import React, { useEffect, useRef } from 'react';
import { View, Text, Image, Animated, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import NextButton from '../../components/NextButton';
import { RootStackParamList } from '../../components/types';
import { StackNavigationProp } from '@react-navigation/stack';
import Svg, { Path, Text as SvgText } from 'react-native-svg';

type FitnessAssessmentNavigationProp = StackNavigationProp<RootStackParamList, 'FitnessAssessment'>;

const FitnessAssessment: React.FC = () => {
  const navigation = useNavigation<FitnessAssessmentNavigationProp>();
  const spinValue = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.loop(
      Animated.timing(spinValue, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, [spinValue]);

  const spin = spinValue.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        {/* Body Assessment */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../../../assets/imagenes/logo.jpeg')}
            style={styles.image}
          />
          <View style={[styles.circle, styles.topRight]} />
          <View style={[styles.circle, styles.bottomLeft]} />
        </View>

        {/* Movement Assessment */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../../../assets/imagenes/logo.jpeg')}
            style={styles.image}
          />
          <View style={styles.centeredCircle}>
            <Animated.View
              style={[styles.spinner, { transform: [{ rotate: spin }] }]}
            />
          </View>
        </View>

        {/* Range Assessment */}
        <View style={styles.imageContainer}>
          <Image
            source={require('../../../assets/imagenes/logo.jpeg')}
            style={styles.image}
          />
          <Svg width="48" height="48" viewBox="0 0 48 48" style={styles.svg}>
            <Path
              d="M24 0 A24 24 0 0 1 48 24"
              fill="none"
              stroke="#2563EB"
              strokeWidth="4"
            />
            <SvgText x="36" y="12" fontSize="10" fill="#2563EB">
              45°
            </SvgText>
          </Svg>
        </View>
      </View>

      <Text style={styles.description}>
        <Text style={styles.highlight}>Comenzaremos su entrenamiento</Text> con algunas
        pruebas simples de aptitud física para calibrar su capacidad e identificar
        cualquier desequilibrio o debilidad que podamos abordar.
      </Text>

      <NextButton onPress={() => navigation.navigate('Login')} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 32,
  },
  imageContainer: {
    position: 'relative',
    width: 128,
    height: 192,
    marginHorizontal: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  circle: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 4,
    borderColor: '#F97316',
  },
  topRight: {
    top: '25%',
    right: '10%',
  },
  bottomLeft: {
    bottom: '25%',
    left: '10%',
  },
  centeredCircle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: [{ translateX: -16 }, { translateY: -16 }],
  },
  spinner: {
    width: 32,
    height: 32,
    borderWidth: 4,
    borderColor: '#2563EB',
    borderRadius: 16,
    borderStyle: 'dashed',
  },
  svg: {
    position: 'absolute',
    top: 0,
    right: 0,
  },
  textDegree: {
    fontSize: 10,
  },
  description: {
    fontSize: 18,
    marginBottom: 32,
    textAlign: 'center',
  },
  highlight: {
    color: '#3B82F6',
  },
});

export default FitnessAssessment;
