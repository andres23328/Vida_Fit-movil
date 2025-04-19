import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Dimensions, TextInput, StyleSheet, ActivityIndicator, Alert, TouchableOpacity, ScrollView } from 'react-native';
import { LineChart } from 'react-native-chart-kit';
import { db } from '../../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { AuthContext } from '../../context/AuthContext';
import { Button } from 'react-native-paper';

const ITEMS_PER_PAGE = 3;

const ProgresoPesoScreen = () => {
  const [pesoActual, setPesoActual] = useState('');
  const [pesos, setPesos] = useState<any[]>([]);
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

  const fetchPesos = async () => {
    setLoading(true);
    const userDocRef = doc(db, 'users', user.uid);
    const progressDocRef = doc(userDocRef, 'graficas', 'peso');
    const docSnap = await getDoc(progressDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const pesosGuardados = data?.pesos || [];
      pesosGuardados.sort((a: any, b: any) => a.timestamp.seconds - b.timestamp.seconds);
      setPesos(pesosGuardados);
    }

    setLoading(false);
  };

  useEffect(() => {
    fetchPesos();
  }, []);

  const handleAgregarPeso = async () => {
    if (!pesoActual || isNaN(Number(pesoActual))) {
      Alert.alert('Dato inválido', 'Ingresa un número válido');
      return;
    }

    setGuardando(true);
    const nuevoPeso = parseFloat(pesoActual);
    const timestamp = new Date();

    const ultimaEntrada = pesos[pesos.length - 1];
    if (ultimaEntrada) {
      const fechaUltima = new Date(ultimaEntrada.timestamp?.seconds ? ultimaEntrada.timestamp.seconds * 1000 : ultimaEntrada.timestamp);
      const hoy = new Date();
      const diferenciaDias = (hoy.getTime() - fechaUltima.getTime()) / (1000 * 60 * 60 * 24);
      if (diferenciaDias < 7) {
        Alert.alert('Espera', 'Solo puedes agregar un nuevo dato una vez por semana.');
        setGuardando(false);
        return;
      }
    }

    const nuevoRegistro = { peso: nuevoPeso, timestamp };
    const userDocRef = doc(db, 'users', user.uid);
    const progressDocRef = doc(userDocRef, 'graficas', 'peso');
    const nuevosPesos = [...pesos, nuevoRegistro];

    await setDoc(progressDocRef, { pesos: nuevosPesos }, { merge: true });

    setPesoActual('');
    setPesos(nuevosPesos);
    setGuardando(false);
    setCurrentPage(1);
    Alert.alert('Peso guardado', 'Tu progreso fue actualizado');
  };

  const handleEliminarPeso = async (index: number) => {
    const nuevosPesos = pesos.filter((_, i) => i !== index);
    const userDocRef = doc(db, 'users', user.uid);
    const progressDocRef = doc(userDocRef, 'graficas', 'peso');

    await setDoc(progressDocRef, { pesos: nuevosPesos }, { merge: true });
    setPesos(nuevosPesos);
  };

  const totalPages = Math.ceil(pesos.length / ITEMS_PER_PAGE);
  const pesosPaginaActual = pesos.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

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

  const labels = pesosPaginaActual.map((_, i) => `Sem ${((currentPage - 1) * ITEMS_PER_PAGE) + i + 1}`);
  const datos = pesosPaginaActual.map((p) => p.peso);

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
        <Text style={styles.title}>Progreso de Peso</Text>

        {loading ? (
          <ActivityIndicator size="large" color="#525FE1" />
        ) : (
          <>
            {datos.length > 0 ? (
              <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <LineChart
                  data={{ labels, datasets: [{ data: datos }] }}
                  width={Math.max(Dimensions.get('window').width - 40, datos.length * 80)}
                  height={220}
                  yAxisSuffix="kg"
                  chartConfig={{
                    backgroundColor: '#fff',
                    backgroundGradientFrom: '#fff',
                    backgroundGradientTo: '#fff',
                    decimalPlaces: 1,
                    color: (opacity = 1) => `rgba(82, 95, 225, ${opacity})`,
                  }}
                  bezier
                  style={{ marginVertical: 16, borderRadius: 16 }}
                />
              </ScrollView>
            ) : (
              <Text style={{ textAlign: 'center', marginVertical: 16, fontFamily: 'Poppins_400Regular' }}>No hay datos aún. Agrega tu primer peso.</Text>
            )}

            <TextInput
              placeholder="Ingresa tu peso (kg)"
              keyboardType="numeric"
              value={pesoActual}
              onChangeText={setPesoActual}
              style={styles.input}
            />

            <Button
              mode="contained"
              onPress={handleAgregarPeso}
              loading={guardando}
              disabled={guardando}
              style={styles.boton}
              labelStyle={styles.text}
            >
              Guardar Peso
            </Button>

            <Text style={styles.subtitulo}>Historial:</Text>

            {pesosPaginaActual.map((item, index) => (
              <View key={index} style={styles.itemLista}>
                <Text>{`Semana ${(currentPage - 1) * ITEMS_PER_PAGE + index + 1}: ${item.peso} kg`}</Text>
                <TouchableOpacity onPress={() => handleEliminarPeso((currentPage - 1) * ITEMS_PER_PAGE + index)}>
                  <Text style={{ color: 'red', fontFamily: 'Poppins_400Regular' }}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            ))}

            {totalPages > 1 && renderPagination()}
          </>
        )}
      </ScrollView>
    </View>
  );
};

export default ProgresoPesoScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F6FA',
    padding: 20,
  },
  title: {
    marginVertical: 30,
    fontSize: 22,
    textAlign: 'center',
    fontWeight: '600',
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
  boton: {
    borderRadius: 20,
    backgroundColor: '#2ECC71',
    marginTop: 16,
  },
  itemLista: {
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
