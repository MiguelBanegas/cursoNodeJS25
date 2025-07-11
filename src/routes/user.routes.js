import { Router } from 'express';
import { getAllUsers, getUserById, updateUser, deleteUser, getProfile } from '../controllers/user.controllers.js';
import { authenticateToken, authorize } from '../middlewares/auth.middleware.js'; //middleware/auth.middleware.js';

const router = Router();

// Todas las rutas de usuarios requieren autenticación
router.use(authenticateToken);

// Ruta para que un usuario obtenga su propio perfil
router.get('/profile', getProfile);

// Rutas de CRUD de usuarios
router.get('/', authorize('admin'), getAllUsers); // Solo admin

router.get('/:id', authorize(['admin', 'user']), (req, res, next) => {
    // Un admin puede ver a cualquiera, un usuario solo a sí mismo.
    if (req.user.rol !== 'admin' && req.user.id !== req.params.id) {
        return res.status(403).json({ error: 'Acceso denegado.' });
    }
    getUserById(req, res, next);
});

router.put('/:id', authorize(['admin', 'user']), updateUser); // Lógica de permisos dentro del controller
router.delete('/:id', authorize('admin'), deleteUser); // Solo admin

export default router;

