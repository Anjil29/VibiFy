import mongoose from 'mongoose';
import config from './config.js';

export async function connectDB() {
  try {
    const conn = await mongoose.connect(config.MONGO_URI);
    console.log(`
🍃 ==========================================
📦  MongoDB Connected Successfully!
🏠  Host: ${conn.connection.host}
💾  Database: ${conn.connection.name}
🔌  URI: ${config.MONGO_URI}
=============================================`);
    return conn;
  } catch (err) {
    console.error('❌ MongoDB Connection Error:', err.message);
    console.error('Make sure your local MongoDB service is running on port 27017.');
    throw err;
  }
}

export default connectDB;
