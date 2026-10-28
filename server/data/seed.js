import bcrypt from 'bcryptjs';
import db from '../utils/db.js';
import { songs as rawSongs } from '../../src/data/mockSongs.js';

export async function seedDatabase() {
  try {
    // 1. Seed Demo User
    const existingUser = db.users.findOne((u) => u.email === 'codeBeats@vibify.com');
    if (!existingUser) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash('password123', salt);

      db.users.insert({
        id: 'user_demo_1',
        name: 'CodeBeats Listener',
        email: 'codeBeats@vibify.com',
        phone: '+1 555-0199',
        password: hashedPassword,
        avatar: 'https://picsum.photos/seed/user/100/100',
        role: 'user',
      });
      console.log('[Seed] Default user "codeBeats@vibify.com" seeded.');
    }

    // 2. Seed Songs
    if (db.songs.count() === 0) {
      console.log(`[Seed] Seeding ${rawSongs.length} songs into database...`);
      const preparedSongs = rawSongs.map((song, index) => ({
        id: `song_${index + 1}`,
        title: song.title,
        singers: song.singers || [],
        mood: song.mood || [],
        year: song.year || 2022,
        album: song.album || 'Single',
        duration: song.duration || '3:30',
        language: song.language || 'English',
        thumbnail: song.thumbnail,
        timeStamp: song.timeStamp || '12:00 PM',
        liked: Boolean(song.liked),
      }));

      db.songs.insertMany(preparedSongs);
      console.log(`[Seed] Successfully seeded ${preparedSongs.length} songs.`);
    } else {
      console.log(`[DB] Song catalog ready (${db.songs.count()} songs loaded).`);
    }
  } catch (err) {
    console.error('[Seed] Error seeding database:', err);
  }
}

export default seedDatabase;

