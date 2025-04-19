// src/redux/slices/membresiaSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface MembresiaState {
  nivel: string | null;
}

const initialState: MembresiaState = {
  nivel: null,
};

export const membresiaSlice = createSlice({
  name: 'membresia',
  initialState,
  reducers: {
    setMembresia: (state, action: PayloadAction<string>) => {
      state.nivel = action.payload;
    },
    clearMembresia: (state) => {
      state.nivel = null;
    },
  },
});

export const { setMembresia, clearMembresia } = membresiaSlice.actions;
export default membresiaSlice.reducer;
