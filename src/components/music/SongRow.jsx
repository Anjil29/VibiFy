import React from 'react';
import { Play, Pause, Heart } from 'lucide-react';
import { usePlayer } from '../../hooks/usePlayer';
import { useSelector } from 'react-redux';
import { selectLikedSongs } from '../../store/slices/songSlice';

export const SongRow = ({ song, index, queue = null, className = '' }) => {
  const { currentSong, isPlaying, playSong, togglePlay, toggleLikeSong } = usePlayer();
  const likedSongs = useSelector(selectLikedSongs);

  if (!song) return null;

  const isCurrent = currentSong?.title?.toLowerCase() === song.title?.toLowerCase();
  const isPlayingThis = isCurrent && isPlaying;
  const isLiked = likedSongs.some((s) => s.title?.toLowerCase() === song.title?.toLowerCase());

  const handleRowClick = () => {
    if (isCurrent) {
      togglePlay();
    } else {
      playSong(song, queue);
    }
  };

  const handleLikeClick = (e) => {
    e.stopPropagation();
    toggleLikeSong(song);
  };

  return (
    <div
      onClick={handleRowClick}
      className={`group flex items-center justify-between px-4 py-2.5 rounded-xl transition-all duration-200 cursor-pointer select-none ${
        isCurrent
          ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
          : 'hover:bg-slate-800/60 text-slate-300 hover:text-white border border-transparent'
      } ${className}`}
    >
      {/* Left: Index / Play Icon + Thumbnail + Title/Artist */}
      <div className="flex items-center gap-4 min-w-0 flex-1">
        {/* Index or Play indicator */}
        <div className="w-6 text-center text-xs font-medium text-slate-500 shrink-0">
          <span className="group-hover:hidden">{index !== undefined ? index + 1 : ''}</span>
          <span className="hidden group-hover:block text-emerald-400">
            {isPlayingThis ? <Pause className="w-3.5 h-3.5 mx-auto" /> : <Play className="w-3.5 h-3.5 mx-auto" />}
          </span>
        </div>

        {/* Thumbnail */}
        <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-slate-900 border border-slate-800">
          <img
            src={song.thumbnail || 'https://picsum.photos/seed/thumb/100/100'}
            alt={song.title}
            loading="lazy"
            className="w-full h-full object-cover"
          />
        </div>

        {/* Title and Singers */}
        <div className="min-w-0 text-left">
          <h4
            className={`text-sm font-medium truncate ${
              isCurrent ? 'text-emerald-400' : 'text-white group-hover:text-emerald-300'
            }`}
          >
            {song.title}
          </h4>
          <p className="text-xs text-slate-400 truncate">
            {Array.isArray(song.singers) ? song.singers.join(', ') : song.singers || 'Unknown Artist'}
          </p>
        </div>
      </div>

      {/* Middle: Album & Year (hidden on mobile) */}
      <div className="hidden md:flex items-center gap-6 text-xs text-slate-400 mx-4 flex-1 truncate">
        {song.album && <span className="truncate">{song.album}</span>}
        {song.year && <span className="text-slate-500 shrink-0">{song.year}</span>}
      </div>

      {/* Right: Duration + Like Button */}
      <div className="flex items-center gap-4 shrink-0">
        <button
          onClick={handleLikeClick}
          aria-label={isLiked ? 'Unlike song' : 'Like song'}
          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition-colors"
        >
          <Heart
            className={`w-4 h-4 transition-transform active:scale-125 ${
              isLiked ? 'text-rose-500 fill-rose-500' : 'opacity-60 group-hover:opacity-100'
            }`}
          />
        </button>

        <span className="text-xs text-slate-400 w-10 text-right">
          {song.duration || '3:30'}
        </span>
      </div>
    </div>
  );
};

export default SongRow;

