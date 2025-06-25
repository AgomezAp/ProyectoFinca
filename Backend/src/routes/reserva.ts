import { Router } from 'express';
import {crearReserva,
    eliminarReserva,
    obtenerReserva,
    actualizarEstado,
    actualizarReserva,
    obtenerReservas,
    buscarDisponibilidad} from '../controllers/reserva';
import multer from 'multer';

const storage = multer.memoryStorage(); // porque luego subirás a R2 desde buffer
export const upload = multer({ storage });

const router = Router()

router.post("/api/reserva/crearReserva", upload.fields([
    {name: 'documento_f', maxCount: 1},
    {name: 'documento_p', maxCount: 1},
    {name: 'rostro', maxCount: 1}
]), crearReserva);

router.get("/api/reserva/obtenerReserva/cc/:cc", obtenerReserva);
router.get("/api/reserva/obtenerReserva/email/:email", obtenerReserva);
router.get("/api/reserva/obtenerReservas", obtenerReservas);

router.put("/api/reserva/updateEstado", actualizarEstado);

router.delete("/api/reserva/eliminarReserva", eliminarReserva);
//LISTO 

router.get("/api/reserva/disponibilidad", buscarDisponibilidad)

router.put("/api/reserva/updateReserva", actualizarReserva);


export default router
