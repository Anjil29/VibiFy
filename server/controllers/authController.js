import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import db from '../utils/db.js';

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, config.JWT_SECRET, {
    expiresIn: config.JWT_EXPIRES_IN,
  });
};

export const register = async (req, res, next) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both an email and a password.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = db.users.findOne((u) => u.email?.toLowerCase() === cleanEmail);

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = db.users.insert({
      name: name?.trim() || cleanEmail.split('@')[0],
      email: cleanEmail,
      phone: phone?.trim() || '',
      password: hashedPassword,
      avatar: `https://picsum.photos/seed/${encodeURIComponent(cleanEmail)}/100/100`,
      role: 'user',
    });

    const token = generateToken(user.id);
    const { password: _, ...userSafe } = user;

    res.status(201).json({
      success: true,
      token,
      user: userSafe,
      message: 'Account created successfully!',
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = db.users.findOne((u) => u.email?.toLowerCase() === cleanEmail);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user.id);
    const { password: _, ...userSafe } = user;

    res.json({
      success: true,
      token,
      user: userSafe,
      message: 'Logged in successfully!',
    });
  } catch (err) {
    next(err);
  }
};

export const getMe = async (req, res, next) => {
  try {
    res.json({
      success: true,
      user: req.user,
    });
  } catch (err) {
    next(err);
  }
};

export const logout = (req, res) => {
  res.json({
    success: true,
    message: 'Logged out successfully.',
  });
};

