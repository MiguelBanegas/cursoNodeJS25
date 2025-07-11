import { db } from "../data/data.js";
import {
    collection,
    getDocs,
    getDoc,
    addDoc,
    updateDoc,
    deleteDoc,
    doc,
    query,
    where
} from "firebase/firestore";

const usuariosCollection = collection(db, "usuarios");

export async function findUserByEmail(email) {
    const q = query(usuariosCollection, where("email", "==", email));
    const querySnapshot = await getDocs(q);
    if (querySnapshot.empty) {
        return null;
    }
    const userDoc = querySnapshot.docs[0];
    return { id: userDoc.id, ...userDoc.data() };
}

export async function findUserById(id) {
    const docRef = doc(db, "usuarios", id);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
        return { id: docSnap.id, ...docSnap.data() };
    }
    return null;
}

export async function createUser(userData) {
    const newUserRef = await addDoc(usuariosCollection, userData);
    return { id: newUserRef.id, ...userData };
}

export async function getAllUsers() {
    const querySnapshot = await getDocs(usuariosCollection);
    const users = [];
    querySnapshot.forEach((doc) => {
        const data = doc.data();
        // no devuelve la contraseña
        delete data.password;
        users.push({ id: doc.id, ...data });
    });
    return users;
}

export async function updateUser(id, userData) {
    const docRef = doc(db, "usuarios", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        return null;
    }

    await updateDoc(docRef, userData);
    const updatedDoc = await getDoc(docRef);
    const data = updatedDoc.data();
    delete data.password; // No devolver la contraseña
    return { id: updatedDoc.id, ...data };
}

export async function deleteUser(id) {
    const docRef = doc(db, "usuarios", id);
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        return false;
    }

    await deleteDoc(docRef);
    return true;
}