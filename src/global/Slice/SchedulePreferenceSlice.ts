import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Define el tipo de estado
interface SchedulePreferenceState {
  scheduleOption: string | null; // Puede ser 'Planifica todo por mí' o 'Administraré mis días y mi tiempo'
}

const initialState: SchedulePreferenceState = {
  scheduleOption: null, // Estado inicial vacío
};

// Crear el slice
const schedulePreferenceSlice = createSlice({
  name: 'schedulePreference',
  initialState,
  reducers: {
    // Acción para actualizar la opción seleccionada
    setScheduleOption: (state, action: PayloadAction<string>) => {
      state.scheduleOption = action.payload;
    },
  },
});

// Exporta las acciones generadas por el slice
export const { setScheduleOption } = schedulePreferenceSlice.actions;

// Exporta el reducer para usarlo en el store
export default schedulePreferenceSlice.reducer;
