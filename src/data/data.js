
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
const  firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  projectId: process.env.projectId,     
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
  measurementId: process.env.measurementId    
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export {db};