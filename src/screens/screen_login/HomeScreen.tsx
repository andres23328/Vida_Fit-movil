// Home.tsx

import React, { useState, useEffect, useContext } from 'react';
import { View, ScrollView, StyleSheet, useColorScheme, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { useNavigation } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import { useSelector } from 'react-redux';
import { RootState } from '../../global/store';
import * as Notifications from 'expo-notifications';
import { doc, getDoc, updateDoc, setDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { RootStackParamList } from '../../components/types';




type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;



export default function HomeScreen() {
  const navigation = useNavigation<HomeScreenNavigationProp>();
  const [darkMode, setDarkMode] = useState(false);
  const scheme = useColorScheme();
  const isDarkMode = darkMode || scheme === 'dark';
  const [predictionsLeft, setPredictionsLeft] = useState<number>(3);
  const [loading, setLoading] = useState(true);
  const [loadingPrediction, setLoadingPrediction] = useState(false);


  const authContext = useContext(AuthContext);
  if (!authContext) throw new Error('AuthContext debe usarse dentro de un AuthProvider');
  const { user } = authContext;

  const membresia = useSelector((state: RootState) => state.membresia.nivel);

  useEffect(() => {
    const iniciarDatosUsuario = async () => {
      setLoading(true);
      try {

        if (!user?.uid) {
          console.log('Usuario no autenticado');
          Alert.alert('Error', 'Debes iniciar sesión para acceder a esta sección.');
          return;
        }
        

        if (user?.uid) {
          await verificarMembresiaVigente(user.uid);

          const userDocRef = doc(db, 'users', user.uid);
          const docSnap = await getDoc(userDocRef);

          // Si no existe el documento del usuario, lo creamos
          if (!docSnap.exists()) {
            await setDoc(userDocRef, { displayName: user.displayName, email: user.email });
          }

          console.log('Usuario autenticado y datos guardados en Firestore', user.uid);

          // Verificamos la existencia de la membresía
          const membershipRef = doc(userDocRef, 'membership', 'status');
          const membresiaSnap = await getDoc(membershipRef);

          if (membresiaSnap.exists()) {
            console.log('Documento encontrado:', membresiaSnap.data());

            const data = membresiaSnap.data();
            const disponibles = data.prediccionesDisponibles ?? 3;
            const usadas = data.prediccionesUsadas ?? 0;
            const disponiblesRestantes = disponibles - usadas;

            setPredictionsLeft(disponiblesRestantes >= 0 ? disponiblesRestantes : 0);
          } else {
            console.log('Documento no existe, creando uno nuevo...');

            // Crear documento por defecto si no existe
            await setDoc(membershipRef, {
              nivel: 'Gratis',
              fechaInicio: Timestamp.now(),
              prediccionesDisponibles: 3,
              prediccionesUsadas: 0,
            });
            setPredictionsLeft(3);
          }
        } else {
          setPredictionsLeft(3);
        }
      } catch (error) {
        console.error('Error inicializando datos:', error);
        setPredictionsLeft(3);
      } finally {
        setLoading(false);
      }
    };

    iniciarDatosUsuario();
  }, [user?.uid, membresia]);

  const verificarMembresiaVigente = async (userId: string) => {
    try {
      const docRef = doc(db, 'users', userId, 'membership', 'status');
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        const data = docSnap.data();
        const fechaInicio = data.fechaInicio.toDate();
        const hoy = new Date();
        const unMesDespues = new Date(fechaInicio);
        unMesDespues.setMonth(unMesDespues.getMonth() + 1);

        if (hoy >= unMesDespues) {
          await mostrarNotificacionVencimiento();
          Alert.alert(
            '📅 Membresía vencida',
            'Tu membresía ha expirado. Por favor renueva para continuar.',
            [{ text: 'Ir a Membresías', onPress: () => navigation.navigate('MembershipScreen') }]
          );
        }
      }
    } catch (error) {
      console.error('❌ Error al verificar membresía:', error);
    }
  };

  const mostrarNotificacionVencimiento = async () => {
    const { status } = await Notifications.requestPermissionsAsync();
    if (status !== 'granted') return;

    await Notifications.scheduleNotificationAsync({
      content: {
        title: '🔔 Membresía vencida',
        body: 'Tu membresía ha expirado. ¡Renueva ahora para seguir disfrutando!',
      },
      trigger: null,
    });
  };

  const handlePrediction = async () => {
    if (!user?.uid) {
      Alert.alert('Error', 'Debes iniciar sesión para hacer predicciones.');
      return;
    }

    try {
      setLoadingPrediction(true); 
      const ref = doc(db, 'users', user.uid, 'membership', 'status');
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        Alert.alert(
          '🔒 Límite alcanzado',
          'No tienes predicciones disponibles. Adquiere una membresía para continuar.',
          [{ text: 'Ver Membresías', onPress: () => navigation.navigate('MembershipScreen') }]
        );
        return;
      }

      const data = snap.data();
      const disponibles = data.prediccionesDisponibles ?? 3;
      const usadas = data.prediccionesUsadas ?? 0;

      if (usadas < disponibles) {
        const nuevasUsadas = usadas + 1;
        await updateDoc(ref, { prediccionesUsadas: nuevasUsadas });
        setPredictionsLeft(disponibles - nuevasUsadas);

        Alert.alert(
          '✅ Predicción realizada',
          `Te quedan ${disponibles >= 9000 && disponibles <= 9999 ? '∞' : disponibles - nuevasUsadas} predicciones.`,
          [{ text: 'OK', onPress: () => navigation.navigate('Predict') }]
        );
        
      } else {
        Alert.alert(
          '🔒 Límite alcanzado',
          'Ya has usado todas tus predicciones disponibles.',
          [{ text: 'Ver Membresías', onPress: () => navigation.navigate('MembershipScreen') }]
        );
      }
    } catch (error) {
      console.error('❌ Error al manejar predicción:', error);
      Alert.alert('Error', 'No se pudo procesar tu predicción.');
    }finally {
      setLoadingPrediction(false); 
    }
  };

  const horarios = [
    { dia: 'Lunes a Viernes', horas: '6:00 AM - 10:00 PM' },
    { dia: 'Sábado', horas: '8:00 AM - 8:00 PM' },
    { dia: 'Domingo', horas: '9:00 AM - 6:00 PM' },
  ];

  return (
    <ScrollView contentContainerStyle={[styles.container, isDarkMode ? styles.darkBackground : styles.lightBackground]}>
      <Text variant="headlineMedium" style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>
        Bienvenido {user?.displayName || 'Usuario'}
      </Text>

      <Card style={[styles.card, isDarkMode ? styles.darkCard : styles.lightCard]}>
        <Card.Content>
          <Text style={[isDarkMode ? styles.darkText : styles.lightText, styles.cardDescCommon]}>
            Horarios del Gimnasio
          </Text>
          {horarios.map((horario, index) => (
            <Text key={index} style={[styles.schedule, isDarkMode ? styles.darkText : styles.lightText]}>
              {horario.dia}: {horario.horas}
            </Text>
          ))}
          {loading ? (
            <ActivityIndicator size="large" color="#525FE1" />
          ) : (
            <Text style={[styles.predictionCount, isDarkMode ? styles.darkText : styles.lightText]}>
              Predicciones Disponibles: {predictionsLeft >= 9000 && predictionsLeft <= 9999 ? '∞' : predictionsLeft}
            </Text>
          )}
        </Card.Content>
      </Card>

      <Button
        mode="contained"
        onPress={handlePrediction}
        loading={loadingPrediction}
        disabled={loadingPrediction}
        style={[styles.button, isDarkMode ? styles.darkButton : styles.lightButton]}
        labelStyle={isDarkMode ? styles.darkButtonText : styles.lightButtonText}
      >
        Hacer una Predicción
      </Button>


{/*       <Button
        mode="contained"
        onPress={() => navigation.navigate('Dashboard')}
        style={[styles.button, isDarkMode ? styles.darkButton : styles.lightButton]}
        labelStyle={isDarkMode ? styles.darkButtonText : styles.lightButtonText}
      >
        Ir al Dashboard
      </Button>

      <TouchableOpacity
        style={[styles.toggleButton, isDarkMode ? styles.darkButton : styles.lightButton]}
        onPress={() => setDarkMode(!darkMode)}
      >
        <Text style={isDarkMode ? styles.darkButtonText : styles.lightButtonText}>
          {isDarkMode ? 'Modo Claro 🌞' : 'Modo Oscuro 🌙'}
        </Text>
      </TouchableOpacity> */}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', alignItems: 'center', padding: 16 },
  cardDescCommon: { fontSize: 14, fontFamily: 'Poppins_400Regular', marginTop: 8 },
  lightBackground: { backgroundColor: 'white' },
  darkBackground: { backgroundColor: '#121212' },
  title: { textAlign: 'center', marginVertical: 20, fontSize: 24 },
  lightText: { color: 'black' },
  darkText: { color: 'white' },
  card: { marginBottom: 20, borderRadius: 10, elevation: 5, width: '90%', padding: 15 },
  lightCard: { backgroundColor: 'white' },
  darkCard: { backgroundColor: '#333' },
  schedule: { marginVertical: 5, fontSize: 16,  fontFamily: 'Poppins_400Regular' },
  predictionCount: { marginTop: 10, fontSize: 18, fontWeight: '600', fontFamily: 'Poppins_600SemiBold' },
  button: { marginVertical: 10, borderRadius: 30, paddingVertical: 10, width: '80%', backgroundColor: '#2ECC71', },
  lightButton: { backgroundColor: '#2ECC71', },
  darkButton: { backgroundColor: '#525FE1' },
  lightButtonText: { color: 'white', fontFamily: 'Poppins_600SemiBold' },
  darkButtonText: { color: 'black', fontFamily: 'Poppins_600SemiBold' },
  toggleButton: { marginTop: 10, padding: 10, borderRadius: 20 },
});
