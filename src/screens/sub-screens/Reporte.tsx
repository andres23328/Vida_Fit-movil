import React, { useEffect, useState, useContext } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Text as PaperText, ActivityIndicator, Card } from 'react-native-paper';
import { Text as RNText } from 'react-native';
import { collection, getDocs, orderBy, query } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { AuthContext } from '../../context/AuthContext';

interface RegistroPeso {
  fecha: Date;
  peso: number;
}

interface PesoPorMes {
  mes: string;
  peso: number;
}

const ITEMS_PER_PAGE = 5;

export default function Reporte() {
  const authContext = useContext(AuthContext);
  const { user } = authContext!;
  const [todosLosPesos, setTodosLosPesos] = useState<RegistroPeso[]>([]);
  const [resumenMensual, setResumenMensual] = useState<PesoPorMes[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(todosLosPesos.length / ITEMS_PER_PAGE);
  const pesosPaginaActual = todosLosPesos.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  useEffect(() => {
    if (user?.uid) {
      obtenerDatosPeso(user.uid);
    }
  }, [user]);

  const obtenerDatosPeso = async (userId: string) => {
    try {
      const responsesRef = collection(db, 'users', userId, 'responses');
      const q = query(responsesRef, orderBy('createdAt', 'asc'));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const registros: RegistroPeso[] = snapshot.docs.map((doc) => {
          const data = doc.data();
          const pesoExtraido = data?.userInfo?.weight;
          return {
            peso: pesoExtraido || 0,
            fecha: data.createdAt?.toDate?.() || new Date(),
          };
        });

        setTodosLosPesos(registros);

        const pesosAgrupados: { [mes: string]: number } = {};
        registros.forEach(({ peso, fecha }) => {
          const mes = fecha.toLocaleDateString('es-ES', { year: 'numeric', month: 'long' });
          pesosAgrupados[mes] = peso;
        });

        const resumen: PesoPorMes[] = Object.entries(pesosAgrupados).map(([mes, peso]) => ({
          mes,
          peso,
        }));

        setResumenMensual(resumen);
      } else {
        console.log('⚠️ No se encontraron documentos en la colección "responses"');
      }
    } catch (error) {
      console.error('❌ Error obteniendo datos de peso:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderTarjeta = (
    titulo: string,
    lista: any[],
    renderItem: (item: any, index: number) => JSX.Element
  ) => {
    return (
      <>
        <PaperText style={styles.title}>{titulo}</PaperText>
        {loading ? (
          <ActivityIndicator animating={true} size="large" />
        ) : lista.length === 0 ? (
          <PaperText style={styles.noData}>No hay datos disponibles.</PaperText>
        ) : (
          <>
            {lista.map((item, index) => renderItem(item, index))}
          </>
        )}
      </>
    );
  };

  const renderPagination = () => (
    <View style={styles.paginationContainer}>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <TouchableOpacity
          key={page}
          style={[
            styles.pageButton,
            currentPage === page && styles.pageButtonActive,
          ]}
          onPress={() => setCurrentPage(page)}
        >
          <PaperText
            style={[
              styles.pageButtonText,
              currentPage === page && styles.pageButtonTextActive,
            ]}
          >
            {page}
          </PaperText>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
      {renderTarjeta('📅 Todos los registros de peso', pesosPaginaActual, (item, index) => (
        <Card key={index} style={styles.card}>
          <Card.Content>
            <PaperText style={styles.mes}>
              {item.fecha.toLocaleDateString('es-ES', {
                day: '2-digit',
                month: 'long',
                year: 'numeric',
              })}
            </PaperText>
            <PaperText style={styles.peso}>Peso: {item.peso} kg</PaperText>
          </Card.Content>
        </Card>
      ))}

      {totalPages > 1 && renderPagination()}

      {renderTarjeta('📊 Resumen mensual (último peso del mes)', resumenMensual, (item, index) => (
        <Card key={index} style={styles.card}>
          <Card.Content>
            <PaperText style={styles.mes}>{item.mes}</PaperText>
            <PaperText style={styles.peso}>Peso: {item.peso} kg</PaperText>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 100,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    marginBottom: 15,
    textAlign: 'center',
    fontFamily: 'Poppins_600SemiBold',
  },
  noData: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: 'gray',
    fontFamily: 'Poppins_400Regular',
  },
  card: {
    marginBottom: 15,
    padding: 10,
    borderRadius: 10,
    elevation: 3,
  },
  mes: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 5,
    fontFamily: 'Poppins_600SemiBold',
  },
  peso: {
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  paginationContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginVertical: 20,
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
