import { configureStore } from '@reduxjs/toolkit';
import songReducer from './slices/songSlice';
import playerReducer from './slices/playerSlice';
import authReducer from './slices/authSlice';
import uiReducer from './slices/uiSlice';

export const store = configureStore({
  reducer: {
    songs: songReducer,
    player: playerReducer,
    auth: authReducer,
    ui: uiReducer,
  },
});

export default store;

