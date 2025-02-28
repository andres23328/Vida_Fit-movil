import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, useColorScheme, TouchableOpacity } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';

export default function ClassesScreen() {
  const [darkMode, setDarkMode] = useState(false);  // Estado para controlar el modo oscuro
  const scheme = useColorScheme();  // Detecta el esquema de colores (oscuro o claro)
  const isDarkMode = darkMode || scheme === 'dark';  // Aplica el modo oscuro si está activado o si el sistema está en oscuro

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
            <Text style={isDarkMode ? styles.darkText : styles.lightText}>
              Instructor: {classItem.instructor}
            </Text>
            <Text style={isDarkMode ? styles.darkText : styles.lightText}>
              Hora: {classItem.time}
            </Text>
            <Text style={isDarkMode ? styles.darkText : styles.lightText}>
              Duración: {classItem.duration}
            </Text>
          </Card.Content>
          <Card.Actions>
            <Button 
              mode="contained" 
              onPress={() => alert('¡Clase reservada con éxito!')}
              style={[styles.button, isDarkMode ? styles.darkButton : styles.lightButton]}
              labelStyle={isDarkMode ? styles.darkButtonText : styles.lightButtonText}
            >
              Reservar Clase
            </Button>
          </Card.Actions>
        </Card>
      ))}

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
    flexGrow: 1,  // Asegura que el ScrollView crezca
    justifyContent: 'center',
    alignItems: 'center',  // Centrado del contenido
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
    width: '90%',  // Ajusta el tamaño
    alignSelf: 'center',  // Centrado
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
    width: '80%',  // Ajusta el tamaño del botón
    alignSelf: 'center',  // Centrado
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
