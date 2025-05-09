import { db } from '../../config/firebase';
import { collection, doc, addDoc, getDocs, Timestamp, setDoc } from 'firebase/firestore';
import axios from 'axios';
import { getAuth } from "firebase/auth";



export const saveUserResponses = async (userId: string, email: string, responses: any, userInfo: any) => {

  const auth = getAuth();
  if (!auth.currentUser) {
    console.error("❌ El usuario no está autenticado.");
    return;
  } else {
    console.log(`✅ Usuario autenticado: ${auth.currentUser.uid}`);
  }

  try {
    console.log('📌 Respuestas antes de guardar en Firestore:', responses);
    console.log('📌 Info del usuario antes de guardar:', userInfo);

    if (!userId) throw new Error('❌ No hay usuario autenticado');

    // Referencia a Firestore
    const userDocRef = doc(db, 'users', userId);

    const responsesCollectionRef = collection(userDocRef, 'responses');

    // 🔹 Guardamos el nuevo dato en Firestore
    const newResponseRef = await addDoc(responsesCollectionRef, {
      email,
      userInfo,
      responses,
      createdAt: Timestamp.now(),
    });

    console.log('✅ Nueva respuesta guardada con ID:', newResponseRef.id);

    // 🔹 Generar CSV del nuevo dato
    const newResponseCSV = `id,email,height,units,weight,age,location,goal,exerciseLevel,gender,trainingIntensity,strength,combinedTraining,totalHealth,cognitiveHealth,sexualHealth,createdAt\n${newResponseRef.id},${email},${userInfo.height},${userInfo.units},${userInfo.weight},${userInfo.age},${responses.location},${responses.goal},${responses.exerciseLevel},${responses.gender},${responses.trainingIntensity},${responses.selectedGoals.includes("strength") ? 1 : 0},${responses.selectedGoals.includes("combinedTraining") ? 1 : 0},${responses.selectedGoals.includes("totalHealth") ? 1 : 0},${responses.selectedGoals.includes("cognitiveHealth") ? 1 : 0},${responses.selectedGoals.includes("sexualHealth") ? 1 : 0},${new Date().toISOString()}`;




    
     const snapshot = await getDocs(responsesCollectionRef);

    // Inicializar la variable sin encabezado
    let allResponsesCSV = 'id,email,height,units,weight,age,location,goal,exerciseLevel,gender,trainingIntensity,strength,combinedTraining,totalHealth,cognitiveHealth,sexualHealth,createdAt\n';
    
    // Verificamos si hay datos en la colección
    if (!snapshot.empty) {
      let firstRow = true; // Flag para agregar el encabezado solo una vez
    
      snapshot.forEach(doc => {
        const data = doc.data();
    
        allResponsesCSV += `${doc.id},${data.email},${data.userInfo.height},${data.userInfo.units},${data.userInfo.weight},${data.userInfo.age},${data.responses.location},${data.responses.goal},${data.responses.exerciseLevel},${data.responses.gender},${data.responses.trainingIntensity},${data.responses.selectedGoals.includes("strength") ? 1 : 0},${data.responses.selectedGoals.includes("combinedTraining") ? 1 : 0},${data.responses.selectedGoals.includes("totalHealth") ? 1 : 0},${data.responses.selectedGoals.includes("cognitiveHealth") ? 1 : 0},${data.responses.selectedGoals.includes("sexualHealth") ? 1 : 0},${data.createdAt.toDate().toISOString()}\n`;
      });
    } 
    
    // 🔹 Enviar los CSVs al backend
    await sendCSVToBackend(userId, newResponseCSV, allResponsesCSV);  
    

  } catch (error) {
    console.error('❌ Error al guardar datos en Firestore:', error);
  }
};

// 📌 Función para enviar los CSVs al backend
const sendCSVToBackend = async (userId: string, newCSV: string, allCSV: string) => {
  console.log("📤 Enviando CSVs al backend...");
  console.log("Nuevo CSV:\n", newCSV);
  console.log("Todos los usuarios CSV:\n", allCSV);

  try {
    const response = await axios.post('http://192.168.84.76:5000/save-csv', { userId, newCSV, allCSV });
    console.log('✅ CSVs guardados en la PC:', response.data);
  } catch (error) {
    console.error('❌ Error al enviar CSVs al backend:', error);
  }
};



export const saveMembershipOnly = async (userId: string, membershipLevel: string) => {
  try {
    const userDocRef = doc(db, 'users', userId);
    const membershipRef = doc(userDocRef, 'membership', 'status');

    // Definir predicciones según nivel
    let prediccionesDisponibles = 0;

    switch (membershipLevel.toLowerCase()) {
      case 'básico':
        prediccionesDisponibles = 10;
        break;
      case 'intermedio':
        prediccionesDisponibles = 30;
        break;
      case 'premium':
        prediccionesDisponibles = 9999; // o puedes manejarlo como 'infinito'
        break;
      default:
        prediccionesDisponibles = 0;
    }

    await setDoc(membershipRef, {
      nivel: membershipLevel,
      fechaInicio: Timestamp.now(),
      prediccionesDisponibles,
      prediccionesUsadas: 0,
    });

    console.log(`📦 Membresía del usuario ${userId} guardada con nivel: ${membershipLevel} y ${prediccionesDisponibles} predicciones`);
  } catch (error) {
    console.error('❌ Error al guardar la membresía:', error);
  }
};




