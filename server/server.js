import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import mongoose from 'mongoose';
import config from './config/config.js';
import connectDB from './config/db.js';
import { seedDatabase } from './data/seed.js';
import authRoutes from './routes/authRoutes.js';
import songRoutes from './routes/songRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import { notFoundHandler, errorHandler } from './middleware/errorMiddleware.js';
import User from './models/User.js';
import Song from './models/Song.js';
import Like from './models/Like.js';

const app = express();

// 1. Core Middlewares
app.use(
  cors({
    origin: (origin, callback) => {
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

// 2. Health & Status Check Endpoint (Live MongoDB Stats)
app.get('/api/health', async (req, res) => {
  try {
    const isConnected = mongoose.connection.readyState === 1;
    const [userCount, songCount, likeCount] = isConnected
      ? await Promise.all([
          User.countDocuments(),
          Song.countDocuments(),
          Like.countDocuments(),
        ])
      : [0, 0, 0];

    res.json({
      status: 'online',
      app: 'Vibify API',
      version: '1.0.0',
      database: isConnected ? 'MongoDB (Connected)' : 'MongoDB (Disconnected)',
      mongoUri: config.MONGO_URI,
      uptime: `${Math.floor(process.uptime())}s`,
      counts: {
        songs: songCount,
        users: userCount,
        likes: likeCount,
      },
      timestamp: new Date().toISOString(),
    });
  } catch (err) {
    res.status(500).json({
      status: 'error',
      message: err.message,
    });
  }
});

// 3. API Routes
app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);
app.use('/api/ai', aiRoutes);

// 4. Error Handling
app.use(notFoundHandler);
app.use(errorHandler);

// 5. Server Startup
const PORT = config.PORT;

async function startServer() {
  try {
    // Connect to MongoDB
    await connectDB();

    // Verify & seed database
    await seedDatabase();

    const server = app.listen(PORT, () => {
      console.log(`
🎧 ==========================================
🎵  Vibify Express Server is running!
🌐  URL: http://localhost:${PORT}
⚡  Health Check: http://localhost:${PORT}/api/health
🍃  MongoDB Database: ${mongoose.connection.name}
👤  Demo Account: codebeats@vibify.com / password123
=============================================
      `);
    });

    // Graceful Shutdown
    const handleShutdown = async () => {
      console.log('\nShutting down Vibify server gracefully...');
      server.close(async () => {
        await mongoose.connection.close(false);
        console.log('MongoDB connection closed. Exiting process.');
        process.exit(0);
      });
    };

    process.on('SIGINT', handleShutdown);
    process.on('SIGTERM', handleShutdown);
  } catch (err) {
    console.error('Fatal Server Boot Error:', err);
    process.exit(1);
  }
}

startServer();

export default app;
