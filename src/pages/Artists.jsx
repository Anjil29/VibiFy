import React, { useState, useMemo } from 'react';
import { useSelector } from 'react-redux';
import { selectAllSongs } from '../store/slices/songSlice';
import ArtistCard from '../components/music/ArtistCard';
import Pagination from '../components/common/Pagination';
import { Mic2, Search, ArrowLeft } from 'lucide-react';
import SongCard from '../components/music/SongCard';

export const Artists = () => {
  const songs = useSelector(selectAllSongs);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(0);
  const [selectedArtist, setSelectedArtist] = useState(null);
  const artistsPerPage = 24;

  // Ultra-fast O(N) map aggregation using useMemo
  const allArtists = useMemo(() => {
    const artistMap = new Map();

    for (const song of songs) {
      if (!song.singers) continue;
      const singersList = Array.isArray(song.singers) ? song.singers : [song.singers];

      for (const singer of singersList) {
        const cleanName = singer?.trim();
        if (!cleanName) continue;

        if (artistMap.has(cleanName)) {
          artistMap.get(cleanName).count += 1;
        } else {
          artistMap.set(cleanName, {
            singer: cleanName,
            count: 1,
            thumbnail: song.thumbnail,
          });
        }
      }
    }

    return Array.from(artistMap.values()).sort((a, b) => b.count - a.count);
  }, [songs]);

  // Filtered by search
  const filteredArtists = useMemo(() => {
    if (!search.trim()) return allArtists;
    const lower = search.toLowerCase().trim();
    return allArtists.filter((a) => a.singer.toLowerCase().includes(lower));
  }, [allArtists, search]);

  const totalPages = Math.ceil(filteredArtists.length / artistsPerPage);
  const paginatedArtists = useMemo(() => {
    const start = page * artistsPerPage;
    return filteredArtists.slice(start, start + artistsPerPage);
  }, [filteredArtists, page, artistsPerPage]);

  // Songs by selected artist
  const artistSongs = useMemo(() => {
    if (!selectedArtist) return [];
    return songs.filter((s) =>
      s.singers?.some((singer) => singer.toLowerCase() === selectedArtist.singer.toLowerCase())
    );
  }, [songs, selectedArtist]);

  return (
    <div className="flex flex-col gap-6 animate-fade-in text-left">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span>Artists Directory</span>
            <Mic2 className="w-6 h-6 text-emerald-400" />
          </h1>
          <p className="text-xs md:text-sm text-slate-400 mt-1">
            Explore {allArtists.length} vocalists and performers in your catalog.
          </p>
        </div>

        {/* Search */}
        {!selectedArtist && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              placeholder="Search artists..."
              className="bg-slate-900 border border-slate-800 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-400"
            />
          </div>
        )}
      </div>

      {/* Selected Artist Drill-down View */}
      {selectedArtist ? (
        <div className="flex flex-col gap-6">
          <button
            onClick={() => setSelectedArtist(null)}
            className="inline-flex items-center gap-2 text-xs font-semibold text-emerald-400 hover:text-emerald-300 w-fit cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to all artists</span>
          </button>

          <div className="flex items-center gap-5 p-6 rounded-3xl bg-slate-900/40 border border-slate-800">
            <img
              src={selectedArtist.thumbnail}
              alt={selectedArtist.singer}
              className="w-20 h-20 rounded-full object-cover border-2 border-emerald-400 shadow-xl"
            />
            <div>
              <h2 className="text-2xl font-bold text-white">{selectedArtist.singer}</h2>
              <p className="text-xs text-slate-400 mt-1">
                {artistSongs.length} {artistSongs.length === 1 ? 'track' : 'tracks'} available
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {artistSongs.map((song, i) => (
              <SongCard key={`${song.title}-${i}`} song={song} queue={artistSongs} />
            ))}
          </div>
        </div>
      ) : (
        /* Artists Grid */
        <>
          {paginatedArtists.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {paginatedArtists.map((artist, i) => (
                <ArtistCard
                  key={`${artist.singer}-${i}`}
                  artist={artist}
                  onClick={() => setSelectedArtist(artist)}
                />
              ))}
            </div>
          ) : (
            <div className="p-16 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400">
              <p className="text-base font-semibold text-slate-300">No artists match "{search}"</p>
              <p className="text-xs text-slate-500 mt-1">Check spelling or search another artist.</p>
            </div>
          )}

          <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
        </>
      )}
    </div>
  );
};

export default Artists;

