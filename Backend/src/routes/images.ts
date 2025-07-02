import express from 'express';
import { gridFSService } from '../services/gridfs';

const router = express.Router();

router.get('/api/imagen/:filename', async (req, res) => {
  try {
    const { filename } = req.params;
    const fileStream = await gridFSService.getFileStream(filename);

    // Opcional: puedes intentar detectar el tipo de archivo y poner el header adecuado
    res.set('Content-Type', 'image/jpeg'); // o image/png según corresponda

    fileStream.on('error', () => res.status(404).send('Imagen no encontrada'));
    fileStream.pipe(res);
  } catch (error) {
    res.status(404).send('Imagen no encontrada');
  }
});

export default router;