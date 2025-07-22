import * as AuthService from '../services/auth.services.js';

export async function register(req, res) {
    try {
        const { email, password, nombre } = req.body;
        if (!email || !password || !nombre) {
            return res.status(400).json({ error: 'Todos los campos son requeridos.' });
        }
        const newUser = await AuthService.registerUser(email, password, nombre); // Lógica para registrar un nuevo usuario
        if (!newUser) {
            return res.status(409).json({ error: 'El correo electrónico ya está en uso.' }); // Código 409 Conflict
        }
        res.status(201).json(newUser);
    } catch (error) {
        // Reenviar el mensaje de error específico desde AuthService
        res.status(500).json({ error: error.message });
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body;
        if (!email || !password) {
            return res.status(400).json({ error: 'Email y contraseña son requeridos.' });
        }
        const result = await AuthService.loginUser(email, password);
        res.json(result);
    } catch (error) {
        res.status(401).json({ error: error.message });
    }
}
export async function verifyCode(req, res) {
    try {
        const { email, code } = req.body;
        if (!email || !code) return res.status(400).json({ error: 'Email y código requeridos' });

        await AuthService.verifyEmailCode(email, code); // Lógica para verificar el código de verificación
        
        res.json({ message: 'Código validado correctamente.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}
export async function resetPassword(req, res) {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) return res.status(400).json({ error: 'Faltan campos requeridos.' });

        await AuthService.resetPasswordWithCode(email, newPassword);
        res.json({ message: 'Contraseña actualizada correctamente.' });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
}