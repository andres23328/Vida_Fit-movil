import React, { useEffect, useState, useContext } from 'react';
import { View, Text, Dimensions, TextInput, Alert, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { PieChart } from 'react-native-chart-kit';
import { db } from '../../config/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { AuthContext } from '../../context/AuthContext';
import { Button } from 'react-native-paper';

const ITEMS_PER_PAGE = 5;

const DistribucionScreen = () => {
  const [parte, setParte] = useState('');
  const [porcentaje, setPorcentaje] = useState('');
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const authContext = useContext(AuthContext);
  if (!authContext) throw new Error('AuthContext debe usarse dentro de un AuthProvider');
  const { user } = authContext;

  if (!user?.uid) {
    Alert.alert('Error de autenticación', 'No estás autenticado. Por favor inicia sesión.');
    return null;
  }

  const fetchDistribucion = async () => {
    setLoading(true);
    const userDocRef = doc(db, 'users', user.uid);
    const progressDocRef = doc(userDocRef, 'graficas', 'distribucion');

    const docSnap = await getDoc(progressDocRef);
    if (docSnap.exists()) {
      const dataGuardada = docSnap.data()?.data || [];
      setData(dataGuardada);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchDistribucion();
  }, []);

  const guardarDistribucion = async (nuevaData: any[]) => {
    const userDocRef = doc(db, 'users', user.uid);
    const progressDocRef = doc(userDocRef, 'graficas', 'distribucion');
    await setDoc(progressDocRef, { data: nuevaData }, { merge: true });
  };

  const agregarParte = async () => {
    const porcentajeNumerico = parseFloat(porcentaje);
    const parteLimpia = parte.trim();

    if (!parteLimpia || isNaN(porcentajeNumerico)) {
      Alert.alert('Error', 'Completa los campos correctamente.');
      return;
    }

    let nuevaData = [...data];
    const parteExistenteIndex = nuevaData.findIndex(
      item => item.name.trim().toLowerCase() === parteLimpia.toLowerCase()
    );

    if (parteExistenteIndex !== -1) {
      // Eliminar temporalmente el porcentaje actual para evitar sumarlo dos veces
      nuevaData.splice(parteExistenteIndex, 1);
    }

    // Agrupar datos en bloques de 100%
    const grupos = agruparPorPorcentaje(nuevaData);

    let ultimoGrupo = grupos[grupos.length - 1] || [];
    const totalUltimoGrupo = ultimoGrupo.reduce((acc, item) => acc + item.population, 0);

    if (totalUltimoGrupo + porcentajeNumerico > 100) {
      // Comenzar un nuevo grupo
      grupos.push([{ name: parteLimpia, population: porcentajeNumerico, timestamp: new Date() }]);
    } else {
      ultimoGrupo.push({ name: parteLimpia, population: porcentajeNumerico, timestamp: new Date() });
    }

    // Aplanar grupos
    const dataFinal = grupos.flat();

    setGuardando(true);
    await guardarDistribucion(dataFinal);
    setData([...dataFinal]);
    setParte('');
    setPorcentaje('');
    setGuardando(false);

    Alert.alert('Guardado', `"${parteLimpia}" con ${porcentaje}% fue ${parteExistenteIndex !== -1 ? 'actualizado' : 'agregado'}.`);
  };

  const eliminarParte = async (index: number) => {
    const nuevaData = data.filter((_, i) => i !== index);
    await guardarDistribucion(nuevaData);
    setData([...nuevaData]);
    Alert.alert('Eliminado', 'El registro fue eliminado.');
  };

  const agruparPorPorcentaje = (data: any[]) => {
    const grupos: any[][] = [];
    let grupoActual: any[] = [];
    let total = 0;

    for (const item of data) {
      if (total + item.population > 100) {
        grupos.push(grupoActual);
        grupoActual = [];
        total = 0;
      }
      grupoActual.push(item);
      total += item.population;
    }

    if (grupoActual.length > 0) {
      grupos.push(grupoActual);
    }

    return grupos;
  };

  const gruposDeGraficos = agruparPorPorcentaje(data);
  const totalPages = gruposDeGraficos.length;
  const grupoActual = gruposDeGraficos[currentPage - 1] || [];

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
    <ScrollView contentContainerStyle={{ padding: 20, backgroundColor: '#F4F6FA', paddingBottom: 100 }}>
      <Text style={styles.title}>Distribución de Entrenamiento</Text>

      {grupoActual.reduce((acc, item) => acc + item.population, 0) === 100 ? (
        <PieChart
          data={grupoActual.map((item, index) => ({
            name: item.name,
            population: item.population,
            color: `hsl(${(index * 360) / grupoActual.length}, 70%, 50%)`,
            legendFontColor: '#7F7F7F',
            legendFontSize: 12,
          }))}
          width={Dimensions.get('window').width - 40}
          height={220}
          chartConfig={{ color: () => '#000' }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      ) : (
        <Text style={{ textAlign: 'center', marginVertical: 16, fontFamily: 'Poppins_400Regular', color: 'red' }}>
          El total debe ser 100% para mostrar el gráfico. Actualmente: {grupoActual.reduce((acc, item) => acc + item.population, 0)}%
        </Text>
      )}

      <TextInput
        placeholder="Parte del cuerpo (ej. Piernas)"
        value={parte}
        onChangeText={setParte}
        style={styles.input}
      />
      <TextInput
        placeholder="Porcentaje (ej. 20)"
        value={porcentaje}
        onChangeText={setPorcentaje}
        keyboardType="numeric"
        style={styles.input}
      />

      <Button
        mode="contained"
        onPress={agregarParte}
        loading={guardando}
        disabled={guardando}
        style={styles.button}
        labelStyle={styles.text}
      >
        Guardar parte del cuerpo
      </Button>

      <Text style={styles.subtitulo}>Historial:</Text>

      {loading ? (
        <Text style={{ textAlign: 'center', marginTop: 20, fontFamily: 'Poppins_400Regular' }}>Cargando...</Text>
      ) : (
        grupoActual.map((item, index) => {
          const globalIndex = data.findIndex(d => d.timestamp?.seconds === item.timestamp?.seconds);
          return (
            <View key={index} style={styles.historialItem}>
              <Text style={{ fontSize: 16, fontFamily: 'Poppins_400Regular' }}>{item.name}</Text>
              <Text style={{ fontSize: 16, fontFamily: 'Poppins_400Regular' }}>{item.population}%</Text>
              <TouchableOpacity onPress={() => eliminarParte(globalIndex)}>
                <Text style={{ color: 'red', fontFamily: 'Poppins_400Regular' }}>Eliminar</Text>
              </TouchableOpacity>
            </View>
          );
        })
      )}

      {totalPages > 1 && renderPagination()}
    </ScrollView>
  );
};

export default DistribucionScreen;

const styles = StyleSheet.create({
  title: {
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
  text: { fontFamily: 'Poppins_600SemiBold' },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    padding: 10,
    borderRadius: 8,
    marginTop: 12,
    backgroundColor: '#fff',
  },
  button: {
    borderRadius: 20,
    backgroundColor: '#2ECC71',
    marginTop: 16,
  },
  historialItem: {
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
