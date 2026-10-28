import dotenv from 'dotenv';
dotenv.config();

export const config = {
  PORT: process.env.PORT || 5001,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET: process.env.JWT_SECRET || 'vibify_super_secret_jwt_key_2026',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  CLIENT_URL: process.env.CLIENT_URL || 'http://localhost:5173',
  GEMINI_API_KEY: process.env.VITE_GENAI_API_KEY1 || process.env.GEMINI_API_KEY || '',
};

export default config;

