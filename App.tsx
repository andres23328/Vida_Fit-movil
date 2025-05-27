import React, { useEffect, useState } from 'react';
import { ScrollView } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator, DrawerContentComponentProps } from "@react-navigation/drawer";
import { Provider as PaperProvider, MD3DarkTheme, MD3LightTheme, IconButton, Title } from 'react-native-paper';
import { onAuthStateChanged, signOut, User } from 'firebase/auth';
import { auth } from './src/config/firebase';
import { Provider } from 'react-redux';
import store from './src/global/store';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { DrawerActions } from "@react-navigation/native";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';
import * as Font from 'expo-font';
import { setCustomText } from 'react-native-global-props'; // ⬅️ AÑADE ESTA LÍNEA
import BottomTabNavigator from './src/components/BottomTabNavigator';
import GraficasNavigator from './src/components/GraficasNavigator';



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
import Predict from './src/screens/sub-screens/Predict';
import Reporte from './src/screens/sub-screens/Reporte';
import CalendarScreen from './src/screens/sub-screens/CalendarScreen';
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
import { RootStackParamList } from './src/components/types';

import SplashScreen from './src/screens/inicio_screen/SplashScreen';


const Stack = createNativeStackNavigator<RootStackParamList>();



export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const baseTheme = darkMode ? MD3DarkTheme : MD3LightTheme;
  const [isLoading, setIsLoading] = useState(true);

  const theme = {
    ...baseTheme,
    fonts: {
      ...baseTheme.fonts,
      bodyLarge: { fontFamily: 'Poppins_400Regular' },
      bodyMedium: { fontFamily: 'Poppins_400Regular' },
      titleLarge: { fontFamily: 'Poppins_400Regular' },
      headlineMedium: { fontFamily: 'Poppins_400Regular' },
      labelMedium: { fontFamily: 'Poppins_600SemiBold' },
    },
  };

  let [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  useEffect(() => {
    const customTextProps = {
      style: {
        fontFamily: 'Poppins_400Regular',
      },
    };
    setCustomText(customTextProps);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return unsubscribe;
  }, []);

  if (!fontsLoaded) return null;

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

/*   function CustomDrawerContent({ navigation }: DrawerContentComponentProps) {
    return (
      <ScrollView contentContainerStyle={styles.drawerContainer}>
        <Text style={styles.menuTitle}>Tu menú</Text>
  
        <View style={styles.cardContainer}>
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              navigation.navigate("Home");
              navigation.dispatch(DrawerActions.closeDrawer());
            }}
          >
            <MaterialCommunityIcons name="home" size={24} color="#FF6600" />
            <Text style={styles.cardText}>Inicio</Text>
          </TouchableOpacity>
  
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              navigation.navigate("Classes");
              navigation.dispatch(DrawerActions.closeDrawer());
            }}
          >
            <MaterialCommunityIcons name="dumbbell" size={24} color="#FF6600" />
            <Text style={styles.cardText}>Clases</Text>
          </TouchableOpacity>
  
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              navigation.navigate("Progress");
              navigation.dispatch(DrawerActions.closeDrawer());
            }}
          >
            <MaterialCommunityIcons name="chart-line" size={24} color="#FF6600" />
            <Text style={styles.cardText}>Progreso</Text>
          </TouchableOpacity>
  
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              navigation.navigate("Dashboard");
              navigation.dispatch(DrawerActions.closeDrawer());
            }}
          >
            <MaterialCommunityIcons name="view-dashboard" size={24} color="#FF6600" />
            <Text style={styles.cardText}>Dashboard</Text>
          </TouchableOpacity>
  
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              navigation.navigate("Preguntas");
              navigation.dispatch(DrawerActions.closeDrawer());
            }}
          >
            <MaterialCommunityIcons name="comment-question" size={24} color="#FF6600" />
            <Text style={styles.cardText}>Preguntas</Text>
          </TouchableOpacity>
  
          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              navigation.navigate("Calendario");
              navigation.dispatch(DrawerActions.closeDrawer());
            }}
          >
            <MaterialCommunityIcons name="calendar-month" size={24} color="#FF6600" />
            <Text style={styles.cardText}>Calendario</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.card}
            onPress={() => {
              navigation.navigate("CalendarScreen");
              navigation.dispatch(DrawerActions.closeDrawer());
            }}
          >
            <MaterialCommunityIcons name="calendar-month" size={24} color="#FF6600" />
            <Text style={styles.cardText}>CalendarScreen</Text>
          </TouchableOpacity>
        </View>
  
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => handleSignOut(navigation)}
        >
          <MaterialCommunityIcons name="logout" size={24} color="#FF3B30" />
          <Text style={styles.logoutText}>Cerrar sesión</Text>
        </TouchableOpacity>
      </ScrollView>
    );
  }


    // 🔹 Configuración del Drawer
    function DrawerNavigator() {
      return (
        <View style={{ flex: 1 }}>
          <TouchableOpacity activeOpacity={1} style={styles.overlay} />
    
          <Drawer.Navigator
            drawerContent={(props) => <CustomDrawerContent {...props} />}
            screenOptions={({ navigation }) => ({
              headerLeft: () => <CustomDrawerToggle navigation={navigation} />,
              drawerStyle: { width: 250 },
              swipeEnabled: false, // ❌ No se puede cerrar deslizando
              gestureEnabled: false, // ❌ No se cierra tocando afuera
          /*     overlayColor: "transparent", // ❌ Deshabilita la capa de cierre táctil 
              headerTitleStyle: {fontFamily: 'Poppins_600SemiBold', fontSize: 20,},
            })}
          >
            <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen name="Classes" component={ClassesScreen} />
            <Drawer.Screen name="Progress" component={ProgressScreen} />
            <Drawer.Screen name="Dashboard" component={DashboardScreen} />
            <Drawer.Screen name="Preguntas" component={Goals} options={{ headerShown: false }}/>
            <Drawer.Screen name="Calendario" component={WeeklySchedule} />
            <Drawer.Screen name="CalendarScreen" component={CalendarScreen} />
          </Drawer.Navigator>
        </View>
      );
    } */

  return isLoading ? (
    <SplashScreen onFinish={() => setIsLoading(false)} />
  ) : (    
    <GestureHandlerRootView style={{ flex: 1 }}>
      <PaperProvider theme={theme}>
        <Provider store={store}>
          <AuthProvider> 
            <NavigationContainer>
              <Stack.Navigator initialRouteName="Welcome"  screenOptions={{headerTitleStyle: {fontFamily: 'Poppins_600SemiBold', fontSize: 20,},}}>
                {/* Pantallas de bienvenida */}
                <Stack.Screen name="Welcome" component={Welcome} options={{ headerShown: false }}/>
                <Stack.Screen name="Goals" component={Goals} options={ {title:"Metas"}}  />
                <Stack.Screen name="Gender" component={Gender} options={ {title:"Género"}} />
                <Stack.Screen name="Location" component={Location} options={ {title:"Lugar"}} />
                <Stack.Screen name="ExerciseHistory" component={ExerciseHistory} options={ {title:"Desarrollo"}} />
                <Stack.Screen name="TrainingIntensity" component={TrainingIntensity} options={ {title:"Intensidad"}}  />
                <Stack.Screen name="UserInfo" component={UserInfo} options={ {title:"IMC"}} />
                <Stack.Screen name="HealthGoals" component={HealthGoals} options={ {title:"Interés"}} />
                <Stack.Screen name="GoogleFitSetup" component={GoogleFitSetup} />
                <Stack.Screen name="GoogleFitAuth" component={GoogleFitAuth} />
                <Stack.Screen name="Registration" component={Registration} options={ {title:"Registro"}} />
                <Stack.Screen name="WeeklySchedule" component={WeeklySchedule} options={{ headerShown: false }} />
                <Stack.Screen name="SchedulePreference" component={SchedulePreference} />
                <Stack.Screen name="TimePicker" component={TimePicker} options={{ headerShown: false }} />
                <Stack.Screen name="TrainingReminder" component={TrainingReminder} />
                <Stack.Screen name="CalibrationInfo" component={CalibrationInfo} />
                <Stack.Screen name="FitnessAssessment" component={FitnessAssessment} />
                <Stack.Screen name="PersonalizedWelcome" component={PersonalizedWelcome} />
  
                {/* Pantalla de login */}
                <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
  
                {/* Drawer Navigation */}
{/*                 <Stack.Screen name="Home" component={DrawerNavigator} options={{ headerShown: false }} />
 */}  
                <Stack.Screen name="Main" component={BottomTabNavigator} options={{ headerShown: false }} />
                <Stack.Screen name="Graficas" component={GraficasNavigator} options={{ headerShown: false }} />
                {/* Pantallas adicionales */}
                <Stack.Screen name="Home" component={HomeScreen} />
                <Stack.Screen name="MembershipScreen" component={MembershipScreen} />
                <Stack.Screen name="IMCScreen" component={IMCScreen} options={ {title:"IMC"}}/>
                <Stack.Screen name="ChartsScreen" component={ChartsScreen} />
                <Stack.Screen name="BodyScreen" component={BodyScreen} options={ {title:"Composición corporal"}} />
                <Stack.Screen name="Predict" component={Predict} options={ {title:"Recomendaciones"}}/>
                <Stack.Screen name="Reporte" component={Reporte} />
                <Stack.Screen name="ClassesScreen" component={ClassesScreen} options={ {title:"Clases"}}/>
                <Stack.Screen name="ProgressScreen" component={ProgressScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </AuthProvider>
        </Provider>
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  drawerContainer: {
    padding: 20,
    backgroundColor: "#F9F9F9",
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: "600",
    marginBottom: 20,
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
  },
  cardContainer: {
    gap: 12,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 14,
    borderRadius: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  cardText: {
    marginLeft: 12,
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#333",
  },
  logoutButton: {
    marginTop: 30,
    flexDirection: "row",
    alignItems: "center",
  },
  logoutText: {
    marginLeft: 10,
    fontSize: 16,
    fontFamily: "Poppins_600SemiBold",
    color: "#FF3B30",
  },
  closeButton: { alignSelf: "flex-end" },
  menuItem: { paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: "#ccc" },
  menuText: { fontSize: 18,  fontFamily: 'Poppins_400Regular' },
  overlay: { position: "absolute", width: "100%", height: "100%" }, // 🔹 Bloquea el cierre táctil
});