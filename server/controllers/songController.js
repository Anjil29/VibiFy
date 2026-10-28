import db from '../utils/db.js';
import { calculateDifference } from '../utils/timeUtils.js';

export const getAllSongs = (req, res, next) => {
  try {
    const { mood, language, search, page, limit, all } = req.query;
    const userId = req.user?.id || 'guest_listener';

    // Retrieve user liked titles set
    const userLikes = new Set(
      db.likes
        .findAll((like) => like.userId === userId)
        .map((like) => like.songTitle?.toLowerCase())
    );

    let songs = db.songs.findAll();

    // Filter by mood
    if (mood && mood !== 'All' && mood !== 'None') {
      songs = songs.filter((s) => s.mood && s.mood.includes(mood));
    }

    // Filter by language
    if (language && language !== 'All') {
      songs = songs.filter((s) => s.language?.toLowerCase() === language.toLowerCase());
    }

    // Filter by search term
    if (search && search.trim()) {
      const q = search.toLowerCase().trim();
      songs = songs.filter(
        (s) =>
          s.title.toLowerCase().includes(q) ||
          s.singers?.some((singer) => singer.toLowerCase().includes(q)) ||
          s.album?.toLowerCase().includes(q)
      );
    }

    // Map personal liked status
    const mappedSongs = songs.map((s) => ({
      ...s,
      liked: userLikes.has(s.title?.toLowerCase()) || Boolean(s.liked),
    }));

    // If client requested unpaginated array (or frontend songService expectations)
    if (all === 'true' || (!page && !limit)) {
      return res.json(mappedSongs);
    }

    // Paginated response
    const currentPage = parseInt(page, 10) || 1;
    const itemsPerPage = parseInt(limit, 10) || 50;
    const total = mappedSongs.length;
    const totalPages = Math.ceil(total / itemsPerPage);
    const startIndex = (currentPage - 1) * itemsPerPage;
    const paginated = mappedSongs.slice(startIndex, startIndex + itemsPerPage);

    res.json({
      success: true,
      total,
      page: currentPage,
      totalPages,
      songs: paginated,
    });
  } catch (err) {
    next(err);
  }
};

export const searchSongs = (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || !q.trim()) {
      return res.json([]);
    }

    const query = q.toLowerCase().trim();
    const userId = req.user?.id || 'guest_listener';
    const userLikes = new Set(
      db.likes
        .findAll((like) => like.userId === userId)
        .map((like) => like.songTitle?.toLowerCase())
    );

    const matches = db.songs
      .findAll((s) =>
        s.title?.toLowerCase().includes(query) ||
        s.singers?.some((singer) => singer.toLowerCase().includes(query)) ||
        s.album?.toLowerCase().includes(query) ||
        s.mood?.some((m) => m.toLowerCase().includes(query))
      )
      .slice(0, 50)
      .map((s) => ({
        ...s,
        liked: userLikes.has(s.title?.toLowerCase()) || Boolean(s.liked),
      }));

    res.json(matches);
  } catch (err) {
    next(err);
  }
};

export const getRecommendations = (req, res, next) => {
  try {
    const { mood, time } = req.query;
    const userId = req.user?.id || 'guest_listener';
    const userLikes = new Set(
      db.likes
        .findAll((like) => like.userId === userId)
        .map((like) => like.songTitle?.toLowerCase())
    );

    let candidates = db.songs.findAll();

    if (mood && mood !== 'None' && mood !== 'All') {
      candidates = candidates.filter((s) => s.mood && s.mood.includes(mood));
    } else {
      candidates = candidates.filter((s) => calculateDifference(s.timeStamp, time));
    }

    if (candidates.length === 0) {
      candidates = db.songs.findAll().slice(0, 30);
    }

    const result = candidates.slice(0, 40).map((s) => ({
      ...s,
      liked: userLikes.has(s.title?.toLowerCase()) || Boolean(s.liked),
    }));

    res.json({
      success: true,
      count: result.length,
      songs: result,
    });
  } catch (err) {
    next(err);
  }
};

export const toggleLike = (req, res, next) => {
  try {
    const { title, songId } = req.body;
    const userId = req.user?.id || 'guest_listener';

    if (!title && !songId) {
      return res.status(400).json({
        success: false,
        message: 'Song title or songId is required to toggle like.',
      });
    }

    let targetSong = null;
    if (songId) {
      targetSong = db.songs.findById(songId);
    } else if (title) {
      targetSong = db.songs.findOne(
        (s) => s.title?.toLowerCase() === title.toLowerCase().trim()
      );
    }

    const songTitle = targetSong ? targetSong.title : title.trim();

    // Check if currently liked by this user
    const existingLike = db.likes.findOne(
      (l) => l.userId === userId && l.songTitle?.toLowerCase() === songTitle.toLowerCase()
    );

    let nowLiked = false;
    if (existingLike) {
      // Remove like
      db.likes.delete((l) => l.id === existingLike.id);
      nowLiked = false;
    } else {
      // Add like
      db.likes.insert({
        userId,
        songTitle,
        songId: targetSong?.id || null,
        likedAt: new Date().toISOString(),
      });
      nowLiked = true;
    }

    // Also update global liked status on the song if user is default demo
    if (targetSong) {
      db.songs.update((s) => s.id === targetSong.id, { liked: nowLiked });
    }

    res.json({
      success: true,
      liked: nowLiked,
      title: songTitle,
      message: nowLiked ? `Added "${songTitle}" to liked songs.` : `Removed "${songTitle}" from liked songs.`,
    });
  } catch (err) {
    next(err);
  }
};

export const getLikedSongs = (req, res, next) => {
  try {
    const userId = req.user?.id || 'guest_listener';

    const userLikedTitles = new Set(
      db.likes
        .findAll((like) => like.userId === userId)
        .map((like) => like.songTitle?.toLowerCase())
    );

    const likedSongs = db.songs
      .findAll((s) => userLikesHas(userLikedTitles, s))
      .map((s) => ({ ...s, liked: true }));

    res.json({
      success: true,
      count: likedSongs.length,
      songs: likedSongs,
    });
  } catch (err) {
    next(err);
  }
};

function userLikesHas(likedTitlesSet, song) {
  return likedTitlesSet.has(song.title?.toLowerCase()) || Boolean(song.liked);
}

export const addSong = (req, res, next) => {
  try {
    const { title, singers, mood, year, album, duration, language, thumbnail, timeStamp } = req.body;

    if (!title) {
      return res.status(400).json({
        success: false,
        message: 'Song title is required.',
      });
    }

    const existing = db.songs.findOne(
      (s) => s.title.toLowerCase() === title.toLowerCase().trim()
    );

    if (existing) {
      return res.json({
        success: true,
        song: existing,
        message: 'Song already exists in catalog.',
      });
    }

    const newSong = db.songs.insert({
      title: title.trim(),
      singers: Array.isArray(singers) ? singers : [singers || 'Unknown'],
      mood: Array.isArray(mood) ? mood : [mood || 'Flow'],
      year: Number(year) || new Date().getFullYear(),
      album: album?.trim() || 'Single',
      duration: duration?.trim() || '3:30',
      language: language?.trim() || 'English',
      thumbnail: thumbnail || `https://picsum.photos/seed/${encodeURIComponent(title)}/400/400`,
      timeStamp: timeStamp || '8:00 PM',
      liked: false,
    });

    res.status(201).json({
      success: true,
      song: newSong,
      message: 'Song added successfully to database.',
    });
  } catch (err) {
    next(err);
  }
};

