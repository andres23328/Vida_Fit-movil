import React from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../components/types'; // Ajusta la ruta si es necesario

const Welcome: React.FC = () => {
  // Tipar el hook de navegación
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      {/* Logo */}
      <View style={styles.logoContainer}>
        <Image source={require('../../../assets/imagenes/logo.jpeg')} style={styles.logo} />
      </View>

      {/* Contenido Principal */}
      <View style={styles.content}>
        <Text style={styles.title}>¡Hola!</Text>
        <Text style={styles.subtitle}>Hagamos{'\n'}un plan de ejercicios para ti.</Text>
        
        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Goals')}
        >
          <Text style={styles.buttonText}>Comenzar</Text>
        </TouchableOpacity>
      </View>

      {/* Footer */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          ¿Ya tienes una cuenta?{' '}
          <Text
            style={styles.linkText}
            onPress={() => navigation.navigate('Login')}
          >
            Inicia sesión ahora
          </Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'space-between',
    backgroundColor: '#FFFFFF',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 40,
  },
  logo: {
    width: 140,
    height: 140,
    resizeMode: 'contain',
  },
  content: {
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    textAlign: 'center',
    color: '#111827', // Gris oscuro
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    lineHeight: 26,
    color: '#4B5563', // Gris intermedio
    marginBottom: 30,
  },
  button: {
    backgroundColor: '#F97316', // Naranja brillante
    paddingVertical: 14,
    paddingHorizontal: 50,
    borderRadius: 50,
    elevation: 3, // Sombras en Android
    shadowColor: '#000', // Sombras en iOS
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  footer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  footerText: {
    fontSize: 14,
    textAlign: 'center',
    color: '#6B7280', // Gris
  },
  linkText: {
    color: '#2563EB', // Azul
    fontWeight: '600',
  },
});

export default Welcome;
