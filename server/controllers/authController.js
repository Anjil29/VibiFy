import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import User from '../models/User.js';

const generateToken = (userId) =>  {
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
    const existing = await User.findOne({ email: cleanEmail });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email already exists.',
      });
    }

    const displayName = name?.trim() || cleanEmail.split('@')[0];
    const avatarUrl = `https://picsum.photos/seed/${encodeURIComponent(cleanEmail)}/100/100`;

    const user = await User.create({
      name: displayName,
      email: cleanEmail,
      phone: phone?.trim() || '',
      password,
      avatar: avatarUrl,
      role: 'user',
    });

    const token = generateToken(user._id);

    res.status(201).json({
      success: true,
      token,
      user: {
        id: String(user._id),
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        createdAt: user.createdAt,
      },
      message: 'Account created successfully in MongoDB!',
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next)=>{
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide email and password.',
      });
    }

    const cleanInput = email.toLowerCase().trim();
    const cleanPhoneDigits = cleanInput.replace(/[^0-9]/g, '');

    const user = await User.findOne({
      $or: [
        { email: cleanInput },
        ...(cleanPhoneDigits.length >= 6 ? [{ phone: { $regex: cleanPhoneDigits } }] : []),
      ],
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.',
      });
    }

    const token = generateToken(user._id);

    res.json({
      success: true,
      token,
      user: {
        id: String(user._id),
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        avatar: user.avatar,
        role: user.role,
        createdAt: user.createdAt,
      },
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
