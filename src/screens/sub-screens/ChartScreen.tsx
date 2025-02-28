// src/screens/ChartsScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

const ChartsScreen: React.FC = () => (
  <View style={styles.container}>
    <Text variant="titleLarge">Visualización de Gráficas de Progreso</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ChartsScreen;
