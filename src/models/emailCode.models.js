import { db } from '../data/data.js';
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore';

const collectionName = 'email_codes';


export async function saveEmailCode(email, code, expiresAt) { // Guarda el código de verificación de email con su fecha de expiración
    await setDoc(doc(db, collectionName, email), { code, expiresAt });
}

export async function getEmailCode(email) { // Recupera el código de verificación de email
    const docSnap = await getDoc(doc(db, collectionName, email));
    return docSnap.exists() ? docSnap.data() : null;
}

export async function deleteEmailCode(email) { // Elimina el código de verificación de email
    await deleteDoc(doc(db, collectionName, email));
}