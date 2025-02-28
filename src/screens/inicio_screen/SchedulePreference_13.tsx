import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import FontAwesome from 'react-native-vector-icons/FontAwesome'; // Usamos react-native-vector-icons
import { StackNavigationProp } from '@react-navigation/stack'; // Importamos StackNavigationProp
import { RootStackParamList } from '../../components/types'; // Importamos el tipo de rutas

// Definimos el tipo de navegación para este componente
type SchedulePreferenceNavigationProp = StackNavigationProp<RootStackParamList, 'SchedulePreference'>;

const SchedulePreference: React.FC = () => {
  const navigation = useNavigation<SchedulePreferenceNavigationProp>(); // Usamos el tipo de navegación aquí

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Cómo quieres administrar tu horario?</Text>

      <View style={styles.optionsContainer}>
        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate('TimePicker')} // Cambio de navegación
        >
          <View style={styles.iconContainer}>
            <FontAwesome name="calendar" size={48} color="white" />
          </View>
          <Text style={styles.optionText}>Planifica{"\n"}todo por{"\n"}mí</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.optionButton}
          onPress={() => navigation.navigate('TimePicker')} // Cambio de navegación
        >
          <View style={[styles.iconContainer]} >
            <FontAwesome name="sliders" size={48} color="white" />
          </View>
          <Text style={styles.optionText}>Administraré{"\n"}mis días y{"\n"}mi tiempo</Text>
        </TouchableOpacity>
      </View>

      {/* Si tienes un NextButton personalizado, usa TouchableOpacity o Button */}
{/*       <TouchableOpacity style={styles.nextButton} onPress={() => navigation.navigate('TimePicker')}>
        <Text style={styles.nextButtonText}>Siguiente</Text>
      </TouchableOpacity> */}
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
  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 32,
  },
  optionButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 96,
    height: 96,
    backgroundColor: '#3B82F6', // Azul
    borderRadius: 48,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  optionText: {
    textAlign: 'center',
    color: '#4B5563', // Gris oscuro
    fontWeight: '500',
  },
  nextButton: {
    backgroundColor: '#F97316', // Naranja
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 32,
  },
  nextButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default SchedulePreference;
