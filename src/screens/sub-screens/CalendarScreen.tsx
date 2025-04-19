import React, { useState, useContext, useCallback } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../context/AuthContext';
import { getFirestore, doc, getDoc } from 'firebase/firestore';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../components/types';
import { Calendar } from 'react-native-calendars';
import { Button } from 'react-native-paper';
import moment from 'moment';
import 'moment/locale/es';
moment.locale('es');

type CalendarScreenNavigationProp = StackNavigationProp<RootStackParamList, 'CalendarScreen'>;

const CalendarScreen: React.FC = () => {
  const navigation = useNavigation<CalendarScreenNavigationProp>();
  const { user } = useContext(AuthContext)!;
  const [selectedDays, setSelectedDays] = useState<{ [key: string]: { selected: boolean, selectedColor: string } }>({});
  const [horaSeleccionada, setHoraSeleccionada] = useState<string | null>(null);
  const [horaFin, setHoraFin] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    useCallback(() => {
      const fetchCalendario = async () => {
        if (!user) return;
        setLoading(true);

        const db = getFirestore();
        const docRef = doc(db, 'users', user.uid, 'progress', 'calendario');
        const docSnap = await getDoc(docRef);

        if (!docSnap.exists()) {
          navigation.navigate('WeeklySchedule');
          return;
        }

        const data = docSnap.data();
        console.log('Datos obtenidos de Firestore:', data);

        if (!data.horaSeleccionada) {
          navigation.navigate('TimePicker');
          return;
        }

        setHoraSeleccionada(data.horaSeleccionada);

        const TimePerDay = data.TimePerDay || 45;
        const parsedTime = moment(data.horaSeleccionada, 'hh:mm A');
        const horaFinal = parsedTime.clone().add(TimePerDay, 'minutes').format('hh:mm A');
        setHoraFin(horaFinal);

        const diasSeleccionados = data.selectedDays || [];
        console.log('Días seleccionados desde Firestore:', diasSeleccionados);

        const fechasMarcadas: { [key: string]: { selected: boolean, selectedColor: string } } = {};
        const ahora = moment();

        for (let i = 0; i < 180; i++) {
          const dia = moment(ahora).add(i, 'days');
          const nombreDia = dia.format('ddd').replace('.', '');
          const capitalizado = nombreDia.charAt(0).toUpperCase() + nombreDia.slice(1);

          if (diasSeleccionados.includes(capitalizado)) {
            const fechaISO = dia.format('YYYY-MM-DD');
            fechasMarcadas[fechaISO] = { selected: true, selectedColor: '#3B82F6' };
          }
        }

        setSelectedDays(fechasMarcadas);
        setLoading(false);
      };

      fetchCalendario();
    }, [user, navigation])
  );

  const handleDias = async () => {
    setLoading(true);
    navigation.navigate('WeeklySchedule');
    setLoading(false);
  };

  const handleHora = async () => {
    setLoading(true);
    navigation.navigate('TimePicker');
    setLoading(false);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3B82F6" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text  style={styles.title}>Calendario</Text>

      <View style={styles.timeContainer}>
        <Text style={styles.timeText}>Inicio: {horaSeleccionada}</Text>
        <Text style={styles.timeText}> - </Text>
        <Text style={styles.timeText}>Fin: {horaFin}</Text>
      </View>
        

      <Calendar
        markedDates={selectedDays}
        theme={{
          selectedDayBackgroundColor: '#3B82F6',
          todayTextColor: '#3B82F6',
          arrowColor: '#3B82F6',
          textDayFontFamily: 'Poppins_400Regular',
          textMonthFontFamily: 'Poppins_600SemiBold',
          textDayHeaderFontFamily: 'Poppins_600SemiBold',
        }}
      />


      <Button mode='contained' style={styles.button} labelStyle={styles.texts} onPress={handleDias} loading={loading} disabled={loading}>
        Actualizar Calendario
      </Button>
      <Button mode='contained' style={styles.button} labelStyle={styles.texts} onPress={handleHora} loading={loading} disabled={loading}>
        Actualizar Hora
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 50,
    backgroundColor: '#f9fafb',
  },
  title: {
    textAlign: 'center',
    marginVertical: 30,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 24,
  },
  timeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },  
  timeText: {
    fontSize: 18,
    fontFamily: 'Poppins_400Regular',
    color: '#1f2937',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  texts: { fontFamily: 'Poppins_600SemiBold' },
  button: {
    marginVertical: 10,
    borderRadius: 30,
    paddingVertical: 10,
    width: '80%',
    alignSelf: 'center', // Esto lo centra horizontalmente
    backgroundColor: '#2ECC71',
  },
  
});

export default CalendarScreen;
