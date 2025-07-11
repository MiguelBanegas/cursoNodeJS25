import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import * as UserModel from '../models/user.models.js';

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
    const token = jwt.sign(tokenPayload, process.env.JWT_SECRET, { expiresIn: '1h' });

    return { token };
}

