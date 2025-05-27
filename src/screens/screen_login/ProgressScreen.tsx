import React, { useEffect, useContext, useState, useCallback } from 'react';
import { ScrollView, StyleSheet, View, Alert } from 'react-native';
import { Text, Card, ProgressBar, Checkbox, Button } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { AuthContext } from '../../context/AuthContext';
import { RootStackParamList } from '../../components/types';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'ProgressScreen'>;

export default function ProgressScreen() {
  const authContext = useContext(AuthContext);
  if (!authContext) throw new Error('AuthContext debe usarse dentro de un AuthProvider');
  const { user } = authContext;
  const navigation = useNavigation<NavigationProp>();
  const [loading, setLoading] = useState(false);
  
  const [clasesReservadas, setClasesReservadas] = useState<any[]>([]);
  const [bodyPartsFirestore, setBodyPartsFirestore] = useState<Record<string, number>>({});
  const [alertShown, setAlertShown] = useState(false); // NUEVO ESTADO

  const totalClases = 20;
  const clasesCompletadas = clasesReservadas.length;
  const attendanceProgress = clasesCompletadas / totalClases;

  const achievements = [
    'Completaste 10 clases HIIT',
    'Asistencia perfecta - 1 semana',
    'Meta de peso alcanzada',
  ];

  useFocusEffect(
    useCallback(() => {
      const checkProgressData = async () => {
        if (!user?.uid) return;
  
        const progressClasesRef = doc(db, 'users', user.uid, 'progress', 'clases');
        const progressBodyRef = doc(db, 'users', user.uid, 'progress', 'body');
  
        const [clasesSnap, bodySnap] = await Promise.all([
          getDoc(progressClasesRef),
          getDoc(progressBodyRef),
        ]);
  
        const clasesExists = clasesSnap.exists();
        const bodyExists = bodySnap.exists();
  
        if (clasesExists) {
          const data = clasesSnap.data();
          setClasesReservadas(data.clasesReservadas || []);
        } else {
          setClasesReservadas([]); // vaciar si no existe
        }
  
        if (bodyExists) {
          setBodyPartsFirestore(bodySnap.data() || {});
        } else {
          setBodyPartsFirestore({}); // vaciar si no existe
        }
  
/*         if (!alertShown && !clasesExists && !bodyExists) {
          setAlertShown(true);
          Alert.alert(
            'Datos incompletos',
            'Para ingresar a tu progreso, primero debes registrar tus clases y tu información corporal.',
            [
              { text: 'Ir a Clases', onPress: () => navigation.navigate('ClassesScreen') },
              { text: 'Ir a Datos Corporales', onPress: () => navigation.navigate('BodyScreen') },
            ],
            { cancelable: false }
          );
        } else if (!clasesExists) {
          //navigation.navigate('ClassesScreen');
        } else if (!bodyExists) {
          //navigation.navigate('BodyScreen');
        } */
      };
  
      checkProgressData();
    }, [user, navigation, alertShown])
  );
  
  const handleClases = async () => {
    setLoading(true);
    navigation.navigate('ClassesScreen');
    setLoading(false);
  };
  const handleCompo = async () => {
    setLoading(true);
    navigation.navigate('BodyScreen');
    setLoading(false);
  };

  return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={styles.container}>
      <Text variant="headlineMedium" style={styles.title}>Mi Progreso</Text>

      {/* Progreso de asistencia */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.text}>Asistencia</Text>
          <ProgressBar progress={attendanceProgress} style={styles.progressBar}  color='#3B82F6'/>
          <Text style={[styles.text, styles.progressText]}>
            {clasesCompletadas} de {totalClases} clases completadas
          </Text>
        </Card.Content>
      </Card>

      {/* Clases reservadas */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.text}>Clases Reservadas</Text>
          {clasesReservadas.length > 0 ? (
            clasesReservadas.map((clase, index) => (
              <View key={index} style={styles.claseItem}>
                <Checkbox status="checked"  color='#3B82F6'/>
                <View>
                  <Text style={styles.text}>{clase.name} - {clase.time}</Text>
                  <Text style={[styles.text, styles.instructor]}>{clase.instructor}</Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.textred}>No hay clases registradas.</Text>
          )}
        </Card.Content>
      </Card>

      {/* Logros */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.text}>Logros</Text>
          {achievements.map((achievement, index) => (
            <Text key={index} style={[styles.text, styles.achievement]}>• {achievement}</Text>
          ))}
        </Card.Content>
      </Card>

      {/* Composición corporal */}
      <Card style={styles.card}>
        <Card.Content>
          <Text variant="titleLarge" style={styles.text}>Composición Corporal</Text>
          {Object.entries(bodyPartsFirestore).length > 0 ? (
            Object.entries(bodyPartsFirestore).map(([part, value]) => (
              <Text key={part} style={styles.text}>
                {part.charAt(0).toUpperCase() + part.slice(1)}: {value}%
              </Text>
            ))
          ) : (
            <Text style={styles.textred}>No hay datos de composición corporal.</Text>
          )}
        </Card.Content>
      </Card>

      <Button mode='contained' style={styles.button} labelStyle={styles.texts} onPress={handleClases} loading={loading} disabled={loading}>
        Registrar Clases
      </Button>

      <Button mode='contained' style={styles.button} labelStyle={styles.texts} onPress={handleCompo} loading={loading} disabled={loading}>
        Registrar composición corporal
      </Button>

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 100,
    backgroundColor: '#f9fafb',

  },
  title: {
    textAlign: 'center',
    marginVertical: 30,
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 24,
  },
  card: {
    marginBottom: 16,
  },
  text: {
    fontFamily: 'Poppins_400Regular',
  },
  textred: {
    fontFamily: 'Poppins_400Regular',
    color: 'red',
  },
  progressBar: {
    marginVertical: 10,
    height: 10,
  },
  progressText: {
    textAlign: 'center',
    marginTop: 5,
  },
  claseItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  instructor: {
    fontSize: 12,
    color: '#666',
  },
  achievement: {
    marginVertical: 5,
  },
  texts: { fontFamily: 'Poppins_600SemiBold' },
  button: { marginVertical: 10, borderRadius: 30, paddingVertical: 10, backgroundColor: '#2ECC71', },
});
