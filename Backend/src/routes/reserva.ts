import { Router } from 'express';
import {crearReserva,
    eliminarReserva,
    obtenerReserva,
    actualizarEstado,
    actualizarReserva,
    obtenerReservas,
    buscarDisponibilidad,
    fechasDisponibles,
    obtenerReservasCalendario,
    facturacion} from '../controllers/reserva';
import multer from 'multer';

const storage = multer.memoryStorage(); // porque luego subirás a R2 desde buffer
export const upload = multer({ storage });

const router = Router()

router.post("/api/reserva/crearReserva", upload.fields([
    {name: 'documento_f', maxCount: 1},
    {name: 'documento_p', maxCount: 1},
    {name: 'rostro', maxCount: 1}
]), crearReserva);
router.post("/api/reserva/disponibilidad", buscarDisponibilidad);
router.post("/api/reserva/CrearFactura", facturacion)


router.get("/api/reserva/obtenerReserva/cc/:cc", obtenerReserva);
router.get("/api/reserva/obtenerReserva/email/:email", obtenerReserva);
router.get("/api/reserva/obtenerReservas", obtenerReservas);
router.get("/api/reserva/obtenerReservasCalendario", obtenerReservasCalendario);
router.get("/api/reserva/fechas", fechasDisponibles)


router.put("/api/reserva/updateEstado", actualizarEstado);

router.delete("/api/reserva/eliminarReserva", eliminarReserva);



//LISTO 
router.put("/api/reserva/updateReserva", actualizarReserva);

export default router
