import { Router } from 'express';
import config from '../config/config.js';

const router = Router();

router.post('/discover', async (req, res, next) => {
  try {
    const { query } = req.body;
    if (!query || !query.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Query parameter is required.',
      });
    }

    const songTitle = query.trim();

    // Check if Gemini API key is configured on server
    if (config.GEMINI_API_KEY) {
      try {
        const { GoogleGenAI } = await import('@google/genai');
        const ai = new GoogleGenAI({ apiKey: config.GEMINI_API_KEY });
        const response = await ai.models.generateContent({
          model: 'gemini-2.5-flash',
          contents: `
            Return ONLY valid JSON. No explanations, no markdown formatting.
            Give me details for the song "${songTitle}" in EXACTLY this format:
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

        return res.json({
          success: true,
          song: data,
        });
      } catch (geminiError) {
        console.warn('[AI] Gemini call failed on server, returning fallback:', geminiError.message);
      }
    }

    // Fallback generated mock song
    const fallbackSong = {
      title: songTitle,
      singers: ['Vibify Featured Artist'],
      mood: ['Chill', 'Flow'],
      year: new Date().getFullYear(),
      album: 'Vibify Discovery',
      duration: '3:30',
      language: 'English',
      thumbnail: `https://picsum.photos/seed/${encodeURIComponent(songTitle)}/400/400`,
      timeStamp: '8:00 PM',
      liked: false,
    };

    res.json({
      success: true,
      song: fallbackSong,
    });
  } catch (err) {
    next(err);
  }
});

export default router;

