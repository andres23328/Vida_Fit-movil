// redux/slices/clasesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Clase {
  name: string;
  instructor: string;
  time: string;
  duration: string;
}

interface ClasesState {
  clasesReservadas: Clase[];
}

const initialState: ClasesState = {
  clasesReservadas: [],
};

const clasesSlice = createSlice({
  name: 'clases',
  initialState,
  reducers: {
    reservarClase: (state, action: PayloadAction<Clase>) => {
      // Evitar duplicados (opcional)
      const yaReservada = state.clasesReservadas.some(
        (clase) => clase.name === action.payload.name && clase.time === action.payload.time
      );
      if (!yaReservada) {
        state.clasesReservadas.push(action.payload);
      }
    },
    cancelarClase: (state, action: PayloadAction<Clase>) => {
      state.clasesReservadas = state.clasesReservadas.filter(
        (clase) => !(clase.name === action.payload.name && clase.time === action.payload.time)
      );
    },
    limpiarClases: (state) => {
      state.clasesReservadas = [];
    },
  },
});

export const { reservarClase, cancelarClase, limpiarClases } = clasesSlice.actions;
export default clasesSlice.reducer;
