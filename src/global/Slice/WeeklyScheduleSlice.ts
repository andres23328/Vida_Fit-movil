import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface WeeklyScheduleState {
  weeklyTime: number;
  selectedDays: string[];
}

const initialState: WeeklyScheduleState = {
  weeklyTime: 145,
  selectedDays: ['Mar', 'Jue', 'Sáb'],
};

const weeklyScheduleSlice = createSlice({
  name: 'weeklySchedule',
  initialState,
  reducers: {
    setWeeklyTime: (state, action: PayloadAction<number>) => {
      state.weeklyTime = action.payload;
    },
    toggleDaySelection: (state, action: PayloadAction<string>) => {
      const day = action.payload;
      if (state.selectedDays.includes(day)) {
        state.selectedDays = state.selectedDays.filter(d => d !== day);
      } else {
        state.selectedDays.push(day);
      }
    },
  },
});

export const { setWeeklyTime, toggleDaySelection } = weeklyScheduleSlice.actions;
export default weeklyScheduleSlice.reducer;
