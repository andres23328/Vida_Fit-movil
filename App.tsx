import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentComponentProps } from "@react-navigation/drawer";
import { DrawerNavigationProp } from '@react-navigation/drawer';
import { Provider as PaperProvider, MD3DarkTheme, MD3LightTheme, IconButton } from 'react-native-paper';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from './src/config/firebase';
import { Provider } from 'react-redux';
import store from './src/global/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useNavigation } from "@react-navigation/native";
import { DrawerActions } from "@react-navigation/native";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";

import { AuthProvider, AuthContext } from "./src/context/AuthContext";
// Importación de pantallas
import LoginScreen from './src/screens/LoginScreen';
import HomeScreen from './src/screens/screen_login/HomeScreen';
import ClassesScreen from './src/screens/screen_login/ClassesScreen';
import ProgressScreen from './src/screens/screen_login/ProgressScreen';
import DashboardScreen from './src/screens/screen_login/DashboardScreen';
import MembershipScreen from './src/screens/sub-screens/MembershipScreen';
import IMCScreen from './src/screens/sub-screens/IMCScreen';
import ChartsScreen from './src/screens/sub-screens/ChartScreen';
import BodyScreen from './src/screens/sub-screens/BodyScreens';

// Pantallas de bienvenida/inicio
import Welcome from './src/screens/inicio_screen/Welcome_1';
import Goals from './src/screens/inicio_screen/Goals_2';
import Gender from './src/screens/inicio_screen/Gender_3';
import Location from './src/screens/inicio_screen/Location_4';
import ExerciseHistory from './src/screens/inicio_screen/ExerciseHistory_5';
import TrainingIntensity from './src/screens/inicio_screen/TrainingIntensity_6';
import UserInfo from './src/screens/inicio_screen/UserInfo_7';
import HealthGoals from './src/screens/inicio_screen/HealthGoals_8';
import GoogleFitSetup from './src/screens/inicio_screen/GoogleFitSetup_9';
import GoogleFitAuth from './src/screens/inicio_screen/GoogleFitAuth_10';
import Registration from './src/screens/inicio_screen/Registration_11';
import WeeklySchedule from './src/screens/inicio_screen/WeeklySchedule_12';
import SchedulePreference from './src/screens/inicio_screen/SchedulePreference_13';
import TimePicker from './src/screens/inicio_screen/TimePicker_14';
import TrainingReminder from './src/screens/inicio_screen/TrainingReminder_15';
import CalibrationInfo from './src/screens/inicio_screen/CalibrationInfo_16';
import FitnessAssessment from './src/screens/inicio_screen/FitnessAssessment_17';
import PersonalizedWelcome from './src/screens/inicio_screen/PersonalizedWelcome_18';


