import * as UserModel from '../models/user.models.js';

export async function getAllUsers(req, res) {
    try {
        const users = await UserModel.getAllUsers();
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener los usuarios.' });
    }
}

export async function getUserById(req, res) {
    try {
        const user = await UserModel.findUserById(req.params.id);
        if (!user) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        delete user.password;
        res.json(user);
    } catch (error) {
        res.status(500).json({ error: 'Error al obtener el usuario.' });
    }
}

export async function updateUser(req, res) {
    try {
        // Un usuario solo puede actualizar su propio nombre o email, no su rol.
        // Un admin puede actualizar el rol de otros.
        const { nombre, email, rol } = req.body;
        const dataToUpdate = {};

        // Solo agregamos los campos al objeto de actualización si están definidos.
        // Esto evita enviar `undefined` a Firestore.
        if (nombre !== undefined) dataToUpdate.nombre = nombre;
        if (email !== undefined) dataToUpdate.email = email;

        if (req.user.rol === 'admin' && rol) {
            dataToUpdate.rol = rol;
        }

        // Si no se envió ningún dato para actualizar, devolvemos un error.
        if (Object.keys(dataToUpdate).length === 0) {
            return res.status(400).json({ error: 'No se proporcionaron campos para actualizar.' });
        }

        const updatedUser = await UserModel.updateUser(req.params.id, dataToUpdate);
        if (!updatedUser) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        res.json(updatedUser);
    } catch (error) {
        console.error("Error en updateUser:", error); // Loguear el error completo para depuración
        res.status(500).json({ error: 'Error al actualizar el usuario.', details: error.message });
    }
}

export async function deleteUser(req, res) {
    try {
        const success = await UserModel.deleteUser(req.params.id);
        if (!success) {
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }
        res.status(200).json({ message: 'Usuario eliminado correctamente.' });
    } catch (error) {
        res.status(500).json({ error: 'Error al eliminar el usuario.' });
    }
}

// Endpoint para que un usuario vea su propio perfil
export async function getProfile(req, res) {
    // req.user es añadido por el middleware authenticateToken
    res.json(req.user);
}
