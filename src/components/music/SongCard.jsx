import React from 'react';
import { Play, Pause, Heart } from 'lucide-react';
import { usePlayer } from '../../hooks/usePlayer';
import { useSelector } from 'react-redux';
import { selectLikedSongs } from '../../store/slices/songSlice';

export const SongCard = ({ song, queue = null, className = '' }) => {
  const { currentSong, isPlaying, playSong, togglePlay, toggleLikeSong } = usePlayer();
  const likedSongs = useSelector(selectLikedSongs);

  if (!song) return null;

  const isCurrent = currentSong?.title?.toLowerCase() === song.title?.toLowerCase();
  const isPlayingThis = isCurrent && isPlaying;
  const isLiked = likedSongs.some((s) => s.title?.toLowerCase() === song.title?.toLowerCase());

  const handleCardClick = () => {
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
      onClick={handleCardClick}
      className={`group relative flex flex-col p-3.5 rounded-2xl bg-slate-900/40 hover:bg-slate-800/70 border border-slate-800/80 hover:border-emerald-500/30 transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1.5 ${
        isCurrent ? 'ring-1 ring-emerald-500/50 bg-slate-800/80' : ''
      } ${className}`}
    >
      {/* Thumbnail Container */}
      <div className="relative aspect-square w-full rounded-xl overflow-hidden bg-slate-950 mb-3 shadow-md">
        <img
          src={song.thumbnail || 'https://picsum.photos/seed/song/300/300'}
          alt={song.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />

        {/* Overlay with Play Button */}
        <div
          className={`absolute inset-0 bg-slate-950/40 backdrop-blur-[2px] flex items-center justify-center transition-opacity duration-300 ${
            isPlayingThis ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'
          }`}
        >
          <div className="w-12 h-12 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center shadow-xl shadow-emerald-500/40 group-hover:scale-110 active:scale-95 transition-all">
            {isPlayingThis ? (
              <Pause className="w-5 h-5 fill-slate-950" />
            ) : (
              <Play className="w-5 h-5 fill-slate-950 ml-0.5" />
            )}
          </div>
        </div>

        {/* Heart Icon Button */}
        <button
          onClick={handleLikeClick}
          aria-label={isLiked ? 'Unlike song' : 'Like song'}
          className={`absolute top-2.5 right-2.5 w-8 h-8 rounded-full backdrop-blur-md flex items-center justify-center transition-all ${
            isLiked
              ? 'bg-rose-500/20 text-rose-500'
              : 'bg-black/40 text-white/70 hover:text-white opacity-0 group-hover:opacity-100'
          }`}
        >
          <Heart className={`w-4 h-4 ${isLiked ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Time Stamp / Mood Badge */}
        {song.mood && song.mood[0] && (
          <span className="absolute bottom-2 left-2 text-[10px] font-semibold px-2 py-0.5 rounded-md bg-slate-900/80 text-emerald-300 backdrop-blur-md border border-slate-700/50">
            {song.mood[0]}
          </span>
        )}
      </div>

      {/* Title & Artist */}
      <div className="text-left">
        <h3
          className={`text-sm font-semibold truncate transition-colors ${
            isCurrent ? 'text-emerald-400' : 'text-white group-hover:text-emerald-300'
          }`}
        >
          {song.title}
        </h3>
        <p className="text-xs text-slate-400 truncate mt-0.5">
          {Array.isArray(song.singers) ? song.singers.join(', ') : song.singers || 'Unknown Artist'}
        </p>
      </div>
    </div>
  );
};

export default SongCard;

