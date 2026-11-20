import { createSlice } from '@reduxjs/toolkit';
import { storage } from '../../utils/storage';
import { songs as defaultSongs } from '../../data/mockSongs';

const DEFAULT_SONG = {
  title: 'Malang',
  singers: ['Ved Sharma'],
  mood: ['Dance', 'Feel good'],
  year: 2020,
  album: 'Malang',
  duration: '4:37',
  language: 'Hindi',
  thumbnail: 'https://i.ytimg.com/vi/KBIq11mNB0I/hqdefault.jpg',
  timeStamp: '6:20 PM',
  liked: false,
};

const savedVolume = storage.get(storage.KEYS.VOLUME, 80);

const initialState = {
  currentSong: DEFAULT_SONG,
  isPlaying: false,
  volume: savedVolume,
  isMuted: false,
  progress: 0,
  currentTime: '0:00',
  totalTime: '0:00',
  queue: [],
  shuffle: false,
  repeat: 'off', // 'off' | 'all' | 'one'
};

const playerSlice = createSlice({
  name: 'player',
  initialState,
  reducers: {
    setCurrentSong: (state, action) => {
      state.currentSong = action.payload;
      state.isPlaying = true;
      state.progress = 0;
      state.currentTime = '0:00';
    },
    setIsPlaying: (state, action) => {
      state.isPlaying = action.payload;
    },
    togglePlay: (state) => {
      state.isPlaying = !state.isPlaying;
    },
    setVolume: (state, action) => {
      state.volume = action.payload;
      state.isMuted = action.payload === 0;
      storage.set(storage.KEYS.VOLUME, action.payload);
    },
    toggleMute: (state) => {
      state.isMuted = !state.isMuted;
    },
    setProgress: (state, action) => {
      const { progress, currentTime, totalTime } = action.payload;
      if (progress !== undefined) state.progress = progress;
      if (currentTime !== undefined) state.currentTime = currentTime;
      if (totalTime !== undefined) state.totalTime = totalTime;
    },
    setQueue: (state, action) => {
      state.queue = action.payload;
    },
    nextSong: (state) => {
      const activeQueue = (state.queue && state.queue.length > 0) ? state.queue : defaultSongs.slice(0, 50);
      if (activeQueue.length === 0) return;
      
      const currentIndex = activeQueue.findIndex(
        (s) => s.title === state.currentSong?.title
      );
      
      if (state.shuffle) {
        const randomIndex = Math.floor(Math.random() * activeQueue.length);
        state.currentSong = activeQueue[randomIndex];
      } else if (currentIndex < activeQueue.length - 1) {
        state.currentSong = activeQueue[currentIndex + 1];
      } else if (state.repeat === 'all' || currentIndex === activeQueue.length - 1) {
        state.currentSong = activeQueue[0];
      }
      state.progress = 0;
      state.isPlaying = true;
    },
    prevSong: (state) => {
      const activeQueue = (state.queue && state.queue.length > 0) ? state.queue : defaultSongs.slice(0, 50);
      if (activeQueue.length === 0) return;
      
      const currentIndex = activeQueue.findIndex(
        (s) => s.title === state.currentSong?.title
      );
      
      if (currentIndex > 0) {
        state.currentSong = activeQueue[currentIndex - 1];
      } else if (state.repeat === 'all' || currentIndex === 0) {
        state.currentSong = activeQueue[activeQueue.length - 1];
      }
      state.progress = 0;
      state.isPlaying = true;
    },
    toggleShuffle: (state) => {
      state.shuffle = !state.shuffle;
    },
    toggleRepeat: (state) => {
      const modes = ['off', 'all', 'one'];
      const nextIndex = (modes.indexOf(state.repeat) + 1) % modes.length;
      state.repeat = modes[nextIndex];
    },
  },
});

export const {
  setCurrentSong,
  setIsPlaying,
  togglePlay,
  setVolume,
  toggleMute,
  setProgress,
  setQueue,
  nextSong,
  prevSong,
  toggleShuffle,
  toggleRepeat,
} = playerSlice.actions;

export const selectCurrentSong = (state) => state.player.currentSong;
export const selectIsPlaying = (state) => state.player.isPlaying;
export const selectPlayerVolume = (state) => state.player.volume;
export const selectIsMuted = (state) => state.player.isMuted;
export const selectPlayerProgress = (state) => ({
  progress: state.player.progress,
  currentTime: state.player.currentTime,
  totalTime: state.player.totalTime,
});
export const selectPlayerQueue = (state) => state.player.queue;
export const selectShuffle = (state) => state.player.shuffle;
export const selectRepeat = (state) => state.player.repeat;

export default playerSlice.reducer;

