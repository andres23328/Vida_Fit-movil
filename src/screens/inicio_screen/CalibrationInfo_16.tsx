import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // Para navegación
import NextButton from '../../components/NextButton'; // Asegúrate de que NextButton esté adaptado para React Native
import { RootStackParamList } from '../../components/types';

// Ahora, puedes usarlo en tu navegación
import { StackNavigationProp } from '@react-navigation/stack';


// Definir el tipo para la navegación
type CalibrationInfoNavigationProp = StackNavigationProp<RootStackParamList, 'CalibrationInfo'>;

const CalibrationInfo: React.FC = () => {
  const navigation = useNavigation<CalibrationInfoNavigationProp>();

  
  return (
    <View style={styles.container}>
      <View style={styles.graphContainer}>
        <View style={styles.column}>
          <View style={styles.bar} />
          <View style={styles.textRow}>
            <Text style={styles.text}>153</Text>
            <Text style={styles.text}>172</Text>
            <Text style={styles.text}>191</Text>
          </View>
        </View>

        <View style={styles.graph}>
          {[...Array(8)].map((_, i) => (
            <View
              key={i}
              style={[styles.bar, { height: `${Math.random() * 100}%`, left: `${(i * 100) / 8}%` }]}
            />
          ))}
        </View>
      </View>

      <Text style={styles.description}>
        <Text style={styles.highlight}>Dentro de cada entrenamiento</Text>, después de un breve
        calentamiento, calibraremos cada ejercicio según su propio nivel de fuerza y avanzaremos
        de acuerdo con su propio ritmo de avance.
      </Text>

      <NextButton onPress={() => navigation.navigate('FitnessAssessment')} />
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
  graphContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  column: {
    alignItems: 'center',
    marginRight: 16,
  },
  graph: {
    width: 128,
    height: 96,
    position: 'relative',
  },
  bar: {
    position: 'absolute',
    width: 16,
    backgroundColor: '#F97316', // Naranja
  },
  textRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginTop: 8,
  },
  text: {
    fontSize: 12,
    color: '#4B5563', // Gris oscuro
  },
  description: {
    fontSize: 18,
    marginBottom: 32,
    textAlign: 'center',
  },
  highlight: {
    color: '#3B82F6', // Azul
  },
});

export default CalibrationInfo;
