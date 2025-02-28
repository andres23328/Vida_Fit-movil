import { firebase } from '@nativescript/firebase-core';  // Firebase core
import '@nativescript/firebase-auth';  // Firebase Auth

// Inicializa Firebase
export const initializeFirebase = async () => {
  try {
    // Usamos firebase().initializeApp() solo si firebase tiene este método, sino
    // firebase().auth() debería funcionar directamente después de importar el módulo.
    const app = firebase();  // Esto ya te devuelve la instancia de Firebase, no necesitas inicializarla explícitamente si ya está configurado
    console.log("Firebase ha sido inicializado");
    return app;  // Retorna la instancia si todo salió bien
  } catch (error) {
    console.error("Error al inicializar Firebase:", error);
    throw error;  // Lanzamos el error si no se pudo inicializar
  }
};

// Acceder a la instancia de autenticación de Firebase
export const auth = firebase().auth();
