import * as service from '../services/data.services.js'; // Importar el servicio de datos AS SERVICE para evitar conflictos de nombres

export const getAllMediciones = async (req, res) => {
    try {
        const mediciones = await service.getAllMediciones();
        res.json(mediciones);
    } catch (error) {
        console.error("Error en getAllMediciones:", error);
        res.status(500).json({ error: "Error al obtener las mediciones" });
    }
}

export const getMedicionById = async (req, res) => {
    try {
        const { id } = req.params;
        const medicion = await service.getMedicionById(id);
        if (!medicion) {
            return res.status(404).json({ error: 'Medición no encontrada' });
        }
        res.json(medicion);
    } catch (error) {
        console.error("Error en getMedicionById:", error);
        res.status(500).json({ error: "Error al obtener la medición" });
    }
}

export const getMedicionesSearch = async (req, res) => {
    try {
        const { search } = req.query;
        if (!search) {
            return res.status(400).json({ error: 'El parámetro "search" es requerido' });
        }
        const mediciones = await service.getMedicionesSearch(search);
        res.json(mediciones);
    } catch (error) {
        console.error("Error en getMedicionesSearch:", error);
        res.status(500).json({ error: "Error al buscar mediciones" });
    }
}

export const nuevaMedicion = async (req, res) => {
    try {
        const { idDisp, temp, hum } = req.body;
        if (!idDisp || temp === undefined || hum === undefined) {
            return res.status(400).json({ error: "Faltan campos requeridos: idDisp, temp, hum" });
        }
        const nuevaMed = await service.nuevaMedicion({ idDisp, temp, hum });
        res.status(201).json(nuevaMed);
    } catch (error) {
        console.error("Error en nuevaMedicion:", error);
        res.status(500).json({ error: "Error al crear la medición" });
    }
};

export const actualizarMedicion = async (req, res) => {
    try {
        const { id } = req.params;
        const nuevosDatos = req.body;
        const medicionActualizada = await service.actualizarMedicion(id, nuevosDatos);
        if (!medicionActualizada) {
            return res.status(404).json({ error: "Medición no encontrada" });
        }
        res.json(medicionActualizada);
    } catch (error) {
        console.error("Error en actualizarMedicion:", error);
        res.status(500).json({ error: "Error al actualizar la medición" });
    }
};

export const eliminarMedicion = async (req, res) => {
    try {
        const { id } = req.params;
        await service.eliminarMedicion(id);
        res.status(200).json({ mensaje: "Medición eliminada correctamente" });
    } catch (error) {
        console.error("Error en eliminarMedicion:", error);
        res.status(500).json({ error: "Error al eliminar la medición" });
    }
};