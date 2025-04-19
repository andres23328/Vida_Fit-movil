import React, { useState, useContext, useEffect } from 'react';
import {
  View,
  Text,
  Dimensions,
  TextInput,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { AuthContext } from '../../context/AuthContext';
import { Picker } from '@react-native-picker/picker';
import { Button } from 'react-native-paper';

const diasSemana = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
const ITEMS_PER_PAGE = 7;

const TiempoEntrenamientoScreen = () => {
  const [diaSeleccionado, setDiaSeleccionado] = useState('Lun');
  const [horas, setHoras] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const authContext = useContext(AuthContext);
  if (!authContext) throw new Error('AuthContext debe usarse dentro de un AuthProvider');
  const { user } = authContext;

  if (!user?.uid) {
    Alert.alert('Error de autenticación', 'No estás autenticado. Por favor inicia sesión.');
    return null;
  }

  // Función para calcular la semana calendario
  const getSemanaCalendario = (fecha: Date) => {
    const opciones: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    const fechaFormateada = fecha.toLocaleDateString('es-ES', opciones);
    return fechaFormateada;  // Ejemplo: "16 de abril"
  };
  

  const cargarDatos = async () => {
    setLoading(true);
    try {
      const userDocRef = doc(db, 'users', user.uid);
      const progressDocRef = doc(userDocRef, 'graficas', 'entrenamiento');
      const snap = await getDoc(progressDocRef);
      if (snap.exists()) {
        const savedData = snap.data()?.data || [];
        // Convertir el timestamp de Firebase en un objeto Date
        const dataConFechas = savedData.map((item: any) => ({
          ...item,
          timestamp: new Date(item.timestamp?.seconds ? item.timestamp.seconds * 1000 : item.timestamp),
        }));
        setData(dataConFechas);
      }
    } catch (error) {
      console.error("Error al cargar datos:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const guardarHoras = async () => {
    const horasNum = parseInt(horas, 10);
    if (!horas || isNaN(horasNum) || horasNum < 1 || horasNum > 24) {
      Alert.alert('Error', 'Ingresa una cantidad de horas válida (1-24)');
      return;
    }
    setGuardando(true);
  
    // Calcular la semana del registro actual
    const semanaSeleccionada = getSemanaCalendario(new Date());
  
    const yaExistia = data.some(item => item.dia === diaSeleccionado);
    const nuevoRegistro = {
      dia: diaSeleccionado,
      horas: horasNum,
      timestamp: new Date(),
      semana: semanaSeleccionada,  // Asignar la semana actual al registro
    };
  
    // Si el día seleccionado pertenece a una semana diferente, crear un nuevo registro con la semana correcta
    const nuevaData = [
      ...data.filter(item => item.dia !== diaSeleccionado || item.semana !== semanaSeleccionada),
      nuevoRegistro
    ];
  
    const userDocRef = doc(db, 'users', user.uid);
    const progressDocRef = doc(userDocRef, 'graficas', 'entrenamiento');
    await setDoc(progressDocRef, { data: nuevaData }, { merge: true });
  
    setData(nuevaData);
    setHoras('');
    setGuardando(false);
    Alert.alert('Guardado', yaExistia ? 'Día actualizado.' : 'Día agregado.');
  };
  

  const eliminarDia = async (dia: string) => {
    const nuevaData = data.filter(item => item.dia !== dia);
    const userDocRef = doc(db, 'users', user.uid);
    const progressDocRef = doc(userDocRef, 'graficas', 'entrenamiento');
    await setDoc(progressDocRef, { data: nuevaData }, { merge: true });

    setData(nuevaData);
    Alert.alert('Eliminado', `Se eliminó el registro del día ${dia}.`);
  };

  const dataOrdenadaPorDia = [...data].sort((a, b) => diasSemana.indexOf(a.dia) - diasSemana.indexOf(b.dia));
  const totalPages = Math.ceil(dataOrdenadaPorDia.length / ITEMS_PER_PAGE);
  const dataPaginaActual = dataOrdenadaPorDia.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <TouchableOpacity
          key={page}
          style={[styles.pageButton, currentPage === page && styles.pageButtonActive]}
          onPress={() => setCurrentPage(page)}
        >
          <Text style={[styles.pageButtonText, currentPage === page && styles.pageButtonTextActive]}>
            {page}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  const labelsPaginaActual = dataPaginaActual.map(item => item.dia);
  const valoresPaginaActual = dataPaginaActual.map(item => item.horas);

  // Calcular la semana para cada entrada del historial
  const semanaActual = dataPaginaActual.length > 0 ? getSemanaCalendario(dataPaginaActual[0].timestamp) : '';

  return (
    <ScrollView contentContainerStyle={{ padding: 20, backgroundColor: '#F4F6FA', flexGrow: 1, paddingBottom: 100 }}>
      <Text style={styles.titulo}>Tiempo de Entrenamiento</Text>

      {dataPaginaActual.length > 0 ? (
        <LineChart
          data={{
            labels: labelsPaginaActual,
            datasets: [{ data: valoresPaginaActual }],
          }}
          width={Dimensions.get('window').width - 40}
          height={220}
          yAxisSuffix="h"
          chartConfig={{
            backgroundColor: '#fff',
            backgroundGradientFrom: '#fff',
            backgroundGradientTo: '#fff',
            decimalPlaces: 0,
            color: (opacity = 1) => `rgba(72, 61, 139, ${opacity})`,
          }}
          bezier
          style={{ marginVertical: 16, borderRadius: 8 }}
        />
      ) : (
        !loading && <Text style={{ textAlign: 'center', marginTop: 16, fontFamily: 'Poppins_400Regular' }}>No hay datos registrados aún.</Text>
      )}

      {loading && <ActivityIndicator size="large" color="#4CAF50" style={{ marginTop: 16 }} />}

      <Text style={styles.subtitulo}>Selecciona el día</Text>
      <Picker selectedValue={diaSeleccionado} onValueChange={setDiaSeleccionado} style={styles.picker}>
        {diasSemana.map(dia => (
          <Picker.Item key={dia} label={dia} value={dia} />
        ))}
      </Picker>

      <TextInput
        placeholder="Horas entrenadas (1-24)"
        keyboardType="numeric"
        value={horas}
        onChangeText={setHoras}
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={guardarHoras}
        loading={guardando}
        disabled={guardando}
        style={styles.boton}
        labelStyle={styles.text}
      >
        Guardar horas
      </Button>

      <Text style={styles.subtitulo}>Historial:</Text>

      {dataPaginaActual.map((item, index) => (
        <View key={index} style={styles.itemHistorial}>
          <Text style={{ fontSize: 16, fontFamily: 'Poppins_400Regular' }}>
            {item.dia}: {item.horas}h
          </Text>
          <TouchableOpacity onPress={() => eliminarDia(item.dia)}>
            <Text style={{ color: 'red', fontFamily: 'Poppins_400Regular' }}>Eliminar</Text>
          </TouchableOpacity>
        </View>
      ))}

      {totalPages > 1 && renderPagination()}

      {/* Mostrar la semana debajo del historial */}
      {semanaActual && (
        <View style={styles.semanaContainer}>
          <Text style={styles.semanaText}>Semana: {semanaActual}</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  titulo: {
    fontWeight: '600',
    fontSize: 18,
    marginVertical: 30,
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
  },
  subtitulo: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginTop: 16,
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  picker: {
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
    color: 'black',
    fontSize: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    marginBottom: 10,
  },
  boton: {
    borderRadius: 20,
    backgroundColor: '#2ECC71',    
    marginBottom: 16,
  },
  text: { fontFamily: 'Poppins_600SemiBold' },
  itemHistorial: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomColor: '#ddd',
    borderBottomWidth: 1,
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 10,
    flexWrap: 'wrap',
    gap: 8,
  },
  pageButton: {
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 8,
    marginHorizontal: 4,
  },
  pageButtonActive: {
    backgroundColor: '#007bff',
  },
  pageButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
    color: '#333',
  },
  pageButtonTextActive: {
    color: '#fff',
  },
  semanaContainer: {
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  semanaText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
    color: '#4CAF50',
  },
});

export default TiempoEntrenamientoScreen;
