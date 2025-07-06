import * as service from '../services/data.services.js'; // Importar el servicio de datos AS SERVICE para evitar conflictos de nombres
import * as model from '../models/data.models.js'; // Importar el modelo para obtener una medición por ID

export const getAllMediciones = (req, res) => {
    res.json(service.getAllMediciones()); // Llamar al servicio para obtener todas las mediciones
}

export const getMedicionById = (req, res) => {
      const { id } = req.params;
      const medicion = model.getMedicionById(parseInt(id)); // Llamar al modelo para obtener la medición por ID
        if (!medicion) {
            return res.status(404).json({ error: 'Medición no encontrada' }); // Manejar el caso en que no se encuentra la medición
        }
        res.json(medicion); // Retornar la medición encontrada
}
export const getMedicionesSearch = (req, res) => {
    const { search } = req.query; // Obtener el parámetro de búsqueda de la consulta
    if (!search) {
        return res.status(400).json({ error: 'Parámetro de búsqueda es requerido' }); // Manejar el caso en que no se proporciona el parámetro de búsqueda
    }
    const mediciones = model.getMedicionesSearch(search); // Llamar al modelo para obtener las mediciones que coincidan con la búsqueda
    res.json(mediciones); // Retornar las mediciones encontradas
}

export const nuevaMedicion = (req,res) => {
    console.log(req.body); // Imprimir el cuerpo de la solicitud para depuración
  const { idDisp, temp, hum } = req.body;

  const nuevaMed = model.nuevaMedicion({ idDisp, temp, hum }); // Llamar al modelo para crear una nueva medición

  res.status(201).json(nuevaMed); // Retornar la nueva medición creada con un código de estado 201
};