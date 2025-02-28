import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack'; // Asegúrate de importar esto correctamente
import { RootStackParamList } from '../../components/types'; // El archivo de tipos que definiste

// Tipamos la navegación correctamente
type TrainingReminderNavigationProp = StackNavigationProp<RootStackParamList, 'TrainingReminder'>;

const TrainingReminder: React.FC = () => {
  const navigation = useNavigation<TrainingReminderNavigationProp>(); // Usamos el tipo de navegación aquí

  const handleScheduleReminderClick = () => {
    navigation.navigate('CalibrationInfo'); // Navegar a la pantalla de CalibrationInfo
  };

  return (
    <View style={styles.container}>
      <View style={styles.gridContainer}>
        {[...Array(16)].map((_, i) => (
          <View
            key={i}
            style={[styles.box, { backgroundColor: Math.random() > 0.5 ? '#3B82F6' : '#BFDBFE' }]}
          />
        ))}
      </View>

      <View style={styles.textContainer}>
        <Text style={styles.title}>Los recordatorios de entrenamiento te mantienen encaminado.</Text>
        <Text style={styles.subtitle}>Programe notificaciones para alcanzar tus objetivos más rápido!</Text>
      </View>

      <TouchableOpacity style={styles.timeButton}>
        <Text style={styles.timeText}>10:00 a.m. ▼</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.reminderButton}
        onPress={handleScheduleReminderClick} // Método para navegar a la pantalla CalibrationInfo
      >
        <Text style={styles.reminderButtonText}>Recordatorio De Horario</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.laterButton}>
        <Text style={styles.laterButtonText}>Quizás más tarde</Text>
      </TouchableOpacity>
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
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 32,
  },
  box: {
    width: 40,
    height: 40,
    margin: 4,
  },
  textContainer: {
    textAlign: 'center',
    marginBottom: 32,
  },
  title: {
    fontSize: 24,
    color: '#3B82F6',
  },
  subtitle: {
    fontSize: 18,
    marginTop: 8,
  },
  timeButton: {
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 24,
    width: '100%',
    alignItems: 'flex-start',
  },
  timeText: {
    fontSize: 18,
    color: '#3B82F6',
  },
  reminderButton: {
    backgroundColor: '#F97316',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  },
  reminderButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  laterButton: {
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginBottom: 16,
    width: '100%',
  },
  laterButtonText: {
    color: '#4B5563',
    textAlign: 'center',
    fontSize: 16,
  },
});

export default TrainingReminder;
