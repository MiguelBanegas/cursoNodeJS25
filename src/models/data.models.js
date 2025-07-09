// para leer un archivo JSON y usarlo como base de datos local
/* import fs from "fs"; */
/* import path from "path"; */


import {db} from "../data/data.js"; // Importa la configuración de Firebase
import {
  collection,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  doc
} from "firebase/firestore"; // Importa las funciones de Firestore

const medicionesCollection = collection(db, "mediciones"); // Colección de mediciones

export async function getAllMediciones() {
  try {
    const querySnapshot = await getDocs(medicionesCollection);
    const mediciones = [];
    querySnapshot.forEach((doc) => {
      mediciones.push({ id: doc.id, ...doc.data() });
    });
    return mediciones;
  } catch (error) {
    console.error("Error al obtener las mediciones:", error);
    throw error;
  } 
};

export async function getMedicionById(id) {
  try {
    const docRef = doc(db, "mediciones", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() };
    } else {
      return null;
    }
  } catch (error) {
    console.error("Error al obtener la medición por ID:", error);
    throw error;
  }
};

export async function getMedicionesSearch(search) {
  const todas = await getAllMediciones();
  const searchLower = search.toLowerCase();
  return todas.filter(p => 
    p.idDisp && p.idDisp.toLowerCase().includes(searchLower)
  );
};

export async function nuevaMedicion (datos) {
  try {
    const nuevaMed = await addDoc(medicionesCollection, datos);
    return { id: nuevaMed.id, ...datos };
  } catch (error) {
    console.error("Error al agregar la medición:", error);
    throw error;
  }
};

export async function actualizarMedicion(id, nuevosDatos) {
  try {
    const docRef = doc(db, "mediciones", id);
    await updateDoc(docRef, nuevosDatos);
    const docActualizado = await getDoc(docRef);
    return { id: docActualizado.id, ...docActualizado.data() };
  } catch (error) {
    // Firestore lanza un error si el documento no existe, que se puede capturar.
    console.error("Error al actualizar la medición:", error);
    //verifica el tipo de error para devolver null si no se encuentra.
    if (error.code === 'not-found') return null;
    throw error;
  }
};

export async function eliminarMedicion(id) {
  try {
    const docRef = doc(db, "mediciones", id);
    await deleteDoc(docRef);
  } catch (error) {
    console.error("Error al eliminar la medición:", error);
    throw error;
  }
};