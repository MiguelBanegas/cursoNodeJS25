import { Router } from "express";
const router = Router();
export default router; // por default para poder llamar a router como quiera

//metodo para obtener las mediciones
import { getAllMediciones } from '../controllers/data.controllers.js';
router.get('/', getAllMediciones); // Ruta para obtener todas las mediciones);

/* import { getProductById } from '../controllers/products.controllers.js'; */
/* router.get('/producto/id/:id', getProductById); // Ruta para obtener un producto por ID */
/*  */
/* import { getProductByName } from '../controllers/products.controllers.js'; */
/* router.get('/producto/nombre/:nombre', getProductByName); // Ruta para obtener un producto por nombre */
/*  */
/* //metodo para manejar el cuerpo de la solicitud POST */
/* router.post('/producto', (req, res) => { */
/*     console.log(req.body); // Log para verificar el cuerpo de la solicitud */
/*     res.send('Post recibido correctamente'); */
/* }); */