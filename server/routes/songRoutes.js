import { Router } from 'express';
import {
  getAllSongs,
  searchSongs,
  getRecommendations,
  toggleLike,
  getLikedSongs,
  addSong,
} from '../controllers/songController.js';
import { optionalAuth } from '../middleware/authMiddleware.js';

const router = Router();

router.get('/', optionalAuth, getAllSongs);
router.get('/search', optionalAuth, searchSongs);
router.get('/recommendations', optionalAuth, getRecommendations);
router.get('/liked', optionalAuth, getLikedSongs);
router.post('/like', optionalAuth, toggleLike);
router.post('/', optionalAuth, addSong);

export default router;

