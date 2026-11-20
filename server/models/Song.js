import mongoose from 'mongoose';

const songSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Song title is required'],
      trim: true,
      index: true,
    },
    videoId: {
      type: String,
      default: '',
      trim: true,
    },
    singers: {
      type: [String],
      default: [],
    },
    artists: {
      type: [String],
      default: [],
    },
    mood: {
      type: [String],
      default: [],
    },
    moods: {
      type: [String],
      default: [],
    },
    year: {
      type: Number,
      default: () => new Date().getFullYear(),
    },
    album: {
      type: String,
      default: 'Single',
      trim: true,
    },
    duration: {
      type: String,
      default: '3:30',
      trim: true,
    },
    language: {
      type: String,
      default: 'English',
      trim: true,
      index: true,
    },
    thumbnail: {
      type: String,
      default: '',
      trim: true,
    },
    timeStamp: {
      type: String,
      default: '8:00 PM',
      trim: true,
    },
    liked: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Format helper to ensure frontend always receives normalized fields
songSchema.methods.toNormalized = function (userLiked = false) {
  const doc = this.toObject();

  // 1. Harmonize singers vs artists
  const singerList =
    doc.singers && doc.singers.length > 0
      ? doc.singers
      : doc.artists && doc.artists.length > 0
      ? doc.artists
      : ['Unknown Artist'];

  // 2. Harmonize moods vs mood
  const rawMoods =
    doc.mood && doc.mood.length > 0
      ? doc.mood
      : doc.moods && doc.moods.length > 0
      ? doc.moods
      : ['Chill'];

  const moodList = rawMoods.map((m) =>
    typeof m === 'string' ? m.charAt(0).toUpperCase() + m.slice(1).toLowerCase() : m
  );

  // 3. Compute thumbnail from YouTube videoId if missing
  let thumb = doc.thumbnail;
  if (!thumb && doc.videoId) {
    thumb = `https://i.ytimg.com/vi/${doc.videoId}/hqdefault.jpg`;
  } else if (!thumb) {
    thumb = `https://picsum.photos/seed/${encodeURIComponent(doc.title)}/400/400`;
  }

  return {
    id: String(doc._id),
    _id: doc._id,
    title: doc.title,
    videoId: doc.videoId || '',
    singers: singerList,
    artists: singerList,
    mood: moodList,
    moods: moodList,
    year: doc.year || 2022,
    album: doc.album || 'Single',
    duration: doc.duration || '3:30',
    language: doc.language || 'English',
    thumbnail: thumb,
    timeStamp: doc.timeStamp || '8:00 PM',
    liked: Boolean(userLiked || doc.liked),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

export const Song = mongoose.model('Song', songSchema);
export default Song;
