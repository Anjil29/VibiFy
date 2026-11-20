# 🎵 Vibify

**Your vibes, your tunes — let the music match your mood.**

Vibify is a modern full-stack music streaming and vibe-matching web platform. It pairs tracks to your time of day, active mood, language, and personal listening history, backed by YouTube playback, AI-assisted track discovery, and a robust **Node.js + Express + MongoDB** backend.

---

## 🏗️ Architecture & Project Structure

The project is structured into a modern full-stack setup:

```
Vibify-main/
├── server/                    # 🚀 NODE.JS / EXPRESS / MONGODB BACKEND
│   ├── config/
│   │   ├── config.js          # Environment variables & constants
│   │   └── db.js              # Mongoose MongoDB connection manager
│   ├── models/                # 🍃 MONGOOSE SCHEMAS & MODELS
│   │   ├── User.js            # User schema (bcrypt hashing, JWT, likedSongs)
│   │   ├── Song.js            # Song schema (flexible videoId, artists, moods, duration)
│   │   └── Like.js            # Like schema (user-to-song relation with unique index)
│   ├── controllers/
│   │   ├── authController.js  # Register, login, getMe, logout (MongoDB powered)
│   │   └── songController.js  # Live catalog, search, recommendations, like toggling
│   ├── middleware/
│   │   ├── authMiddleware.js  # JWT Bearer token protection & guest fallback
│   │   └── errorMiddleware.js # 404 handler & centralized error logging
│   ├── routes/
│   │   ├── authRoutes.js      # /api/auth
│   │   ├── songRoutes.js      # /api/songs
│   │   └── aiRoutes.js        # /api/ai
│   ├── data/
│   │   └── seed.js            # Syncs default demo user & songs into MongoDB
│   ├── .env                   # Server environment variables (MONGO_URI, PORT, JWT)
│   ├── .env.example
│   ├── package.json
│   └── server.js              # Express entrypoint with CORS, Mongoose boot & health
│
├── src/                       # ⚛️ REACT + VITE FRONTEND
│   ├── components/
│   │   ├── common/            # Button, Input, Pagination, SearchBar, Toast
│   │   ├── layout/            # Navbar, NavigationBar, MusicPlayer, Footer, MainLayout
│   │   └── music/             # SongCard, SongRow, ArtistCard, MoodSection
│   ├── data/                  # Static categories & fallback datasets
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

## 🍃 MongoDB & MongoDB Compass Setup

The backend connects directly to your local **MongoDB** database:

- **Connection URI**: `mongodb://127.0.0.1:27017/vibify`
- **Database Name**: `vibify`
- **Collections in Compass**:
  - `users`: Registered users with bcrypt-hashed passwords and their liked songs array.
  - `songs`: Song catalog with titles, video IDs, artists, moods, and languages.
  - `likes`: Relational like entries tracking user-to-song bookmarks.

> **View in MongoDB Compass**:
> 1. Open MongoDB Compass.
> 2. Connect to `mongodb://localhost:27017`.
> 3. Click the `vibify` database.
> 4. View, edit, or insert documents in `users`, `songs`, or `likes` — changes reflect live in the Vibify UI upon page refresh!

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

Run both services in separate terminal tabs:

```bash
# Terminal 1: Start Express & MongoDB Backend (runs on http://localhost:5001)
npm run server

# Terminal 2: Start Vite Frontend (runs on http://localhost:5173)
npm run dev
```

> **Why Port 5001?** Port 5001 is used because macOS AirPlay Receiver occupies port 5000. Vite automatically proxies all `/api` requests from `http://localhost:5173` to `http://localhost:5001`.

---

## 👤 Authentication & Demo Account

The MongoDB database includes a default demo user initialized on boot:
- **Email**: `codebeats@vibify.com`
- **Password**: `password123`

You can also sign up with **any new account** via the Sign Up page (`/signup`) or log in with your custom credentials — your profile is saved directly into MongoDB and shown in MongoDB Compass.

---

## 🔌 API Endpoints Reference

### 🔐 Authentication (`/api/auth`)
| Method | Endpoint | Description | Auth Required |
|---|---|---|---|
| `POST` | `/api/auth/signup` | Register new account into MongoDB with hashed password | No |
| `POST` | `/api/auth/login` | Authenticate user against MongoDB & receive JWT | No |
| `GET` | `/api/auth/me` | Fetch authenticated user profile from MongoDB | Yes (Bearer JWT) |
| `POST` | `/api/auth/logout` | End session | No |

### 🎵 Songs (`/api/songs`)
| Method | Endpoint | Description | Query Parameters |
|---|---|---|---|
| `GET` | `/api/songs` | Fetch songs directly from MongoDB `songs` collection | `?page=1&limit=50&mood=Chill&language=Hindi` |
| `GET` | `/api/songs/search` | Search songs, singers & albums in MongoDB | `?q=search_term` |
| `GET` | `/api/songs/recommendations` | Get time-based vibe recommendations | `?mood=Romantic&time=8:00+PM` |
| `GET` | `/api/songs/liked` | Fetch all songs liked by current user | None |
| `POST` | `/api/songs/like` | Toggle like status in MongoDB `likes` and `users` | `{ title: "Song Name" }` |
| `POST` | `/api/songs` | Add new song directly into MongoDB collection | Song metadata body |

### 🤖 AI Discovery (`/api/ai`)
| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/ai/discover` | Server-side Gemini AI song metadata discovery |

### 🩺 Health (`/api/health`)
| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Health check with live MongoDB connection status & document counts |

---

## 👥 Team CodeBeats
- **Aditya Sharma** (CSE-A)
- **Anjil Tripathi** (CSE-A)
- **Amrita Kushwaha** (CSE-A)
- **Arya Shree** (CSE-B)
