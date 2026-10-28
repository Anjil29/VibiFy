/**
 * AI Service using Google GenAI SDK
 * Provides intelligent song recommendations and auto-discovery when songs are not in the local library.
 */

import { GoogleGenAI } from '@google/genai';

const apiKey =
  import.meta.env.VITE_GENAI_API_KEY1 ||
  import.meta.env.VITE_GENAI_API_KEY ||
  import.meta.env.VITE_GEMINI_API_KEY ||
  '';

let aiClient = null;
if (apiKey) {
  try {
    aiClient = new GoogleGenAI({ apiKey });
  } catch (e) {
    console.warn('Failed to initialize GoogleGenAI client:', e);
  }
}

export const aiService = {
  /**
   * Check if AI service is configured
   */
  isConfigured() {
    return Boolean(apiKey && aiClient);
  },

  /**
   * Find details for an unindexed song using Gemini
   * @param {string} songName
   */
  async discoverSong(songName) {
    if (!songName || !songName.trim()) {
      throw new Error('Please enter a valid song name');
    }

    if (!aiClient) {
      // Mock generated song if API key is not configured
      return {
        title: songName.trim(),
        singers: ['AI Discovered Artist'],
        mood: ['Chill', 'Flow'],
        year: new Date().getFullYear(),
        album: 'Single',
        duration: '3:30',
        language: 'English',
        thumbnail: `https://picsum.photos/seed/${encodeURIComponent(songName)}/400/400`,
        timeStamp: '8:00 PM',
        liked: false,
      };
    }

    try {
      const response = await aiClient.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: `
          Return ONLY valid JSON. No markdown formatting, no backticks, no explanation.

          Give me details for the song "${songName}" in EXACTLY this format:
          {
            "title": "string",
            "singers": ["string"],
            "mood": ["string"],
            "year": number,
            "album": "string",
            "duration": "string",
            "language": "string",
            "thumbnail": "string",
            "timeStamp": "string",
            "liked": false
          }
        `,
      });

      let text = response.text || '';
      text = text.replace(/```json|```/g, '').trim();

      const data = JSON.parse(text);
      if (!data.thumbnail || !data.thumbnail.startsWith('http')) {
        data.thumbnail = `https://picsum.photos/seed/${encodeURIComponent(data.title || songName)}/400/400`;
      }
      return data;
    } catch (err) {
      console.error('Gemini discovery failed:', err);
      throw new Error('Could not fetch song metadata via AI. Please check your connection or API key.');
    }
  },
};

export default aiService;

