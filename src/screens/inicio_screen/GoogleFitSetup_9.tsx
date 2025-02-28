import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../components/types'; // Asegúrate de tener este archivo si usas tipificación

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'GoogleFitSetup'>;

const GoogleFitSetup: React.FC = () => {
  const navigation = useNavigation<NavigationProp>(); // Navegación tipada
  
  // Función para navegar a la pantalla de autenticación de Google Fit
  const handleAccept = () => {
    navigation.navigate('GoogleFitAuth'); // Navegar a la pantalla de autenticación
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: '/bodbot-network.svg' }} style={styles.image} />
      </View>

      <View style={styles.card}>
        <Text style={styles.title}>Se Requiere Google Fit</Text>
        <Text style={styles.description}>
          Al parecer debes configurar Google Fit, lo cual necesitamos para acceder
          a tus datos de salud. Una vez que lo hayas hecho, pulsa 'Aceptar' y
          continuaremos.
        </Text>

        <TouchableOpacity
          style={styles.acceptButton}
          onPress={handleAccept} // Al presionar el botón, navega a la pantalla de autenticación
        >
          <Text style={styles.buttonText}>Aceptar</Text>
        </TouchableOpacity>
      </View>

      {/* Botón de siguiente */}
      <TouchableOpacity
        style={styles.nextButton}
        onPress={handleAccept} // Aquí también se puede navegar a otra pantalla si es necesario
      >
        <Text style={styles.nextButtonText}>Siguiente</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  image: {
    width: 150, // Ajusta el tamaño de la imagen
    height: 150, // Ajusta el tamaño de la imagen
  },
  card: {
    backgroundColor: '#FFF',
    borderRadius: 8,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginHorizontal: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 14,
    color: '#6B7280', // Gris intermedio
    textAlign: 'center',
    marginBottom: 24,
  },
  acceptButton: {
    backgroundColor: '#2563EB', // bg-blue-600
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#F97316', // bg-orange-500
    paddingVertical: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default GoogleFitSetup;
