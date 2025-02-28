// firebase.js
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import React, { useState, useEffect } from 'react';

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyB-50GxEsKc0ZdMNTH0Z2_Xp1LZSHRf2QU",
  authDomain: "vidafit-project.firebaseapp.com",
  projectId: "vidafit-project",
  storageBucket: "vidafit-project.firebasestorage.app",
  messagingSenderId: "151804344761",
  appId: "1:151804344761:web:1a86ccdb7b7f9be91dde68",
  measurementId: "G-THZSB2KDS7"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Hook para manejar la autenticación
export const useAuth = () => {
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUserId(user.uid); // Si el usuario está autenticado, guarda el userId
      } else {
        setUserId(null); // Si no hay usuario, establece el userId como null
      }
    });

    return () => unsubscribe(); // Limpieza cuando el componente se desmonte
  }, []);

  return userId;
};

export { auth, db };
