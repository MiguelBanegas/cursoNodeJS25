import bcrypt from 'bcryptjs';
import * as UserModel from '../models/user.models.js';
import * as AuditModel from '../models/audit.models.js';
import generateToken from '../utils/token-generator.js';

export async function registerUser(email, password, nombre) {
    const existingUser = await UserModel.findUserByEmail(email);
    if (existingUser) {
        throw new Error('El correo electrónico ya está en uso.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Por defecto, el primer usuario es 'admin', los demás son 'user'
    const allUsers = await UserModel.getAllUsers();
    const rol = allUsers.length === 0 ? 'admin' : 'user';

    const newUser = await UserModel.createUser({
        email,
        password: hashedPassword,
        nombre,
        rol, // Asignamos el rol
    });

    delete newUser.password; // No devolver la contraseña
    return newUser;
}

export async function loginUser(email, password) {
    const user = await UserModel.findUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new Error('Credenciales inválidas.');
    }

    const tokenPayload = { id: user.id, email: user.email, rol: user.rol };
    const token = generateToken(tokenPayload);

    return { token };
}

export async function changeUserPassword(userId, newPassword, adminUser) {
    const user = await UserModel.findUserById(userId);
    if (!user) {
        throw new Error('Usuario no encontrado.');
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Reutilizamos la función updateUser del modelo para actualizar solo la contraseña
    await UserModel.updateUser(userId, { password: hashedPassword });

    // Registrar el evento de cambio de contraseña en el log de auditoría
    try {
        await AuditModel.createLog({
            action: 'ADMIN_PASSWORD_CHANGE',
            adminId: adminUser.id,
            adminEmail: adminUser.email,
            targetUserId: user.id,
            targetUserEmail: user.email,
        });
    } catch (logError) {
        // Si el log falla, no revertimos el cambio de contraseña, pero sí lo registramos en la consola.
        console.error("Fallo al registrar el cambio de contraseña en la auditoría:", logError);
    }

    return true;
}
