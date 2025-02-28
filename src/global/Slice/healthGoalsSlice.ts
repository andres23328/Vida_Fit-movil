import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface HealthGoalsState {
  selectedGoals: string[];
}

const initialState: HealthGoalsState = {
  selectedGoals: [], // Inicialmente vacío
};

const healthGoalsSlice = createSlice({
  name: 'healthGoals',
  initialState,
  reducers: {
    toggleGoal(state, action: PayloadAction<string>) {
      const goal = action.payload;
      if (state.selectedGoals.includes(goal)) {
        state.selectedGoals = state.selectedGoals.filter((item) => item !== goal); // Si ya está, lo quitamos
      } else {
        state.selectedGoals.push(goal); // Si no está, lo agregamos
      }
    },
    resetGoals(state) {
      state.selectedGoals = []; // Limpia todas las metas seleccionadas
    },
  },
});

export const { toggleGoal, resetGoals } = healthGoalsSlice.actions;

export default healthGoalsSlice.reducer;
