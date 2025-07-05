import express  from 'express';
import cors from 'cors'; // Importar el middleware CORS
const app = express();
const port = 3000;

app.use(cors()); // Middleware para permitir solicitudes CORS
app.use(express.json()); // Middleware para parsear JSON en el cuerpo de las solicitudes


import productsRoutes from './src/routes/products.routes.js'; // Importar las rutas de productos

app.use("/api/v1", productsRoutes); // Usar las rutas de productos

app.use((req, res, next) => {
    res.status(404).json({ error: 'Ruta no encontrada' });
}); // Middleware para manejar rutas no encontradas

app.get('/', (req, res) => {
  res.send('<h1>Esta es na API en Node.js con Nodemon</h1>');    
});


app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

