import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../components/types';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useDispatch } from 'react-redux';
import { updateResponse } from '../../global/redux/responsesSlice'; // Usa responsesSlice

// Define el tipo de navegación para esta pantalla
type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Location'>;

const Location: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();

  // Guardar la selección en Redux y navegar a la siguiente pantalla
  const handleSelectLocation = (location: string) => {
    dispatch(updateResponse({ field: 'location', value: location })); // Guarda en Redux
    navigation.navigate('ExerciseHistory');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Dónde te ejercitas?</Text>

      <View style={styles.optionsContainer}>
        {/* Opción Gimnasio */}
        <TouchableOpacity
          style={[styles.option, styles.optionGym]}
          onPress={() => handleSelectLocation('Gimnasio')}
          activeOpacity={0.7}
        >
          <Icon name="weight-lifter" size={48} color="#fff" />
          <Text style={styles.optionText}>Gimnasio</Text>
        </TouchableOpacity>

        {/* Opción Casa */}
        <TouchableOpacity
          style={[styles.option, styles.optionHome]}
          onPress={() => handleSelectLocation('Casa')}
          activeOpacity={0.7}
        >
          <Icon name="home-outline" size={48} color="#fff" />
          <Text style={styles.optionText}>Casa</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    textAlign: 'center',
    marginBottom: 24,
    fontWeight: '700',
    color: '#111827', // Gris oscuro
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  option: {
    width: 120,
    height: 120,
    borderRadius: 60,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 6, // Sombras en Android
  },
  optionGym: {
    backgroundColor: '#1E40AF', // Azul fuerte para el gimnasio
  },
  optionHome: {
    backgroundColor: '#16A34A', // Verde para casa
  },
  optionText: {
    marginTop: 8,
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default Location;
