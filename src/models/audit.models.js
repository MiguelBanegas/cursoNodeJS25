import {db} from "../data/data.js"; // Importa la configuración de Firebase
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';

const auditCollection = collection(db, 'audit_logs');

/* /** */
/*  * Crea un nuevo registro de auditoría en la base de datos. */
/*  * @param {object} logData - Los datos del registro de auditoría. */
/*  * @returns {Promise<string>} - El ID del documento de registro creado. */
/*  */ 
export async function createLog(logData) {
    try {
        const docData = { ...logData, timestamp: serverTimestamp() };
        const docRef = await addDoc(auditCollection, docData);
        return docRef.id;
    } catch (error) {
        console.error("Error al crear el registro de auditoría:", error);
        throw new Error('No se pudo crear el registro de auditoría.');
    }
}