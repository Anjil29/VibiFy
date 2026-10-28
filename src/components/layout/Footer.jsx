import React from 'react';
import { Heart } from 'lucide-react';

export const Footer = () => {
  const members = [
    { name: 'Aditya Sharma', branch: 'CSE-A' },
    { name: 'Anjil Tripathi', branch: 'CSE-A' },
    { name: 'Amrita Kushwaha', branch: 'CSE-A' },
    { name: 'Arya Shree', branch: 'CSE-B' },
  ];

  return (
    <footer className="w-full bg-slate-950/90 border-t border-slate-900 py-10 px-6 mt-auto">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        {/* Brand */}
        <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">
              🎵 CodeBeats
            </span>
            <span className="text-xs px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-medium">
              Vibify 2.0
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
            Engineered with <Heart className="w-3 h-3 text-rose-500 fill-rose-500 inline" /> by the CodeBeats team
          </p>
        </div>

        {/* Team Members */}
        <div className="flex flex-col items-center md:items-end">
          <span className="text-[11px] font-semibold uppercase tracking-widest text-slate-400 mb-2">
            Project Creators
          </span>
          <div className="grid grid-cols-2 gap-x-6 gap-y-1.5 text-xs">
            {members.map((m, i) => (
              <div key={i} className="flex items-center gap-1.5 text-slate-300">
                <span className="font-medium text-slate-200">{m.name}</span>
                <span className="text-[10px] text-emerald-400/80 font-mono">({m.branch})</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

