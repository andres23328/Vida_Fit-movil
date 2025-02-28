import React, { useState, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../components/types';

// Tipado de navegación
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'WeeklySchedule'>;

const WeeklySchedule: React.FC = () => {
  const [weeklyTime, setWeeklyTime] = useState(145);
  const [selectedDays, setSelectedDays] = useState(['Mar', 'Jue', 'Sáb']);
  const sliderValue = useRef(145); // Usamos useRef para almacenar el valor del slider sin causar re-renderizados
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
  const navigation = useNavigation<NavigationProp>();

  // Usamos useCallback para evitar recrear la función handleDayClick
  const handleDayClick = useCallback((day: string) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  }, []);

  const handleNext = () => {
    navigation.navigate('SchedulePreference'); // Navega a la siguiente pantalla
  };

  // Evitar cambios rápidos, actualizar solo después de un pequeño retraso
  const handleSliderChange = (value: number) => {
    sliderValue.current = value;
  };

  const handleSliderRelease = () => {
    // Actualizamos el estado cuando el usuario deja de mover el slider
    setWeeklyTime(Math.round(sliderValue.current));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        ¿Cuánto tiempo puedes ejercitarte cada semana?
      </Text>

      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>Tiempo por semana: {weeklyTime} min</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={300}
          step={1}
          value={weeklyTime}
          onValueChange={handleSliderChange}
          onSlidingComplete={handleSliderRelease} // Actualizamos el estado cuando se suelta el slider
        />
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabel}>baja{'\n'}eficacia</Text>
          <Text style={styles.sliderLabel}>alta{'\n'}eficiencia</Text>
          <Text style={styles.sliderLabel}>baja{'\n'}eficiencia</Text>
        </View>
      </View>

      <Text style={styles.subtitle}>¿Cuándo puedes ejercitarte?</Text>

      <View style={styles.daysContainer}>
        {days.map(day => (
          <TouchableOpacity
            key={day}
            onPress={() => handleDayClick(day)}
            style={[
              styles.dayButton,
              selectedDays.includes(day) ? styles.selectedDay : styles.deselectedDay
            ]}
          >
            <Text style={styles.dayText}>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
        <Text style={styles.nextButtonText}>Siguiente</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
  },
  timeContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    color: '#48BB78', // green-500
    marginBottom: 16,
  },
  slider: {
    width: '80%',
    height: 40,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '80%',
    marginTop: 8,
  },
  sliderLabel: {
    fontSize: 12,
    color: '#A0AEC0', // gray-400
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 16,
  },
  daysContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 32,
  },
  dayButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  selectedDay: {
    backgroundColor: '#F97316', // bg-orange-500
  },
  deselectedDay: {
    backgroundColor: '#E5E7EB', // bg-gray-100
  },
  dayText: {
    color: '#fff',
    fontWeight: '600',
  },
  nextButton: {
    backgroundColor: '#F97316', // bg-orange-500
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default WeeklySchedule;
