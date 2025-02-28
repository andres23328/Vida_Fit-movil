import React, { useState } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

// Componente individual de Tarjeta
const CardItem: React.FC<{ name: string; description: string; darkMode: boolean; navigateTo: string }> = ({
  name,
  description,
  darkMode,
  navigateTo,
}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.navigate(navigateTo as never)} activeOpacity={0.8}>
      <Card style={[styles.card, darkMode ? styles.darkCard : styles.lightCard]}>
        <Card.Content>
          <Text variant="titleLarge" style={darkMode ? styles.darkText : styles.lightText}>
            {name}
          </Text>
          <Text style={darkMode ? styles.darkText : styles.lightText}>{description}</Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

// Componente principal del Dashboard
const DashboardScreen: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false); // Cambiar a "true" para que el modo oscuro sea el predeterminado

  const toggleDarkMode = () => setDarkMode(!darkMode); // Alternar estado

  // Información de las tarjetas
  const cards = [
    { name: "Membresías", description: "Gestiona tus membresías y pagos.", navigateTo: "MembershipScreen" },
    { name: "IMC", description: "Consulta tu Índice de Masa Corporal.", navigateTo: "IMCScreen" },
    { name: "Gráficas", description: "Visualiza tu progreso en gráficas.", navigateTo: "ChartsScreen" },
    { name: "Cuerpo Humano", description: "Modifica y analiza tu masa corporal.", navigateTo: "BodyScreen" },
    { name: "Clases", description: "Reserva clases de entrenamiento.", navigateTo: "ClassesScreen" },
    { name: "Progreso", description: "Revisa tu historial de progreso.", navigateTo: "ProgressScreen" },
  ];

  return (
    <ScrollView style={[styles.container, darkMode ? styles.darkBackground : styles.lightBackground]}>
      {/* Título del Dashboard */}
      <Text variant="headlineMedium" style={[styles.title, darkMode ? styles.darkText : styles.lightText]}>
        Panel de Control
      </Text>

      {/* Renderizado de las tarjetas */}
      <View style={styles.cardContainer}>
        {cards.map((cardItem, index) => (
          <View key={index} style={styles.cardWrapper}>
            <CardItem
              name={cardItem.name}
              description={cardItem.description}
              darkMode={darkMode}
              navigateTo={cardItem.navigateTo}
            />
          </View>
        ))}
      </View>

      {/* Contenedor para el botón que alterna el modo oscuro */}
      <View style={styles.footer}>
        <TouchableOpacity
          style={[styles.toggleButton, darkMode ? styles.darkButton : styles.lightButton]}
          onPress={toggleDarkMode}
        >
          <Text style={darkMode ? styles.darkButtonText : styles.lightButtonText}>
            {darkMode ? 'Modo Claro 🌞' : 'Modo Oscuro 🌙'}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

// Estilos
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  title: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 24,
  },
  cardContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap', // Permite que las tarjetas se envuelvan a la siguiente fila
    justifyContent: 'space-evenly', // Espaciado entre las tarjetas
  },
  cardWrapper: {
    width: '48%', // Dos tarjetas por fila, pero aumentamos el tamaño
    marginBottom: 20, // Aumentamos el espacio entre filas
  },
  card: {
    borderRadius: 10,
    height: 250, // Aumentamos la altura de las tarjetas para que sean más grandes
    padding: 15, // Aumentamos el padding dentro de la tarjeta
  },
  lightBackground: {
    backgroundColor: 'white',
  },
  darkBackground: {
    backgroundColor: '#121212',
  },
  lightCard: {
    backgroundColor: 'white',
  },
  darkCard: {
    backgroundColor: '#333333',
  },
  lightText: {
    color: 'black',
  },
  darkText: {
    color: 'white',
  },
  button: {
    marginTop: 10,
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
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    backgroundColor: '#525FE1',
    alignSelf: 'center', // Centrado
  },
  footer: {
    paddingVertical: 15,
    marginTop: 'auto', // Esto empuja el botón hacia el fondo de la pantalla
    marginBottom: 20, // Para agregar un margen en la parte inferior
  },
});

export default DashboardScreen;
