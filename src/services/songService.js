/**
 * Song Service
 * Bridges UI to backend API with local mock fallback.
 */

import api from './api';
import { songs as mockSongs } from '../data/mockSongs';
import { calculateDifference } from '../utils/timeUtils';

export const songService = {
  /**
   * Fetch all songs
   */
  async getAllSongs() {
    try {
      const data = await api.get('/songs');
      return Array.isArray(data) ? data : data.songs || mockSongs;
    } catch {
      // Fallback to local mock data
      return mockSongs;
    }
  },

  /**
   * Search songs by query
   */
  async search(query, localSongs = mockSongs) {
    if (!query || !query.trim()) return [];
    
    try {
      const data = await api.get(`/songs/search?q=${encodeURIComponent(query)}`);
      return Array.isArray(data) ? data : data.songs;
    } catch {
      const lower = query.toLowerCase().trim();
      return localSongs.filter(
        (s) =>
          s.title?.toLowerCase().includes(lower) ||
          s.singers?.some((singer) => singer.toLowerCase().includes(lower)) ||
          s.album?.toLowerCase().includes(lower) ||
          s.mood?.some((m) => m.toLowerCase().includes(lower))
      );
    }
  },

  /**
   * Toggle like for a song
   */
  async toggleLike(song) {
    try {
      return await api.post('/songs/like', { title: song.title });
    } catch {
      // Mock toggle
      return { success: true, liked: !song.liked };
    }
  },

  /**
   * Filter songs matching current vibe / time
   */
  getTimeVibeRecommendations(songsList = mockSongs) {
    return songsList.filter((s) => calculateDifference(s.timeStamp));
  },

  /**
   * Filter songs by mood
   */
  filterByMood(mood, songsList = mockSongs) {
    if (!mood || mood === 'None' || mood === 'All') return songsList;
    return songsList.filter((s) => s.mood && s.mood.includes(mood));
  },

  /**
   * Filter songs by language
   */
  filterByLanguage(language, songsList = mockSongs) {
    if (!language || language === 'All') return songsList;
    return songsList.filter((s) => s.language?.toLowerCase() === language.toLowerCase());
  },
};

export default songService;

