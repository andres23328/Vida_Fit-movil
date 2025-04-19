import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Modal,
} from "react-native";
import { Send, MessageCircle, User, Bot } from "lucide-react-native";


interface Message {
  id: string;
  text: string;
  sender: "user" | "bot";
  timestamp: Date;
}

interface ChatbotProps {
  isChatOpen: boolean;
  setIsChatOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function Chatbot({ isChatOpen, setIsChatOpen }: ChatbotProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputText, setInputText] = useState("");

  const handleSendMessage = async () => {
    if (!inputText.trim()) return;
  
    console.log("📤 Enviando mensaje:", inputText); // 🔍 Verifica el mensaje antes de enviarlo
  
    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputText,
      sender: "user",
      timestamp: new Date(),
    };
  
    setMessages((prev) => [...prev, userMessage]);
    setInputText("");
    //CUN: 192.168.10.17:5000
    //casa: 192.168.20.31:5000
    //datos:  192.168.59.76:5000
    try {
      const response = await fetch("http://192.168.20.31:5000/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: inputText }),
      });
  
      console.log("📥 Respuesta del backend:", response.status); // 🔍 Muestra el código de estado
  
      const data = await response.json();
      console.log("📩 Respuesta JSON recibida:", data); // 🔍 Muestra el JSON recibido
  
      const botMessage: Message = {
        id: Date.now().toString() + "_bot",
        text: data.response,
        sender: "bot",
        timestamp: new Date(),
      };
  
      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("❌ Error al comunicarse con el backend:", error);
    }
  };

  return (
    <View style={styles.container}>
      {/* Botón flotante */}
      {!isChatOpen && (
        <TouchableOpacity style={styles.floatingButton} onPress={() => setIsChatOpen(true)}>
          <MessageCircle size={32} color="white" />
        </TouchableOpacity>
      )}

      {/* Modal del Chatbot */}
      <Modal
        visible={isChatOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setIsChatOpen(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.chatContainer}>
            <Text style={styles.chatHeader}>Chatbot ML</Text>

            {/* Mensajes del chat */}
            <FlatList
              data={messages}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <View
                  style={[
                    styles.messageContainer,
                    item.sender === "user" ? styles.userMessage : styles.botMessage,
                  ]}
                >
                  {item.sender === "user" ? <User size={20} color="white" /> : <Bot size={20} color="black" />}
                  <Text style={styles.messageText}>{item.text}</Text>
                </View>
              )}
            />

            {/* Input y botón de enviar */}
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                value={inputText}
                onChangeText={setInputText}
                placeholder="Escribe un mensaje..."
              />
              <TouchableOpacity onPress={handleSendMessage} style={styles.sendButton}>
                <Send size={24} color="white" />
              </TouchableOpacity>
            </View>

            {/* Botón para cerrar el chat */}
            <TouchableOpacity style={styles.closeButton} onPress={() => setIsChatOpen(false)}>
              <Text style={styles.closeButtonText}>Cerrar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  floatingButton: {
    position: "absolute",
    bottom: 30,
    right: 20,
    backgroundColor: "#007bff",
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  chatContainer: {
    width: "90%",
    height: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 10,
  },
  chatHeader: {
    fontSize: 18,
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 10,
    fontFamily: 'Poppins_600SemiBold',
  },
  messageContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderRadius: 8,
    marginVertical: 4,
    maxWidth: "80%",
    alignSelf: "flex-start",
    fontFamily: 'Poppins_400Regular',
  },
  userMessage: {
    backgroundColor: "#007bff",
    alignSelf: "flex-end",
  },
  botMessage: {
    backgroundColor: "#f0f0f0",
    alignSelf: "flex-start",
    fontFamily: 'Poppins_400Regular',
  },
  messageText: { marginLeft: 10, color: "black" },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
  },
  input: {
    flex: 1,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    padding: 8,
  },
  sendButton: {
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginLeft: 5,
  },
  closeButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: "center",
  },
  closeButtonText: { color: "white", fontWeight: "600", fontFamily: 'Poppins_600SemiBold' },
});
