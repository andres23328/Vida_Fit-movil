import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface LocationState {
  location: string | null; // Puede ser 'Gimnasio', 'Casa' o null si no se seleccionó
}

const initialState: LocationState = {
  location: null,
};

const locationSlice = createSlice({
  name: 'location',
  initialState,
  reducers: {
    setLocation: (state, action: PayloadAction<string>) => {
      state.location = action.payload; // Almacena la ubicación seleccionada
    },
  },
});

export const { setLocation } = locationSlice.actions;
export default locationSlice.reducer;
