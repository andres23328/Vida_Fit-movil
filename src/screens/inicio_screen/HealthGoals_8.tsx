import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import Icon from 'react-native-vector-icons/FontAwesome';

import { RootStackParamList } from '../../components/types';
import { useDispatch, useSelector } from 'react-redux';
import { updateResponse } from '../../global/redux/responsesSlice';
import { RootState } from '../../global/store';

// Define el tipo de navegación
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'HealthGoals'>;

const HealthGoals: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();

  // Obtiene las metas seleccionadas desde Redux y las convierte en un array si es necesario
  const selectedGoals: string[] = useSelector((state: RootState) =>
    Array.isArray(state.responses.selectedGoals) ? state.responses.selectedGoals : []
  );

  // Alterna la selección de una meta y la guarda en responseSlice
  const handleToggleGoal = (goal: string) => {
    const updatedGoals = selectedGoals.includes(goal)
      ? selectedGoals.filter((g) => g !== goal) // Remueve si ya está seleccionado
      : [...selectedGoals, goal]; // Agrega si no está seleccionado

    dispatch(updateResponse({ field: 'selectedGoals', value: updatedGoals }));
  };

  // Navega a la siguiente pantalla solo si hay metas seleccionadas
  const handleNavigation = () => {
    console.log('Objetivos seleccionados:', selectedGoals);
    if (selectedGoals.length > 0) {
      navigation.navigate('Registration');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Qué te gustaría hacer?</Text>

      {/* Sección de Rendimiento */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rendimiento</Text>

        <TouchableOpacity
          style={[styles.option, selectedGoals.includes('strength') && styles.selectedOption]}
          onPress={() => handleToggleGoal('strength')}
        >
          <MaterialIcons name="fitness-center" size={24} style={styles.icon} />
          <Text style={styles.optionText}>Aumentar La Fuerza</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, selectedGoals.includes('combinedTraining') && styles.selectedOption]}
          onPress={() => handleToggleGoal('combinedTraining')}
        >
          <FontAwesome name="heartbeat" size={24} style={styles.icon} />
          <Text style={styles.optionText}>Entrenamiento Combinado</Text>
        </TouchableOpacity>
      </View>

      {/* Sección de Salud */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Salud</Text>

        <TouchableOpacity
          style={[styles.option, selectedGoals.includes('totalHealth') && styles.selectedOption]}
          onPress={() => handleToggleGoal('totalHealth')}
        >
          <FontAwesome name="heart" size={24} style={styles.icon} />
          <Text style={styles.optionText}>Salud Total</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, selectedGoals.includes('cognitiveHealth') && styles.selectedOption]}
          onPress={() => handleToggleGoal('cognitiveHealth')}
        >
          <MaterialIcons name="psychology" size={24} style={styles.icon} />
          <Text style={styles.optionText}>Salud Cognitiva</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, selectedGoals.includes('sexualHealth') && styles.selectedOption]}
          onPress={() => handleToggleGoal('sexualHealth')}
        >
          <Icon name="venus" size={24} style={styles.icon} />
          <Text style={styles.optionText}>Salud Sexual</Text>
        </TouchableOpacity>
      </View>

      {/* Botón de Siguiente */}
      <TouchableOpacity
        style={[styles.nextButton, selectedGoals.length === 0 && styles.disabledButton]}
        onPress={handleNavigation}
        disabled={selectedGoals.length === 0}
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
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
    color: '#1F2937',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#6B7280',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginBottom: 12,
  },
  selectedOption: {
    backgroundColor: '#D1D5DB',
  },
  icon: {
    fontSize: 24,
    color: '#1F2937',
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    color: '#1F2937',
  },
  nextButton: {
    backgroundColor: '#F97316',
    paddingVertical: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#F97316AA',
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default HealthGoals;
