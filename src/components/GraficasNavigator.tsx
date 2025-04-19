import React , { useEffect } from 'react';
import {
  View,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  Text,
} from 'react-native';
import { TabView, SceneMap } from 'react-native-tab-view';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp  } from '@react-navigation/native';
import * as Animatable from 'react-native-animatable';
import Svg, { Path } from 'react-native-svg';
import { RootStackParamList } from '../components/types';

import ProgresoPesoScreen from '../screens/graficas/ProgresoPesoScreen';
import RecordsScreen from '../screens/graficas/RecordsScreen';
import DistribucionScreen from '../screens/graficas/DistribucionScreen';
import TiempoEntrenamientoScreen from '../screens/graficas/TiempoEntrenamientoScreen';

const initialLayout = { width: Dimensions.get('window').width };

const swipeableRoutes = [
  { key: 'progreso', title: 'Progreso', icon: 'chart-line' },
  { key: 'records', title: 'Records', icon: 'trophy' },
  { key: 'distribucion', title: 'Distribución', icon: 'chart-donut' },
  { key: 'tiempo', title: 'Tiempo', icon: 'timer-outline' },
];

const routes = [
  ...swipeableRoutes,
  { key: 'volver', title: 'Volver', icon: 'arrow-left' }, // botón para volver
];

const renderScene = SceneMap({
  progreso: ProgresoPesoScreen,
  records: RecordsScreen,
  distribucion: DistribucionScreen,
  tiempo: TiempoEntrenamientoScreen,
});

type GraficasRouteProp = RouteProp<RootStackParamList, 'Graficas'>;


const GraficasNavigator = () => {
  const [index, setIndex] = React.useState(0);
  const navigation = useNavigation() as any;

  const tabWidth = initialLayout.width / routes.length;
  const notchRadius = 50;
  const notchDepth = 58;
  const visibleIndex = Math.min(index, swipeableRoutes.length - 1);
  const notchStart = tabWidth * visibleIndex + tabWidth / 2 - notchRadius;
  const route = useRoute<GraficasRouteProp>();
  const { initialTab } = route.params || {};

  useEffect(() => {
    if (initialTab) {
      const tabIndex = routes.findIndex(route => route.key === initialTab);
      if (tabIndex !== -1) {
        setIndex(tabIndex);
      }
    }
  }, [initialTab]);

  const leftCurve =
    index === 0
      ? `M0,30 V90`
      : `M30,0 Q0,0 0,30 V90`;

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
        <Svg width={initialLayout.width} height={90} style={styles.svgBackground}>
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

        {routes.map((route, i) => {
          const focused = index === i;
          const isBack = route.key === 'volver';

          return (
            <TouchableOpacity
              key={route.key}
              onPress={() => {
                if (isBack) {
                  navigation.goBack();
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
              {!focused && !isBack && (
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
    zIndex: 1,
  },
  svgBackground: {
    position: 'absolute',
    bottom: 0,
    zIndex: 0,
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

export default GraficasNavigator;
