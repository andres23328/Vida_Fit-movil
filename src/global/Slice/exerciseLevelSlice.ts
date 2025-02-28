import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ExerciseLevelState {
  level: number | null; // Nivel seleccionado (1 a 5) o null si no se selecciona
}

const initialState: ExerciseLevelState = {
  level: null,
};

const exerciseLevelSlice = createSlice({
  name: 'exerciseLevel',
  initialState,
  reducers: {
    setExerciseLevel: (state, action: PayloadAction<number>) => {
      state.level = action.payload; // Guarda el nivel seleccionado
    },
  },
});

export const { setExerciseLevel } = exerciseLevelSlice.actions;
export default exerciseLevelSlice.reducer;
