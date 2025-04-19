import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { Text, Button } from 'react-native-paper';
import Slider from '@react-native-community/slider';
import { db } from '../../config/firebase';
import { doc, setDoc } from 'firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../components/types';
import { AuthContext } from '../../context/AuthContext';

type BodyPart = 'brazos' | 'piernas' | 'torso';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'BodyScreen'>;

const BodyScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [bodyParts, setBodyParts] = useState<Record<BodyPart, number>>({
    brazos: 25,
    piernas: 30,
    torso: 35,
  });

  const [loading, setLoading] = useState(false);

  const authContext = useContext(AuthContext);
  if (!authContext) throw new Error('AuthContext debe usarse dentro de un AuthProvider');
  const { user } = authContext;

  const handleChange = (part: BodyPart, value: number) => {
    setBodyParts((prev) => ({ ...prev, [part]: value }));
  };

  const handleGuardarCambios = async () => {
    setLoading(true);
    try {
      if (!user?.uid) {
        Alert.alert('Error', 'Debes iniciar sesión para acceder a esta sección.');
        return;
      }

      const userDocRef = doc(db, 'users', user.uid);
      const progressDocRef = doc(userDocRef, 'progress', 'body');

      await setDoc(progressDocRef, bodyParts);

      Alert.alert('✅ Guardado', 'Masa Corporal guardada correctamente');
      navigation.goBack(); // ← vuelve al tab anterior
    } catch (error) {
      console.error('Error al guardar datos:', error);
      Alert.alert('Error', 'Hubo un error al guardar los datos. Intenta nuevamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        Ajusta tu Masa Corporal
      </Text>

      {(Object.keys(bodyParts) as BodyPart[]).map((part) => (
        <View key={part} style={styles.sliderContainer}>
          <Text variant="bodyMedium" style={styles.label}>
            {part.charAt(0).toUpperCase() + part.slice(1)}: {bodyParts[part]}%
          </Text>
          <Slider
            minimumValue={0}
            maximumValue={50}
            step={1}
            value={bodyParts[part]}
            onSlidingComplete={(value) => handleChange(part, value)}
            style={styles.slider}
            minimumTrackTintColor="#6200ee"
            maximumTrackTintColor="#cccccc"
            thumbTintColor="#6200ee"
          />
        </View>
      ))}

      <View style={styles.buttonContainer}>
        <Button
          mode="contained"
          style={styles.button}
          labelStyle={styles.buttonText}
          icon="chart-donut"
          onPress={() => navigation.navigate('Graficas', { initialTab: 'distribucion' })}
          loading={loading}
          disabled={loading}
        >
          Ver Distribución
        </Button>
      </View>

      <Button
        mode="contained"
        style={styles.button}
        labelStyle={styles.buttonText}
        onPress={handleGuardarCambios}
        loading={loading}
        disabled={loading}
      >
        Guardar Cambios
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  sliderContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 10,
  },
  slider: {
    width: '100%',
  },
  buttonContainer: {
    marginVertical: 20,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#2ECC71',
  },
  buttonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#fff',
  },
});

export default BodyScreen;
