import * as model from '../models/data.models.js';
import { db } from "../data/data.js";
import { collection, getDocs, query, where, updateDoc, deleteDoc, doc } from "firebase/firestore";

const medicionesCollection = collection(db, "mediciones");

export async function getMedicionByIdNum(idNum) {
    try {
        const q = query(medicionesCollection, where("idNum", "==", Number(idNum)));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            const doc = querySnapshot.docs[0];
            return { id: doc.id, ...doc.data() };
        }
        return null;
    } catch (error) {
        console.error("Error al buscar medición por idNum:", error);
        throw error;
    }
}

export const getDocIdByIdNum = async (idNum) => {
    const q = query(medicionesCollection, where("idNum", "==", Number(idNum)));
    const querySnapshot = await getDocs(q);
    if (!querySnapshot.empty) {
        return querySnapshot.docs[0].id;
    }
    return null;
}

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

export async function actualizarMedicionPorIdNum(idNum, nuevosDatos) {
    const docId = await getDocIdByIdNum(idNum);
    if (!docId) return null;
    const docRef = doc(db, "mediciones", docId);
    await updateDoc(docRef, nuevosDatos);
    return { id: docId, ...nuevosDatos, idNum: Number(idNum) };
}

export async function eliminarMedicionPorIdNum(idNum) {
    const docId = await getDocIdByIdNum(idNum);
    if (!docId) return false;
    const docRef = doc(db, "mediciones", docId);
    await deleteDoc(docRef);
    return true;
}