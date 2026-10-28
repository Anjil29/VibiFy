import { createSlice } from '@reduxjs/toolkit';
import authService from '../../services/authService';

const storedUser = authService.getCurrentUser();
const isAuthenticated = authService.isAuthenticated();

const initialState = {
  user: storedUser || null,
  isAuthenticated: isAuthenticated || false,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = true;
      state.error = null;
    },
    logoutUser: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.error = null;
      authService.logout();
    },
    setAuthLoading: (state, action) => {
      state.loading = action.payload;
    },
    setAuthError: (state, action) => {
      state.error = action.payload;
      state.loading = false;
    },
    clearAuthError: (state) => {
      state.error = null;
    },
  },
});

export const {
  setUser,
  logoutUser,
  setAuthLoading,
  setAuthError,
  clearAuthError,
} = authSlice.actions;

export const selectAuthUser = (state) => state.auth.user;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectAuthLoading = (state) => state.auth.loading;
export const selectAuthError = (state) => state.auth.error;

export default authSlice.reducer;

