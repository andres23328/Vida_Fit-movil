import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, useColorScheme, TouchableOpacity } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';

// Definir el tipo de las rutas para la navegación
type RootStackParamList = {
  Home: undefined;
  Classes: undefined;
  Progress: undefined;
  Dashboard: undefined;
};

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface HomeScreenProps {
  navigation: HomeScreenNavigationProp;
}

export default function HomeScreen({ navigation }: HomeScreenProps) {
  const [darkMode, setDarkMode] = useState(false);  // Estado para controlar el modo oscuro
  const scheme = useColorScheme();  // Detectar el esquema de colores (oscuro o claro)
  const isDarkMode = darkMode || scheme === 'dark'; // Establecer si el modo es oscuro

  const horarios = [
    { dia: 'Lunes a Viernes', horas: '6:00 AM - 10:00 PM' },
    { dia: 'Sábado', horas: '8:00 AM - 8:00 PM' },
    { dia: 'Domingo', horas: '9:00 AM - 6:00 PM' },
  ];

  return (
    <ScrollView 
      contentContainerStyle={[styles.container, isDarkMode ? styles.darkBackground : styles.lightBackground]}
    >
      <Text variant="headlineMedium" style={[styles.title, isDarkMode ? styles.darkText : styles.lightText]}>
        Bienvenido a Nuestro Gimnasio
      </Text>
      
      <Card style={[styles.card, isDarkMode ? styles.darkCard : styles.lightCard]}>
        <Card.Content>
          <Text variant="titleLarge" style={isDarkMode ? styles.darkText : styles.lightText}>
            Horarios del Gimnasio
          </Text>
          {horarios.map((horario, index) => (
            <Text key={index} style={[styles.schedule, isDarkMode ? styles.darkText : styles.lightText]}>
              {horario.dia}: {horario.horas}
            </Text>
          ))}
        </Card.Content>
      </Card>


      <Button 
        mode="contained"
        onPress={() => navigation.navigate('Dashboard')}
        style={[styles.button, isDarkMode ? styles.darkButton : styles.lightButton]}
        labelStyle={isDarkMode ? styles.darkButtonText : styles.lightButtonText}
      >
        dasboard
      </Button>

      {/* Botón para cambiar entre el modo oscuro y claro */}
      <TouchableOpacity 
        style={[styles.toggleButton, isDarkMode ? styles.darkButton : styles.lightButton]}
        onPress={() => setDarkMode(!darkMode)}
      >
        <Text style={isDarkMode ? styles.darkButtonText : styles.lightButtonText}>
          {isDarkMode ? 'Modo Claro 🌞' : 'Modo Oscuro 🌙'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1, // Necesario para que el ScrollView se expanda correctamente
    justifyContent: 'center',
    alignItems: 'center', // Centrado
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
    marginBottom: 20,
    borderRadius: 10,
    elevation: 5,
    width: '90%', // Ajuste de tamaño
    alignSelf: 'center', // Centrado horizontal
  },
  lightCard: {
    backgroundColor: 'white',
  },
  darkCard: {
    backgroundColor: '#333333',
  },
  schedule: {
    marginVertical: 5,
    fontSize: 16,
  },
  button: {
    marginVertical: 10,
    borderRadius: 30,
    paddingVertical: 10,
    width: '80%', // Ajuste de tamaño
    alignSelf: 'center', // Centrado
  },
  lightButton: {
    backgroundColor: '#525FE1',
  },
  darkButton: {
    backgroundColor: '#525FE1',
  },
  lightButtonText: {
    color: 'white',
  },
  darkButtonText: {
    color: 'black',
  },
  toggleButton: {
    marginTop: 20,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#525FE1',
  },
});
