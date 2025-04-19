import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserInfoState {
  height: string;
  weight: string;
  age: string;
  units: 'metric' | 'imperial';
}

const initialState: UserInfoState = {
  height: '',
  weight: '',
  age: '',
  units: 'metric', // Valor predeterminado
};

const userInfoSlice = createSlice({
  name: 'userInfo',
  initialState,
  reducers: {
    setHeight: (state, action: PayloadAction<string>) => {
      state.height = action.payload;
    },
    setWeight: (state, action: PayloadAction<string>) => {
      state.weight = action.payload;
    },
    setAge: (state, action: PayloadAction<string>) => {
      state.age = action.payload;
    },
    setUnits: (state, action: PayloadAction<'metric' | 'imperial'>) => {
      state.units = action.payload;
    },
    resetForm: (state) => {
      state.height = '';
      state.age = '';
      state.weight = '';
    },
  },
});

export const { setHeight, setWeight, setAge, setUnits, resetForm } = userInfoSlice.actions;
export default userInfoSlice.reducer;
