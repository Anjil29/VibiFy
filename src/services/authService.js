/**
 * Authentication Service
 * Handles user authentication via backend API with robust local fallback.
 */

import api from './api';
import { storage } from '../utils/storage';

const DEFAULT_DEMO_USER = {
  id: 'user_demo_1',
  name: 'CodeBeats Listener',
  email: 'codebeats@vibify.com',
  phone: '+1 555-0199',
  avatar: 'https://picsum.photos/seed/codebeats/100/100',
  role: 'demo',
};

/**
 * Cleanly formats a display name from an email address or input
 * @param {string} email
 * @param {string} [explicitName]
 * @returns {string}
 */
export function formatDisplayName(email, explicitName = '') {
  if (explicitName && explicitName.trim()) {
    return explicitName.trim();
  }
  if (!email || typeof email !== 'string') {
    return 'Listener';
  }

  const clean = email.toLowerCase().trim();
  if (clean === 'codebeats@vibify.com') {
    return 'CodeBeats Listener';
  }

  // Handle phone-based mock emails (e.g. 9876543210@vibify.local)
  if (clean.endsWith('@vibify.local')) {
    const rawDigits = clean.split('@')[0];
    return `User ${rawDigits.slice(-4) || rawDigits}`;
  }

  const localPart = clean.split('@')[0];
  const parts = localPart
    .split(/[._\-+]+/)
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1));

  return parts.join(' ') || 'Listener';
}

/**
 * Retrieves the local directory of registered users
 * @returns {Array<Object>}
 */
function getLocalUsers() {
  return storage.get(storage.KEYS.REGISTERED_USERS, [DEFAULT_DEMO_USER]);
}

/**
 * Persists a user profile into the local user directory
 * @param {Object} user
 */
function saveLocalUser(user) {
  if (!user || !user.email) return;
  const users = getLocalUsers();
  const cleanEmail = user.email.toLowerCase().trim();
  const existingIdx = users.findIndex(
    (u) => u.email?.toLowerCase().trim() === cleanEmail
  );

  if (existingIdx !== -1) {
    users[existingIdx] = { ...users[existingIdx], ...user };
  } else {
    users.unshift(user);
  }
  storage.set(storage.KEYS.REGISTERED_USERS, users);
}

export const authService = {
  /**
   * Log in user
   * @param {Object} credentials - { email, password }
   */
  async login({ email, password }) {
    const cleanEmail = email.toLowerCase().trim();

    try {
      // 1. Attempt backend API call first
      const data = await api.post('/auth/login', { email: cleanEmail, password });
      if (data && data.token && data.user) {
        storage.set(storage.KEYS.AUTH_TOKEN, data.token);
        storage.set(storage.KEYS.AUTH_USER, data.user);
        saveLocalUser(data.user);
        return data.user;
      }
    } catch {
      // Backend not running / offline / error: fallback to local authentication
    }

    // 2. Local Fallback Authentication
    const localUsers = getLocalUsers();
    const matchedUser = localUsers.find(
      (u) =>
        u.email?.toLowerCase().trim() === cleanEmail ||
        (u.phone && cleanEmail.includes(u.phone.replace(/[^0-9]/g, '')))
    );

    let activeUser;
    if (matchedUser) {
      activeUser = {
        ...matchedUser,
        name: formatDisplayName(matchedUser.email, matchedUser.name),
      };
    } else if (cleanEmail === 'codebeats@vibify.com') {
      activeUser = { ...DEFAULT_DEMO_USER };
    } else {
      // Any new ID gets its own dedicated user profile (never default to CodeBeats)
      activeUser = {
        id: `user_${Date.now()}`,
        name: formatDisplayName(cleanEmail),
        email: cleanEmail,
        avatar: `https://picsum.photos/seed/${encodeURIComponent(cleanEmail)}/100/100`,
        role: 'user',
      };
      saveLocalUser(activeUser);
    }

    storage.set(storage.KEYS.AUTH_TOKEN, `mock_jwt_token_${activeUser.id}`);
    storage.set(storage.KEYS.AUTH_USER, activeUser);
    return activeUser;
  },

  /**
   * Sign up new user
   * @param {Object} userData - { email, password, name, phone }
   */
  async signup(userData) {
    const cleanEmail = userData.email.toLowerCase().trim();
    const displayName = formatDisplayName(cleanEmail, userData.name);

    try {
      // 1. Attempt backend API call first
      const data = await api.post('/auth/signup', {
        ...userData,
        email: cleanEmail,
        name: displayName,
      });

      if (data && data.token && data.user) {
        storage.set(storage.KEYS.AUTH_TOKEN, data.token);
        storage.set(storage.KEYS.AUTH_USER, data.user);
        saveLocalUser(data.user);
        return data.user;
      }
    } catch {
      // Backend not running / offline: fallback to local account creation
    }

    const newUser = {
      id: `user_${Date.now()}`,
      name: displayName,
      email: cleanEmail,
      phone: userData.phone?.trim() || '',
      avatar: `https://picsum.photos/seed/${encodeURIComponent(cleanEmail)}/100/100`,
      role: 'user',
    };

    saveLocalUser(newUser);
    storage.set(storage.KEYS.AUTH_TOKEN, `mock_jwt_token_${newUser.id}`);
    storage.set(storage.KEYS.AUTH_USER, newUser);
    return newUser;
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
   * Retrieve current user from storage and self-heal any obsolete state
   */
  getCurrentUser() {
    const user = storage.get(storage.KEYS.AUTH_USER, null);
    if (!user) return null;

    // Self-healing fix: if an earlier session mistakenly gave a non-demo email 'CodeBeats Listener'
    if (
      user.email &&
      user.email.toLowerCase().trim() !== 'codebeats@vibify.com' &&
      user.name === 'CodeBeats Listener'
    ) {
      const localUsers = getLocalUsers();
      const matched = localUsers.find(
        (u) => u.email?.toLowerCase().trim() === user.email.toLowerCase().trim()
      );
      user.name = formatDisplayName(user.email, matched?.name);
      user.avatar = `https://picsum.photos/seed/${encodeURIComponent(user.email)}/100/100`;
      storage.set(storage.KEYS.AUTH_USER, user);
    }

    return user;
  },

  /**
   * Check if user is authenticated
   */
  isAuthenticated() {
    return Boolean(storage.get(storage.KEYS.AUTH_TOKEN, null));
  },
};

export default authService;
