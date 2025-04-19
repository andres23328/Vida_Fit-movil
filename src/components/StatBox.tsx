import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

interface StatBoxProps {
  title: string;
  value: string | number;
  tooltip: string;
}

const StatBox: React.FC<StatBoxProps> = ({ title, value, tooltip }) => {
  const [showTooltip, setShowTooltip] = useState(false);

  return (
    <View style={styles.container}>
      {/* Título */}
      <Text style={styles.title}>{title}</Text>

      {/* Valor */}
      <Text style={styles.value}>{value}</Text>

      {/* Ícono de información */}
      <TouchableOpacity
        style={styles.infoIcon}
        onPress={() => setShowTooltip(!showTooltip)}
      >
        <Text style={styles.infoText}>!</Text>
      </TouchableOpacity>

      {/* Tooltip */}
      {showTooltip && (
        <View style={styles.tooltip}>
          <Text style={styles.tooltipText}>{tooltip}</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#F0E6EF",
    padding: 16,
    borderRadius: 8,
    position: "relative",
    alignItems: "center",
  },
  title: {
    fontSize: 14,
    color: "#333",
    fontFamily: 'Poppins_600SemiBold',
  },
  value: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: 'Poppins_600SemiBold',
  },
  infoIcon: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#d1c4e9",
    borderRadius: 10,
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  infoText: {
    fontWeight: "bold",
    color: "#333",
    fontFamily: 'Poppins_400Regular',
  },
  tooltip: {
    position: "absolute",
    top: -40,
    right: 30,
    backgroundColor: "#333",
    padding: 8,
    borderRadius: 5,
    width: 200,
  },
  tooltipText: {
    color: "#fff",
    textAlign: "center",
    fontSize: 12,
    fontFamily: 'Poppins_400Regular',
  },
});

export default StatBox;
