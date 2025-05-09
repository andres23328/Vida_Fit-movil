import React, { useState, useCallback } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import Predicts from '../../components/Predicts';


interface GeminiProps {
  isChatOpen: boolean;
  setIsChatOpen: (open: boolean) => void;
}

const Gemini: React.FC<GeminiProps> = ({ isChatOpen, setIsChatOpen }) => {
  const [preferencias, setPreferencias] = useState('');
  const [restricciones, setRestricciones] = useState('');
  const [foodData, setFoodData] = useState<any>(null);
  const [foodError, setFoodError] = useState('');
  const [loadingGemini, setLoadingGemini] = useState(false);

  const fetchFoodAndDrinks = useCallback(async () => {
    setLoadingGemini(true);
    try {
      const response = await axios.post("http://192.168.84.76:5000/api/comida-bebidas", {
        preferencias,
        restricciones
      });
      console.log("Respuesta de /comida-bebidas:", response.data);
      setFoodData(response.data);
    } catch (err: any) {
      setFoodError(err.response ? err.response.data.message : 'Error al obtener comida y bebidas');
    } finally {
      setLoadingGemini(false);
    }
  }, [preferencias, restricciones]);

  return (
    <Modal
      visible={isChatOpen}
      transparent
      animationType="slide"
      onRequestClose={() => setIsChatOpen(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
        <ScrollView>
          <Text style={styles.modalTitle}>Recomendaciones Gemini 🍴</Text>

          {/* Texto explicativo para preferencias */}
          <Text style={styles.label}>
            ¿Qué comida o bebida deseas? (Ej: Pollo, smoothie, etc.)
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese la comida o bebida que desea"
            value={preferencias}
            onChangeText={setPreferencias}
          />

          {/* Texto explicativo para restricciones */}
          <Text style={styles.label}>
            ¿Qué debe tener o evitar tu comida o bebida? (Ej: Alto en proteína, sin azúcar, etc.)
          </Text>
          <TextInput
            style={styles.input}
            placeholder="Ingrese sus preferencias o restricciones"
            value={restricciones}
            onChangeText={setRestricciones}
          />

          {/* Mostrar error si existe */}
          {foodError ? (
            <Text style={{ color: 'red', marginTop: 10 }}>{foodError}</Text>
          ) : null}

          {/* Mostrar recomendación solo si hay datos */}
          {foodData && (
            <Predicts
              title="Recomendación de comida:"
              content={foodData.recomendacion || "No disponible"}
              tooltip="Alimentos recomendados para tu entrenamiento"
            />
          )}

          {/* Botón para buscar */}
          <TouchableOpacity
            style={[styles.button, { opacity: loadingGemini ? 0.6 : 1 }]}
            onPress={fetchFoodAndDrinks}
            disabled={loadingGemini}
          >
            {loadingGemini ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Obtener recomendación</Text>
            )}
          </TouchableOpacity>
        
          {/* Botón para cerrar */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setIsChatOpen(false)}
          >
            <Text style={styles.closeButtonText}>Cerrar</Text>
          </TouchableOpacity>
        </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    fontFamily: 'Poppins_600SemiBold',
  },
  input: {
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 10,
    padding: 12,
    backgroundColor: '#f9f9f9',
  },
  button: {
    backgroundColor: '#3B82F6',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontWeight: '600',
    fontFamily: 'Poppins_600SemiBold',
  },
  closeButton: {
    marginTop: 20,
    alignSelf: 'center',
  },
  closeButtonText: {
    color: 'red',
    fontSize: 16,
    fontFamily: 'Poppins_400Regular',
  },
  label: {
    fontSize: 14,
    marginBottom: 5,
    fontFamily: 'Poppins_400Regular',
  },
  
});

export default Gemini;
