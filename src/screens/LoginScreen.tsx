import React, { useState, useContext, useEffect } from 'react';
import { View, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { signInWithEmailAndPassword, sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';
import { AuthContext } from '../context/AuthContext';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const authContext = useContext(AuthContext);

  if (!authContext) {
    throw new Error('AuthContext debe usarse dentro de un AuthProvider');
  }

  const { user, setUser } = authContext;

  useEffect(() => {
    console.log("Usuario en AuthContext:", user);
    if (user) {
      navigation.replace("Home");
    }
  }, [user, navigation]);
  

  const handleLogin = async () => {
    try {
      setLoading(true);
      setError('');
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      setUser(userCredential.user);
      navigation.replace('Home');
    } catch (err) {
      setError('Correo o contraseña incorrectos');
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordReset = async () => {
    if (!email) {
      Alert.alert('Error', 'Por favor ingresa tu correo para restablecer la contraseña.');
      return;
    }

    try {
      auth.languageCode = 'es';
      await sendPasswordResetEmail(auth, email);
      Alert.alert('Éxito', 'Se ha enviado un correo para restablecer tu contraseña.');
    } catch (error) {
      Alert.alert('Error', 'No se pudo enviar el correo. Verifica que la dirección es correcta.');
    }
  };

  return (
    <View style={[styles.padre, darkMode ? styles.darkBackground : styles.lightBackground]}>
      <Image source={require('../../assets/imagenes/logo.jpeg')} style={styles.profile} />
      <View style={[styles.tarjeta, darkMode ? styles.darkCard : styles.lightCard]}>
        <TextInput
          label='Email'
          value={email}
          onChangeText={setEmail}
          mode='outlined'
          keyboardType='email-address'
          autoCapitalize='none'
          style={[styles.input, { backgroundColor: darkMode ? '#333' : 'white' }]}
        />
        <TextInput
          label='Contraseña'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          mode='outlined'
          style={[styles.input, { backgroundColor: darkMode ? '#333' : 'white' }]}
        />
        {error ? <HelperText type='error'>{error}</HelperText> : null}
        <Button mode='contained' onPress={handleLogin} loading={loading} disabled={loading}>
          Iniciar sesión
        </Button>
        <TouchableOpacity onPress={handlePasswordReset}>
          <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.toggleButton} onPress={() => setDarkMode(!darkMode)}>
        <Text style={styles.toggleButtonText}>{darkMode ? 'Modo Claro 🌞' : 'Modo Oscuro 🌙'}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  padre: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  lightBackground: { backgroundColor: 'white' },
  darkBackground: { backgroundColor: '#121212' },
  profile: { width: 100, height: 100, borderRadius: 50, marginBottom: 20 },
  tarjeta: { width: '90%', padding: 20, borderRadius: 20, elevation: 5 },
  lightCard: { backgroundColor: 'white' },
  darkCard: { backgroundColor: '#1f1f1f' },
  input: { height: 60, marginVertical: 10 },
  forgotPasswordText: { color: '#525FE1', textAlign: 'center', marginTop: 10, textDecorationLine: 'underline' },
  toggleButton: { marginTop: 10, padding: 10, borderRadius: 20, backgroundColor: '#525FE1' },
  toggleButtonText: { color: 'white', textAlign: 'center' },
});

export default LoginScreen;
