import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectAllSongs } from '../store/slices/songSlice';
import SongCard from '../components/music/SongCard';
import SongRow from '../components/music/SongRow';
import Pagination from '../components/common/Pagination';
import { LayoutGrid, List, Search } from 'lucide-react';

export const Library = () => {
  const songs = useSelector(selectAllSongs);
  const [filterQuery, setFilterQuery] = useState('');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'list'
  const [page, setPage] = useState(0);
  const songsPerPage = 18;

  const filteredSongs = useMemo(() => {
    if (!filterQuery.trim()) return songs;
    const lower = filterQuery.toLowerCase().trim();
    return songs.filter(
      (s) =>
        s.title.toLowerCase().includes(lower) ||
        s.singers?.some((singer) => singer.toLowerCase().includes(lower)) ||
        s.album?.toLowerCase().includes(lower) ||
        s.language?.toLowerCase().includes(lower)
    );
  }, [songs, filterQuery]);

  const totalPages = Math.ceil(filteredSongs.length / songsPerPage);
  const paginatedSongs = useMemo(() => {
    const start = page * songsPerPage;
    return filteredSongs.slice(start, start + songsPerPage);
  }, [filteredSongs, page, songsPerPage]);

  const handleSearchChange = (e) => {
    setFilterQuery(e.target.value);
    setPage(0);
  };

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-left">
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight">Your Library</h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Browse through your entire music collection of {songs.length} tracks.
          </p>
        </div>

        {/* View Toggle & Search */}
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={filterQuery}
              onChange={handleSearchChange}
              placeholder="Filter library..."
              className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="flex items-center p-1 rounded-xl bg-slate-900 border border-slate-800">
            <button
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'grid' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              aria-label="List view"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-emerald-500/20 text-emerald-400' : 'text-slate-400 hover:text-white'
              }`}
            >
              <List className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Songs Display */}
      {paginatedSongs.length > 0 ? (
        viewMode === 'grid' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {paginatedSongs.map((song, i) => (
              <SongCard key={`${song.title}-${i}`} song={song} queue={paginatedSongs} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col divide-y divide-slate-800/40 rounded-2xl bg-slate-900/30 border border-slate-800/80 p-2">
            {paginatedSongs.map((song, i) => (
              <SongRow
                key={`${song.title}-${i}`}
                song={song}
                index={page * songsPerPage + i}
                queue={paginatedSongs}
              />
            ))}
          </div>
        )
      ) : (
        <div className="p-16 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400">
          <p className="text-base font-semibold text-slate-300">No songs match "{filterQuery}"</p>
          <p className="text-xs text-slate-500 mt-1">Try another title, singer, or keyword.</p>
        </div>
      )}

      {/* Pagination */}
      <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
    </div>
  );
};

export default Library;

