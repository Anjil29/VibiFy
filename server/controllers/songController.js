import Song from '../models/Song.js';
import Like from '../models/Like.js';
import User from '../models/User.js';
import { calculateDifference } from '../utils/timeUtils.js';

export const getAllSongs = async (req, res, next) => {
  try {
    const { mood, language, search, page, limit, all } = req.query;
    const userId = req.user ? String(req.user._id || req.user.id) : null;

    // 1. Fetch user's liked titles from MongoDB
    let userLikedTitles = new Set();
    if (userId) {
      const likes = await Like.find({ userId }).select('songTitle').lean();
      userLikedTitles = new Set(likes.map((l) => l.songTitle.toLowerCase()));
    }

    // 2. Build MongoDB filter
    const filter = {};

    if (mood && mood !== 'All' && mood !== 'None') {
      const regexMood = new RegExp(`^${mood}$`, 'i');
      filter.$or = [{ mood: regexMood }, { moods: regexMood }];
    }

    if (language && language !== 'All') {
      filter.language = new RegExp(`^${language}$`, 'i');
    }

    if (search && search.trim()) {
      const q = search.trim();
      const regex = new RegExp(q, 'i');
      const searchOr = [
        { title: regex },
        { singers: regex },
        { artists: regex },
        { album: regex },
      ];
      if (filter.$or) {
        filter.$and = [{ $or: filter.$or }, { $or: searchOr }];
        delete filter.$or;
      } else {
        filter.$or = searchOr;
      }
    }

    // 3. Query MongoDB
    const isUnpaginated = all === 'true' || (!page && !limit);

    if (isUnpaginated) {
      const docs = await Song.find(filter).sort({ createdAt: -1 });
      const normalized = docs.map((doc) =>
        doc.toNormalized(userLikedTitles.has(doc.title.toLowerCase()))
      );
      return res.json(normalized);
    }

    const currentPage = Math.max(1, parseInt(page, 10) || 1);
    const itemsPerPage = Math.max(1, parseInt(limit, 10) || 50);
    const total = await Song.countDocuments(filter);
    const totalPages = Math.ceil(total / itemsPerPage);

    const docs = await Song.find(filter)
      .sort({ createdAt: -1 })
      .skip((currentPage - 1) * itemsPerPage)
      .limit(itemsPerPage);

    const normalized = docs.map((doc) =>
      doc.toNormalized(userLikedTitles.has(doc.title.toLowerCase()))
    );

    res.json({
      success: true,
      total,
      page: currentPage,
      totalPages,
      songs: normalized,
    });
  } catch (err) {
    next(err);
  }
};

export const searchSongs = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return res.json([]);
    }

    const query = q.trim();
    const regex = new RegExp(query, 'i');
    const userId = req.user ? String(req.user._id || req.user.id) : null;

    let userLikedTitles = new Set();
    if (userId) {
      const likes = await Like.find({ userId }).select('songTitle').lean();
      userLikedTitles = new Set(likes.map((l) => l.songTitle.toLowerCase()));
    }

    const docs = await Song.find({
      $or: [
        { title: regex },
        { singers: regex },
        { artists: regex },
        { album: regex },
        { mood: regex },
        { moods: regex },
      ],
    })
      .limit(50)
      .sort({ createdAt: -1 });

    const result = docs.map((doc) =>
      doc.toNormalized(userLikedTitles.has(doc.title.toLowerCase()))
    );

    res.json(result);
  } catch (err) {
    next(err);
  }
};

export const getRecommendations = async (req, res, next) => {
  try {
    const { mood, time } = req.query;
    const userId = req.user ? String(req.user._id || req.user.id) : null;

    let userLikedTitles = new Set();
    if (userId) {
      const likes = await Like.find({ userId }).select('songTitle').lean();
      userLikedTitles = new Set(likes.map((l) => l.songTitle.toLowerCase()));
    }

    const query = {};
    if (mood && mood !== 'None' && mood !== 'All') {
      const regexMood = new RegExp(`^${mood}$`, 'i');
      query.$or = [{ mood: regexMood }, { moods: regexMood }];
    }

    let docs = await Song.find(query).limit(100);

    // Filter by time window if no explicit mood chosen
    if (!mood || mood === 'None' || mood === 'All') {
      const timeFiltered = docs.filter((s) => calculateDifference(s.timeStamp, time));
      if (timeFiltered.length > 0) {
        docs = timeFiltered;
      }
    }

    if (docs.length === 0) {
      docs = await Song.find().limit(30);
    }

    const result = docs.slice(0, 40).map((doc) =>
      doc.toNormalized(userLikedTitles.has(doc.title.toLowerCase()))
    );

    res.json({
      success: true,
      count: result.length,
      songs: result,
    });
  } catch (err) {
    next(err);
  }
};

