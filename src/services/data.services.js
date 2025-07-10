import * as model from '../models/data.models.js';
import { db } from "../data/data.js";
import { collection, getDocs, query, where, updateDoc, deleteDoc, doc } from "firebase/firestore";

const medicionesCollection = collection(db, "mediciones");


export const getAllMediciones = async () => {
    return await model.getAllMediciones();
}

export const getMedicionById = async (id) => {
    return await model.getMedicionById(id);
}

export const getMedicionesSearch = async (search) => {
    // La búsqueda en Firestore puede ser compleja.
    // Por ahora, delegamos al modelo, pero aquí se podría añadir lógica de negocio.
    return await model.getMedicionesSearch(search);
}

export const nuevaMedicion = async (datos) => {
    return await model.nuevaMedicion(datos);
}

export const actualizarMedicion = async (id, nuevosDatos) => {
    return await model.actualizarMedicion(id, nuevosDatos);
}

export const eliminarMedicion = async (id) => {
    return await model.eliminarMedicion(id);
}

