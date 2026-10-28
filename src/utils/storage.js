/**
 * Safe LocalStorage utility functions
 */

const STORAGE_KEYS = {
  AUTH_TOKEN: 'vibify_auth_token',
  AUTH_USER: 'vibify_auth_user',
  LIKED_SONGS: 'vibify_liked_songs',
  VOLUME: 'vibify_player_volume',
};

export const storage = {
  get(key, defaultValue = null) {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : defaultValue;
    } catch (e) {
      console.warn(`Error reading from localStorage key "${key}":`, e);
      return defaultValue;
    }
  },

  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.warn(`Error writing to localStorage key "${key}":`, e);
    }
  },

  remove(key) {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`Error removing localStorage key "${key}":`, e);
    }
  },

  clear() {
    try {
      localStorage.clear();
    } catch (e) {
      console.warn('Error clearing localStorage:', e);
    }
  },

  KEYS: STORAGE_KEYS,
};

