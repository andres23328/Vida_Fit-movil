import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../components/types'; // Ajusta la ruta
import { useDispatch } from 'react-redux';
import { updateResponse } from '../../global/redux/responsesSlice'; // Ahora usa responsesSlice

const Gender: React.FC = () => {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const dispatch = useDispatch();

  // Guardar la selección del género en Redux y navegar a la siguiente pantalla
  const handleSelectGender = (gender: string) => {
    dispatch(updateResponse({ field: 'gender', value: gender })); // Usa responsesSlice
    navigation.navigate('Location');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Cuál es tu género?</Text>

      <View style={styles.optionsContainer}>
        {/* Opción Mujer */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => handleSelectGender('Mujer')}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, styles.female]}>
            <Image source={require('../../../assets/imagenes/female_icon.png')} style={styles.icon} />
          </View>
          <Text style={styles.optionText}>Mujer</Text>
        </TouchableOpacity>

        {/* Opción Hombre */}
        <TouchableOpacity
          style={styles.option}
          onPress={() => handleSelectGender('Hombre')}
          activeOpacity={0.7}
        >
          <View style={[styles.iconContainer, styles.male]}>
            <Image source={require('../../../assets/imagenes/male-icon.png')} style={styles.icon} />
          </View>
          <Text style={styles.optionText}>Hombre</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 26,
    fontWeight: '600',
    textAlign: 'center',
    color: '#111827', // Gris oscuro
    marginBottom: 30,
    fontFamily: 'Poppins_600SemiBold',
  },
  optionsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    width: '100%',
  },
  option: {
    alignItems: 'center',
    width: 120,
  },
  iconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#1E40AF', // Azul intenso
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    elevation: 6, // Sombras en Android
    shadowColor: '#000', // Sombras en iOS
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
  },
  icon: {
    width: 60,
    height: 60,
    color: "#fff",
    resizeMode: 'contain',
  },
  optionText: {
    marginTop: 8,
    fontSize: 16,
    color: '#fff', // Gris oscuro
    textAlign: 'center',
    fontFamily: 'Poppins_400Regular',
  },
  female: {
    backgroundColor: 'rgb(255, 4, 201)', // Gris claro
  },
  male: {
    backgroundColor: '#16A34A', // Verde claro
  },
});

export default Gender;
