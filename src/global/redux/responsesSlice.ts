// global/redux/responsesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Definir el tipo de valores permitidos en responses
type ResponseValue = string | number | boolean | null | string[];

// Estado global para las respuestas
interface ResponsesState {
  height?: string | number;
  weight?: string | number;
  age?: string | number;
  [key: string]: string | number | boolean | null | string[] | undefined;
}

// Estado inicial vacío
const initialState: ResponsesState = {};

const responsesSlice = createSlice({
  name: 'responses',
  initialState,
  reducers: {
    updateResponse: (state, action: PayloadAction<{ field: string; value: ResponseValue }>) => {
      if (__DEV__) {
        console.log('🟡 Actualizando Redux:', action.payload);
      }
      state[action.payload.field] = action.payload.value;
    },
    resetResponses: () => {
      if (__DEV__) {
        console.log('🔄 Reiniciando respuestas en Redux');
      }
      return { ...initialState }; // Retorna un nuevo objeto vacío
    },
  },
});

export const { updateResponse, resetResponses } = responsesSlice.actions;
export default responsesSlice.reducer;
