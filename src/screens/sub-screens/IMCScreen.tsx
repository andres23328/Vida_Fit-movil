import React, { useState, useEffect, useContext } from 'react';
import { View, StyleSheet, Text, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import Animated, { withTiming, useSharedValue, useAnimatedStyle } from 'react-native-reanimated';
import { AuthContext } from '../../context/AuthContext';
import { db } from '../../config/firebase';
import { doc, getDocs, collection, query, orderBy, limit } from 'firebase/firestore';
import StatBox from '../../components/StatBox';


const IMCScreen: React.FC = () => {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [unit, setUnit] = useState<'metric' | 'imperial'>('metric');
  const [imc, setImc] = useState<number | null>(null);


  // ✅ Siempre usar el hook antes de cualquier return condicional
  const authContext = useContext(AuthContext);

  // ✅ Si authContext es null, usamos un estado seguro
  const user = authContext?.user || null;

  // ✅ Mover el useEffect arriba, antes de cualquier retorno condicional
  useEffect(() => {
    if (!user) {
      Alert.alert('Error', 'Debes iniciar sesión para guardar respuestas.');
    }
  }, [user]);

  // ✅ Ahora podemos hacer el return condicional sin afectar los hooks
  if (!user) {
    return null;
  }

  const [userData, setUserData] = useState<any>(null);


  const userId = user.uid;


  useEffect(() => {
    const fetchLatestUserData = async () => {
      if (!userId) return;
  
      try {
        console.log('Obteniendo el último dato del usuario con ID:', userId);
  
        // Referencia a la subcolección responses
        const responsesCollectionRef = collection(db, 'users', userId, 'responses');
  
        // Consultar datos ordenados por createdAt, tomando solo el más reciente
        const q = query(responsesCollectionRef, orderBy('createdAt', 'desc'), limit(1));
        const snapshot = await getDocs(q);
  
        if (!snapshot.empty) {
          const latestResponse = {
            id: snapshot.docs[0].id, // ID del documento
            ...snapshot.docs[0].data() // Datos del documento
          };
  
          console.log('Último dato agregado:', latestResponse);
          setUserData(latestResponse); // Guardar solo el último dato
        } else {
          console.log('No se encontraron respuestas para este usuario.');
        }
      } catch (error) {
        console.error('Error obteniendo los datos del usuario:', error);
        Alert.alert('Error', 'Hubo un problema al obtener los datos del usuario.');
      } 
    };
  
    fetchLatestUserData();
  }, [userId]);



  const height1 = userData?.userInfo?.height;
  const weight1 = userData?.userInfo?.weight;
  const age = userData?.userInfo?.age;
  const units = userData?.userInfo?.units; // "metric" o "imperial"

  
  let imc1 = null;
  
  if (height1 && weight1) {
    let heightInMeters, weightInKg;
  
    if (units === "imperial") {
      heightInMeters = height1 * 0.3048; // Convertir pies a metros
      weightInKg = weight1 * 0.453592; // Convertir libras a kg
    } else {
      heightInMeters = height1 / 100; // Convertir cm a metros
      weightInKg = weight1; // Ya está en kg
    }
  
    if (!isNaN(heightInMeters) && !isNaN(weightInKg) && heightInMeters > 0) {
      imc1 = weightInKg / (heightInMeters ** 2);
    } else {
      console.error("Error: Altura o peso inválidos", { height, weight, heightInMeters, weightInKg });
      imc1 = null; // Para evitar errores en cálculos posteriores
    }
  
  }
      
  
  
  const animationValue = useSharedValue(0);

  const validateInputs = () => {
    let weightValue = parseFloat(weight);
    let heightValue = parseFloat(height);

    if (isNaN(weightValue) || isNaN(heightValue)) {
      Alert.alert("Error", "Por favor ingresa valores numéricos válidos.");
      return false;
    }

    if (weightValue <= 0 || heightValue <= 0) {
      Alert.alert("Error", "El peso y la altura deben ser mayores a 0.");
      return false;
    }

    if (unit === 'metric') {
      if (weightValue < 30 || weightValue > 300) {
        Alert.alert("Error", "El peso en kg debe estar entre 30 y 300.");
        return false;
      }
      if (heightValue < 100 || heightValue > 250) {
        Alert.alert("Error", "La altura en cm debe estar entre 100 y 250.");
        return false;
      }
    } else {
      if (weightValue < 66 || weightValue > 660) {
        Alert.alert("Error", "El peso en libras debe estar entre 66 y 660.");
        return false;
      }
      if (heightValue < 3 || heightValue > 8) {
        Alert.alert("Error", "La altura en pies debe estar entre 3 y 8.");
        return false;
      }
    }

    return true;
  };

  const handleCalculate = () => {
    if (!validateInputs()) return;

    let weightValue = parseFloat(weight);
    let heightValue = parseFloat(height);

    if (unit === 'imperial') {
      weightValue *= 0.453592; // pounds to kg
      heightValue *= 0.3048; // feet to meters
    } else {
      heightValue /= 100; // cm to meters
    }

    const calculatedIMC = weightValue / (heightValue * heightValue);
    setImc(calculatedIMC);

    animationValue.value = withTiming(1, { duration: 500 });
  };

  const resetForm = () => {
    setWeight('');
    setHeight('');
    setImc(null);
    setUnit('metric');
    animationValue.value = withTiming(0, { duration: 500 });
  };

  const imcMessage = () => {
    if (imc !== null) {
      if (imc < 18.5) return 'Bajo peso';
      if (imc >= 18.5 && imc < 24.9) return 'Normal';
      if (imc >= 25 && imc < 29.9) return 'Sobrepeso';
      return 'Obesidad';
    }
    return '';
  };

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: animationValue.value,
    transform: [{ scale: animationValue.value }],
  }));

  return (
    <View style={styles.container}>
      <StatBox title="IMC:" value={imc1 || "N/A"} tooltip="Índice de Masa Corporal actual basado en tu peso y estatura." />

      <Text style={styles.titleText}>Calcula tu IMC</Text>

      {/* Botones para cambiar unidades */}
      <View style={styles.unitButtonsContainer}>
        <TouchableOpacity
          onPress={() => setUnit('imperial')}
          style={[styles.unitButton, unit === 'imperial' && styles.activeUnitButton]}
        >
          <Text style={[styles.unitButtonText, unit === 'imperial' && styles.activeUnitButtonText]}>
            lbs & pies
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => setUnit('metric')}
          style={[styles.unitButton, unit === 'metric' && styles.activeUnitButton]}
        >
          <Text style={[styles.unitButtonText, unit === 'metric' && styles.activeUnitButtonText]}>
            kg & metros
          </Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.input}
        label={unit === 'metric' ? 'Peso (kg)' : 'Peso (lbs)'}
        keyboardType="numeric"
        value={weight}
        onChangeText={setWeight}
        mode="outlined"
      />
      <TextInput
        style={styles.input}
        label={unit === 'metric' ? 'Altura (cm)' : 'Altura (ft)'}
        keyboardType="numeric"
        value={height}
        onChangeText={setHeight}
        mode="outlined"
      />

      <Button mode="contained" onPress={handleCalculate} style={styles.button} labelStyle={styles.buttonText}>
        Calcular IMC
      </Button>

      {imc !== null && (
        <Animated.View style={[styles.resultContainer, animatedStyle]}>
          <Text style={styles.resultText}>Tu IMC es: {imc.toFixed(2)}</Text>
          <Text style={styles.message}>{imcMessage()}</Text>
          <Button mode="outlined" onPress={resetForm} style={styles.button} labelStyle={styles.text}>
            Reiniciar
          </Button>
        </Animated.View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#F7F7F7',
  },
  titleText: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 30,
    color: '#2C3E50',
    fontFamily: 'Poppins_600SemiBold',
  },
  unitButtonsContainer: {
    flexDirection: 'row',
    marginVertical: 20,
    backgroundColor: '#ECF0F1',
    borderRadius: 10,
    padding: 5,
  },
  unitButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeUnitButton: {
    backgroundColor: '#3498DB',
  },
  unitButtonText: {
    fontSize: 16,
    color: '#2C3E50',
    fontFamily: 'Poppins_400Regular',
  },
  activeUnitButtonText: {
    color: 'white',
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  input: {
    width: '100%',
    marginVertical: 10,
    backgroundColor: 'white',
    borderRadius: 10,
  },
  button: {
    marginTop: 15,
    width: '100%',
    borderRadius: 10,
    backgroundColor: '#2ECC71',
  },
  buttonText: {
    fontFamily: 'Poppins_600SemiBold',
    fontSize: 16,
    color: '#fff',
  },
  resultContainer: {
    marginTop: 20,
    padding: 20,
    borderRadius: 15,
    backgroundColor: '#D6EAF8',
    alignItems: 'center',
    width: '100%',
    fontFamily: 'Poppins_600SemiBold',
  },
  resultText: {
    fontSize: 22,
    fontWeight: '600',
    color: '#1A5276',
    fontFamily: 'Poppins_600SemiBold',
  },
  message: {
    fontSize: 18,
    color: '#7F8C8D',
    marginVertical: 10,
    fontFamily: 'Poppins_400Regular',
  },
  text: { fontFamily: 'Poppins_400Regular' },
});

export default IMCScreen;
