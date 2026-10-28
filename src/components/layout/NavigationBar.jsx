import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Library, Compass, Heart, Mic2, Globe } from 'lucide-react';
import { useSelector } from 'react-redux';
import { selectLikedSongs } from '../../store/slices/songSlice';

export const NavigationBar = () => {
  const likedSongs = useSelector(selectLikedSongs);

  const navItems = [
    { to: '/home', label: 'Home', icon: Home, end: true },
    { to: '/library', label: 'Library', icon: Library },
    { to: '/explore', label: 'Explore', icon: Compass },
    { 
      to: '/liked-songs', 
      label: 'Liked Songs', 
      icon: Heart, 
      badge: likedSongs.length > 0 ? likedSongs.length : null 
    },
    { to: '/artists', label: 'Artists', icon: Mic2 },
    { to: '/languages', label: 'Languages', icon: Globe },
  ];

  return (
    <nav className="w-full bg-slate-950/60 backdrop-blur-md border-b border-slate-800/60 px-4 md:px-8 py-2.5 overflow-x-auto scrollbar-none">
      <div className="max-w-7xl mx-auto flex items-center justify-start md:justify-center gap-2 md:gap-4 min-w-max">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.to}
              to={item.to}
              end={item.end}
              className={({ isActive }) =>
                `flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs md:text-sm font-medium transition-all duration-200 select-none ${
                  isActive
                    ? 'bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 shadow-sm shadow-emerald-500/10'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 border border-transparent'
                }`
              }
            >
              <Icon className="w-4 h-4 shrink-0" />
              <span>{item.label}</span>
              {item.badge !== null && (
                <span className="ml-1 text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/30">
                  {item.badge}
                </span>
              )}
            </NavLink>
          );
        })}
      </div>
    </nav>
  );
};

export default NavigationBar;

