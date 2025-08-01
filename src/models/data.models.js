import {db} from "../data/data.js"; // Importa la configuración de Firebase
import { 
    collection, 
    getDocs, 
    getDoc, 
    addDoc, 
    updateDoc, 
    deleteDoc, 
    doc, 
    query, 
    where, 
    orderBy } from "firebase/firestore"; // Importa las funciones de Firestore

const medicionesCollection = collection(db, "mediciones"); // Colección de mediciones

export async function getAllMediciones() { // Obtiene todas las mediciones
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

export async function getMedicionById(id) { // Obtiene una medición por su ID
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

export async function getMedicionesSearch(search) { // Busca mediciones por un parámetro de búsqueda
  
  const searchLower = search.toLowerCase();
  const q = query(
    medicionesCollection,
    where('idDisp', '>=', searchLower),
    where('idDisp', '<=', searchLower + '\uf8ff') // Esto permite buscar por prefijo
  );

  const querySnapshot = await getDocs(q);
  const mediciones = [];
  querySnapshot.forEach(doc => mediciones.push({ id: doc.id, ...doc.data() })); // Agrega cada documento encontrado al array
  return mediciones; // Devuelve el array de mediciones encontradas
};

export async function nuevaMedicion (datos) { // Crea una nueva medición
  try {
    const nuevaMed = await addDoc(medicionesCollection, datos);
    return { id: nuevaMed.id, ...datos }; // Devuelve el ID del nuevo documento junto con los datos
  } catch (error) {
    console.error("Error al agregar la medición:", error);
    throw error;
  }
};

export async function actualizarMedicion(id, nuevosDatos) { // Actualiza una medición por su ID
  try {
    const docRef = doc(db, "mediciones", id);
    await updateDoc(docRef, nuevosDatos);
    const docActualizado = await getDoc(docRef);
    return { id: docActualizado.id, ...docActualizado.data() }; // Devuelve el documento actualizado
  } catch (error) {
    // Firestore lanza un error si el documento no existe, que se puede capturar.
    console.error("Error al actualizar la medición:", error);
    //verifica el tipo de error para devolver null si no se encuentra.
    if (error.code === 'not-found') return null;
    throw error;
  }
};

export async function eliminarMedicion(id) { // Elimina una medición por su ID
  try {
    const docRef = doc(db, "mediciones", id);
    const docSnap = await getDoc(docRef); // Primero, verifica si el documento existe
    if (!docSnap.exists()) {
      return false; // Si no existe, avisa que no se encontró para eliminar
    }
    await deleteDoc(docRef); // Elimina el documento de la colección
    return true; // Devuelve true para indicar que la eliminación fue exitosa
  } catch (error) {
    console.error("Error al eliminar la medición:", error);
    throw error;
  }
};