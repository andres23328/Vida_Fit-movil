import React, { useRef, useCallback, useContext, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import Slider from '@react-native-community/slider';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../components/types';
import { getFirestore, doc, getDoc, setDoc } from 'firebase/firestore';
import { AuthContext } from '../../context/AuthContext';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'WeeklySchedule'>;

const WeeklySchedule: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const authContext = useContext(AuthContext);
  if (!authContext) throw new Error('AuthContext debe usarse dentro de un AuthProvider');
  const { user } = authContext;

  const db = getFirestore();
  const days = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  const [TimePerDay, setTimePerDay] = useState(60);
  const [selectedDays, setSelectedDays] = useState<string[]>([]);
  const sliderValue = useRef(TimePerDay);
  const [hasExistingData, setHasExistingData] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const handleDayClick = useCallback((day: string) => {
    setSelectedDays(prev =>
      prev.includes(day)
        ? prev.filter(d => d !== day)
        : [...prev, day]
    );
  }, []);

  const handleSliderChange = (value: number) => {
    sliderValue.current = value;
  };

  const handleSliderRelease = async () => {
    const roundedTime = Math.round(sliderValue.current);
    setTimePerDay(roundedTime);
  };

  const saveToFirestore = async (time: number, days: string[]) => {
    try {
      if (!user?.uid) return;
      const userDocRef = doc(db, 'users', user.uid, 'progress', 'calendario');
      await setDoc(userDocRef, {
        TimePerDay: time,
        selectedDays: days,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Error al guardar en Firestore:', error);
      Alert.alert('Error', 'No se pudo guardar tu información');
    }
  };

  const handleNext = async () => {
    setLoading(true);
    await saveToFirestore(TimePerDay, selectedDays);
    setLoading(false);
    navigation.navigate('TimePicker');
  };
  

  const checkForExistingData = async () => {
    try {

      if (!user?.uid) return;
      const userDocRef = doc(db, 'users', user.uid, 'progress', 'calendario');
      const docSnap = await getDoc(userDocRef);

      if (docSnap.exists()) {
        setHasExistingData(true);

        Alert.alert(
          'Datos ya registrados',
          'Ya tienes una programación registrada. ¿Deseas actualizarla?',
          [
            {
              text: 'Cancelar',
              onPress: () => navigation.navigate('Home'),
              style: 'cancel',
            },
            {
              text: 'Actualizar',
              onPress: () => {
                const data = docSnap.data();
                if (data.TimePerDay) setTimePerDay(data.TimePerDay);
                if (data.selectedDays) setSelectedDays(data.selectedDays);
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('Error al verificar datos existentes:', error);
    }
  };

  useEffect(() => {
    checkForExistingData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Cuánto tiempo puedes ejercitarte cada dia?</Text>

      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>Tiempo por dia: {TimePerDay} min</Text>
        <Slider
          style={styles.slider}
          minimumValue={0}
          maximumValue={300}
          step={1}
          value={TimePerDay}
          onValueChange={handleSliderChange}
          onSlidingComplete={handleSliderRelease}
        />
        <View style={styles.sliderLabels}>
          <Text style={styles.sliderLabel}>Baja{'\n'}eficiencia</Text>
          <Text style={styles.sliderLabel}>Media{'\n'}eficiencia</Text>
          <Text style={styles.sliderLabel}>Alta{'\n'}eficiencia</Text>
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
              selectedDays.includes(day) ? styles.selectedDay : styles.deselectedDay,
            ]}
          >
            <Text style={styles.dayText}>{day}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <TouchableOpacity
        style={[styles.nextButton, loading && { backgroundColor: '#ccc' }]}
        onPress={handleNext}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.nextButtonText}>Siguiente</Text>
        )}
      </TouchableOpacity>

    </View>
  );
};

// Estilos
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
    fontFamily: 'Poppins_600SemiBold',
  },
  timeContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  timeText: {
    fontSize: 16,
    color: '#48BB78',
    marginBottom: 16,
    fontFamily: 'Poppins_400Regular',
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
    color: '#A0AEC0',
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
  },
  subtitle: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Poppins_400Regular',
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
    backgroundColor: '#3B82F6',
  },
  deselectedDay: {
    backgroundColor: '#E5E7EB',
  },
  dayText: {
    color: '#fff',
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  nextButton: {
    backgroundColor: '#2ECC71',    
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 16,
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
});

export default WeeklySchedule;
