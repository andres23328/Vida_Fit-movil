import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../components/types';
import { useDispatch, useSelector } from 'react-redux';
import { setHeight, setWeight, setAge, setUnits } from '../../global/Slice/userInfoSlice';
import { RootState } from '../../global/store'; // Importa el tipo RootState para usar useSelector

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'UserInfo'>;

const UserInfo: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();

  // Obtener valores actuales del estado global
  const { height, weight, age, units } = useSelector((state: RootState) => state.userInfo);

  // Obtener las unidades dinámicas
  const getUnit = (field: 'height' | 'weight') => {
    if (units === 'metric') {
      return field === 'height' ? 'cm' : 'Kg';
    } else {
      return field === 'height' ? 'pies' : 'lbs';
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cuéntanos un poco sobre ti</Text>

      <View style={styles.formContainer}>
        {/* Altura */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Altura</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              value={height}
              onChangeText={(value) => dispatch(setHeight(value))} // Actualiza el estado global
              style={styles.input}
              keyboardType="numeric"
              placeholder={units === 'metric' ? 'Ej. 176' : 'Ej. 5.9'}
            />
            <Text style={styles.unitText}>{getUnit('height')}</Text>
          </View>
        </View>

        {/* Edad */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Edad</Text>
          <TextInput
            value={age}
            onChangeText={(value) => dispatch(setAge(value))} // Actualiza el estado global
            style={[styles.input, { flex: 1 }]}
            keyboardType="numeric"
            placeholder="Ej. 22"
          />
        </View>

        {/* Peso */}
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Peso</Text>
          <View style={styles.inputWrapper}>
            <TextInput
              value={weight}
              onChangeText={(value) => dispatch(setWeight(value))} // Actualiza el estado global
              style={styles.input}
              keyboardType="numeric"
              placeholder={units === 'metric' ? 'Ej. 75' : 'Ej. 165'}
            />
            <Text style={styles.unitText}>{getUnit('weight')}</Text>
          </View>
        </View>

        {/* Botones para cambiar unidades */}
        <View style={styles.unitButtonsContainer}>
          <TouchableOpacity
            onPress={() => dispatch(setUnits('imperial'))} // Actualiza las unidades en el estado global
            style={[styles.unitButton, units === 'imperial' && styles.activeUnitButton]}
          >
            <Text style={[styles.unitButtonText, units === 'imperial' && styles.activeUnitButtonText]}>
              lbs & pies
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => dispatch(setUnits('metric'))} // Actualiza las unidades en el estado global
            style={[styles.unitButton, units === 'metric' && styles.activeUnitButton]}
          >
            <Text style={[styles.unitButtonText, units === 'metric' && styles.activeUnitButtonText]}>
              kg & metros
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Botón para continuar */}
      <TouchableOpacity
        style={styles.nextButton}
        onPress={() => navigation.navigate('HealthGoals')} // Navegar sin parámetros
      >
        <Text style={styles.nextButtonText}>Siguiente</Text>
      </TouchableOpacity>
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
    fontSize: 24,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 32,
    color: '#1F2937', // Gris oscuro
  },
  formContainer: {
    marginBottom: 32,
  },
  inputContainer: {
    marginBottom: 20,
    flexDirection: 'row', // Alineación en fila
    alignItems: 'center', // Alineación vertical
  },
  label: {
    fontSize: 14,
    color: '#4B5563', // Gris más oscuro
    marginRight: 10, // Espacio entre label y input
    width: 60, // Ancho fijo para el label
  },
  inputWrapper: {
    flexDirection: 'row', // Input + unidad en fila
    alignItems: 'center',
    borderColor: '#D1D5DB',
    borderWidth: 1,
    borderRadius: 8,
    flex: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  input: {
    flex: 1, // El input ocupa el espacio restante
    height: 40,
    fontSize: 16,
    color: '#1F2937',
  },
  unitText: {
    fontSize: 16,
    color: '#6B7280', // Gris más claro
    marginLeft: 8, // Separación entre el input y la unidad
  },
  unitButtonsContainer: {
    flexDirection: 'row',
    borderRadius: 8,
    borderWidth: 1,
    marginTop: 16,
    borderColor: '#D1D5DB',
    overflow: 'hidden',
  },
  unitButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F3F4F6',
  },
  activeUnitButton: {
    backgroundColor: '#F97316', // Naranja (Activo)
  },
  unitButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#4B5563',
  },
  activeUnitButtonText: {
    color: '#FFF', // Texto blanco cuando está activo
  },
  nextButton: {
    backgroundColor: '#F97316', // bg-orange-500
    paddingVertical: 16,
    borderRadius: 8,
    marginHorizontal: 16,
    marginTop: 32,
  },
  nextButtonText: {
    textAlign: 'center',
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default UserInfo;
