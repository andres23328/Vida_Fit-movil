// src/screens/IMCScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

const IMCScreen: React.FC = () => (
  <View style={styles.container}>
    <Text variant="titleLarge">Consulta tu Índice de Masa Corporal (IMC)</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default IMCScreen;
