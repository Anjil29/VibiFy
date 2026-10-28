import React, { useState, useRef, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Search, Sparkles, Loader2, Play } from 'lucide-react';
import { selectAllSongs, addSong } from '../../store/slices/songSlice';
import { usePlayer } from '../../hooks/usePlayer';
import { aiService } from '../../services/aiService';
import { showToast } from '../../store/slices/uiSlice';

export const SearchBar = ({ className = '' }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isFetchingAi, setIsFetchingAi] = useState(false);
  
  const searchRef = useRef(null);
  const songs = useSelector(selectAllSongs);
  const { playSong } = usePlayer();
  const dispatch = useDispatch();

  // Filter songs based on input
  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);

    if (!val.trim()) {
      setResults([]);
      setIsOpen(false);
      return;
    }

    const lower = val.toLowerCase().trim();
    const matched = songs
      .filter(
        (s) =>
          s.title.toLowerCase().includes(lower) ||
          s.singers?.some((singer) => singer.toLowerCase().includes(lower)) ||
          s.album?.toLowerCase().includes(lower)
      )
      .slice(0, 8);

    setResults(matched);
    setIsOpen(true);
  };

  // AI Discover handler
  const handleAiDiscover = async () => {
    if (!query.trim()) return;

    setIsFetchingAi(true);
    try {
      const newSong = await aiService.discoverSong(query.trim());
      dispatch(addSong(newSong));
      playSong(newSong);
      dispatch(
        showToast({
          message: `Discovered "${newSong.title}" via AI! 🎵`,
          type: 'success',
        })
      );
      setIsOpen(false);
      setQuery('');
    } catch (err) {
      dispatch(
        showToast({
          message: err.message || 'Failed to discover song with AI.',
          type: 'error',
        })
      );
    } finally {
      setIsFetchingAi(false);
    }
  };

  // Dismiss on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={searchRef} className={`relative w-full max-w-lg ${className}`}>
      <div className="relative flex items-center">
        <Search className="absolute left-4 w-4 h-4 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={query}
          onChange={handleInputChange}
          onFocus={() => query.trim() && setIsOpen(true)}
          placeholder="Search songs, artists, albums or vibes..."
          className="w-full bg-slate-900/70 border border-slate-700/60 rounded-full pl-11 pr-24 py-2.5 text-sm text-white placeholder-slate-400 focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400/40 backdrop-blur-xl transition-all shadow-inner"
        />

        <button
          onClick={handleAiDiscover}
          disabled={!query.trim() || isFetchingAi}
          title="Search or generate song with AI"
          className="absolute right-2.5 px-3 py-1.5 rounded-full bg-gradient-to-r from-emerald-500/20 to-teal-500/20 hover:from-emerald-500/30 hover:to-teal-500/30 text-emerald-300 border border-emerald-500/30 text-xs font-medium flex items-center gap-1.5 transition-all disabled:opacity-30 disabled:pointer-events-none"
        >
          {isFetchingAi ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
          )}
          <span>AI Search</span>
        </button>
      </div>

      {/* Dropdown Results */}
      {isOpen && (
        <div className="absolute left-0 right-0 mt-2 bg-slate-900/95 border border-slate-800 rounded-2xl shadow-2xl backdrop-blur-2xl z-50 overflow-hidden divide-y divide-slate-800/60 max-h-96 overflow-y-auto">
          {results.length > 0 ? (
            results.map((song, i) => (
              <div
                key={`${song.title}-${i}`}
                onClick={() => {
                  playSong(song);
                  setIsOpen(false);
                }}
                className="group flex items-center gap-3.5 p-3 hover:bg-emerald-500/10 cursor-pointer transition-colors"
              >
                <div className="relative w-11 h-11 rounded-lg overflow-hidden shrink-0 bg-slate-800">
                  <img
                    src={song.thumbnail}
                    alt={song.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <Play className="w-4 h-4 text-emerald-400 fill-emerald-400" />
                  </div>
                </div>
                <div className="flex-1 min-w-0 text-left">
                  <h4 className="text-sm font-medium text-white truncate group-hover:text-emerald-300">
                    {song.title}
                  </h4>
                  <p className="text-xs text-slate-400 truncate">
                    {song.singers?.join(', ')} {song.album && `• ${song.album}`}
                  </p>
                </div>
                {song.duration && (
                  <span className="text-xs text-slate-500 pr-2">{song.duration}</span>
                )}
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-sm text-slate-400">
              <p>No matching local tracks for "{query}"</p>
              <button
                onClick={handleAiDiscover}
                disabled={isFetchingAi}
                className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-semibold transition-all"
              >
                {isFetchingAi ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Sparkles className="w-4 h-4" />
                )}
                Ask AI to discover this song
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchBar;

