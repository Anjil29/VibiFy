import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  toast: null, // { message: string, type: 'info' | 'success' | 'error' }
  mobileNavOpen: false,
};

const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    showToast: (state, action) => {
      state.toast = {
        message: action.payload.message || action.payload,
        type: action.payload.type || 'info',
        id: Date.now(),
      };
    },
    clearToast: (state) => {
      state.toast = null;
    },
    toggleMobileNav: (state) => {
      state.mobileNavOpen = !state.mobileNavOpen;
    },
    setMobileNavOpen: (state, action) => {
      state.mobileNavOpen = action.payload;
    },
  },
});

export const { showToast, clearToast, toggleMobileNav, setMobileNavOpen } = uiSlice.actions;

export const selectToast = (state) => state.ui.toast;
export const selectMobileNavOpen = (state) => state.ui.mobileNavOpen;

export default uiSlice.reducer;

