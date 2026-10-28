import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { LogOut, User as UserIcon } from 'lucide-react';
import SearchBar from '../common/SearchBar';
import { logoutUser, selectAuthUser } from '../../store/slices/authSlice';
import { showToast } from '../../store/slices/uiSlice';

export const Navbar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector(selectAuthUser);

  const handleLogout = () => {
    dispatch(logoutUser());
    dispatch(showToast({ message: 'Logged out successfully', type: 'info' }));
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-slate-950/80 backdrop-blur-xl border-b border-slate-800/80 px-4 md:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/home" className="flex items-center gap-2.5 shrink-0 group">
          <img
            src="/images/logo.png"
            alt="Vibify Logo"
            className="h-10 w-auto object-contain transition-transform group-hover:scale-105"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <span className="text-xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 via-teal-300 to-sky-400 bg-clip-text text-transparent">
            Vibify
          </span>
        </Link>

        {/* Global Search Bar */}
        <div className="flex-1 max-w-xl mx-auto hidden sm:block">
          <SearchBar />
        </div>

        {/* User Session & Logout */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden md:flex items-center gap-2.5 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 text-slate-300 text-xs">
            <div className="w-6 h-6 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold">
              {user?.name ? user.name.charAt(0).toUpperCase() : <UserIcon className="w-3.5 h-3.5" />}
            </div>
            <span className="font-medium max-w-[120px] truncate">
              {user?.name || user?.email || 'Listener'}
            </span>
          </div>

          <button
            onClick={handleLogout}
            title="Log out"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 text-xs font-semibold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Search Bar Row */}
      <div className="mt-2 sm:hidden">
        <SearchBar />
      </div>
    </header>
  );
};

export default Navbar;

