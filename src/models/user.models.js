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
  where,
  limit,
} from "firebase/firestore";

const usuariosCollection = collection(db, "usuarios");

// Utilidad interna para obtener un documento por email
async function getUserDocByEmail(email) {
  const q = query(usuariosCollection, where("email", "==", email), limit(1));
  // Limitamos a 1 para evitar múltiples resultados
  const querySnapshot = await getDocs(q);
  //console.log(`getUserDocByEmail: ${email} encontrado: ${querySnapshot.query}`);
  const result = querySnapshot.empty ? null : querySnapshot.docs[0];
  //console.log("Datos devueltos por getUserDocByEmail:", result); // Agregar console.log aquí
  return result;
}

export async function findUserByEmail(email) {
  const userDoc = await getUserDocByEmail(email);
  const result = userDoc ? { id: userDoc.id, ...userDoc.data() } : null;
  
  //console.log("Datos devueltos por findUserByEmail:", result);
  return result;
}

export async function findUserById(id) {
  const docSnap = await getDoc(doc(db, "usuarios", id));
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
}

export async function createUser(userData) {
  const enrichedUserData = {
    ...userData,
    isEmailVerified: userData.isEmailVerified ?? false,
    createdAt: userData.createdAt ?? Date.now(),
  };
  const newUserRef = await addDoc(usuariosCollection, enrichedUserData);
  const { password, ...rest } = enrichedUserData; // Excluir password del return
  return { id: newUserRef.id, ...rest };
}

export async function getAllUsers() {
  const querySnapshot = await getDocs(usuariosCollection);
  return querySnapshot.docs.map((doc) => {
    const { password, ...data } = doc.data();
    return { id: doc.id, ...data };
  });
}

export async function updateUser(id, userData) {
  const docRef = doc(db, "usuarios", id);
  const docSnap = await getDoc(docRef);

  if (!docSnap.exists()) return null;

  await updateDoc(docRef, userData);
  const { password, ...updatedData } = { ...docSnap.data(), ...userData };
  return { id, ...updatedData };
}

export async function deleteUser(id) {
  const docRef = doc(db, "usuarios", id);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return false;
  await deleteDoc(docRef);
  return true;
}

export async function updateUserByEmail(email, data) {
  const userDoc = await getUserDocByEmail(email);
  if (!userDoc) throw new Error("Usuario no encontrado.");
  await updateDoc(userDoc.ref, data);
  return true;
}

export async function deleteUserByEmail(email) {
  const userDoc = await getUserDocByEmail(email);
  if (!userDoc) return false;
  await deleteDoc(userDoc.ref);
  return true;
}
