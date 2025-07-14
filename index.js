import 'dotenv/config'; // Asegurarse de que las variables de entorno estén disponibles

import express from 'express';
import cors from 'cors'; // Importar el middleware CORS
import authRoutes from './src/routes/auth.routes.js';
import userRoutes from './src/routes/user.routes.js';
import dataRoutes from './src/routes/data.routes.js';
import { notFoundHandler, generalErrorHandler } from './src/middlewares/error.middleware.js';

const app = express();
app.use(cors()); // Middleware para permitir solicitudes CORS

// Middleware para parsear JSON
// express.json() es el reemplazo moderno de bodyParser.json()
app.use(express.json());

// Rutas
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/users', userRoutes);
app.use('/api/v1/mediciones', dataRoutes);

// Middlewares de manejo de errores
// El manejador 404 debe ir después de todas las rutas
app.use(notFoundHandler);
// El manejador de errores general debe ser el último middleware
app.use(generalErrorHandler);

const PORT = process.env.PORT || 3000;
// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});