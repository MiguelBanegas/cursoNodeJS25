import { Router } from 'express';
import {
    getAllMediciones,
    getMedicionById,
    getMedicionesSearch,
    nuevaMedicion,
    actualizarMedicion,
    eliminarMedicion
} from '../controllers/data.controllers.js';
import { authenticateToken, authorize } from '../middlewares/auth.middleware.js';

const router = Router();

// Todas las rutas de mediciones requieren que el usuario esté autenticado y tenga rol 'user' o 'admin'
router.use(authenticateToken, authorize(['user', 'admin']));

router.get('/', getAllMediciones);
router.get('/search', getMedicionesSearch);
router.get('/id/:id', getMedicionById);
router.post('/', nuevaMedicion);
router.put('/id/:id', actualizarMedicion);
router.delete('/id/:id', eliminarMedicion);

export default router;