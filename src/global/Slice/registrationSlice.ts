import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface RegistrationState {
  name: string;
  email: string;
  password: string;
}

const initialState: RegistrationState = {
  name: '',
  email: '',
  password: '',
};

const registrationSlice = createSlice({
  name: 'registration',
  initialState,
  reducers: {
    updateField: (
      state,
      action: PayloadAction<{ field: keyof RegistrationState; value: string }>
    ) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
  },
});

export const { updateField } = registrationSlice.actions;
export default registrationSlice.reducer;
