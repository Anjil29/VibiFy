import React, { useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ALL_MOODS } from '../../data/categories';
import { selectActiveMood, setActiveMood } from '../../store/slices/songSlice';

export const MoodSection = ({ className = '' }) => {
  const dispatch = useDispatch();
  const activeMood = useSelector(selectActiveMood);
  const scrollContainerRef = useRef(null);

  const handleScroll = (direction) => {
    if (scrollContainerRef.current) {
      const scrollAmount = direction === 'left' ? -300 : 300;
      scrollContainerRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const handleMoodSelect = (moodId) => {
    dispatch(setActiveMood(moodId));
  };

  return (
    <div className={`relative w-full ${className}`}>
      <div className="flex items-center justify-between mb-3 px-1">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span>Match Your Mood</span>
            {activeMood !== 'None' && (
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                Filtered: {activeMood}
              </span>
            )}
          </h2>
          <p className="text-xs text-slate-400">Tap a vibe to tune your personalized music feed</p>
        </div>

        {/* Carousel Arrow Controls */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={() => handleScroll('left')}
            aria-label="Scroll moods left"
            className="w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            aria-label="Scroll moods right"
            className="w-8 h-8 rounded-full bg-slate-900/80 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white flex items-center justify-center transition-colors cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mood Items Scroll Area */}
      <div
        ref={scrollContainerRef}
        className="flex items-center gap-4 overflow-x-auto pb-3 pt-1 scrollbar-none no-scrollbar"
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
      >
        {ALL_MOODS.map((mood) => {
          const isSelected = activeMood === mood.id;
          return (
            <button
              key={mood.id}
              onClick={() => handleMoodSelect(mood.id)}
              className={`group flex flex-col items-center gap-2 shrink-0 transition-all cursor-pointer ${
                isSelected ? 'scale-105' : 'hover:scale-105 opacity-85 hover:opacity-100'
              }`}
            >
              <div
                className={`relative w-20 h-20 rounded-full overflow-hidden p-0.5 transition-all duration-300 ${
                  isSelected
                    ? 'ring-4 ring-emerald-400 shadow-lg shadow-emerald-500/30'
                    : 'border-2 border-slate-700 group-hover:border-emerald-400/60'
                }`}
              >
                <img
                  src={mood.image}
                  alt={mood.label}
                  className="w-full h-full object-cover rounded-full"
                  onError={(e) => {
                    e.currentTarget.src = `https://picsum.photos/seed/${mood.id}/200/200`;
                  }}
                />
                <div
                  className={`absolute inset-0 rounded-full transition-opacity ${
                    isSelected ? 'bg-emerald-500/20' : 'bg-black/20 group-hover:bg-transparent'
                  }`}
                />
              </div>

              <span
                className={`text-xs font-medium tracking-wide transition-colors ${
                  isSelected ? 'text-emerald-400 font-semibold' : 'text-slate-300 group-hover:text-white'
                }`}
              >
                {mood.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default MoodSection;

