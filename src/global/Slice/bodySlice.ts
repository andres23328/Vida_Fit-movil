// redux/slices/bodySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type BodyPart = 'arms' | 'legs' | 'torso' | 'head' | 'other';

interface BodyState {
  bodyParts: Record<BodyPart, number>;
}

const initialState: BodyState = {
  bodyParts: {
    arms: 20,
    legs: 25,
    torso: 30,
    head: 10,
    other: 15,
  },
};

const bodySlice = createSlice({
  name: 'body',
  initialState,
  reducers: {
    actualizarMasaCorporal: (state, action: PayloadAction<Record<BodyPart, number>>) => {
      state.bodyParts = action.payload;
    },
  },
});

export const { actualizarMasaCorporal } = bodySlice.actions;
export default bodySlice.reducer;
