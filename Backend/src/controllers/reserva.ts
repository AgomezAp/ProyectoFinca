import {Request, Response } from 'express'
import { Reserva } from '../models/agenda'
import { uploadToR2 } from '../services/storage'
import { gridFSService } from '../services/gridfs'
import mongoose from 'mongoose'
import { GridFSBucket } from 'mongodb'
import { crearPDF } from '../services/facturacion'
export const crearReserva = async (req: Request, res: Response): Promise<any> => {
    try {
        const files = req.files as {
            documento_f: Express.Multer.File[];
            documento_p: Express.Multer.File[];
            rostro: Express.Multer.File[];
        };
        // Guardar archivos en GridFS y obtener los nombres
        const docFrenteName = await gridFSService.uploadFile(files.documento_f[0].buffer, `doc_frente_${Date.now()}.jpg`);
        const docAtrasName = await gridFSService.uploadFile(files.documento_p[0].buffer, `doc_atras_${Date.now()}.jpg`);
        const rostroName = await gridFSService.uploadFile(files.rostro[0].buffer, `rostro_${Date.now()}.jpg`);
        // Guarda los nombres en la reserva
        const nuevaReserva = new Reserva({
            ...req.body,
            documento_f: docFrenteName,
            documento_p: docAtrasName,
            rostro: rostroName
        });
        await nuevaReserva.save();
        res.status(201).json({
            ok: true,
            reserva: nuevaReserva
        });
    } catch (error) {
        console.error(error)
        res.status(400).json({ error: error instanceof Error ? error.message : String(error) });
    }
}


export const eliminarReserva = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, fechallegada } = req.body;
        if (!email || !fechallegada) {
            return res.status(400).json({ error: 'Email y fecha son requeridos' });
        }
        const reservaEliminada = await Reserva.findOneAndDelete({
            email,
            fechaLlegada: new Date(fechallegada)});
        if (!reservaEliminada) {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }
        const db = mongoose.connection.db;
        if (!db) {
            return res.status(500).json({ error: 'No se pudo obtener la conexión a la base de datos' });
        }
        const bucket = new GridFSBucket(db, { bucketName: 'documentos'});

        const eliminarArchivo = async (filename: string) => {
            if(!filename) return;

            const files = await db.collection('documentos.files').find({filename}).toArray();
            if (files.length > 0) {
                await bucket.delete(files[0]._id);
                console.log(`Archivo eliminado: ${filename}`)
            }
        };

        await Promise.all([
            eliminarArchivo(reservaEliminada.documento_f),
            eliminarArchivo(reservaEliminada.documento_p),
            eliminarArchivo(reservaEliminada.rostro)
        ])

        res.status(200).json({ ok: true, mensaje: 'Reserva eliminada correctamente', reserva: reservaEliminada });
    } catch (error) {
        res.status(500).json({error: 'Error al obtener reserva' });
        console.error(error)
    }
}

export const obtenerReserva = async (req: Request, res: Response): Promise<any> => {
    try {
        const { cc, email } = req.params;
        if (cc) {
            const reserva = await Reserva.find({ cc: cc.toString() });
            if (!reserva.length) return res.status(404).json({ error: 'Ninguna reserva encontrada' });
            return res.status(200).json(reserva);
        }
        if (email) {
            const reserva = await Reserva.find({ email: email.toString() });
            if (!reserva.length) return res.status(404).json({ error: 'Ninguna reserva encontrada' });
            return res.status(200).json(reserva);
        }
        return res.status(400).json({ error: 'El email o la cc es requerido ' });
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al obtener reserva' });
    }
};

export const obtenerReservas = async (req: Request, res: Response): Promise<any> => {
    try {
        const reserva = await Reserva.find();
        return res.status(200).json(reserva);
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al obtener reserva' });
    }
};

export const obtenerReservasCalendario = async (req: Request, res: Response): Promise<any> => {
    try {
        const reserva = await Reserva.find();
        const reservasCalendario = reserva.map(rs => {
            const {
                _id, terminos, rostro, documento_f, documento_p, __v, telefono,
                ...rest
            } = rs.toObject ? rs.toObject() : rs;
            return {
                ...rest,
                fechaLlegada: rs.fechaLlegada ? rs.fechaLlegada.toISOString().split('T')[0] : '',
                fechaSalida: rs.fechaSalida ? rs.fechaSalida.toISOString().split('T')[0] : ''
            };
        });
        return res.status(200).json(reservasCalendario);
    } catch (error) {
        console.error(error)
        res.status(500).json({ error: 'Error al obtener reserva' });
    }
};


export const actualizarEstado = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, fechallegada, estado } = req.body;
        if (typeof email !== 'string' || !fechallegada) {
            return res.status(400).json({ error: 'Email, fecha son requeridos' });
        }
        const reservaActualizada = await Reserva.findOne({
            email,
            fechaLlegada: new Date(fechallegada)});
        if (!reservaActualizada) {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }
        reservaActualizada.confirmado = estado;
        await reservaActualizada.save();
        res.status(200).json({ ok: true, reserva: reservaActualizada });
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'Error al actualizar la reserva' });
    }
}

