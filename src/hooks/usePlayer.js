import { useDispatch, useSelector } from 'react-redux';
import {
  setCurrentSong,
  setIsPlaying,
  togglePlay,
  setQueue,
  selectCurrentSong,
  selectIsPlaying,
} from '../store/slices/playerSlice';
import { toggleLike, selectLikedSongs } from '../store/slices/songSlice';
import { showToast } from '../store/slices/uiSlice';

export function usePlayer() {
  const dispatch = useDispatch();
  const currentSong = useSelector(selectCurrentSong);
  const isPlaying = useSelector(selectIsPlaying);
  const likedSongs = useSelector(selectLikedSongs);

  const isCurrentSongLiked = Boolean(
    currentSong && likedSongs.some((s) => s.title.toLowerCase() === currentSong.title.toLowerCase())
  );

  const playSong = (song, queue = null) => {
    if (!song) return;
    dispatch(setCurrentSong(song));
    if (queue && Array.isArray(queue)) {
      dispatch(setQueue(queue));
    }
  };

  const handleToggleLike = (song) => {
    const targetSong = song || currentSong;
    if (!targetSong) return;

    const isLiked = likedSongs.some((s) => s.title.toLowerCase() === targetSong.title.toLowerCase());
    dispatch(toggleLike(targetSong));
    dispatch(
      showToast({
        message: isLiked
          ? `Removed "${targetSong.title}" from Liked Songs`
          : `Added "${targetSong.title}" to Liked Songs ❤️`,
        type: isLiked ? 'info' : 'success',
      })
    );
  };

  return {
    currentSong,
    isPlaying,
    isCurrentSongLiked,
    playSong,
    togglePlay: () => dispatch(togglePlay()),
    pause: () => dispatch(setIsPlaying(false)),
    play: () => dispatch(setIsPlaying(true)),
    toggleLikeSong: handleToggleLike,
  };
}

export default usePlayer;

