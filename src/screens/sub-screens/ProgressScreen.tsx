// src/screens/ProgressScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

const ProgressScreen: React.FC = () => (
  <View style={styles.container}>
    <Text variant="titleLarge">Consulta tu Progreso de Entrenamiento</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProgressScreen;
