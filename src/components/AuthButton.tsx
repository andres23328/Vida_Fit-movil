import React from 'react';
import { TouchableOpacity, Text, StyleSheet } from 'react-native';

type AuthButtonProps = {
  onPress: () => void;
  title: string;
  backgroundColor?: string;
};

export function AuthButton({ onPress, title, backgroundColor = '#007AFF' }: AuthButtonProps) {
  return (
    <TouchableOpacity 
      style={[styles.button, { backgroundColor }]}
      onPress={onPress}
    >
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});