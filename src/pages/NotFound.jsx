import React from 'react';
import { Link } from 'react-router-dom';
import { Home, Music2 } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center text-center p-6 text-white">
      <div className="w-20 h-20 rounded-3xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-emerald-400 mb-4 shadow-xl">
        <Music2 className="w-10 h-10" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight">404</h1>
      <p className="text-lg font-semibold text-slate-300 mt-2">Track Not Found</p>
      <p className="text-xs text-slate-500 max-w-sm mt-1">
        The page or playlist you are looking for has been moved or doesn't exist.
      </p>

      <Link
        to="/home"
        className="mt-6 inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs transition-all shadow-lg shadow-emerald-500/20"
      >
        <Home className="w-4 h-4" />
        <span>Return to Home</span>
      </Link>
    </div>
  );
};

export default NotFound;

