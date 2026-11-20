import User from '../models/User.js';
import Song from '../models/Song.js';
import { songs as rawSongs } from '../../src/data/mockSongs.js';

export async function seedDatabase() {
  try {
    // 1. Seed Demo User in MongoDB if missing
    const existingUser = await User.findOne({ email: 'codebeats@vibify.com' });
    if (!existingUser) {
      await User.create({
        name: 'CodeBeats Listener',
        email: 'codebeats@vibify.com',
        phone: '+1 555-0199',
        password: 'password123', // Model pre-save hashes this with bcrypt
        avatar: 'https://picsum.photos/seed/codebeats/100/100',
        role: 'demo',
      });
      console.log('👤 [MongoDB Seed] Demo user "codebeats@vibify.com" initialized in MongoDB.');
    } else {
      console.log('👤 [MongoDB Seed] Demo user "codebeats@vibify.com" verified in MongoDB.');
    }

    // 2. Check song collection in MongoDB
    const count = await Song.countDocuments();
    if (count === 0) {
      console.log(`🎵 [MongoDB Seed] Seeding catalog into MongoDB...`);
      const preparedSongs = rawSongs.map((song) => {
        let videoId = '';
        if (song.thumbnail && song.thumbnail.includes('/vi/')) {
          videoId = song.thumbnail.split('/vi/')[1].split('/')[0];
        }

        return {
          title: song.title,
          videoId,
          singers: song.singers || [],
          artists: song.singers || [],
          mood: song.mood || [],
          moods: song.mood || [],
          year: song.year || 2022,
          album: song.album || 'Single',
          duration: song.duration || '3:30',
          language: song.language || 'English',
          thumbnail: song.thumbnail,
          timeStamp: song.timeStamp || '8:00 PM',
          liked: Boolean(song.liked),
        };
      });

      await Song.insertMany(preparedSongs);
      console.log(`✅ [MongoDB Seed] Successfully seeded ${preparedSongs.length} songs into MongoDB collection!`);
    } else {
      console.log(`📦 [MongoDB Seed] MongoDB already has ${count} songs in "songs" collection.`);
    }
  } catch (err) {
    console.error('❌ [MongoDB Seed] Seeding error:', err.message);
  }
}

export default seedDatabase;
