const productos = [{ id: 1, nombre: "A", precio: 100 },
                    { id: 2, nombre: "Ba", precio: 150 },
                    { id: 3, nombre: "Caa", precio: 200 }];

export const getAllProducts = (req, res) => {
    res.json(productos);
}

export const getProductById = (req, res) => {   
  const id = parseInt(req.params.id); 
  const nombre = req.query.nombre; // Obtener el parámetro de consulta 'nombre'
  console.log(`ID recibido: ${id}`); // Log para verificar el ID recibido
  console.log(`Nombre recibido: ${nombre}`); // Log para verificar el nombre recibido

    const producto = productos.find(p => p.id === id);
    if (!producto) {
        return res.status(404).json({ error: 'Producto no encontrado' });
    }
    res.json(producto);
}  

export const getProductByName = (req, res) => {

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

}
