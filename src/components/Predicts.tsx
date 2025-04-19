import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";


// Objeto con imágenes mapeadas a su respectivo nombre
const getImage = (name: string) => {
  console.log("🔍 Nombre recibido en getImage:", name);

  const images: { [key: string]: any } = {
    Abdominals: require("../../assets/images/parte_cuerpo/abdominales.jpg"),
    Quadriceps: require("../../assets/images/parte_cuerpo/cuadriceps.jpg"),
    Shoulders: require("../../assets/images/parte_cuerpo/hombros.avif"),
    Chest: require("../../assets/images/parte_cuerpo/cofre.png"),
    Biceps: require("../../assets/images/parte_cuerpo/Biceps.webp"),
    Triceps: require("../../assets/images/parte_cuerpo/triceps.avif"),
    Lats: require("../../assets/images/parte_cuerpo/lats.jpg"),
    Hamstrings: require("../../assets/images/parte_cuerpo/Isquiotibiales.webp"),
    "Middle Back": require("../../assets/images/parte_cuerpo/espalda_media.jpg"),
    "Lower Back": require("../../assets/images/parte_cuerpo/espalda_baja.jpg"),
    Glutes: require("../../assets/images/parte_cuerpo/gluteo.jpg"),
    Calves: require("../../assets/images/parte_cuerpo/calves.jpg"),
    Forearms: require("../../assets/images/parte_cuerpo/antebrazos.webp"),
    Traps: require("../../assets/images/parte_cuerpo/Traps.jpg"),
    Abductors: require("../../assets/images/parte_cuerpo/Abductors.jpg"),
    Adductors: require("../../assets/images/parte_cuerpo/Abductors.jpg"),
    Neck: require("../../assets/images/parte_cuerpo/Neck.jpg"),
  };
  

  const image = images[name];

  console.log("🔍 Imagen encontrada:", image);
  return Image.resolveAssetSource(images[name] || images["Abdominals"]);
};


interface PredictsProps {
  title: string;
  content: string;
  tooltip: string;
}

const Predicts: React.FC<PredictsProps> = ({ title, content, tooltip }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const imageSource = title === "Parte del cuerpo:" ? getImage(content) : null;


  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.content}>{content}</Text>

      {/* Icono de exclamación para tooltip */}
      <TouchableOpacity
        style={styles.tooltipButton}
        onPress={() => setShowTooltip(!showTooltip)}
      >
        <Text style={styles.tooltipText}>!</Text>
      </TouchableOpacity>

      {/* Tooltip */}
      {showTooltip && (
        <View style={styles.tooltipBox}>
          <Text style={styles.tooltipTextBox}>{tooltip}</Text>
        </View>
      )}

      {/* Mostrar la imagen si existe */}
      {imageSource && (
        <>
          {console.log("Image Source:", imageSource)}
          <Image source={imageSource} style={styles.image} resizeMode="cover" />
        </>
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
    fontWeight: "600",
    fontFamily: 'Poppins_600SemiBold',
  },
  content: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: 'Poppins_600SemiBold',
  },
  tooltipButton: {
    position: "absolute",
    top: 5,
    right: 5,
    backgroundColor: "#d1c4e9",
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  tooltipText: {
    fontWeight: "bold",
    color: "#000",
    fontFamily: 'Poppins_400Regular',
  },
  tooltipBox: {
    position: "absolute",
    top: -40,
    right: 30,
    backgroundColor: "#333",
    padding: 8,
    borderRadius: 5,
    zIndex: 1,
  },
  tooltipTextBox: {
    color: "#fff",
    textAlign: "center",
    fontFamily: 'Poppins_400Regular',
  },
  image: {
    marginTop: 16,
    width: 100, // Ajusta según tu necesidad
    height: 100, // Ajusta según tu necesidad
    borderRadius: 8,
  },
});

export default Predicts;
