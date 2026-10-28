import { createSlice } from '@reduxjs/toolkit';
import { songs as mockSongs } from '../../data/mockSongs';
import { calculateDifference } from '../../utils/timeUtils';

const initialState = {
  items: mockSongs,
  activeMood: 'None',
  activeLanguage: 'All',
  searchQuery: '',
};

const songSlice = createSlice({
  name: 'songs',
  initialState,
  reducers: {
    setSongs: (state, action) => {
      state.items = action.payload;
    },
    addSong: (state, action) => {
      // Check if song already exists
      const exists = state.items.some(
        (s) => s.title.toLowerCase() === action.payload.title.toLowerCase()
      );
      if (!exists) {
        state.items.unshift(action.payload);
      }
    },
    toggleLike: (state, action) => {
      const songTitle = typeof action.payload === 'string' 
        ? action.payload 
        : action.payload?.title;
        
      if (!songTitle) return;

      const song = state.items.find(
        (s) => s.title.toLowerCase() === songTitle.toLowerCase()
      );
      if (song) {
        song.liked = !song.liked;
      }
    },
    setActiveMood: (state, action) => {
      state.activeMood = state.activeMood === action.payload ? 'None' : action.payload;
    },
    setActiveLanguage: (state, action) => {
      state.activeLanguage = action.payload;
    },
    setSearchQuery: (state, action) => {
      state.searchQuery = action.payload;
    },
  },
});

export const {
  setSongs,
  addSong,
  toggleLike,
  setActiveMood,
  setActiveLanguage,
  setSearchQuery,
} = songSlice.actions;

// Selectors
export const selectAllSongs = (state) => state.songs.items;
export const selectLikedSongs = (state) => state.songs.items.filter((s) => s.liked);
export const selectActiveMood = (state) => state.songs.activeMood;
export const selectActiveLanguage = (state) => state.songs.activeLanguage;

/**
 * Selector for home page recommended songs based on active mood & time
 */
export const selectRecommendedSongs = (state) => {
  const { items, activeMood } = state.songs;
  if (activeMood && activeMood !== 'None') {
    return items.filter((s) => s.mood && s.mood.includes(activeMood));
  }
  // Otherwise filter by current local vibe time
  const timeFiltered = items.filter((s) => calculateDifference(s.timeStamp));
  return timeFiltered.length > 0 ? timeFiltered : items.slice(0, 30);
};

export default songSlice.reducer;

