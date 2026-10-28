import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import NavigationBar from './NavigationBar';
import MusicPlayer from './MusicPlayer';
import Footer from './Footer';
import Toast from '../common/Toast';

export const MainLayout = () => {
  return (
    <div className="min-h-screen flex flex-col bg-radial-[circle_at_top] from-slate-900 via-slate-950 to-slate-950 text-white selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Top Header */}
      <Navbar />

      {/* Main Navigation Links */}
      <NavigationBar />

      {/* Main Page Content Outlet */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 md:px-8 py-6 pb-36">
        <Outlet />
      </main>

      {/* Fixed Persistent Player */}
      <MusicPlayer />

      {/* Global Toast Notifications */}
      <Toast />

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default MainLayout;

