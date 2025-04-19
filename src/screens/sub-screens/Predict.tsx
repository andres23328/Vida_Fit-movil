
// src/screens/Predict.tsx
import React, { useState, useEffect, useCallback, useContext, useRef,  } from 'react'
import { View, StyleSheet, Alert, TouchableOpacity, Animated, ScrollView, Easing,  ActivityIndicator    } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../components/types'; 
import { TextInput } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { Text } from 'react-native-paper';
import axios from 'axios';
import { db } from '../../config/firebase';
import { doc, getDocs, collection, query, orderBy, limit } from 'firebase/firestore';
import StatBox from '../../components/StatBox';
import Predicts from '../../components/Predicts';
import { AuthContext } from '../../context/AuthContext';


interface Exercise {
  BodyPart: string;
  Desc: string;
  Equipment: string;
  Level: string;
  Rating: string;
  RatingDesc: string;
  Title: string;
  Type: string;
  id: string;
}

interface PredictionResponse {
  accuracy: number;
  grupo_kmeans: number;
  prediccion: string;
  resultados: Exercise[]; // Cambiado aquí para reflejar la estructura correcta
}
const Predict: React.FC = () => {
  const [predictionData, setPredictionData] = useState<PredictionResponse | null>(null);
  const [predictionError, setPredictionError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loading_predict, setLoading_predict] = useState(false);
  const [loading_gemini, setLoading_gemini] = useState(false);

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



  // Valores animados para cada círculo
  const translateY1 = useRef(new Animated.Value(0)).current;
  const translateY2 = useRef(new Animated.Value(0)).current;
  const translateY3 = useRef(new Animated.Value(0)).current;

  const animateBounce = (animation: Animated.Value): Animated.CompositeAnimation => {
    return Animated.loop(
      Animated.sequence([
        Animated.timing(animation, {
          toValue: -20, // Subir
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(animation, {
          toValue: 0, // Bajar
          duration: 300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ])
    );
  };

  useEffect(() => {
    let animation1: Animated.CompositeAnimation | null = null;
    let animation2: Animated.CompositeAnimation | null = null;
    let animation3: Animated.CompositeAnimation | null = null;

    if (isLoading) {
      animation1 = animateBounce(translateY1);
      animation2 = animateBounce(translateY2);
      animation3 = animateBounce(translateY3);

      animation1.start();
      setTimeout(() => animation2?.start(), 100);
      setTimeout(() => animation3?.start(), 200);
    } else {
      // Reiniciar valores si isLoading es false
      translateY1.setValue(0);
      translateY2.setValue(0);
      translateY3.setValue(0);
    }

    return () => {
      animation1?.stop();
      animation2?.stop();
      animation3?.stop();
    };
  }, [isLoading]);
  
  
  

  const fetchPrediction = useCallback(async () => {
    setLoading_predict(true);
    console.log("Botón clickeado, solicitando nueva predicción...");
    setIsLoading(true); // Empieza la carga
    setPredictionError(null); // Limpia errores previos
    //CUN: 192.168.10.17:5000
    //casa: 192.168.20.31:5000
    //datos:  192.168.59.76:5000
    
    try {
      const response = await axios.get<PredictionResponse>("http://192.168.20.31:5000/api/predict");
      console.log("Respuesta de /predict:", response.data);
      setPredictionData(response.data);
    } catch (err: any) {
      setPredictionError(err.response ? err.response.data.message : 'Error al obtener predicción');
      setPredictionData(null);
    } finally {
      setIsLoading(false); 
      setLoading_predict(false);
    }
  }, []);

  interface FoodResponse {
    recomendacion: string;
  }

  const [preferencias, setPreferencias] = useState("");
  const [restricciones, setRestricciones] = useState("");


  const [foodData, setFoodData] = useState<FoodResponse | null>(null);
  const [foodError, setFoodError] = useState<string | null>(null);


  const fetchFoodAndDrinks = useCallback(async () => {
    setLoading_gemini(true);
    try {
      const response = await axios.post("http://192.168.20.31:5000/api/comida-bebidas", {
        preferencias: preferencias, 
        restricciones: restricciones 
      });
      console.log("Respuesta de /comida-bebidas:", response.data);
      setFoodData(response.data);
    } catch (err: any) {
      setFoodError(err.response ? err.response.data.message : 'Error al obtener comida y bebidas');
    } finally {
      setLoading_gemini(false);
    }
  }, [preferencias, restricciones]); 
  
  
  useEffect(() => {
    fetchPrediction(); // Llamada inicial al cargar el componente
    //fetchFoodAndDrinks();
  }, []);




  const calculateExercise = (level: string) => {
    let reps, timeInMinutes;

    // Determina las repeticiones y tiempo según el nivel
    switch (level) {
        case 'Beginner':
            reps = 10; // 10 repeticiones para principiante
            timeInMinutes = 5; // 5 minutos de ejercicio
            break;
        case 'Intermediate':
            reps = 20; // 20 repeticiones para intermedio
            timeInMinutes = 10; // 10 minutos de ejercicio
            break;
        case 'Expert':
            reps = 30; // 30 repeticiones para experto
            timeInMinutes = 15; // 15 minutos de ejercicio
            break;
        default:
            reps = 15; // Valor predeterminado para "desconocido"
            timeInMinutes = 8; // 8 minutos predeterminados
            break;
    }

    return { reps, timeInMinutes };
  };


  let reps = 0, timeInMinutes = 0; 

  // Verificar que predictionData y predictionData.resultados existen antes de acceder a ellos
  if (predictionData && predictionData.resultados && predictionData.resultados.length > 0) {
   // Extraer el nivel del primer resultado
   const level = predictionData.resultados[0].Level || "desconocido";
   console.log("Nivel del ejercicio:", level);

   // Calcular repeticiones y tiempo en minutos basados en el nivel
   const exercise = calculateExercise(level);
   reps = exercise.reps;  // Asignar el valor a la variable reps
   timeInMinutes = exercise.timeInMinutes;  // Asignar el valor a la variable timeInMinutes

   console.log("Repeticiones:", reps, "Tiempo en minutos:", timeInMinutes);
 } else {
   console.log("No hay datos disponibles en predictionData.resultados");
 }



    const [userData, setUserData] = useState<any>(null);
    const [loading, setLoading] = useState(true);



    const userId = user.uid;
    console.log('Usuario loadin:', loading);
  
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
        } finally {
          setLoading(false);
        }
      };
    
      fetchLatestUserData();
    }, [userId]);
    

  

    
    



    const height = userData?.userInfo?.height;
    const weight = userData?.userInfo?.weight;
    const age = userData?.userInfo?.age;
    const units = userData?.userInfo?.units; // "metric" o "imperial"

    
    let imc = null;
    
    if (height && weight) {
      let heightInMeters, weightInKg;
    
      if (units === "imperial") {
        heightInMeters = height * 0.3048; // Convertir pies a metros
        weightInKg = weight * 0.453592; // Convertir libras a kg
      } else {
        heightInMeters = height / 100; // Convertir cm a metros
        weightInKg = weight; // Ya está en kg
      }
    
      if (!isNaN(heightInMeters) && !isNaN(weightInKg) && heightInMeters > 0) {
        imc = weightInKg / (heightInMeters ** 2);
      } else {
        console.error("Error: Altura o peso inválidos", { height, weight, heightInMeters, weightInKg });
        imc = null; // Para evitar errores en cálculos posteriores
      }
    
      console.log("IMC calculado:", imc);
    }
    
    const isIMCNormal = imc !== null && imc >= 18.5 && imc <= 24.9;
    console.log("IMC Normal:", isIMCNormal);
    
    let imcDeseado;
    let mensaje;

    let estaturaM;

    
    
    if (isIMCNormal) {
      imcDeseado = imc;
      mensaje = "Estás bien de salud.";
    } 
    
    // Calculamos estatura en metros
    estaturaM = units === "imperial" ? height * 0.3048 : height / 100;
    console.log("Estatura m:", estaturaM);
    
    if (!isIMCNormal) {
      const pesoDeseadoInferior = 18.5 * (estaturaM ** 2);
      const pesoDeseadoSuperior = 24.9 * (estaturaM ** 2);
      const pesoDeseado = (pesoDeseadoInferior + pesoDeseadoSuperior) / 2;
    
      console.log("Datos para cálculo de IMC deseado:");
      console.log("Altura en metros:", estaturaM);
      console.log("Peso deseado inferior:", pesoDeseadoInferior);
      console.log("Peso deseado superior:", pesoDeseadoSuperior);
      console.log("Peso deseado promedio:", pesoDeseado);
    
      imcDeseado = pesoDeseado / (estaturaM ** 2);
      mensaje = `Para estar en un IMC normal, deberías pesar entre ${pesoDeseadoInferior.toFixed(2)} kg y ${pesoDeseadoSuperior.toFixed(2)} kg.`;
    }
    
    console.log("Altura en metros después de validación:", estaturaM);
    
    
    console.log("IMC deseado:", imcDeseado);
    

    
    const valorEstadistica = `IMC deseado está: ${imcDeseado} - ${mensaje}`;
    
    console.log("Cargando predicción...",isLoading);


  
   const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
   return (
    <ScrollView style={{ flex: 1 }} contentContainerStyle={{  padding: 26, flexGrow: 1, alignItems: 'center'  }} keyboardShouldPersistTaps="handled">
      <View style={{ display: 'flex', flexDirection: 'column', gap: 16, marginBottom: 32 }}>
        <StatBox title="IMC:" value={imc || "N/A"} tooltip="Índice de Masa Corporal actual basado en tu peso y estatura." />
        <StatBox title="IMC deseado:" value={valorEstadistica} tooltip="IMC recomendado para estar en un rango saludable. Peso ideal entre 59.94 kg y 80.68 kg." />
    
        {isLoading ? (
          
          <View style={styles.container}>
            <View style={styles.wrapper}>
              {/* Círculos animados */}
              <Animated.View style={[styles.circle, styles.circle1, { transform: [{ translateY: translateY1 }] }]} />
              <Animated.View style={[styles.circle, styles.circle2, { transform: [{ translateY: translateY2 }] }]} />
              <Animated.View style={[styles.circle, styles.circle3, { transform: [{ translateY: translateY3 }] }]} />

              {/* Sombras animadas */}
              <Animated.View style={[styles.shadow, styles.shadow1, { scaleX: translateY1.interpolate({ inputRange: [-20, 0], outputRange: [0.5, 1] }) }]} />
              <Animated.View style={[styles.shadow, styles.shadow2, { scaleX: translateY2.interpolate({ inputRange: [-20, 0], outputRange: [0.5, 1] }) }]} />
              <Animated.View style={[styles.shadow, styles.shadow3, { scaleX: translateY3.interpolate({ inputRange: [-20, 0], outputRange: [0.5, 1] }) }]} />
            </View>
            <Text  style={styles.text}>Cargando predicción del ejercicio con IA...</Text>
          </View>
        ) : predictionError ? (
          <Text style={{ color: 'red' }}>{predictionError}</Text>
        ) : predictionData ? (
          <>
            <View style={{ backgroundColor: '#F0E6EF', padding: 16, borderRadius: 8  }}>
              <Text variant="titleLarge" style={{ color: isIMCNormal ? 'green' : 'red' }}>
                {isIMCNormal ? 'El IMC está en el rango normal.' : 'El IMC no está en el rango normal.'}
              </Text>
            </View>

            <View style={{ backgroundColor: '#F0E6EF', padding: 16, borderRadius: 8 }}>
              <Text  style={{ fontSize: 20, fontWeight: '600', fontFamily: 'Poppins_600SemiBold' }}>Predicción:</Text>
            </View>

            {predictionData.resultados.length > 0 ? (
              <>
                <Predicts title="Ejercicio:" content={predictionData.resultados[0].Title || "Título no disponible"} tooltip="Nombre del ejercicio recomendado" />
                <Predicts title="Descripción:" content={predictionData.resultados[0].Desc || "Descripción no disponible"} tooltip="Descripción breve del ejercicio" />
                <Predicts title="Equipo:" content={predictionData.resultados[0].Equipment || "Equipo no disponible"} tooltip="Equipo necesario para realizar el ejercicio" />
                <Predicts title="Nivel:" content={predictionData.resultados[0].Level || "Nivel no disponible"} tooltip="Nivel de dificultad del ejercicio" />
                <Predicts title="Parte del cuerpo:" content={predictionData.resultados[0].BodyPart || "Parte no disponible"} tooltip="Parte del cuerpo que trabaja el ejercicio" />
                <Predicts title="Tipo:" content={predictionData.resultados[0].Type || "Tipo no disponible"} tooltip="Tipo de ejercicio (fuerza, cardio, etc.)" />
              </>
            ) : (
              <Text style={{ fontSize: 20, fontWeight: '600', fontFamily: 'Poppins_600SemiBold' }}>Sin resultados disponibles</Text>
            )}

{/*             <TouchableOpacity
                  onPress={fetchPrediction}
                  style={{
                    alignSelf: 'center',
                    marginTop: 16,
                    padding: 10,
                    backgroundColor: '#007BFF',
                    borderRadius: 8,
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                  disabled={loading}
                >
              {loading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={{ color: '#FFF', textAlign: 'center', fontWeight: '600', fontFamily: 'Poppins_600SemiBold' }}>Obtener otra predicción</Text>
              )}
            </TouchableOpacity> */}
          </>
        ) : (
          <Text style={{ fontSize: 20, fontWeight: '600', fontFamily: 'Poppins_600SemiBold' }}>{predictionError || "Cargando predicción de la AI..."}</Text>
        )}

        <TextInput
          style={styles.input}
          label="Ingrese sus preferencias"
          value={preferencias}
          onChangeText={setPreferencias}
          mode="outlined"
        />
              
        <TextInput
          style={styles.input}
          label="Ingrese sus prioridades"
          value={restricciones}
          onChangeText={setRestricciones}
          mode="outlined"
        />
              

        {foodError ? (
          <Text style={{ color: 'red' }}>{foodError}</Text>
        ) : foodData ? (
          <Predicts 
            title="Recomendación de comida:"  
            content={foodData.recomendacion || "No disponible"}  
            tooltip="Alimentos recomendados para tu entrenamiento" 
          />
        ) : (
          loading_gemini && !foodData && (
            <Text style={{ marginTop: 10, fontFamily: 'Poppins_400Regular' }}>Cargando recomendación de comida...</Text>
          )
        )}
        <TouchableOpacity 
          style={[styles.button, { marginBottom: 50, opacity: loading_gemini ? 0.6 : 1 }]} 
          onPress={fetchFoodAndDrinks} 
          disabled={loading_gemini}
        >
          {loading_gemini ? (
            <ActivityIndicator color="#FFF" />
          ) : (
            <Text style={styles.buttonText}>Obtener recomendación</Text>
          )}
        </TouchableOpacity>



      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
    container: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  wrapper: {
    marginLeft: -30,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: 120, // Aumentamos el ancho para más separación
    height: 60,
    marginBottom: 10,
  },
  circle: {
    width: 20,
    height: 20,
    borderRadius: 50,
    backgroundColor: "#000",
    position: "absolute",
  },
  circle1: { left: 0 },
  circle2: { left: "50%" },
  circle3: { left: "100%" },
  
  shadow: {
    width: 20,
    height: 4,
    borderRadius: 50,
    backgroundColor: "rgba(85, 85, 85, 0.7)",
    position: "absolute",
    top: 40, // Mejor posición para que no se solape con los círculos
    zIndex: -1,
  },
  shadow1: { left: 0 },
  shadow2: { left: "50%" },
  shadow3: { left: "100%" },

  text: {
    fontSize: 16,
    fontWeight: "600",
    marginTop: 10,
    textAlign: "center",
    fontFamily: 'Poppins_600SemiBold',
  },
  input: {
    height: 40,
    marginBottom: 10,
    paddingHorizontal: 8,
    borderRadius: 10,
    width: 300,
    marginVertical: 10,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#2ECC71',    
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "600",
    fontFamily: 'Poppins_600SemiBold',
  },
});

export default Predict;
