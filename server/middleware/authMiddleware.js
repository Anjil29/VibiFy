import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import db from '../utils/db.js';

export const protect = (req, res, next) => {
  let token = null;

  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized. Please log in to access this resource.',
    });
  }

  try {
    const decoded = jwt.verify(token, config.JWT_SECRET);
    const user = db.users.findById(decoded.id);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.',
      });
    }

    // Strip password from req.user
    const { password: _, ...userWithoutPassword } = user;
    req.user = userWithoutPassword;
    next();
  } catch {
    return res.status(401).json({
      success: false,
      message: 'Token is invalid or expired. Please sign in again.',
    });
  }
};

/**
 * Attaches user if valid token present, but permits anonymous guests
 */
export const optionalAuth = (req, res, next) => {
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decoded = jwt.verify(token, config.JWT_SECRET);
      const user = db.users.findById(decoded.id);
      if (user) {
        const { password: _, ...userWithoutPassword } = user;
        req.user = userWithoutPassword;
      }
    } catch {
      // Ignore token decode errors for optional auth
    }
  }
  next();
};

