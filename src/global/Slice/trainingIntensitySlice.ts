import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface TrainingIntensityState {
  intensity: number | null; // Nivel de intensidad seleccionado (1 a 5) o null si no se selecciona
}

const initialState: TrainingIntensityState = {
  intensity: null,
};

const trainingIntensitySlice = createSlice({
  name: 'trainingIntensity',
  initialState,
  reducers: {
    setTrainingIntensity: (state, action: PayloadAction<number>) => {
      state.intensity = action.payload; // Guarda la intensidad seleccionada
    },
  },
});

export const { setTrainingIntensity } = trainingIntensitySlice.actions;
export default trainingIntensitySlice.reducer;
