import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../components/types'; // Asegúrate de tener este archivo si usas tipificación

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'GoogleFitAuth'>;

const GoogleFitAuth: React.FC = () => {
  const navigation = useNavigation<NavigationProp>(); // Navegación tipada
  
  // Funciones para navegar a la pantalla correspondiente
  const handleNo = () => {
    navigation.navigate('Registration'); // Navega a la pantalla de registro
  };

  const handleYes = () => {
    navigation.navigate('Registration'); // Navega a la pantalla de registro
  };

  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={{ uri: '/bodbot-network.svg' }} style={styles.image} />
      </View>
      
      <View style={styles.card}>
        <Text style={styles.title}>Autorizar Google Fit</Text>
        
        <Text style={styles.description}>
          ¿Te gustaría permitir el uso de algunos de tus datos de Google Fit?
          BodBot puede utilizarlos para seguir mejorando tus recomendaciones.
        </Text>
        
        <Text style={styles.note}>
          Nota: Si no tienes Google Fit instalado, Android te pedirá que lo instales.
        </Text>

        <View style={styles.buttonsContainer}>
          <TouchableOpacity
            style={styles.noButton}
            onPress={handleNo} // Acción para 'No'
          >
            <Text style={styles.noButtonText}>No</Text>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.yesButton}
            onPress={handleYes} // Acción para 'Sí'
          >
            <Text style={styles.yesButtonText}>Sí</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Botón de siguiente */}
      <TouchableOpacity
        style={styles.nextButton}
        onPress={handleYes} // Aquí también se puede navegar a otra pantalla si es necesario
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
  note: {
    fontSize: 12,
    color: '#6B7280', // Gris más claro
    textAlign: 'center',
    marginBottom: 24,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  noButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: '#F3F4F6', // bg-gray-100
    borderRadius: 8,
    marginRight: 8,
    alignItems: 'center',
  },
  noButtonText: {
    fontSize: 16,
    color: '#6B7280', // Gris intermedio
  },
  yesButton: {
    flex: 1,
    paddingVertical: 16,
    backgroundColor: '#2563EB', // bg-blue-600
    borderRadius: 8,
    alignItems: 'center',
  },
  yesButtonText: {
    fontSize: 16,
    color: '#FFF',
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

export default GoogleFitAuth;
