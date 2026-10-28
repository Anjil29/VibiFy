import React from 'react';
import { useSelector } from 'react-redux';
import { Sparkles, Play } from 'lucide-react';
import MoodSection from '../components/music/MoodSection';
import SongCard from '../components/music/SongCard';
import { selectRecommendedSongs, selectActiveMood } from '../store/slices/songSlice';
import { usePlayer } from '../hooks/usePlayer';

export const Home = () => {
  const recommendedSongs = useSelector(selectRecommendedSongs);
  const activeMood = useSelector(selectActiveMood);
  const { playSong } = usePlayer();

  const handlePlayAll = () => {
    if (recommendedSongs.length > 0) {
      playSong(recommendedSongs[0], recommendedSongs);
    }
  };

  return (
    <div className="flex flex-col gap-8 animate-fade-in text-left">
      {/* Hero Banner */}
      <section className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-emerald-900/30 via-slate-900/80 to-slate-950 p-6 md:p-10 border border-slate-800/80 shadow-2xl">
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none" />
        
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-semibold uppercase tracking-wider mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Adaptive Vibe Engine
          </span>

          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white leading-tight">
            Your vibes, your tunes — let music match your mood.
          </h1>

          <p className="mt-3 text-sm md:text-base text-slate-300 font-light leading-relaxed">
            An infinite personalized mix synced to your time of day, active vibes, and listening taste.
          </p>

          <div className="mt-6 flex items-center gap-3">
            <button
              onClick={handlePlayAll}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm shadow-xl shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
              <span>Play Vibe Mix</span>
            </button>
            <span className="text-xs text-slate-400">
              {recommendedSongs.length} curated tracks ready
            </span>
          </div>
        </div>
      </section>

      {/* Mood Section Carousel */}
      <section>
        <MoodSection />
      </section>

      {/* Recommended Songs Grid */}
      <section className="mt-2">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-white tracking-tight">
              {activeMood !== 'None' ? `${activeMood} Vibes` : 'Recommended For You'}
            </h2>
            <p className="text-xs text-slate-400">
              {activeMood !== 'None'
                ? `Handpicked tracks categorized under "${activeMood}"`
                : 'Songs matching your current local vibe and time window'}
            </p>
          </div>

          <span className="text-xs font-mono text-slate-400 bg-slate-900 px-3 py-1.5 rounded-lg border border-slate-800">
            {recommendedSongs.length} songs
          </span>
        </div>

        {recommendedSongs.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {recommendedSongs.map((song, i) => (
              <SongCard key={`${song.title}-${i}`} song={song} queue={recommendedSongs} />
            ))}
          </div>
        ) : (
          <div className="p-12 text-center rounded-2xl bg-slate-900/40 border border-slate-800 text-slate-400">
            <p className="text-base font-medium text-slate-300">No songs found for this mood filter.</p>
            <p className="text-xs text-slate-500 mt-1">Try selecting another vibe above or search for a song.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;

