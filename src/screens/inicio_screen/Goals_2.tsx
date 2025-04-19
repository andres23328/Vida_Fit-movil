import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../components/types'; // Ajusta esta ruta
import { useDispatch } from 'react-redux';
import { updateResponse } from '../../global/redux/responsesSlice'; // Importar Redux

const Goals: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch(); 

  const handleSelectGoal = (goal: string) => {
    dispatch(updateResponse({ field: 'goal', value: goal })); // Guardar en Redux
    navigation.navigate('Gender'); // Navegar a la siguiente pantalla
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Qué te gustaría hacer?</Text>

      <View style={styles.cardContainer}>
        <TouchableOpacity
          style={styles.card}
          onPress={() => handleSelectGoal('Perder Grasa y Ganar Músculo')}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="fitness-outline" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.cardText}>Perder Grasa y Ganar Músculo</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => handleSelectGoal('Perder Grasa')}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="flame-outline" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.cardText}>Perder Grasa</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          onPress={() => handleSelectGoal('Ganar Músculo')}
        >
          <View style={styles.iconContainer}>
            <Ionicons name="barbell-outline" size={24} color="#FFFFFF" />
          </View>
          <Text style={styles.cardText}>Ganar Músculo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Estilos (se mantienen iguales)
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    textAlign: 'center',
    color: '#111827',
    marginBottom: 24,
    fontFamily: 'Poppins_600SemiBold',
  },
  cardContainer: {
    width: '100%',
  },
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    marginBottom: 16,
    backgroundColor: '#1E40AF',
    borderRadius: 10,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  iconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#3B82F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  cardText: {
    fontSize: 15,
    color: '#F9FAFB',
    fontWeight: '500',
    marginLeft: -10,
    fontFamily: 'Poppins_400Regular',
  },
});

export default Goals;
