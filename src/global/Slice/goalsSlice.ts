import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GoalsState {
  goal: string | null; // Estado inicial, sin selección
}

const initialState: GoalsState = {
  goal: null,
};

const goalsSlice = createSlice({
  name: 'goals',
  initialState,
  reducers: {
    setGoal(state, action: PayloadAction<string>) {
      state.goal = action.payload; // Almacena el objetivo seleccionado
    },
  },
});

export const { setGoal } = goalsSlice.actions;
export default goalsSlice.reducer;
