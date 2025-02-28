import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

interface NextButtonProps {
  onPress: () => void; // Definir el tipo de la función onPress
}

const NextButton: React.FC<NextButtonProps> = ({ onPress }) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>Siguiente</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#F97316', // Naranja
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 8,
    marginTop: 32,
  },
  buttonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
});

export default NextButton;
