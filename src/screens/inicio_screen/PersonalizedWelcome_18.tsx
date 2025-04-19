import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import NextButton from '../../components/NextButton'; // Asegúrate de que NextButton esté adaptado a React Native
import { RootStackParamList } from '../../components/types'; // Asegúrate de tener este archivo de tipos
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthContext } from '../../context/AuthContext';

// Definir el tipo para la navegación
type PersonalizedWelcomeNavigationProp = StackNavigationProp<RootStackParamList, 'PersonalizedWelcome'>;

const PersonalizedWelcome: React.FC = () => {
  const navigation = useNavigation<PersonalizedWelcomeNavigationProp>();

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require('../../../assets/imagenes/logo.jpeg')} // Asegúrate de que la ruta sea correcta
          style={styles.image}
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.welcomeText}>
          Hola Andres Ardila,{"\n"}
          Bienvenido a BodBot!
        </Text>
        
        <Text style={styles.descriptionText}>
          Vamos a ayudarlo a que trabaje de manera eficiente ajustando cada
          entrenamiento a sus necesidades y habilidades.
        </Text>
      </View>

      {/* Botón de navegación */}
      <NextButton onPress={() => navigation.navigate('Login')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageContainer: {
    marginBottom: 32,
  },
  image: {
    width: 256,  // Ajusta el tamaño de la imagen según sea necesario
    height: 64,  // Ajusta el tamaño de la imagen según sea necesario
    resizeMode: 'contain',
  },
  textContainer: {
    textAlign: 'center',
    marginBottom: 32,
  },
  welcomeText: {
    fontSize: 24,
    color: '#3B82F6', // Color azul similar al original
    textAlign: 'center',
  },
  descriptionText: {
    fontSize: 18,
    color: '#4B5563', // Gris oscuro
    textAlign: 'center',
  },
});

export default PersonalizedWelcome;
