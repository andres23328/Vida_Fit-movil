// src/screens/MembershipScreen.tsx
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';

const MembershipScreen: React.FC = () => (
  <View style={styles.container}>
    <Text variant="titleLarge">Gestión de Membresías</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default MembershipScreen;
