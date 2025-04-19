import React from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
  Platform,
} from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { getAuth, signOut } from 'firebase/auth';
import { useNavigation } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import Svg, { Path } from 'react-native-svg';

import HomeScreen from '../screens/screen_login/HomeScreen';
import ProgressScreen from '../screens/screen_login/ProgressScreen';
import CalendarScreen from '../screens/sub-screens/CalendarScreen';
import DashboardScreen from '../screens/screen_login/DashboardScreen';

const initialLayout = { width: Dimensions.get('window').width };
const swipeableRoutes = [
  { key: 'inicio', title: 'Inicio', icon: 'home' },
  { key: 'progreso', title: 'Progreso', icon: 'chart-line' },
  { key: 'calendario', title: 'Calendario', icon: 'calendar-month' },
  { key: 'dashboard', title: 'Panel', icon: 'view-dashboard' },
];
const routes = [...swipeableRoutes, { key: 'logout', title: 'Salir', icon: 'logout' }];

const renderScene = SceneMap({
  inicio: HomeScreen,
  progreso: ProgressScreen,
  calendario: CalendarScreen,
  dashboard: DashboardScreen,
});

const BottomTabWithSwipe = () => {
  const [index, setIndex] = React.useState(0);
  const navigation = useNavigation() as any;

  const handleLogout = () => {
    const auth = getAuth();
    signOut(auth)
      .then(() => {
        navigation.replace('Login');
      })
      .catch((error) => console.error('Error al cerrar sesión:', error));
  };

  const tabWidth = initialLayout.width / routes.length;
  const notchRadius = 50;
  const notchDepth = 58;
  // Asegura que notchStart esté alineado solo con los botones swipeables
  const visibleIndex = Math.min(index, swipeableRoutes.length - 1);
  const notchStart = tabWidth * visibleIndex + tabWidth / 2 - notchRadius;

  const leftCurve =
  index === 0
    ? `M0,30 V90` // Si está en "Inicio", empezamos sin curva
    : `M30,0 Q0,0 0,30 V90`; // Si no, dibujamos la curva izquierda


  return (
    <View style={{ flex: 1 }}>
      <TabView
        navigationState={{ index, routes: swipeableRoutes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={initialLayout}
        renderTabBar={() => null}
        lazy
        lazyPreloadDistance={0}
      />

      {/* Custom Tab Bar */}
      <View style={styles.tabBarWrapper}>
        {/* Fondo SVG con notch */}
        <Svg
          width={initialLayout.width}
          height={90}
          style={styles.svgBackground}
        >
        <Path
          fill="rgb(209, 250, 229)"
          d={`
            ${leftCurve}
            H${initialLayout.width}
            V30
            Q${initialLayout.width},0 ${initialLayout.width - 30},0
            H${notchStart + notchRadius * 2}
            C${notchStart + notchRadius * 2 - 25},0 ${notchStart + notchRadius * 2 - 2},${notchDepth} ${notchStart + notchRadius},${notchDepth}
            C${notchStart + 2},${notchDepth} ${notchStart + 25},0 ${notchStart},0
            H0
            Z
          `}
        />
          
        </Svg>

        {/* Íconos */}
        {routes.map((route, i) => {
          const focused = index === i;
          const isLogout = route.key === 'logout';

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => {
                if (isLogout) {
                  handleLogout();
                } else {
                  const newIndex = swipeableRoutes.findIndex(r => r.key === route.key);
                  if (newIndex !== -1) setIndex(newIndex);
                }
              }}
              style={[styles.tabItem, focused && styles.floatingTab]}
              activeOpacity={0.7}
            >
              <Animatable.View
                animation={focused ? 'bounceInUp' : undefined}
                duration={500}
                useNativeDriver
                style={focused ? styles.floatingIcon : styles.regularIcon}
              >
                <MaterialCommunityIcons
                  name={route.icon as any}
                  size={focused ? 30 : 24}
                  color={focused ? 'rgb(0, 0, 0)' : 'black'}
                />
              </Animatable.View>
              {!focused && !isLogout && (
                <Text style={[styles.label, { color: 'black' }]}>{route.title}</Text>
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  tabBarWrapper: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    height: 90,
    flexDirection: 'row',
    justifyContent: 'space-around',
    zIndex: 1, // Por encima del SVG
  },
  svgBackground: {
    position: 'absolute',
    bottom: 0,
    zIndex: 0, // Fondo SVG detrás
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  floatingTab: {
    marginTop: -40,
  },
  floatingIcon: {
    backgroundColor: '#fff',
    borderRadius: 40,
    padding: 14,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  regularIcon: {
    paddingTop: 4,
  },
  label: {
    fontSize: 11,
    fontFamily: 'Poppins_400Regular',
    marginTop: 2,
  },
});

export default BottomTabWithSwipe;
