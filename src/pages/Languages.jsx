import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Globe } from 'lucide-react';
import { selectAllSongs } from '../store/slices/songSlice';
import { ALL_LANGUAGES } from '../data/categories';
import SongCard from '../components/music/SongCard';
import Pagination from '../components/common/Pagination';

export const Languages = () => {
  const songs = useSelector(selectAllSongs);
  const [activeLang, setActiveLang] = useState('English');
  const [page, setPage] = useState(0);
  const songsPerPage = 18;

  const filteredSongs = useMemo(() => {
    if (activeLang === 'All') return songs;
    return songs.filter(
      (s) => s.language?.toLowerCase() === activeLang.toLowerCase()
    );
  }, [songs, activeLang]);

  const totalPages = Math.ceil(filteredSongs.length / songsPerPage);
  const paginatedSongs = useMemo(() => {
    const start = page * songsPerPage;
    return filteredSongs.slice(start, start + songsPerPage);
  }, [filteredSongs, page, songsPerPage]);

  const handleLanguageChange = (lang) => {
    setActiveLang(lang);
    setPage(0);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-left">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span>Explore Languages</span>
          <Globe className="w-6 h-6 text-emerald-400" />
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          Immerse yourself in global rhythms across languages and regions.
        </p>
      </div>

      {/* Language Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {ALL_LANGUAGES.map((lang) => {
          const isSelected = activeLang === lang;
          return (
            <button
              key={lang}
              onClick={() => handleLanguageChange(lang)}
              className={`px-4 py-2 rounded-xl text-xs md:text-sm font-semibold transition-all shrink-0 cursor-pointer ${
                isSelected
                  ? 'bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/25 scale-105'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-800'
              }`}
            >
              {lang}
            </button>
          );
        })}
      </div>

      {/* Songs Grid */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-white">
            {activeLang} Tracks
          </h2>
          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            {filteredSongs.length} songs
          </span>
        </div>

        {paginatedSongs.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {paginatedSongs.map((song, i) => (
              <SongCard key={`${song.title}-${i}`} song={song} queue={filteredSongs} />
            ))}
          </div>
        ) : (
          <div className="p-16 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400">
            <p className="text-base font-semibold text-slate-300">
              No tracks found in {activeLang}.
            </p>
            <p className="text-xs text-slate-500 mt-1">Choose another language from the pills above.</p>
          </div>
        )}

        <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      </div>
    </div>
  );
};

export default Languages;

