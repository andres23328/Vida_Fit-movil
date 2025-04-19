import React, { useState, useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { RootStackParamList } from '../../components/types';
import { StackNavigationProp } from '@react-navigation/stack';
import { getFirestore, doc, setDoc } from 'firebase/firestore';
import { AuthContext } from '../../context/AuthContext';

type TimePickerNavigationProp = StackNavigationProp<RootStackParamList, 'TrainingReminder'>;

const TimePicker: React.FC = () => {
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const navigation = useNavigation<TimePickerNavigationProp>();
  const authContext = useContext(AuthContext);
  if (!authContext) throw new Error('AuthContext debe usarse dentro de un AuthProvider');
  const { user } = authContext;
  const showDatePicker = () => setDatePickerVisibility(true);
  const hideDatePicker = () => setDatePickerVisibility(false);

  const handleConfirm = async (date: Date) => {
    const hours = date.getHours();
    const minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const formattedHours = hours % 12 || 12;
    const formattedTime = `${formattedHours < 10 ? `0${formattedHours}` : formattedHours}:${minutes < 10 ? `0${minutes}` : minutes} ${ampm}`;
    
    setSelectedTime(formattedTime);
    hideDatePicker();

    try {
      if (!user) {
        Alert.alert('Error', 'No se ha iniciado sesión');
        return;
      }

      const db = getFirestore();
      const docRef = doc(db, 'users', user.uid, 'progress', 'calendario');
      await setDoc(docRef, {
        horaSeleccionada: formattedTime,
        timestamp: new Date()
      }, { merge: true });

      Alert.alert('Guardado', `Horario guardado: ${formattedTime}`);
      navigation.reset({ index: 0,  routes: [{ name: 'Main', state: { index: 0, routes: [{ name: 'Home' }] } }], });
      
    } catch (error) {
      console.error('Error al guardar el horario', error);
      Alert.alert('Error', 'No se pudo guardar el horario');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.gridContainer}>
        {[...Array(14)].map((_, i) => (
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

      <TouchableOpacity style={styles.timeDisplay} onPress={showDatePicker}>
        <Text style={styles.timeText}>{selectedTime}</Text>
      </TouchableOpacity>

      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="time"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
        is24Hour={false}
        cancelTextIOS="Cancelar"
        confirmTextIOS="Aceptar"
        customHeaderIOS={() => (
          <Text style={styles.pickerHeader}>Selecciona la hora</Text>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
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
    fontFamily: 'Poppins_600SemiBold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 18,
    marginTop: 8,
    fontFamily: 'Poppins_400Regular',
    textAlign: 'center',
  },
  timeDisplay: {
    backgroundColor: '#FFFFFF',
    borderColor: '#3B82F6',
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
    color: '#000000',
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  pickerHeader: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    textAlign: 'center',
    marginBottom: 10,
  },
});

export default TimePicker;
