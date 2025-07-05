import express  from 'express';
import cors from 'cors'; // Importar el middleware CORS
const app = express();
const port = 3000;

app.use(express.json()); // Middleware para parsear JSON en el cuerpo de las solicitudes
app.use(cors()); // Middleware para permitir solicitudes CORS
const productos = [{ id: 1, nombre: "A", precio: 100 },
  { id: 2, nombre: "Ba", precio: 150 },
  { id: 3, nombre: "Caa", precio: 200 }];

  app.post('/producto', (req, res) => {
    console.log(req.body); // Log para verificar el cuerpo de la solicitud
    res.send('Post recibido correctamente');
});

app.get('/', (req, res) => {
  res.send('<h1>Esta es na API en Node.js con Nodemon</h1>');    
});

app.get('/producto/id/:id',(req, res) => {
  const id = parseInt(req.params.id); 
  const nombre = req.query.nombre; // Obtener el parámetro de consulta 'nombre'
  console.log(`ID recibido: ${id}`); // Log para verificar el ID recibido
  console.log(`Nombre recibido: ${nombre}`); // Log para verificar el nombre recibido

    const producto = productos.find(p => p.id === id);
    if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(producto);
});

app.get('/producto/nombre/:nombre', (req, res) => {
    const nombre = req.params.nombre; // Obtener el parámetro de la ruta 'nombre'
    console.log(`Nombre recibido: ${nombre}`); // Log para verificar el nombre recibido

    // Filtrar productos que incluyan el texto recibido (ignorando mayúsculas/minúsculas)
    const productosFiltrados = productos.filter(p =>
        p.nombre.toLowerCase().includes(nombre.toLowerCase())
    );

    if (productosFiltrados.length === 0) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(productosFiltrados);
});

app.get('/productos', (req, res) => {
  res.json(productos);
});

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});

