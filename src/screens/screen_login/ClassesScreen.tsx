import React, { useState, useContext } from 'react';
import { View, ScrollView, StyleSheet, useColorScheme, TouchableOpacity, Alert } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { db } from '../../config/firebase';
import { doc, setDoc, updateDoc, getDoc } from 'firebase/firestore';
import { AuthContext } from '../../context/AuthContext';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../components/types';


type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ClassesScreen'>;


export default function ClassesScreen() {
  const navigation = useNavigation<NavigationProp>();
  
  const [darkMode, setDarkMode] = useState(false);  // Estado para controlar el modo oscuro
  const scheme = useColorScheme();  // Detecta el esquema de colores (oscuro o claro)
  const isDarkMode = darkMode || scheme === 'dark';  // Aplica el modo oscuro si está activado o si el sistema está en oscuro
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  const authContext = useContext(AuthContext);
  if (!authContext) throw new Error('AuthContext debe usarse dentro de un AuthProvider');
  const { user } = authContext;

  const handleReservar = async (classItem: any, index: number) => {
    if (!user?.uid) {
      Alert.alert('Error', 'Debes iniciar sesión para reservar una clase.');
      setLoadingIndex(null);
      return;
    }
  
    try {
      setLoadingIndex(index);
      const userDocRef = doc(db, 'users', user.uid);
      const progressDocRef = doc(userDocRef, 'progress', 'clases');
  
      const progressSnap = await getDoc(progressDocRef);
  
      let existingClasses: any[] = [];
  
      if (progressSnap.exists()) {
        const progressData = progressSnap.data();
        existingClasses = progressData?.clasesReservadas || [];
  
        // Verifica si ya existe una clase con el mismo nombre
        const yaReservada = existingClasses.some(
          (c: any) => c.name === classItem.name
        );
  
        if (yaReservada) {
          Alert.alert('Clase ya reservada', 'Ya has reservado esta clase anteriormente.');
          setLoadingIndex(null);
          return;
        }
      }
  
      // Guardamos la clase reservada directamente en el subdocumento progress/clases
      await setDoc(
        progressDocRef,
        {
          clasesReservadas: [...existingClasses, classItem],
        },
        { merge: true }
      );
  
      Alert.alert('Clase Reservada', '¡La clase ha sido reservada con éxito!');
    } catch (error) {
      console.error('Error al reservar la clase:', error);
      Alert.alert('Error', 'Hubo un error al reservar la clase. Intenta nuevamente.');
    } finally {
      setLoadingIndex(null);
    }
  };
  
  
  

  const classes = [
    {
      name: 'Yoga',
      instructor: 'Sarah Johnson',
      time: '8:00 AM',
      duration: '60 min',
    },
    {
      name: 'HIIT',
      instructor: 'Mike Thompson',
      time: '10:00 AM',
      duration: '45 min',
    },
    {
      name: 'Spinning',
      instructor: 'Lisa Anderson',
      time: '5:00 PM',
      duration: '45 min',
    },
  ];

  return (
    <ScrollView
      contentContainerStyle={[styles.container, isDarkMode ? styles.darkBackground : styles.lightBackground]}
    >
      <Text variant="headlineMedium" style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>
        Clases Disponibles
      </Text>

      {classes.map((classItem, index) => (
        <Card key={index} style={[styles.card, isDarkMode ? styles.darkCard : styles.lightCard]}>
          <Card.Content>
            <Text variant="titleLarge" style={isDarkMode ? styles.darkText : styles.lightText}>
              {classItem.name}
            </Text>
            <Text variant="titleLarge" style={isDarkMode ? styles.darkText : styles.lightText}>
              Instructor: {classItem.instructor}
            </Text>
            <Text variant="titleLarge" style={isDarkMode ? styles.darkText : styles.lightText}>
              Hora: {classItem.time}
            </Text>
            <Text variant="titleLarge" style={isDarkMode ? styles.darkText : styles.lightText}>
              Duración: {classItem.duration}
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button
              mode="contained"
              onPress={() => handleReservar(classItem, index)}
              style={[styles.button, isDarkMode ? styles.darkButton : styles.lightButton]}
              labelStyle={isDarkMode ? styles.darkButtonText : styles.lightButtonText}
              loading={loadingIndex === index} 
              disabled={loadingIndex !== null && loadingIndex !== index} 
            >
              Reservar Clase
            </Button>
          </Card.Actions>
        </Card>
      ))}

      {/* Botón para cambiar entre el modo oscuro y claro */}
{/*       <TouchableOpacity
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
  container: {
    flexGrow: 1, // Asegura que el ScrollView crezca
    justifyContent: 'center',
    alignItems: 'center', // Centrado del contenido
    padding: 16,
  },
  lightBackground: {
    backgroundColor: 'white',
  },
  darkBackground: {
    backgroundColor: '#121212',
  },
  title: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 24,
  },
  lightText: {
    color: 'black',
  },
  darkText: {
    color: 'white',
  },
  card: {
    marginBottom: 16,
    borderRadius: 10,
    elevation: 5,
    width: '90%', // Ajusta el tamaño
    alignSelf: 'center', // Centrado
  },
  lightCard: {
    backgroundColor: 'white',
  },
  darkCard: {
    backgroundColor: '#333333',
  },
  button: {
    marginVertical: 10,
    borderRadius: 30,
    paddingVertical: 10,
    width: '80%', // Ajusta el tamaño del botón
    alignSelf: 'center', // Centrado
  },
  lightButton: {
    backgroundColor: '#2ECC71'
  },
  darkButton: {
    backgroundColor: '#525FE1',
  },
  lightButtonText: {
    color: 'white',
    fontFamily: 'Poppins_600SemiBold',
  },
  darkButtonText: {
    color: 'black',
    fontFamily: 'Poppins_600SemiBold',
  },
  toggleButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#525FE1',
  },
});
