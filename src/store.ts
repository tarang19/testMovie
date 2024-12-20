import { configureStore } from '@reduxjs/toolkit';
import filmsReducer from './features/films/filmsSlice';

export const store = configureStore({
  reducer: {
    films: filmsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
