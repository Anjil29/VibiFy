import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const Pagination = ({
  currentPage,
  totalPages,
  onPageChange,
  className = '',
}) => {
  if (totalPages <= 1) return null;

  return (
    <div className={`flex items-center justify-center gap-3 my-8 select-none ${className}`}>
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage <= 0}
        aria-label="Previous Page"
        className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 text-slate-200 disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 cursor-pointer"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>

      <div className="flex items-center px-4 py-2 rounded-xl bg-slate-900/70 border border-slate-800 text-sm font-medium text-slate-300">
        <span className="text-emerald-400 font-semibold">{currentPage + 1}</span>
        <span className="mx-2 text-slate-600">/</span>
        <span>{totalPages}</span>
      </div>

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage >= totalPages - 1}
        aria-label="Next Page"
        className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700/50 text-slate-200 disabled:opacity-30 disabled:pointer-events-none transition-all duration-200 cursor-pointer"
      >
        <ChevronRight className="w-5 h-5" />
      </button>
    </div>
  );
};

export default Pagination;

