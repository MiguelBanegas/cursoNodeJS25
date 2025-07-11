import * as AuthService from '../services/auth.services.js';

export async function register(req, res) {
    try {
        const { email, password, nombre } = req.body;
        if (!email || !password || !nombre) {
            return res.status(400).json({ error: 'Todos los campos son requeridos.' });
        }
        const newUser = await AuthService.registerUser(email, password, nombre);
        res.status(201).json(newUser);
    } catch (error) {
        res.status(400).json({ error: error.message });
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


