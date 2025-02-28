import { configureStore } from '@reduxjs/toolkit';
import goalsReducer from './Slice/goalsSlice';
import genderReducer from './Slice/genderSlice';
import locationReducer from './Slice/locationSlice'; 
import exerciseLevelReducer from './Slice/exerciseLevelSlice';
import trainingIntensityReducer from './Slice/trainingIntensitySlice';
import userInfoReducer from './Slice/userInfoSlice'; 
import healthGoalsReducer from './Slice/healthGoalsSlice';
import registrationReducer from './Slice/registrationSlice';
import responsesReducer from './redux/responsesSlice';
import weeklyScheduleReducer from './Slice/WeeklyScheduleSlice';
import schedulePreferenceReducer from './Slice/SchedulePreferenceSlice';

const store = configureStore({
  reducer: {
    goals: goalsReducer,
    gender: genderReducer,
    location: locationReducer,
    exerciseLevel: exerciseLevelReducer,
    trainingIntensity: trainingIntensityReducer,
    userInfo: userInfoReducer, 
    healthGoals: healthGoalsReducer,
    registration: registrationReducer, 
    responses: responsesReducer, 
    weeklySchedule: weeklyScheduleReducer,
    schedule: schedulePreferenceReducer,

  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
 

