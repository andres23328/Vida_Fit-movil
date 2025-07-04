import React, { useState, useRef } from 'react';
import { ScrollView, StyleSheet, View, TouchableOpacity, PanResponder, Animated } from 'react-native';
import { Card, Text } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import Chatbot from '../sub-screens/chat';
import { MessageCircle } from 'lucide-react-native';

// Componente individual de Tarjeta
const CardItem: React.FC<{ name: string; description: string; darkMode: boolean; navigateTo: string }> = ({
  name,
  description,
  darkMode,
  navigateTo,
}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity onPress={() => navigation.navigate(navigateTo as never)} activeOpacity={0.8}>
      <Card style={[styles.card, darkMode ? styles.darkCard : styles.lightCard]}>
        <Card.Content>
          <Text  style={[darkMode ? styles.darkText : styles.lightText, styles.cardDesc]}>
            {name}
          </Text>
          <Text style={[darkMode ? styles.darkText : styles.lightText, styles.cardDescCommon]}>
            {description}
          </Text>
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );
};

// Componente principal del Dashboard
const DashboardScreen: React.FC = () => {
  const [darkMode, setDarkMode] = useState(false);
  const [isChatOpen, setIsChatOpen] = useState<boolean>(false);

  // Posición del botón del chat
  const chatPosition = useRef(new Animated.ValueXY({ x: 300, y: 650 })).current;

  // PanResponder para mover el botón
  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        chatPosition.extractOffset();
      },
      onPanResponderMove: Animated.event(
        [null, { dx: chatPosition.x, dy: chatPosition.y }],
        { useNativeDriver: false }
      ),
      onPanResponderRelease: () => {
        chatPosition.flattenOffset();
      },
    })
  ).current;

  const cards = [
    { name: "📏IMC", description: "Consulta tu Índice de Masa Corporal.", navigateTo: "IMCScreen" },
    { name: "📈Gráficas", description: "Visualiza tu progreso.", navigateTo: "Graficas" },
    { name: "🏃Cuerpo Humano", description: "Modifica y analiza tu masa corporal.", navigateTo: "BodyScreen" },
    { name: "📊Reporte", description: "Reporte de Peso Mensual.", navigateTo: "Reporte" },
    { name: "💬Preguntas", description: "Formulario para recomendar ejercicios.", navigateTo: "Goals" }, // Ajustado aquí
  ];

  return (
    <View style={styles.flexContainer}>
      <ScrollView
        style={[styles.container, darkMode ? styles.darkBackground : styles.lightBackground]}
        contentContainerStyle={{ paddingBottom: 150 }}
      >
        <Text variant="headlineMedium" style={[styles.title, darkMode ? styles.darkText : styles.lightText]}>
          Panel de Control
        </Text>

        <View style={styles.cardContainer}>
          {cards.map((cardItem, index) => (
            <View key={index} style={styles.cardWrapper}>
              <CardItem
                name={cardItem.name}
                description={cardItem.description}
                darkMode={darkMode}
                navigateTo={cardItem.navigateTo}
              />
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Botón flotante del Chatbot con movimiento y acción */}
      <Animated.View style={[styles.chatButton, chatPosition.getLayout()]} {...panResponder.panHandlers}>
        <TouchableOpacity onPress={() => setIsChatOpen(true)}>
          <MessageCircle size={28} color="white" />
        </TouchableOpacity>
      </Animated.View>

      {/* Modal del Chatbot */}
      {isChatOpen && <Chatbot isChatOpen={isChatOpen} setIsChatOpen={setIsChatOpen} />}
    </View>
  );
};

const styles = StyleSheet.create({
  flexContainer: { flex: 1, position: 'relative' },
  container: { flex: 1, padding: 10 },
  title: { textAlign: 'center', marginVertical: 30, fontSize: 24, fontFamily: 'Poppins_600SemiBold' },
  cardContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-evenly' },
  cardWrapper: { width: '48%', marginBottom: 20 },
  card: { borderRadius: 10, height: 230, padding: 15 },
  lightBackground: { backgroundColor: 'white' },
  darkBackground: { backgroundColor: '#121212' },
  lightCard: { backgroundColor: 'rgba(113, 247, 180, 0.63)' },
  darkCard: { backgroundColor: '#333333' },
  lightText: { color: 'black' },
  darkText: { color: 'white' },
  chatButton: {
    position: 'absolute',
    backgroundColor: '#3B82F6',
    width: 55,
    height: 55,
    borderRadius: 27.5,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 6,
    zIndex: 999,
  },
  cardDescCommon: {
    fontSize: 14,
    fontFamily: 'Poppins_400Regular',
    marginTop: 8,
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 16,
    fontFamily: 'Poppins_600SemiBold',
    marginTop: 8,
    textAlign: 'center',
  },




});

export default DashboardScreen;
