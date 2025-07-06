import * as service from '../services/data.services.js'; // Importar el servicio de datos AS SERVICE para evitar conflictos de nombres

export const getAllMediciones = (req, res) => {
    res.json(service.getAllMediciones()); // Llamar al servicio para obtener todas las mediciones
}