const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const theme = darkMode ? MD3DarkTheme : MD3LightTheme;


  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  const handleSignOut = async (navigation: any) => {
    try {
      await signOut(auth);
      setUser(null);
      navigation.reset({
        index: 0,
        routes: [{ name: 'Login' }],
      });
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    }
  };


  const Drawer = createDrawerNavigator();

  // 🔹 Menú personalizado
  function CustomDrawerContent({ navigation }: DrawerContentComponentProps) {
    return (
      <View style={styles.drawerContainer}>
        {/* Botón de cerrar (X) */}
{/*         <IconButton
          icon="close"
          size={30}
          onPress={() => navigation.dispatch(DrawerActions.closeDrawer())}
          style={styles.closeButton}
        /> */}
  
        {/* Título */}
        <Text style={styles.menuTitle}>Menú</Text>
  
        {/* Opciones de navegación */}
        {["Home", "Classes", "Progress", "Dashboard", "Preguntas"].map((screen) => (
          <TouchableOpacity
            key={screen}
            onPress={() => {
              navigation.navigate(screen);
              navigation.dispatch(DrawerActions.closeDrawer()); // Cierra el Drawer al navegar
            }}
            style={styles.menuItem}
          >
            <Text style={styles.menuText}>{screen}</Text>
          </TouchableOpacity>
        ))}
  
        {/* Botón de Cerrar Sesión */}
        <IconButton
          icon="logout"
          size={24}
          onPress={() => handleSignOut(navigation)}
          style={styles.logoutButton}
        />
      </View>
    );
  }
  
  // 🔹 Botón de menú hamburguesa (solo abre el Drawer)
  function CustomDrawerToggle({ navigation }: { navigation: any }) {
    return (
      <IconButton
        icon="menu"
        size={30}
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        style={{ marginLeft: 10 }}
      />
    );
  }

  function PreguntasScreen() {
    return (
      <View>
        <Goals />
{/*         <Gender />
        <Location />
        <ExerciseHistory />
        <TrainingIntensity />
        <UserInfo />
        <HealthGoals /> */}

      </View>
    );
  }
  
  // 🔹 Configuración del Drawer
  function DrawerNavigator() {
    return (
      <View style={{ flex: 1 }}>
        {/* 🔹 Overlay que bloquea el toque afuera */}
        <TouchableOpacity activeOpacity={1} style={styles.overlay} />
  
        <Drawer.Navigator
          drawerContent={(props) => <CustomDrawerContent {...props} />}
          screenOptions={({ navigation }) => ({
            headerLeft: () => <CustomDrawerToggle navigation={navigation} />,
            drawerStyle: { width: 250 },
            swipeEnabled: false, // ❌ No se puede cerrar deslizando
            gestureEnabled: false, // ❌ No se cierra tocando afuera
        /*     overlayColor: "transparent", // ❌ Deshabilita la capa de cierre táctil */
          })}
        >
          <Drawer.Screen name="Home" component={HomeScreen} />
          <Drawer.Screen name="Classes" component={ClassesScreen} />
          <Drawer.Screen name="Progress" component={ProgressScreen} />
          <Drawer.Screen name="Dashboard" component={DashboardScreen} />
          <Drawer.Screen name="Preguntas" component={PreguntasScreen} options={{ headerShown: false }}/>
        </Drawer.Navigator>
      </View>
    );
  }
  

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <Provider store={store}>
          <AuthProvider> 
            <NavigationContainer>
              <Stack.Navigator initialRouteName="Welcome">
                {/* Pantallas de bienvenida */}
                <Stack.Screen name="Welcome" component={Welcome} />
                <Stack.Screen name="Goals" component={Goals} />
                <Stack.Screen name="Gender" component={Gender} />
                <Stack.Screen name="Location" component={Location} />
                <Stack.Screen name="ExerciseHistory" component={ExerciseHistory} />
                <Stack.Screen name="TrainingIntensity" component={TrainingIntensity} />
                <Stack.Screen name="UserInfo" component={UserInfo} />
                <Stack.Screen name="HealthGoals" component={HealthGoals} />
                <Stack.Screen name="GoogleFitSetup" component={GoogleFitSetup} />
                <Stack.Screen name="GoogleFitAuth" component={GoogleFitAuth} />
                <Stack.Screen name="Registration" component={Registration} />
                <Stack.Screen name="WeeklySchedule" component={WeeklySchedule} />
                <Stack.Screen name="SchedulePreference" component={SchedulePreference} />
                <Stack.Screen name="TimePicker" component={TimePicker} />
                <Stack.Screen name="TrainingReminder" component={TrainingReminder} />
                <Stack.Screen name="CalibrationInfo" component={CalibrationInfo} />
                <Stack.Screen name="FitnessAssessment" component={FitnessAssessment} />
                <Stack.Screen name="PersonalizedWelcome" component={PersonalizedWelcome} />
  
                {/* Pantalla de login */}
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
  
                {/* Drawer Navigation */}
                <Stack.Screen name="Home" component={DrawerNavigator} options={{ headerShown: false }} />
  
                {/* Pantallas adicionales */}
                <Stack.Screen name="MembershipScreen" component={MembershipScreen} />
                <Stack.Screen name="IMCScreen" component={IMCScreen} />
                <Stack.Screen name="ChartsScreen" component={ChartsScreen} />
                <Stack.Screen name="BodyScreen" component={BodyScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </AuthProvider>
        </Provider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawerContainer: { flex: 1, paddingTop: 40, paddingHorizontal: 20 },
  closeButton: { alignSelf: "flex-end" },
  menuTitle: { fontSize: 20, fontWeight: "bold", textAlign: "center", marginBottom: 20 },
  menuItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" },
  menuText: { fontSize: 18 },
  logoutButton: { alignSelf: "center", marginTop: 30 },
  overlay: { position: "absolute", width: "100%", height: "100%" }, // 🔹 Bloquea el cierre táctil
});