export const actualizarReserva = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, fecha, fechasalida, fechallegada, cantidad } = req.body;
        if (!email || !fecha) {
            return res.status(400).json({ error: 'Email y fecha son requeridos' });
        }

        const updateFields: any = {};
        if (fechasalida) updateFields.fechasalida = fechasalida;
        if (fechallegada) updateFields.fechallegada = fechallegada;
        if (typeof cantidad !== 'undefined') updateFields.cantidad = cantidad;

        const reservaActualizada = await Reserva.findOneAndUpdate(
            { email: email.toString(), fecha: fecha.toString() },
            updateFields,
            { new: true }
        );

        if (!reservaActualizada) {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }

        res.status(200).json({ ok: true, reserva: reservaActualizada });
    } catch (error) {
        res.status(500).json({error: 'Error al obtener reserva' });

    }
}


export const buscarDisponibilidad = async (req: Request, res: Response): Promise<any> => {
    try {
        const { FechaInicio, FechaFin } = req.body;
        console.log("Fin " + FechaFin + " Inicio " + FechaInicio)
        if (!FechaInicio || !FechaFin) {
            return res.status(400).json({ mensaje: 'Debes llenar el formulario' });
        }
        // Busca reservas que se solapen con el rango dado
        const reservas = await Reserva.find({
            fechaLlegada: { $lt: new Date(FechaFin) },
            fechaSalida: { $gt: new Date(FechaInicio) },
            $or: [
                { confirmado: { $ne: false } },
                { confirmado: { $exists: false } },
                { confirmado: null}
            ]
        });
        if (reservas.length > 0) {
            console.log('No hay disponibilidad para las fechas seleccionadas');
            return res.status(200).json({ 
                disponible: false, 
                mensaje: 'No hay disponibilidad para las fechas seleccionadas', 
            });
        } else {
            console.log('Hay disponibilidad para las fechas seleccionadas');
            return res.status(200).json({ 
                disponible: true,
                mensaje: 'Hay disponibilidad para las fechas seleccionadas', 
            });
        }
    } catch (error) {
        res.status(500).json({ error: 'Error al buscar disponibilidad' });
        console.log(error)
    }
}

export const fechasDisponibles = async (req: Request, res: Response): Promise<any> => {
    try {
        // Obtener todas las reservas de la base de datos
        const reservas = await Reserva.find({ $or: [ { confirmado: true }, { confirmado: null } ] });
        console.log('Total reservas encontradas:', reservas.length);
        console.log('Primera reserva:', reservas[0]);
        
        const fechasOcupadas: string[] = [];
        const hoy = new Date();
        hoy.setHours(0, 0, 0, 0); // Resetear horas para comparar solo fechas
        
        console.log('Fecha actual:', hoy);
        
        // Recorrer cada reserva y generar todas las fechas entre FechaInicio y FechaFin
        reservas.forEach((reserva: any) => {
            console.log('Procesando reserva:', {
                FechaInicio: reserva.fechaLlegada,
                FechaFin: reserva.fechaSalida
            });
            
            const fechaInicio = new Date(reserva.fechaLlegada);
            const fechaFin = new Date(reserva.fechaSalida);
            
            console.log('Fechas convertidas:', {
                inicio: fechaInicio,
                fin: fechaFin
            });
            
            // Generar todas las fechas del rango
            const fechaActual = new Date(fechaInicio);
            while (fechaActual <= fechaFin) {
                // Solo incluir fechas posteriores o iguales a hoy
                if (fechaActual >= hoy) {
                    // Formato YYYY-MM-DD para consistencia con el frontend
                    const fechaFormateada = fechaActual.toISOString().split('T')[0];
                    fechasOcupadas.push(fechaFormateada);
                    console.log('Fecha agregada:', fechaFormateada);
                }
                
                // Avanzar al siguiente día
                fechaActual.setDate(fechaActual.getDate() + 1);
            }
        });
        
        // Eliminar fechas duplicadas si existen reservas solapadas
        const fechasUnicas = [...new Set(fechasOcupadas)];
        
        console.log('Fechas ocupadas finales:', fechasOcupadas);
        
        res.status(200).json({
            success: true,
            fechasOcupadas: fechasOcupadas,
            totalReservas: reservas.length
        });
        
    } catch (error) {
        console.error('Error en fechasDisponibles:', error);
        res.status(500).json({error: 'Error al encontrar fechas disponibles'});
    }
}

export const facturacion = async (req: Request, res: Response): Promise<any> => {
    try {
        const { email, fechallegada} = req.body;
        if (typeof email !== 'string' || !fechallegada) {
            return res.status(400).json({ error: 'Email, fecha son requeridos' });
        }
        const reservaActualizada = await Reserva.findOne({
            email,
            fechaLlegada: new Date(fechallegada)});
        if (!reservaActualizada) {
            return res.status(404).json({ error: 'Reserva no encontrada' });
        }
        const pdfBuffer = await crearPDF(reservaActualizada);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="Factura-${reservaActualizada.nombre}.pdf"`);
        res.send(pdfBuffer);
        
    } catch (error) {
        console.error(error)
        res.status(500).json({error: 'Error al actualizar la reserva' });
    }
}