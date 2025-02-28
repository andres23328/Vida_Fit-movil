import { NavigatorScreenParams } from '@react-navigation/native';

/* export type IntroStackParamList = {
  Login: undefined;
  Welcome: undefined; // Pantalla inicial
  Goals: undefined; // Ejemplo: pasa un nombre desde Welcome
  Gender: { goals: string }; // Ejemplo: pasa metas desde Goals
  Location: { gender: string }; // Y así sucesivamente...
  ExerciseHistory: { location: string };
  TrainingIntensity: { history: string };
  UserInfo: { intensity: string };
  HealthGoals: { userInfo: string };
  GoogleFitSetup: { healthGoals: string };
  GoogleFitAuth: { fitSetup: string };
  Registration: { fitAuth: string };
  WeeklySchedule: { registration: string };
  SchedulePreference: { schedule: string };
  TimePicker: { preferences: string };
  TrainingReminder: { time: string };
  CalibrationInfo: { reminder: string };
  FitnessAssessment: { calibration: string };
  PersonalizedWelcome: { assessment: string };
}; */

export type RootStackParamList = {
  Login: undefined; // Pantalla de inicio de sesión
  Home: undefined; // Pantalla principal
  Welcome: undefined; // Pantalla inicial
  Goals: undefined; 
  Gender: undefined; // Ejemplo: pasa metas desde Goals
  Location: undefined; // Y así sucesivamente...
  ExerciseHistory: undefined;
  TrainingIntensity: undefined;
  UserInfo: undefined;
  HealthGoals: undefined;
  GoogleFitSetup: undefined;
  GoogleFitAuth: undefined;
  Registration: undefined;
  WeeklySchedule: undefined;
  SchedulePreference: undefined;
  TimePicker: undefined;
  TrainingReminder: undefined;
  CalibrationInfo: undefined;
  FitnessAssessment: undefined;
  PersonalizedWelcome: undefined;
};
