import { Router } from "express";
const router = Router();
export default router; // por default para poder llamar a router como quiera

//metodo GET para obtener las mediciones
import * as control from '../controllers/data.controllers.js';

router.get('/mediciones', control.getAllMediciones); // Ruta para obtener todas las mediciones
router.get('/mediciones/id/:id', control.getMedicionById); // Ruta para obtener una medición por ID

router.get("/mediciones/search", control.getMedicionesSearch); // Ruta para buscar mediciones por parámetro de búsqueda

router.post("/mediciones", control.nuevaMedicion); // Ruta para crear una nueva medición

router.put('/mediciones/id/:id', control.actualizarMedicion); // Ruta para actualizar una medición por ID

router.delete('/mediciones/id/:id', control.eliminarMedicion); // Ruta para eliminar una medición por ID

