import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useDispatch, useSelector } from 'react-redux';
import { updateField, resetForm as resetRegistrationForm } from '../../global/Slice/registrationSlice';
import { RootState  } from '../../global/store';
import { registerUser } from '../../global/services/authService';
import { saveUserResponses } from '../../global/services/firestoreService';
import { RootStackParamList } from '../../components/types';
import { resetForm as resetUserInfoForm  } from '../../global/Slice/userInfoSlice';

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Registration'>;

const Registration: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();
  const formData = useSelector((state: RootState) => state.registration);
  const userResponses = useSelector((state: RootState) => state.responses);
  const userInfo = useSelector((state: RootState) => state.userInfo);

  const [loading, setLoading] = useState(false);

  const isValidEmail = (email: string) => /\S+@\S+\.\S+/.test(email);

  const handleChange = (name: string, value: string) => {
    dispatch(updateField({ field: name as 'name' | 'email' | 'password', value }));
  };

  const handleSubmit = async () => {
    const { email, password, name: username } = formData;
    
    if (!email || !password || !username) {
      Alert.alert('Error', 'Por favor, completa todos los campos.');
      return;
    }
  
    if (!isValidEmail(email)) {
      Alert.alert('Error', 'Ingresa un correo electrónico válido.');
      return;
    }
  
    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres.');
      return;
    }
  
    if (loading) return;
  
    setLoading(true);
    try {
      // 1️⃣ REGISTRO EN FIREBASE AUTH
      const user = await registerUser(email, password, username);
      
      // 2️⃣ OBTENER USER ID DESPUÉS DEL REGISTRO
      if (!user || !user.uid) {
        throw new Error("No se pudo obtener el UID del usuario.");
      }
      
      const userId = user.uid;
      console.log('✅ Usuario registrado con UID:', userId);

  
      // 3️⃣ GUARDAR DATOS DEL USUARIO EN FIRESTORE
      await saveUserResponses(userId, email, userResponses, userInfo);

  
      Alert.alert('¡Éxito!', 'Cuenta creada y respuestas guardadas.');
      dispatch(resetUserInfoForm());  
      dispatch(resetRegistrationForm());
      navigation.navigate('Login');
      
   } catch (error: any) {
    // Manejo específico del error de email en uso
    if (error.code === 'auth/email-already-in-use') {
      Alert.alert('Error', 'El correo ya está registrado. Inicia sesión en su lugar.');
    } else {
      Alert.alert('Error', error.message || 'No se pudo completar el registro.');
    }
  } finally {
    setLoading(false);
  }
};
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Regístrate para obtener tu plan</Text>
      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nombre:"
          placeholderTextColor="#A0AEC0"
          value={formData.name}
          onChangeText={(text) => handleChange('name', text)}
        />
        <TextInput
          style={styles.input}
          placeholder="Correo electrónico:"
          placeholderTextColor="#A0AEC0"
          value={formData.email}
          onChangeText={(text) => handleChange('email', text)}
          keyboardType="email-address"
        />
        <TextInput
          style={styles.input}
          placeholder="Contraseña:"
          placeholderTextColor="#A0AEC0"
          value={formData.password}
          onChangeText={(text) => handleChange('password', text)}
          secureTextEntry
        />
      </View>
      <TouchableOpacity 
        style={[styles.submitButton, loading && styles.disabledButton]} 
        onPress={handleSubmit} 
        disabled={loading}
      >
        {loading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.submitButtonText}>Terminar</Text>}
      </TouchableOpacity>
      <Text style={styles.termsText}>
        Al hacer clic en Registrarse, aceptas los Términos de servicio y la Política de privacidad y confirmas que tienes al menos 18 años de edad.
      </Text>
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
    fontFamily: 'Poppins_600SemiBold',
  },
  formContainer: {
    marginBottom: 24,
  },
  input: {
    backgroundColor: '#2D3748',
    color: '#FFF',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  submitButton: {
    backgroundColor: '#F97316',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 16,
    
  },
  disabledButton: {
    backgroundColor: '#D1D5DB',
  },
  submitButtonText: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'Poppins_400Regular',
  },
  termsText: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
    marginTop: 16,
    fontFamily: 'Poppins_400Regular',
  },
});

export default Registration;
