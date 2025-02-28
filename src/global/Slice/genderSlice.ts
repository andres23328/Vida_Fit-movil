// redux/genderSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface GenderState {
  gender: string | null;
}

const initialState: GenderState = {
  gender: null,
};

const genderSlice = createSlice({
  name: 'gender',
  initialState,
  reducers: {
    setGender(state, action: PayloadAction<string>) {
      state.gender = action.payload;
    },
  },
});

export const { setGender } = genderSlice.actions;
export default genderSlice.reducer;
