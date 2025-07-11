//import dotenv from 'dotenv';
// Cargar variables de entorno ANTES de importar otros módulos que las usen.
//dotenv.config();
import 'dotenv/config'; // Asegurarse de que las variables de entorno estén disponibles

import express from 'express';
import cors from 'cors'; // Importar el middleware CORS
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import dataRoutes from './src/routes/data.routes.js';

const app = express();
app.use(cors()); // Middleware para permitir solicitudes CORS
// Middleware para parsear JSON
app.use(express.json());

// Rutas
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/mediciones', dataRoutes);

app.use((req, res, next) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
}); // Middleware para manejar rutas no encontradas

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});