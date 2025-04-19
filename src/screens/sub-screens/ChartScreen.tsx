import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, ScrollView, Button, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from "react-native";
import { Canvas, Path, Skia } from "@shopify/react-native-skia";
import { BottomNavigation } from "react-native-paper";

interface PesoData {
  semana: number;
  peso: number;
}

const ChartScreen = () => {
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "peso", title: "Peso", icon: "chart-line" },
    { key: "record", title: "Records", icon: "trophy" },
    { key: "distribucion", title: "Distribución", icon: "chart-pie" },
    { key: "tiempo", title: "Tiempo", icon: "clock" },
  ]);

  const [progresoPeso, setProgresoPeso] = useState<PesoData[]>([ { semana: 1, peso: 72 }, { semana: 2, peso: 80 } ]);
  const [nuevoPeso, setNuevoPeso] = useState("");

  const addPeso = () => {
    if (nuevoPeso) {
      setProgresoPeso([...progresoPeso, { semana: progresoPeso.length + 1, peso: parseInt(nuevoPeso) }]);
      setNuevoPeso("");
    }
  };

  const drawLineChart = (data: PesoData[]) => {
    const path = Skia.Path.Make();
    if (data.length === 0) return path;
    path.moveTo(0, 100 - data[0].peso);
    data.forEach((point, i) => {
      path.lineTo(i * 50, 100 - point.peso);
    });
    return path;
  };

  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case "peso":
        return (
          <View style={styles.card}>
            <Text style={styles.title}>Progreso de Peso</Text>
            <Canvas style={styles.chart}>
              <Path path={drawLineChart(progresoPeso)} color="blue" strokeWidth={3} />
            </Canvas>
            <TextInput style={styles.input} keyboardType="numeric" placeholder="Nuevo peso" value={nuevoPeso} onChangeText={setNuevoPeso} />
            <Button title="Agregar Peso" onPress={addPeso} />
          </View>
        );
      case "record":
        return <Text style={styles.title}>Gráfica de Records</Text>;
      case "distribucion":
        return <Text style={styles.title}>Gráfica de Distribución</Text>;
      case "tiempo":
        return <Text style={styles.title}>Gráfica de Tiempo</Text>;
      default:
        return null;
    }
  };

  return (
    <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={{ flex: 1 }}>
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        {renderScene({ route: routes[index] })}
      </ScrollView>
      <BottomNavigation navigationState={{ index, routes }} onIndexChange={setIndex} renderScene={renderScene} />
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f8f8f8" },
  card: { backgroundColor: "#fff", padding: 15, marginBottom: 10, borderRadius: 10 },
  title: { fontSize: 18, fontWeight: "bold", textAlign: "center", marginBottom: 10 },
  input: { height: 40, borderColor: "gray", borderWidth: 1, marginBottom: 10, paddingHorizontal: 8 },
  chart: { width: 300, height: 120 },
});

export default ChartScreen;
