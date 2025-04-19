// global/redux/responsesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// Definir el tipo de valores permitidos en responses
type ResponseValue = string | number | boolean | null | string[];

// Estado global para las respuestas
interface ResponsesState {
  height?: string | number;
  weight?: string | number;
  age?: string | number;
  selectedGoals: string[];
  [key: string]: string | number | boolean | null | string[] | undefined;
}

// Estado inicial con valores seguros
const initialState: ResponsesState = {
  selectedGoals: [],
};

const responsesSlice = createSlice({
  name: 'responses',
  initialState,
  reducers: {
    updateResponse: (state, action: PayloadAction<{ field: string; value: ResponseValue }>) => {
      if (__DEV__) {
        console.log('🟡 Actualizando Redux:', action.payload);
      }
      return { ...state, [action.payload.field]: action.payload.value };
    },
    resetResponses: () => {
      if (__DEV__) {
        console.log('🔄 Reiniciando respuestas en Redux');
      }
      return { ...initialState }; // Retorna un nuevo objeto seguro
    },
    resetSelectedGoals: (state) => {
      if (__DEV__) {
        console.log('🔄 Reiniciando selectedGoals en Redux');
      }
      state.selectedGoals = []; // Solo resetea selectedGoals sin tocar lo demás
    },
  },
});

export const { updateResponse, resetResponses, resetSelectedGoals  } = responsesSlice.actions;
export default responsesSlice.reducer;
