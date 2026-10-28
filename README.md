# 🎵 Vibify

**Your vibes, your tunes — let the music match your mood.**

Vibify is a modern full-stack music streaming and vibe-matching web platform. It pairs tracks to your time of day, active mood, language, and personal listening history, backed by YouTube playback, AI-assisted track discovery, and a robust Node.js/Express backend.

---

## 🏗️ Architecture & Project Structure

The project is structured into a modern full-stack setup:

```
Vibify-main/
├── server/                    # 🚀 NODE.JS / EXPRESS BACKEND
│   ├── config/
│   │   └── config.js          # Server configuration & environment variables
│   ├── controllers/
│   │   ├── authController.js  # Register, login, current user (me), logout
│   │   └── songController.js  # Catalog, search, vibe recommendations, likes
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT Bearer token protection & guest fallback
│   │   └── errorMiddleware.js # 404 handler & centralized error logging
│   ├── routes/
│   │   ├── authRoutes.js      # /api/auth
│   │   ├── songRoutes.js      # /api/songs
│   │   └── aiRoutes.js        # /api/ai
│   ├── utils/
│   │   ├── db.js              # High-performance JSON database engine with atomic writes
│   │   └── timeUtils.js       # Vibe matching time-window calculation
│   ├── data/
│   │   ├── seed.js            # Auto-seeds songs and default demo user
│   │   ├── songs.json         # Seeded song catalog
│   │   ├── users.json         # User credentials with bcrypt hashes
│   │   └── likes.json         # User liked tracks storage
│   ├── .env                   # Server environment variables
│   ├── .env.example
│   ├── package.json
│   └── server.js              # Express entrypoint with CORS, logging & seed boot
│
├── src/                       # ⚛️ REACT + VITE FRONTEND
│   ├── components/
│   │   ├── common/            # Button, Input, Pagination, SearchBar, Toast
│   │   ├── layout/            # Navbar, NavigationBar, MusicPlayer, Footer, MainLayout
│   │   └── music/             # SongCard, SongRow, ArtistCard, MoodSection
│   ├── data/                  # Static datasets (mockSongs.js, categories.js)
│   ├── hooks/                 # usePlayer, useDebounce
│   ├── pages/                 # Home, Library, Explore, LikedSongs, Artists, Languages, Login, SignUp, NotFound
│   ├── routes/                # AppRoutes, ProtectedRoute
│   ├── services/              # api.js, authService.js, songService.js, aiService.js
│   ├── store/                 # Redux Toolkit store & slices (auth, song, player, ui)
│   └── utils/                 # timeUtils, storage
│
├── package.json               # Root scripts & frontend dependencies
└── vite.config.js             # Vite configuration with React, Tailwind & /api proxy
```

---

## 🚀 Quick Start

### 1. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd server && npm install && cd ..
```

### 2. Start the Application

You can run both or either service:

```bash
# Terminal 1: Start Express Backend (runs on http://localhost:5001)
npm run server

# Terminal 2: Start Vite Frontend (runs on http://localhost:5173)
npm run dev
```

> **Note on Port 5001**: Port 5001 is used by default because macOS AirPlay Receiver reserves port 5000. Vite automatically proxies `/api` requests from `http://localhost:5173` to `http://localhost:5001`.

---

## 👤 Default Demo Account

The backend automatically seeds a demo account upon first launch:
- **Email**: `codeBeats@vibify.com`
- **Password**: `password123`

You can also click **"Fill Credentials"** directly on the Login page.

---

## 🔌 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Register new account with hashed password | No |
| `POST` | `/api/auth/login` | Authenticate user & receive JWT token | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile | Yes (Bearer JWT) |
| `POST` | `/api/auth/logout` | End session | No |

### 🎵 Songs (`/api/songs`)
| Method | Endpoint | Description | Query Parameters |
|---|---|---|---|
| `GET` | `/api/songs` | Fetch songs catalog | `?page=1&limit=50&mood=Chill&language=Hindi` |
| `GET` | `/api/songs/search` | Search songs, singers & albums | `?q=search_term` |
| `GET` | `/api/songs/recommendations` | Get time-based vibe recommendations | `?mood=Romantic&time=8:00+PM` |
| `GET` | `/api/songs/liked` | Fetch all songs liked by current user | None |
| `POST` | `/api/songs/like` | Toggle like status for a song | `{ title: "Song Name" }` |
| `POST` | `/api/songs` | Add new song to database | Song metadata body |

### 🤖 AI Discovery (`/api/ai`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/ai/discover` | Server-side Gemini AI song metadata discovery |

### 🩺 Health (`/api/health`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check with uptime and database item counts |

---

## 👥 Team CodeBeats
- **Aditya Sharma** (CSE-A)
- **Anjil Tripathi** (CSE-A)
- **Amrita Kushwaha** (CSE-A)
- **Arya Shree** (CSE-B)
