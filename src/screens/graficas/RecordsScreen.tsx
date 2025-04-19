import React, { useState, useContext, useEffect } from 'react';
import { View, Text, Dimensions, TextInput, Alert, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { db } from '../../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { AuthContext } from '../../context/AuthContext';
import { Button } from 'react-native-paper';

const ITEMS_PER_PAGE = 3;

const RecordsScreen = () => {
  const [ejercicio, setEjercicio] = useState('');
  const [repeticiones, setRepeticiones] = useState('');
  const [tiempo, setTiempo] = useState('');
  const [tipoEntrada, setTipoEntrada] = useState<'repeticiones' | 'tiempo'>('repeticiones');
  const [records, setRecords] = useState<any[]>([]);
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

  const fetchRecords = async () => {
    setLoading(true);
    const userDocRef = doc(db, 'users', user.uid);
    const progressDocRef = doc(userDocRef, 'graficas', 'records');

    const docSnap = await getDoc(progressDocRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      const recordsGuardados = data?.records || [];
      setRecords(recordsGuardados);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const handleAgregarRecord = async () => {
    if (!ejercicio || (tipoEntrada === 'repeticiones' && (!repeticiones || isNaN(Number(repeticiones)))) || 
        (tipoEntrada === 'tiempo' && (!tiempo || isNaN(Number(tiempo))))) {
      Alert.alert('Dato inválido', 'Por favor completa correctamente los campos.');
      return;
    }

    setGuardando(true);

    const nuevoRecord = {
      ejercicio,
      tipo: tipoEntrada,
      repeticiones: tipoEntrada === 'repeticiones' ? parseInt(repeticiones, 10) : null,
      tiempo: tipoEntrada === 'tiempo' ? parseInt(tiempo, 10) : null,
      timestamp: new Date(),
    };

    const userDocRef = doc(db, 'users', user.uid);
    const progressDocRef = doc(userDocRef, 'graficas', 'records');

    const nuevosRecords = [...records, nuevoRecord];

    await setDoc(progressDocRef, { records: nuevosRecords }, { merge: true });

    setEjercicio('');
    setRepeticiones('');
    setTiempo('');
    setRecords(nuevosRecords);
    setGuardando(false);
    setCurrentPage(1);
    Alert.alert('Record guardado', 'Tu progreso fue actualizado');
  };

  const handleEliminarRecord = async (index: number) => {
    const nuevosRecords = records.filter((_, i) => i !== index);
    const userDocRef = doc(db, 'users', user.uid);
    const progressDocRef = doc(userDocRef, 'graficas', 'records');

    await setDoc(progressDocRef, { records: nuevosRecords }, { merge: true });

    setRecords(nuevosRecords);
    Alert.alert('Record eliminado', 'El record ha sido eliminado.');
  };

  const totalPages = Math.ceil(records.length / ITEMS_PER_PAGE);
  const recordsPaginaActual = records.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const getMaxRepsPerExercise = () => {
    const map = new Map();

    records.forEach((record) => {
      if (record.tipo === 'repeticiones') {
        const prev = map.get(record.ejercicio);
        if (!prev || record.repeticiones > prev.repeticiones) {
          map.set(record.ejercicio, record);
        }
      }
    });

    return Array.from(map.values());
  };

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

  return (
    <View style={{ flex: 1, backgroundColor: '#F4F6FA' }}>
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 100 }}>
        <Text style={styles.title}>Records Personales</Text>

        {getMaxRepsPerExercise().length > 0 ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <BarChart
              data={{
                labels: getMaxRepsPerExercise().map((item) => item.ejercicio),
                datasets: [{ data: getMaxRepsPerExercise().map((item) => item.repeticiones) }],
              }}
              width={Math.max(Dimensions.get('window').width - 40, getMaxRepsPerExercise().length * 80)}
              height={220}
              yAxisLabel=""
              yAxisSuffix=""
              chartConfig={{
                backgroundColor: '#fff',
                backgroundGradientFrom: '#fff',
                backgroundGradientTo: '#fff',
                decimalPlaces: 0,
                color: (opacity = 1) => `rgba(138, 43, 226, ${opacity})`,
              }}
              fromZero
              style={{ marginVertical: 8, borderRadius: 8 }}
            />
          </ScrollView>
        ) : (
          <Text style={{ textAlign: 'center', marginVertical: 16, fontFamily: 'Poppins_400Regular' }}>
            No hay records aún.
          </Text>
        )}

        <TextInput
          placeholder="Nombre del ejercicio"
          value={ejercicio}
          onChangeText={(text) => {
            setEjercicio(text);
            const lower = text.toLowerCase();
            const esTiempo = ['plancha', 'trote', 'cardio', 'bici', 'caminar'].some(keyword => lower.includes(keyword));
            setTipoEntrada(esTiempo ? 'tiempo' : 'repeticiones');
          }}
          style={styles.input}
        />

        {tipoEntrada === 'repeticiones' ? (
          <TextInput
            placeholder="Repeticiones"
            keyboardType="numeric"
            value={repeticiones}
            onChangeText={setRepeticiones}
            style={styles.input}
          />
        ) : (
          <TextInput
            placeholder="Tiempo (minutos)"
            keyboardType="numeric"
            value={tiempo}
            onChangeText={setTiempo}
            style={styles.input}
          />
        )}

        <Button
          mode="contained"
          onPress={handleAgregarRecord}
          loading={guardando}
          disabled={guardando}
          style={styles.button}
          labelStyle={styles.text}
        >
          Guardar Record
        </Button>

        <Text style={styles.subtitulo}>Historial:</Text>

        {loading ? (
          <Text style={{ textAlign: 'center', fontFamily: 'Poppins_400Regular' }}>Cargando...</Text>
        ) : recordsPaginaActual.length === 0 ? (
          <Text style={{ textAlign: 'center', fontFamily: 'Poppins_400Regular' }}>No hay registros aún.</Text>
        ) : (
          recordsPaginaActual.map((item, index) => (
            <View key={index} style={styles.recordRow}>
              <Text>{item.ejercicio}</Text>
              <Text>
                {item.tipo === 'repeticiones'
                  ? `${item.repeticiones} repeticiones`
                  : `${item.tiempo} min`}
              </Text>
              <TouchableOpacity onPress={() => handleEliminarRecord((currentPage - 1) * ITEMS_PER_PAGE + index)}>
                <Text style={{ color: 'red', fontFamily: 'Poppins_400Regular' }}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          ))
        )}

        {totalPages > 1 && renderPagination()}
      </ScrollView>
    </View>
  );
};

export default RecordsScreen;

const styles = StyleSheet.create({
  title: {
    fontWeight: '600',
    fontSize: 18,
    marginVertical: 30,
    textAlign: 'center',
    marginBottom: 16,
    fontFamily: 'Poppins_600SemiBold',
  },
  subtitulo: {
    marginTop: 24,
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  text: {
    fontFamily: 'Poppins_600SemiBold',
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginTop: 16,
    backgroundColor: '#fff',
  },
  button: {
    borderRadius: 20,
    backgroundColor: '#2ECC71',
    marginTop: 16,
  },
  recordRow: {
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
});
