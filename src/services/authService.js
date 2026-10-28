/**
 * Authentication Service
 * Handles user authentication via backend or fallback local session.
 */

import api from './api';
import { storage } from '../utils/storage';

const MOCK_USER = {
  id: 'user_1',
  name: 'CodeBeats Listener',
  email: 'codeBeats@vibify.com',
  avatar: 'https://picsum.photos/seed/user/100/100',
};

export const authService = {
  /**
   * Log in user
   * @param {Object} credentials - { email, password }
   */
  async login({ email, password }) {
    try {
      // Attempt backend API call first
      const data = await api.post('/auth/login', { email, password });
      if (data.token) {
        storage.set(storage.KEYS.AUTH_TOKEN, data.token);
        storage.set(storage.KEYS.AUTH_USER, data.user);
        return data.user;
      }
    } catch {
      // Backend not running / unavailable: fallback to mock auth
      if (
        (email === 'codeBeats@vibify.com' && password === 'password123') ||
        (email && password && email.includes('@'))
      ) {
        const user = { ...MOCK_USER, email };
        storage.set(storage.KEYS.AUTH_TOKEN, 'mock_jwt_token_vibify');
        storage.set(storage.KEYS.AUTH_USER, user);
        return user;
      }
      throw new Error('Invalid email or password.');
    }
  },

  /**
   * Sign up new user
   * @param {Object} userData - { email, password, name, phone }
   */
  async signup(userData) {
    try {
      const data = await api.post('/auth/signup', userData);
      if (data.token) {
        storage.set(storage.KEYS.AUTH_TOKEN, data.token);
        storage.set(storage.KEYS.AUTH_USER, data.user);
        return data.user;
      }
    } catch {
      // Fallback mock registration
      const newUser = {
        id: `user_${Date.now()}`,
        name: userData.name || userData.email.split('@')[0],
        email: userData.email,
        avatar: 'https://picsum.photos/seed/user/100/100',
      };
      storage.set(storage.KEYS.AUTH_TOKEN, 'mock_jwt_token_vibify');
      storage.set(storage.KEYS.AUTH_USER, newUser);
      return newUser;
    }
  },

  /**
   * Log out current user
   */
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch {
      // ignore network errors on logout
    } finally {
      storage.remove(storage.KEYS.AUTH_TOKEN);
      storage.remove(storage.KEYS.AUTH_USER);
    }
  },

  /**
   * Retrieve current user from storage or backend
   */
  getCurrentUser() {
    return storage.get(storage.KEYS.AUTH_USER, null);
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return !!storage.get(storage.KEYS.AUTH_TOKEN, null);
  },
};

export default authService;

