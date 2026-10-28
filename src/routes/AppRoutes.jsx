import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { selectIsAuthenticated } from '../store/slices/authSlice';

import MainLayout from '../components/layout/MainLayout';
import Home from '../pages/Home';
import Library from '../pages/Library';
import Explore from '../pages/Explore';
import LikedSongs from '../pages/LikedSongs';
import Artists from '../pages/Artists';
import Languages from '../pages/Languages';
import Login from '../pages/Login';
import SignUp from '../pages/SignUp';
import NotFound from '../pages/NotFound';
import ProtectedRoute from './ProtectedRoute';

export const AppRoutes = () => {
  const isAuthenticated = useSelector(selectIsAuthenticated);

  return (
    <Routes>
      {/* Root redirect */}
      <Route
        path="/"
        element={
          isAuthenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
        }
      />

      {/* Public Auth Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<SignUp />} />

      {/* Protected App Routes */}
      <Route
        element={
          <ProtectedRoute>
            <MainLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/home" element={<Home />} />
        <Route path="/library" element={<Library />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/liked-songs" element={<LikedSongs />} />
        <Route path="/artists" element={<Artists />} />
        <Route path="/languages" element={<Languages />} />

        {/* Legacy route redirects for backward compatibility */}
        <Route path="/Home" element={<Navigate to="/home" replace />} />
        <Route path="/Home/*" element={<Navigate to="/home" replace />} />
        <Route path="/liked" element={<Navigate to="/liked-songs" replace />} />
        <Route path="/Liked_songs" element={<Navigate to="/liked-songs" replace />} />
        <Route path="/Liked_Songs" element={<Navigate to="/liked-songs" replace />} />
      </Route>

      {/* Catch-all 404 */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;

