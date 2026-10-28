import React from 'react';
import { Mic2 } from 'lucide-react';

export const ArtistCard = ({ artist, onClick, className = '' }) => {
  if (!artist) return null;

  const name = artist.singer || artist.name || 'Artist';
  const subtitle = artist.genre || (artist.count ? `${artist.count} Tracks` : 'Artist');
  const image = artist.thumbnail || '/images/info.png';

  return (
    <div
      onClick={onClick}
      className={`group flex flex-col items-center p-4 rounded-2xl bg-slate-900/40 hover:bg-slate-800/70 border border-slate-800/80 hover:border-emerald-500/30 transition-all duration-300 cursor-pointer shadow-lg hover:-translate-y-1.5 ${className}`}
    >
      <div className="relative w-28 h-28 rounded-full overflow-hidden mb-3 bg-slate-950 border-2 border-slate-800 group-hover:border-emerald-400 shadow-xl transition-all">
        {artist.thumbnail ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900 text-emerald-400">
            <Mic2 className="w-10 h-10" />
          </div>
        )}
      </div>

      <h4 className="text-sm font-semibold text-white group-hover:text-emerald-300 text-center truncate max-w-full">
        {name}
      </h4>
      <p className="text-xs text-slate-400 text-center truncate max-w-full mt-0.5">
        {subtitle}
      </p>
    </div>
  );
};

export default ArtistCard;

