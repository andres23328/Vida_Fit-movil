import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Text, Button } from 'react-native-paper';
import Slider from '@react-native-community/slider';

type BodyPart = 'arms' | 'legs' | 'torso' | 'head' | 'other'; // Define las claves válidas

const BodyScreen: React.FC = () => {
  const [bodyParts, setBodyParts] = useState<Record<BodyPart, number>>({
    arms: 20,
    legs: 25,
    torso: 30,
    head: 10,
    other: 15,
  });

  const handleChange = (part: BodyPart, value: number) => {
    setBodyParts((prev) => ({ ...prev, [part]: value }));
  };

  return (
    <View style={styles.container}>
      <Text variant="titleLarge" style={styles.title}>
        Ajusta tu Masa Corporal
      </Text>
      {(Object.keys(bodyParts) as BodyPart[]).map((part) => ( // Usa BodyPart[] para las claves
        <View key={part} style={styles.sliderContainer}>
          <Text variant="bodyMedium" style={styles.label}>
            {part.charAt(0).toUpperCase() + part.slice(1)}: {bodyParts[part]}%
          </Text>
          <Slider
            minimumValue={0}
            maximumValue={50}
            step={1}
            value={bodyParts[part]}
            onValueChange={(value) => handleChange(part, value)}
            style={styles.slider}
            minimumTrackTintColor="#6200ee"
            maximumTrackTintColor="#cccccc"
            thumbTintColor="#6200ee"
          />
        </View>
      ))}
      <Button
        mode="contained"
        style={styles.button}
        onPress={() => alert(`Masa Corporal ajustada: ${JSON.stringify(bodyParts)}`)}
      >
        Guardar Cambios
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    textAlign: 'center',
    marginBottom: 20,
  },
  sliderContainer: {
    marginBottom: 20,
  },
  label: {
    marginBottom: 10,
  },
  slider: {
    width: '100%',
  },
  button: {
    marginTop: 20,
  },
});

export default BodyScreen;
