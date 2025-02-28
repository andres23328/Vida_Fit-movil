import { db } from '../../config/firebase';
import { collection, doc, setDoc, getDoc } from 'firebase/firestore';

export const saveUserResponses = async (userId: string, email: string, responses: any, userInfo: any) => {
  try {
    console.log('📌 Respuestas antes de guardar en Firestore:', responses);
    console.log('📌 Info del usuario antes de guardar:', userInfo);

    if (!userId) throw new Error('❌ No hay usuario autenticado');

    // Referencia al documento del usuario en Firestore
    const userDocRef = doc(db, 'users', userId);

    // Revisamos si el usuario ya tiene datos previos
    const userSnapshot = await getDoc(userDocRef);
    const hasData = userSnapshot.exists();

    // Estructura del documento a guardar
    const userData = {
      email,          // Guardamos el email del usuario
      responses,      // Respuestas del cuestionario
      userInfo,       // Información personal del usuario
      createdAt: hasData ? userSnapshot.data()?.createdAt : new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Guardamos o actualizamos el documento en Firestore
    await setDoc(userDocRef, userData, { merge: true });

    console.log('✅ Datos guardados correctamente en Firestore');
  } catch (error) {
    console.error('❌ Error al guardar datos en Firestore:', error);
  }
};
