import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { RootStackParamList } from '../../components/types';
import { StackNavigationProp } from '@react-navigation/stack';

// Define el tipo para la navegación
type TimePickerNavigationProp = StackNavigationProp<RootStackParamList, 'TrainingReminder'>;

const TimePicker: React.FC = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const navigation = useNavigation<TimePickerNavigationProp>(); // Tipado específico para esta pantalla

  // Función para mostrar el modal del selector de hora
  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  // Función para ocultar el modal
  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  // Función para manejar la selección de la hora
  const handleConfirm = (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12; // Convierte 0 horas en 12
    const formattedTime = `${formattedHours < 10 ? `0${formattedHours}` : formattedHours}:${minutes < 10 ? `0${minutes}` : minutes} ${ampm}`;
    setSelectedTime(formattedTime);
    hideDatePicker();
  };

  return (
    <View style={styles.container}>
      {/* Imagen de cabecera */}
      <View style={styles.gridContainer}>
        {[...Array(14)].map((_, i) => (
          <View
            key={i}
            style={[styles.box, { backgroundColor: Math.random() > 0.5 ? '#3B82F6' : '#BFDBFE' }]}
          />
        ))}
      </View>

      {/* Texto de descripción */}
      <View style={styles.textContainer}>
        <Text style={styles.title}>Los recordatorios de entrenamiento te mantienen encaminado.</Text>
        <Text style={styles.subtitle}>Programe notificaciones para alcanzar tus objetivos más rápido!</Text>
      </View>

      {/* Hora seleccionada con integración del selector */}
      <TouchableOpacity style={styles.timeDisplay} onPress={showDatePicker}>
        <Text style={styles.timeText}>{selectedTime}</Text>
      </TouchableOpacity>

      {/* Modal del selector de tiempo */}
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        is24Hour={false} // Selector en formato 12 horas
        cancelTextIOS="Cancelar"
        confirmTextIOS="Aceptar"
        customHeaderIOS={() => (
          <Text style={{ fontSize: 18, fontWeight: '600', color: '#000', textAlign: 'center', marginBottom: 10 }}>
            Selecciona la hora
          </Text>
        )}
      />


      {/* Botón de recordatorio */}
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.navigate('PersonalizedWelcome')}
      >
        <Text style={styles.nextButtonText}>Recordatorio De Horario</Text>
      </TouchableOpacity>

      {/* Opción de "Quizás más tarde" */}
      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Text style={styles.laterText}>Quizás más tarde</Text>
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
    backgroundColor: '#f3f4f6', // Fondo gris claro
  },
  headerImage: {
    width: 120,
    height: 120,
    marginBottom: 20,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginBottom: 30,
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
  timeDisplay: {
    backgroundColor: '#FFFFFF', // Fondo blanco
    borderColor: '#3B82F6', // Borde azul
    borderWidth: 2,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 10,
    marginBottom: 24,
    justifyContent: 'center',
    alignItems: 'center',
    width: 150,
  },
  timeText: {
    fontSize: 24,
    color: '#000000', // Letra negra
    fontWeight: '600',
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
  laterText: {
    color: '#4B5563', // Gris oscuro
    fontSize: 16,
    marginTop: 16,
    textDecorationLine: 'underline',
  },
});

export default TimePicker;
