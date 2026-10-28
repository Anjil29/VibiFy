import React from 'react';
import { Sparkles, TrendingUp, Mic2, Disc3 } from 'lucide-react';
import { EXPLORE_DATA } from '../data/categories';
import SongCard from '../components/music/SongCard';
import ArtistCard from '../components/music/ArtistCard';

export const Explore = () => {
  const { latestSongs, trendingSongs, trendingArtists, newAlbums } = EXPLORE_DATA;

  return (
    <div className="flex flex-col gap-10 animate-fade-in text-left">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
          <span>Explore New Sounds</span>
          <Sparkles className="w-5 h-5 text-emerald-400" />
        </h1>
        <p className="text-xs md:text-sm text-slate-400 mt-1">
          Stay on top of chart toppers, viral anthems, and breakout record drops.
        </p>
      </div>

      {/* Latest Releases Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-emerald-500/15 text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Fresh Releases</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {latestSongs.map((song) => (
            <SongCard key={song.id} song={song} queue={latestSongs} />
          ))}
        </div>
      </section>

      {/* Trending Right Now Section */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-sky-500/15 text-sky-400">
            <TrendingUp className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Trending Right Now</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {trendingSongs.map((song) => (
            <SongCard key={song.id} song={song} queue={trendingSongs} />
          ))}
        </div>
      </section>

      {/* Trending Artists */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-amber-500/15 text-amber-400">
            <Mic2 className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">Spotlight Artists</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {trendingArtists.map((artist) => (
            <ArtistCard key={artist.id} artist={artist} />
          ))}
        </div>
      </section>

      {/* New Albums & OSTs */}
      <section>
        <div className="flex items-center gap-2 mb-4">
          <div className="p-1.5 rounded-lg bg-purple-500/15 text-purple-400">
            <Disc3 className="w-4 h-4" />
          </div>
          <h2 className="text-xl font-bold text-white tracking-tight">New Albums & Soundtracks</h2>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {newAlbums.map((song) => (
            <SongCard key={song.id} song={song} queue={newAlbums} />
          ))}
        </div>
      </section>
    </div>
  );
};

export default Explore;

