import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import config from './config/config.js';
import { seedDatabase } from './data/seed.js';
import authRoutes from './routes/authRoutes.js';
import songRoutes from './routes/songRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';
import db from './utils/db.js';

const app = express();

// 1. Core Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow localhost dev servers or mobile/same-origin requests
      callback(null, true);
    },
    credentials: true,
  })
);

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

if (config.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// 2. Health & Status Check Endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    app: 'Vibify API',
    version: '1.0.0',
    uptime: `${Math.floor(process.uptime())}s`,
    counts: {
      songs: db.songs.count(),
      users: db.users.count(),
      likes: db.likes.count(),
    },
    timestamp: new Date().toISOString(),
  });
});

// 3. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/ai', aiRoutes);

// 4. Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// 5. Server Startup & Data Seeding
const PORT = config.PORT;

async function startServer() {
  await seedDatabase();

  app.listen(PORT, () => {
    console.log(`
🎧 ==========================================
🎵  Vibify Express Server is running!
🌐  URL: http://localhost:${PORT}
⚡  Health Check: http://localhost:${PORT}/api/health
📦  Catalog: ${db.songs.count()} songs loaded
👤  Demo Account: codeBeats@vibify.com / password123
=============================================
    `);
  });
}

startServer();

export default app;

