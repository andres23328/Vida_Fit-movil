import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../components/types';
import { useDispatch } from 'react-redux';
import { updateResponse } from '../../global/redux/responsesSlice'; // Usa responsesSlice

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'TrainingIntensity'>;

const TrainingIntensity: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const dispatch = useDispatch();

  const levels = [1, 2, 3, 4, 5];

  const getBackgroundColor = (level: number) => {
    const colors = ['#FEE2E2', '#FED7AA', '#FDBA74', '#F87171', '#EF4444'];
    return colors[level - 1] || '#EF4444';
  };

  const handleIntensitySelect = (intensity: number) => {
    dispatch(updateResponse({ field: 'trainingIntensity', value: intensity })); // Guarda en Redux
    navigation.navigate('UserInfo');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>¿Qué tan duro te gustaría entrenar?</Text>

      <View style={styles.levelsContainer}>
        {levels.map((level, index) => (
          <View key={level} style={styles.levelContainer}>
            <TouchableOpacity
              style={[styles.levelButton, { backgroundColor: getBackgroundColor(level) }]}
              onPress={() => handleIntensitySelect(level)}
              activeOpacity={0.7}
            >
              <View style={styles.innerLevel} />
            </TouchableOpacity>
            <Text style={styles.label}>
              {index === 0 ? 'Fácil' : index === levels.length - 1 ? 'Intenso' : ''}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    textAlign: 'center',
    marginBottom: 24,
    color: '#1F2937',
    fontFamily: 'Poppins_600SemiBold',
  },
  levelsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '90%',
  },
  levelContainer: {
    alignItems: 'center',
  },
  levelButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  innerLevel: {
    width: 24,
    height: 24,
    borderWidth: 4,
    borderColor: '#FFF',
    borderRadius: 12,
  },
  label: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 6,
    fontFamily: 'Poppins_400Regular',
  },
});

export default TrainingIntensity;
