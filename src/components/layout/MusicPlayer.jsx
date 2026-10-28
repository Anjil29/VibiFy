import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Heart,
  Volume2,
  VolumeX,
  Volume1,
  Shuffle,
  Repeat,
  Repeat1,
} from 'lucide-react';
import {
  selectCurrentSong,
  selectIsPlaying,
  selectPlayerVolume,
  selectIsMuted,
  selectShuffle,
  selectRepeat,
  togglePlay,
  setIsPlaying,
  setVolume,
  toggleMute,
  nextSong,
  prevSong,
  toggleShuffle,
  toggleRepeat,
} from '../../store/slices/playerSlice';
import { selectLikedSongs, toggleLike } from '../../store/slices/songSlice';
import { showToast } from '../../store/slices/uiSlice';
import { formatTime } from '../../utils/timeUtils';

export const MusicPlayer = () => {
  const dispatch = useDispatch();
  const currentSong = useSelector(selectCurrentSong);
  const isPlaying = useSelector(selectIsPlaying);
  const volume = useSelector(selectPlayerVolume);
  const isMuted = useSelector(selectIsMuted);
  const shuffle = useSelector(selectShuffle);
  const repeat = useSelector(selectRepeat);
  const likedSongs = useSelector(selectLikedSongs);

  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState('0:00');
  const [totalTime, setTotalTime] = useState('0:00');

  const playerRef = useRef(null);
  const playerReady = useRef(false);
  const intervalRef = useRef(null);

  // Store mutable refs for event handlers to prevent effect re-subscriptions
  const repeatRef = useRef(repeat);
  const volumeRef = useRef(volume);
  const isMutedRef = useRef(isMuted);
  const currentSongRef = useRef(currentSong);

  useEffect(() => {
    repeatRef.current = repeat;
    volumeRef.current = volume;
    isMutedRef.current = isMuted;
    currentSongRef.current = currentSong;
  }, [repeat, volume, isMuted, currentSong]);

  const isLiked = Boolean(
    currentSong && likedSongs.some((s) => s.title.toLowerCase() === currentSong.title.toLowerCase())
  );

  // Helper to extract YouTube video ID
  const getVideoId = useCallback((thumbnail) => {
    if (!thumbnail || typeof thumbnail !== 'string') return null;
    try {
      if (thumbnail.includes('/vi/')) {
        return thumbnail.split('/vi/')[1].split('/')[0];
      }
      return null;
    } catch {
      return null;
    }
  }, []);

  // Progress Tracker Loop
  const startProgressTracker = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (playerRef.current && playerReady.current) {
        try {
          const current = playerRef.current.getCurrentTime() || 0;
          const total = playerRef.current.getDuration() || 0;

          if (total > 0) {
            setProgress((current / total) * 100);
            setCurrentTime(formatTime(current));
            setTotalTime(formatTime(total));
          }
        } catch {
          // ignore transient iframe errors
        }
      }
    }, 1000);
  }, []);

  // Initialize YouTube Iframe Player
  useEffect(() => {
    const initPlayer = () => {
      const videoId = getVideoId(currentSongRef.current?.thumbnail) || 'KBIq11mNB0I';

      try {
        if (window.YT && window.YT.Player) {
          playerRef.current = new window.YT.Player('yt-audio-player', {
            height: '1',
            width: '1',
            videoId,
            playerVars: {
              autoplay: 0,
              controls: 0,
              disablekb: 1,
              fs: 0,
              modestbranding: 1,
              playsinline: 1,
            },
            events: {
              onReady: (event) => {
                playerReady.current = true;
                event.target.setVolume(isMutedRef.current ? 0 : volumeRef.current);
                startProgressTracker();
              },
              onStateChange: (e) => {
                if (window.YT) {
                  if (e.data === window.YT.PlayerState.PLAYING) {
                    dispatch(setIsPlaying(true));
                  } else if (e.data === window.YT.PlayerState.PAUSED) {
                    dispatch(setIsPlaying(false));
                  } else if (e.data === window.YT.PlayerState.ENDED) {
                    if (repeatRef.current === 'one') {
                      playerRef.current?.seekTo(0, true);
                      playerRef.current?.playVideo();
                    } else {
                      dispatch(nextSong());
                    }
                  }
                }
              },
            },
          });
        }
      } catch (err) {
        console.warn('YT Player initialization error:', err);
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      playerReady.current = false;
      if (intervalRef.current) clearInterval(intervalRef.current);
      if (playerRef.current && typeof playerRef.current.destroy === 'function') {
        playerRef.current.destroy();
      }
    };
  }, [dispatch, getVideoId, startProgressTracker]);

  // Load new song when currentSong title changes
  const prevTitleRef = useRef(currentSong?.title);
  useEffect(() => {
    if (!currentSong || currentSong.title === prevTitleRef.current) return;
    prevTitleRef.current = currentSong.title;

    if (playerReady.current && playerRef.current) {
      const videoId = getVideoId(currentSong.thumbnail);
      if (videoId && typeof playerRef.current.loadVideoById === 'function') {
        try {
          playerRef.current.loadVideoById(videoId);
          dispatch(setIsPlaying(true));
        } catch (err) {
          console.warn('Error loading video by ID:', err);
        }
      }
    }
  }, [currentSong, dispatch, getVideoId]);

  // Volume changes
  useEffect(() => {
    if (playerReady.current && playerRef.current && typeof playerRef.current.setVolume === 'function') {
      playerRef.current.setVolume(isMuted ? 0 : volume);
    }
  }, [volume, isMuted]);

  // Play/Pause sync
  useEffect(() => {
    if (!playerReady.current || !playerRef.current) return;

    try {
      if (isPlaying) {
        if (typeof playerRef.current.playVideo === 'function') {
          playerRef.current.playVideo();
        }
      } else {
        if (typeof playerRef.current.pauseVideo === 'function') {
          playerRef.current.pauseVideo();
        }
      }
    } catch (err) {
      console.warn('Play/pause error:', err);
    }
  }, [isPlaying]);

  // Handle click on progress bar
  const handleSeek = (e) => {
    if (!playerReady.current || !playerRef.current) return;

    const bar = e.currentTarget;
    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const percentage = Math.max(0, Math.min(1, clickX / rect.width));

    try {
      const duration = playerRef.current.getDuration();
      if (duration > 0) {
        const seekSeconds = percentage * duration;
        playerRef.current.seekTo(seekSeconds, true);
        setProgress(percentage * 100);
      }
    } catch (err) {
      console.warn('Seek error:', err);
    }
  };

  const handleLikeToggle = () => {
    if (!currentSong) return;
    dispatch(toggleLike(currentSong));
    dispatch(
      showToast({
        message: isLiked
          ? `Removed "${currentSong.title}" from Liked Songs`
          : `Added "${currentSong.title}" to Liked Songs ❤️`,
        type: isLiked ? 'info' : 'success',
      })
    );
  };

  if (!currentSong) return null;

  const displayTotalTime = totalTime !== '0:00' ? totalTime : (currentSong.duration || '0:00');

  return (
    <footer className="fixed bottom-0 left-0 right-0 z-50 bg-slate-950/95 border-t border-slate-800/80 backdrop-blur-2xl px-4 py-2.5 shadow-[0_-8px_30px_rgba(0,0,0,0.5)]">
      {/* Hidden YouTube Iframe */}
      <div
        id="yt-audio-player"
        style={{
          position: 'fixed',
          top: '-9999px',
          left: '-9999px',
          width: '1px',
          height: '1px',
          opacity: 0,
          pointerEvents: 'none',
        }}
      />

      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        {/* Left: Track Information */}
        <div className="flex items-center gap-3.5 w-1/4 min-w-[180px]">
          <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-900 border border-slate-800 shrink-0 shadow-md">
            <img
              src={currentSong.thumbnail}
              alt={currentSong.title}
              className="w-full h-full object-cover"
            />
          </div>

          <div className="min-w-0 text-left">
            <h4 className="text-sm font-semibold text-white truncate hover:text-emerald-300 transition-colors cursor-pointer">
              {currentSong.title}
            </h4>
            <p className="text-xs text-slate-400 truncate">
              {Array.isArray(currentSong.singers)
                ? currentSong.singers.join(', ')
                : currentSong.singers || 'Unknown Artist'}
            </p>
          </div>

          <button
            onClick={handleLikeToggle}
            aria-label={isLiked ? 'Unlike song' : 'Like song'}
            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 transition-all shrink-0 ml-1"
          >
            <Heart
              className={`w-4 h-4 transition-transform active:scale-125 ${
                isLiked ? 'text-rose-500 fill-rose-500' : 'text-slate-400'
              }`}
            />
          </button>
        </div>

        {/* Center: Playback Controls & Progress Scrubber */}
        <div className="flex flex-col items-center justify-center flex-1 max-w-xl">
          {/* Action Buttons */}
          <div className="flex items-center gap-4 mb-1.5">
            <button
              onClick={() => dispatch(toggleShuffle())}
              aria-label="Toggle shuffle"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                shuffle ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Shuffle className="w-4 h-4" />
            </button>

            <button
              onClick={() => dispatch(prevSong())}
              aria-label="Previous song"
              className="p-1.5 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <SkipBack className="w-4 h-4" />
            </button>

            <button
              onClick={() => dispatch(togglePlay())}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="w-9 h-9 rounded-full bg-emerald-500 hover:bg-emerald-400 text-slate-950 flex items-center justify-center shadow-lg shadow-emerald-500/25 transition-all hover:scale-105 active:scale-95 cursor-pointer"
            >
              {isPlaying ? (
                <Pause className="w-4 h-4 fill-slate-950" />
              ) : (
                <Play className="w-4 h-4 fill-slate-950 ml-0.5" />
              )}
            </button>

            <button
              onClick={() => dispatch(nextSong())}
              aria-label="Next song"
              className="p-1.5 rounded-lg text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <SkipForward className="w-4 h-4" />
            </button>

            <button
              onClick={() => dispatch(toggleRepeat())}
              aria-label="Toggle repeat"
              className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                repeat !== 'off' ? 'text-emerald-400' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {repeat === 'one' ? <Repeat1 className="w-4 h-4" /> : <Repeat className="w-4 h-4" />}
            </button>
          </div>

          {/* Scrubber & Timers */}
          <div className="w-full flex items-center gap-2.5 text-[11px] font-mono text-slate-400 select-none">
            <span className="w-8 text-right">{currentTime}</span>

            <div
              onClick={handleSeek}
              className="relative flex-1 h-1.5 bg-slate-800 hover:h-2 rounded-full cursor-pointer transition-all overflow-hidden group"
            >
              <div
                className="h-full bg-emerald-400 group-hover:bg-emerald-300 rounded-full transition-all duration-150"
                style={{ width: `${progress}%` }}
              />
            </div>

            <span className="w-8 text-left">{displayTotalTime}</span>
          </div>
        </div>

        {/* Right: Volume & Details */}
        <div className="hidden sm:flex items-center justify-end gap-3 w-1/4">
          <button
            onClick={() => dispatch(toggleMute())}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
            className="text-slate-400 hover:text-white transition-colors cursor-pointer"
          >
            {isMuted || volume === 0 ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : volume < 50 ? (
              <Volume1 className="w-4 h-4" />
            ) : (
              <Volume2 className="w-4 h-4" />
            )}
          </button>

          <input
            type="range"
            min="0"
            max="100"
            value={isMuted ? 0 : volume}
            onChange={(e) => dispatch(setVolume(Number(e.target.value)))}
            aria-label="Volume slider"
            className="w-20 accent-emerald-400 h-1 bg-slate-800 rounded-lg cursor-pointer"
          />
        </div>
      </div>
    </footer>
  );
};

export default MusicPlayer;