export const toggleLike = async (req, res, next) => {
  try {
    const { title, songId } = req.body;
    const userId = req.user ? String(req.user._id || req.user.id) : 'guest_listener';

    if (!title && !songId) {
      return res.status(400).json({
        success: false,
        message: 'Song title or songId is required to toggle like.',
      });
    }

    let targetSong = null;
    if (songId) {
      targetSong = await Song.findById(songId);
    } else if (title) {
      targetSong = await Song.findOne({
        title: new RegExp(`^${title.trim()}$`, 'i'),
      });
    }

    const songTitle = targetSong ? targetSong.title : title.trim();

    // Check if currently liked by this user in MongoDB
    const existingLike = await Like.findOne({
      userId,
      songTitle: new RegExp(`^${songTitle}$`, 'i'),
    });

    let nowLiked = false;
    if (existingLike) {
      // Remove like from MongoDB
      await Like.deleteOne({ _id: existingLike._id });
      if (req.user && req.user._id) {
        await User.findByIdAndUpdate(req.user._id, {
          $pull: { likedSongs: songTitle },
        });
      }
      nowLiked = false;
    } else {
      // Insert like into MongoDB
      await Like.create({
        userId,
        songTitle,
        songId: targetSong?._id || null,
      });
      if (req.user && req.user._id) {
        await User.findByIdAndUpdate(req.user._id, {
          $addToSet: { likedSongs: songTitle },
        });
      }
      nowLiked = true;
    }

    res.json({
      success: true,
      liked: nowLiked,
      title: songTitle,
      message: nowLiked
        ? `Added "${songTitle}" to liked songs in MongoDB.`
        : `Removed "${songTitle}" from liked songs in MongoDB.`,
    });
  } catch (err) {
    next(err);
  }
};

export const getLikedSongs = async (req, res, next) => {
  try {
    const userId = req.user ? String(req.user._id || req.user.id) : 'guest_listener';

    const likes = await Like.find({ userId }).select('songTitle').lean();
    const likedTitles = likes.map((l) => l.songTitle);

    const docs = await Song.find({
      $or: [
        { title: { $in: likedTitles.map((t) => new RegExp(`^${t}$`, 'i')) } },
        { liked: true },
      ],
    }).sort({ updatedAt: -1 });

    const normalized = docs.map((doc) => doc.toNormalized(true));

    res.json({
      success: true,
      count: normalized.length,
      songs: normalized,
    });
  } catch (err) {
    next(err);
  }
};

export const addSong = async (req, res, next) => {
  try {
    const { title, videoId, singers, artists, mood, moods, year, album, duration, language, thumbnail, timeStamp } =
      req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Song title is required.',
      });
    }

    const cleanTitle = title.trim();
    const existing = await Song.findOne({
      title: new RegExp(`^${cleanTitle}$`, 'i'),
    });

    if (existing) {
      return res.json({
        success: true,
        song: existing.toNormalized(false),
        message: 'Song already exists in MongoDB catalog.',
      });
    }

    const singerList = Array.isArray(singers)
      ? singers
      : Array.isArray(artists)
      ? artists
      : [singers || artists || 'Unknown Artist'];

    const moodList = Array.isArray(mood)
      ? mood
      : Array.isArray(moods)
      ? moods
      : [mood || moods || 'Flow'];

    let thumb = thumbnail;
    if (!thumb && videoId) {
      thumb = `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    }

    const newDoc = await Song.create({
      title: cleanTitle,
      videoId: videoId?.trim() || '',
      singers: singerList,
      artists: singerList,
      mood: moodList,
      moods: moodList,
      year: Number(year) || new Date().getFullYear(),
      album: album?.trim() || 'Single',
      duration: duration?.trim() || '3:30',
      language: language?.trim() || 'English',
      thumbnail: thumb || `https://picsum.photos/seed/${encodeURIComponent(cleanTitle)}/400/400`,
      timeStamp: timeStamp || '8:00 PM',
      liked: false,
    });

    res.status(201).json({
      success: true,
      song: newDoc.toNormalized(false),
      message: 'Song added successfully to MongoDB collection!',
    });
  } catch (err) {
    next(err);
  }
};
