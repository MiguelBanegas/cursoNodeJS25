import jwt from 'jsonwebtoken';
import 'dotenv/config';

const generateToken = (payload) => {
    const jwtSecret = process.env.JWT_SECRET;
    const expiresIn = process.env.JWT_EXPIRES_IN || '1h';

    if (!jwtSecret) {
        console.error('Error: La variable de entorno JWT_SECRET no está definida.');
        throw new Error('La clave secreta para JWT no está configurada.');
    }

    if (!payload || !payload.id) {
        console.error('Error: Se requiere un ID para generar el token.');
        throw new Error('Se requiere un ID para generar el token.');
    }
    
    // Firmamos el payload completo para incluir todos los datos (como el rol)
    return jwt.sign(payload, jwtSecret, { expiresIn });
};

export default generateToken;
