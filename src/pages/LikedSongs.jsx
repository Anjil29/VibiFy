import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Heart, Play, Music2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { selectLikedSongs } from '../store/slices/songSlice';
import SongRow from '../components/music/SongRow';
import Pagination from '../components/common/Pagination';
import { usePlayer } from '../hooks/usePlayer';

export const LikedSongs = () => {
  const likedSongs = useSelector(selectLikedSongs);
  const { playSong } = usePlayer();
  const [page, setPage] = useState(0);
  const songsPerPage = 20;

  const totalPages = Math.ceil(likedSongs.length / songsPerPage);
  const paginatedSongs = likedSongs.slice(page * songsPerPage, (page + 1) * songsPerPage);

  const handlePlayAll = () => {
    if (likedSongs.length > 0) {
      playSong(likedSongs[0], likedSongs);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-left">
      {/* Liked Songs Hero Header */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-rose-950/40 via-slate-900/80 to-slate-950 p-6 md:p-8 border border-rose-900/30 shadow-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="flex items-center gap-5">
          <div className="w-20 h-20 md:w-24 md:h-24 rounded-2xl bg-gradient-to-br from-rose-500 to-pink-600 flex items-center justify-center text-white shadow-xl shadow-rose-500/30 shrink-0">
            <Heart className="w-10 h-10 md:w-12 md:h-12 fill-white" />
          </div>

          <div>
            <span className="text-xs font-semibold uppercase tracking-wider text-rose-400">
              Playlist
            </span>
            <h1 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              Liked Songs
            </h1>
            <p className="text-xs md:text-sm text-slate-400 mt-1">
              {likedSongs.length} {likedSongs.length === 1 ? 'track' : 'tracks'} saved to your favorites
            </p>
          </div>
        </div>

        {likedSongs.length > 0 && (
          <button
            onClick={handlePlayAll}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
          >
            <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
            <span>Play All</span>
          </button>
        )}
      </div>

      {/* Track List */}
      {likedSongs.length > 0 ? (
        <div className="flex flex-col">
          <div className="flex flex-col divide-y divide-slate-800/40 rounded-2xl bg-slate-900/30 border border-slate-800/80 p-2">
            {paginatedSongs.map((song, i) => (
              <SongRow
                key={`${song.title}-${i}`}
                song={song}
                index={page * songsPerPage + i}
                queue={likedSongs}
              />
            ))}
          </div>

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </div>
      ) : (
        <div className="p-16 text-center rounded-3xl bg-slate-900/30 border border-slate-800/80 flex flex-col items-center justify-center gap-3">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 mb-2">
            <Music2 className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-white">Songs you like will appear here</h3>
          <p className="text-xs text-slate-400 max-w-sm">
            Save songs by tapping the heart icon in the player, feed, or library.
          </p>
          <Link
            to="/library"
            className="mt-4 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 text-xs font-bold transition-all"
          >
            Discover Music
          </Link>
        </div>
      )}
    </div>
  );
};

export default LikedSongs;

