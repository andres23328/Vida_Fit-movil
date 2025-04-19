import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Alert } from 'react-native';
import { Text, Card, Button } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { useContext } from 'react';
import { AuthContext } from '../../context/AuthContext';
import { useDispatch, useSelector } from 'react-redux';
import { setMembresia } from '../../global/Slice/membresiaSlice';
import axios from 'axios';
import { saveMembershipOnly } from '../../global/services/firestoreService';
import { RootStackParamList } from '../../components/types'; 






type MembresiaScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Home'>;

interface MembresiaScreenProps {
  navigation: MembresiaScreenNavigationProp;
}

export default function MembresiaScreen({ navigation }: MembresiaScreenProps) {
  const authContext = useContext(AuthContext);
  if (!authContext) {
    throw new Error('AuthContext debe usarse dentro de un AuthProvider');
  }
  const { user } = authContext;
  const dispatch = useDispatch();
  const [loadingIndex, setLoadingIndex] = useState<number | null>(null);

  
  const membresias = [
    { nivel: 'Básico', precio: '$5/mes', beneficios: 'Acceso a 10 predicciones al mes' },
    { nivel: 'Intermedio', precio: '$10/mes', beneficios: 'Acceso 30 a predicciones al mes' },
    { nivel: 'Premium', precio: '$20/mes', beneficios: 'Acceso ilimitado a predicciones' },
  ];


  const handleCashPayment = async (membresia: string, precio: string, index: number) => {
    setLoadingIndex(index);
    if (!user?.email) {
        Alert.alert('Error', 'Debes iniciar sesión para comprar una membresía.');
        return;
    }

    console.log('Iniciando proceso de pago...');
    const paymentCode = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`Código de pago generado: ${paymentCode}`);

    //CUN: 192.168.10.17:5000
    //casa: 192.168.20.31:5000
    //datos  192.168.59.76:5000
    try {
        console.log('Enviando solicitud al backend...');
        const response = await axios.post('http://192.168.20.31:5000/send-email', {
            email: user.email,
            nombre: user.displayName,
            membresia,
            precio,
            paymentCode,
        });

        console.log('Correo enviado correctamente:', response.data);
        Alert.alert(
          '✅ Solicitud enviada',
          `Se ha enviado un correo a ${user.email} con las instrucciones de pago.`,
          [
            {
              text: 'OK',
              onPress:  async () => {
                dispatch(setMembresia(membresia));
                try {
                  await saveMembershipOnly(user.uid, membresia); // Aquí guardas la membresía si tienes esa función
                  navigation.reset({ index: 0,  routes: [{ name: 'Main', state: { index: 0, routes: [{ name: 'Home' }] } }], });
                } catch (err) {
                  console.error('Error guardando la membresía:', err);
                  Alert.alert('Error', 'No se pudo guardar la membresía.');
                } finally {
                  setLoadingIndex(null);
                }              
              }
            }
          ]
        );
        
      } catch (error: any) {
      console.error('Error enviando correo:', error.response?.data || error.message);
      Alert.alert('Error', 'No se pudo enviar el correo.');
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.container}  keyboardShouldPersistTaps="handled">
        <Text  style={styles.title}>Elige tu Membresía</Text>
        {membresias.map((m, index) => (
          <Card key={index} style={styles.card}>
            <Card.Content>
              <Text variant="titleLarge">{m.nivel}</Text>
              <Text variant="titleLarge">{m.precio}</Text>
              <Text variant="titleLarge">{m.beneficios}</Text>
            </Card.Content>
            <Card.Actions>
              <Button mode="contained" style={styles.button} loading={loadingIndex === index} disabled={loadingIndex !== null && loadingIndex !== index}  labelStyle={styles.text} onPress={() => handleCashPayment(m.nivel, m.precio, index)}>
                Pagar en Efectivo
              </Button>
            </Card.Actions>
          </Card>
        ))}
{/*         <Button
          mode="contained"
          onPress={() => {
            if (navigation.canGoBack()) {
              navigation.goBack();
            } else {
              navigation.reset({
                index: 0,
                routes: [{ name: 'Dashboard' }],
              });
            }
          }}
        >
          Volver
        </Button> */}


      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 100,
  },
  title: {
    textAlign: 'center',
    marginVertical: 20,
    fontSize: 24,
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold'

  },
  card: {
    marginBottom: 20,
    borderRadius: 10,
    elevation: 5,
    width: '100%',
    alignSelf: 'center',
    padding: 15,
  },
  backButton: {
    marginVertical: 20,
  },
  text: { fontFamily: 'Poppins_600SemiBold' },
  button: {backgroundColor: '#2ECC71'},

});
