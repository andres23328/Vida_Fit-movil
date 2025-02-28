import React, { createContext, useState, useEffect } from "react";
import { User, onAuthStateChanged } from "firebase/auth";
import { auth } from "../config/firebase";
import { View, Text } from "react-native";

interface AuthContextProps {
  user: User | null;
  setUser: React.Dispatch<React.SetStateAction<User | null>>;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); // Estado para controlar el loading

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      console.log("🔥 Cambio de sesión detectado:", currentUser);
      setUser(currentUser);
      setLoading(false); // Ya cargó la autenticación
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await auth.signOut();
    setUser(null);
  };

  if (loading) {
    return (
      <>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <Text>Cargando sesión...</Text>
        </View>
      </>
    );
  }
  

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      <>{children}</>
    </AuthContext.Provider>

  );
};
