import React, { useMemo, useContext, useState } from 'react';
import { View, Text, TouchableOpacity, Alert, StyleSheet, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import { useDispatch, useSelector } from 'react-redux';
import { updateResponse, resetSelectedGoals } from '../../global/redux/responsesSlice';
import { RootState } from '../../global/store';
import { RootStackParamList } from '../../components/types';
import { AuthContext } from '../../context/AuthContext';
import { saveUserResponses } from '../../global/services/firestoreService';
import { resetForm } from '../../global/Slice/userInfoSlice';

// Define el tipo de navegación
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'HealthGoals'>;

const HealthGoals: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();
  // Memoiza el estado para evitar renders innecesarios
  const selectedGoals = useSelector((state: RootState) => state.responses.selectedGoals);
  const memoizedGoals = useMemo(() => selectedGoals || [], [selectedGoals]);
  const authContext = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const userResponses = useSelector((state: RootState) => state.responses);
  const userInfo = useSelector((state: RootState) => state.userInfo);


  if (!authContext) {
    throw new Error('AuthContext debe usarse dentro de un AuthProvider');
  }

  const { user } = authContext;

  // Alterna la selección de una meta y la guarda en responseSlice
  const handleToggleGoal = (goal: string) => {
    const updatedGoals = memoizedGoals.includes(goal)
      ? memoizedGoals.filter((g) => g !== goal) // Remueve si ya está seleccionado
      : [...memoizedGoals, goal]; // Agrega si no está seleccionado

    dispatch(updateResponse({ field: 'selectedGoals', value: updatedGoals }));
  };

  // Navega a la siguiente pantalla solo si hay metas seleccionadas
  const handleNavigation = () => {
    console.log('Objetivos seleccionados:', memoizedGoals);
    if (memoizedGoals.length > 0) {
      navigation.navigate('Registration');
    }
  };


  // Guarda las respuestas si la sesión está activa y navega a Home
  const handleSaveResponses = async () => {
    
    if (!user) {
      Alert.alert('Error', 'Debes iniciar sesión para guardar respuestas.');
      return;
    }

    if (loading) return;
  
    setLoading(true);

    try {
      const userId = user.uid;
      const email = user.email || 'Sin correo';


      await saveUserResponses(userId, email, userResponses, userInfo);

      Alert.alert('¡Éxito!', 'Respuestas guardadas.');
      dispatch(resetForm());
      dispatch(resetSelectedGoals());
      navigation.reset({ index: 0,  routes: [{ name: 'Main', state: { index: 0, routes: [{ name: 'Home' }] } }], });
    } catch (error) {
      console.error('❌ Error al guardar respuestas:', error);
      Alert.alert('Error', 'No se pudo guardar las respuestas.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Qué te gustaría hacer?</Text>

      {/* Sección de Rendimiento */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Rendimiento</Text>

        <TouchableOpacity
          style={[styles.option, memoizedGoals.includes('strength') && styles.selectedOption]}
          onPress={() => handleToggleGoal('strength')}
        >
          <MaterialIcons name="fitness-center" size={24} style={styles.icon} />
          <Text style={styles.optionText}>Aumentar La Fuerza</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, memoizedGoals.includes('combinedTraining') && styles.selectedOption]}
          onPress={() => handleToggleGoal('combinedTraining')}
        >
          <FontAwesome name="heartbeat" size={24} style={styles.icon} />
          <Text style={styles.optionText}>Entrenamiento Combinado</Text>
        </TouchableOpacity>
      </View>

      {/* Sección de Salud */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Salud</Text>

        <TouchableOpacity
          style={[styles.option, memoizedGoals.includes('totalHealth') && styles.selectedOption]}
          onPress={() => handleToggleGoal('totalHealth')}
        >
          <FontAwesome name="heart" size={24} style={styles.icon} />
          <Text style={styles.optionText}>Salud Total</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, memoizedGoals.includes('cognitiveHealth') && styles.selectedOption]}
          onPress={() => handleToggleGoal('cognitiveHealth')}
        >
          <MaterialIcons name="psychology" size={24} style={styles.icon} />
          <Text style={styles.optionText}>Salud Cognitiva</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.option, memoizedGoals.includes('sexualHealth') && styles.selectedOption]}
          onPress={() => handleToggleGoal('sexualHealth')}
        >
          <FontAwesome name="venus" size={24} style={styles.icon} />
          <Text style={styles.optionText}>Salud Sexual</Text>
        </TouchableOpacity>
      </View>

      {/* Botones condicionales */}
      {user ? (
        <TouchableOpacity
          style={[styles.nextButton, memoizedGoals.length === 0 && styles.disabledButton]}
          onPress={handleSaveResponses}
          disabled={memoizedGoals.length === 0 || loading}
        >
          {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.nextButtonText}>Guardar y Continuar</Text>}
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[styles.nextButton, memoizedGoals.length === 0 && styles.disabledButton]}
          onPress={handleNavigation}
          disabled={memoizedGoals.length === 0}
        >
          <Text style={styles.nextButtonText}>Siguiente</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
    color: '#1F2937',
    fontFamily: 'Poppins_600SemiBold',
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    color: '#6B7280',
    fontFamily: 'Poppins_400Regular',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 8,
    backgroundColor: '#F3F4F6',
    marginBottom: 12,
  },
  selectedOption: {
    backgroundColor: 'rgba(255, 216, 216, 0.45)',
  },
  icon: {
    fontSize: 24,
    color: '#1F2937',
    marginRight: 12,
  },
  optionText: {
    fontSize: 16,
    color: '#1F2937',
    fontFamily: 'Poppins_400Regular',
  },
  nextButton: {
    backgroundColor: '#F97316',
    paddingVertical: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#F97316AA',
  },
  nextButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Poppins_400Regular',
  },
});

export default HealthGoals;
