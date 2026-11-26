import React, { useCallback, useEffect, useRef, useState } from 'react';

function formatClock(seconds) {
  const s = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  const m = Math.floor(s / 60);
  const rest = String(s % 60).padStart(2, '0');
  return `${m}:${rest}`;
}

export default function BrandVideoPlayer({
  src,
  poster,
  title = 'Festival video',
  autoPlayOnVisible = false,
  playerId = 'featured-2026',
  className = '',
}) {
  const wrapRef = useRef(null);
  const videoRef = useRef(null);
  const timerRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isFull, setIsFull] = useState(false);
  const [canPip, setCanPip] = useState(false);
  const [isBuffering, setIsBuffering] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [controlsIdle, setControlsIdle] = useState(false);
  const [bufferedPct, setBufferedPct] = useState(0);

  const wakeControls = useCallback(() => {
    setControlsIdle(false);
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      setControlsIdle(true);
    }, 2800);
  }, []);

  const togglePlay = useCallback(() => {
    const v = videoRef.current;
    if (!v) return;
    if (v.paused) {
      v.muted = isMuted;
      window.dispatchEvent(new CustomEvent('nclf:video-play', { detail: { sourceId: playerId } }));
      v.play().catch(() => {});
    } else {
      v.pause();
    }
    wakeControls();
  }, [isMuted, playerId, wakeControls]);

  useEffect(() => {
    const handleGlobalPlay = (event) => {
      if (event.detail?.sourceId !== playerId && videoRef.current && !videoRef.current.paused) {
        videoRef.current.pause();
      }
    };
    window.addEventListener('nclf:video-play', handleGlobalPlay);
    return () => window.removeEventListener('nclf:video-play', handleGlobalPlay);
  }, [playerId]);

  const toggleMute = () => {
    const v = videoRef.current;
    if (!v) return;
    const nextMuted = !isMuted;
    v.muted = nextMuted;
    setIsMuted(nextMuted);
    if (!nextMuted && v.volume === 0) {
      v.volume = 0.8;
      setVolume(0.8);
    }
    wakeControls();
  };

  const handleSeek = (newTime) => {
    const v = videoRef.current;
    if (!v) return;
    v.currentTime = Math.min(Math.max(0, newTime), duration || 0);
    setTime(v.currentTime);
    wakeControls();
  };

  const togglePip = () => {
    if (document.pictureInPictureElement) {
      document.exitPictureInPicture().catch(() => {});
    } else if (videoRef.current?.requestPictureInPicture) {
      videoRef.current.requestPictureInPicture().catch(() => {});
    }
    wakeControls();
  };

  const toggleFullscreen = () => {
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return;

    const isCurrentlyFull = Boolean(document.fullscreenElement || document.webkitFullscreenElement);

    if (isCurrentlyFull) {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
      setIsFull(false);
      return;
    }

    if (video.paused) {
      video.play().catch(() => {});
    }

    // iOS Safari compatibility (iPhone uses webkitEnterFullscreen on video element)
    if (video.webkitEnterFullscreen && /iPhone|iPod/.test(navigator.userAgent)) {
      video.webkitEnterFullscreen();
      return;
    }

    if (wrap.requestFullscreen) {
      wrap.requestFullscreen().then(() => setIsFull(true)).catch(() => {
        if (video.webkitEnterFullscreen) video.webkitEnterFullscreen();
      });
    } else if (wrap.webkitRequestFullscreen) {
      wrap.webkitRequestFullscreen();
      setIsFull(true);
    } else if (video.webkitEnterFullscreen) {
      video.webkitEnterFullscreen();
    }
    wakeControls();
  };

  // Autoplay on intersection observer (viewport)
  useEffect(() => {
    if (!autoPlayOnVisible) return;
    const wrap = wrapRef.current;
    const video = videoRef.current;
    if (!wrap || !video) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && entry.intersectionRatio >= 0.45) {
            if (video.paused && !video.ended) {
              video.muted = true;
              setIsMuted(true);
              video.play().then(() => {
                setHasStarted(true);
                setIsPlaying(true);
              }).catch(() => {});
            }
          } else {
            if (!video.paused) {
              video.pause();
              setIsPlaying(false);
            }
          }
        });
      },
      { threshold: [0.2, 0.5, 0.8] }
    );

    observer.observe(wrap);
    return () => observer.disconnect();
  }, [autoPlayOnVisible]);

  // Fullscreen change listener
  useEffect(() => {
    const onFullChange = () => {
      const full = Boolean(document.fullscreenElement === wrapRef.current);
      setIsFull(full);
    };
    document.addEventListener('fullscreenchange', onFullChange);
    document.addEventListener('webkitfullscreenchange', onFullChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFullChange);
      document.removeEventListener('webkitfullscreenchange', onFullChange);
      clearTimeout(timerRef.current);
    };
  }, []);

  useEffect(() => {
    if (document.pictureInPictureEnabled) {
      setCanPip(true);
    }
  }, []);

  const playedPct = duration > 0 ? (time / duration) * 100 : 0;
  const hideControls = hasStarted && isPlaying && controlsIdle;

  return (
    <div
      ref={wrapRef}
      className={`brand-video-player ${hideControls ? 'controls-hidden' : ''} ${isFull ? 'is-fullscreen' : ''} ${className}`}
      onPointerMove={wakeControls}
      onTouchStart={wakeControls}
      onClick={wakeControls}
      role="region"
      aria-label={title}
    >
      <video
        ref={videoRef}
        src={src}
        poster={poster}
        playsInline
        webkit-playsinline="true"
        x5-playsinline="true"
        preload="metadata"
        onClick={togglePlay}
        onPlay={() => {
          setIsPlaying(true);
          setHasStarted(true);
          setIsBuffering(false);
          wakeControls();
        }}
        onPause={() => setIsPlaying(false)}
        onWaiting={() => setIsBuffering(true)}
        onPlaying={() => {
          setIsPlaying(true);
          setIsBuffering(false);
        }}
        onTimeUpdate={() => {
          if (videoRef.current) setTime(videoRef.current.currentTime);
        }}
        onDurationChange={() => {
          if (videoRef.current) setDuration(videoRef.current.duration || 0);
        }}
        onProgress={() => {
          const v = videoRef.current;
          if (v && v.buffered.length > 0 && v.duration) {
            setBufferedPct((v.buffered.end(v.buffered.length - 1) / v.duration) * 100);
          }
        }}
        onEnded={() => {
          setIsPlaying(false);
          setControlsIdle(false);
        }}
      />

      {/* Floating Unmute Badge when muted autoplay is active */}
      {isPlaying && isMuted && (
        <button
          type="button"
          className="bvp-unmute-badge"
          onClick={(e) => {
            e.stopPropagation();
            toggleMute();
          }}
          aria-label="Tap to unmute"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
          </svg>
          <span>Tap for sound</span>
        </button>
      )}

      {/* Center Big Play Button */}
      {!isPlaying && (
        <button
          type="button"
          className="bvp-big-play"
          onClick={(e) => {
            e.stopPropagation();
            togglePlay();
          }}
          aria-label={isPlaying ? 'Pause video' : 'Play video'}
        >
          <svg viewBox="0 0 24 24" width="28" height="28" fill="currentColor">
            <path d="M8 5v14l11-7z" />
          </svg>
        </button>
      )}

      {/* Buffering Spinner */}
      {isBuffering && (
        <div className="bvp-spinner" role="status" aria-label="Buffering">
          <div className="bvp-spin-circle" />
        </div>
      )}

      {/* Control Bar Overlay */}
      <div className="bvp-controls" onClick={(e) => e.stopPropagation()}>
        {/* Scrubber Progress Bar */}
        <div className="bvp-progress-wrap">
          <input
            className="bvp-scrub"
            type="range"
            min={0}
            max={duration || 0}
            step="any"
            value={time}
            aria-label="Seek time"
            style={{
              '--played': `${playedPct}%`,
              '--buffered': `${bufferedPct}%`,
            }}
            onChange={(e) => handleSeek(Number(e.target.value))}
          />
        </div>

        {/* Lower Row Controls */}
        <div className="bvp-controls-row">
          {/* Play / Pause */}
          <button
            type="button"
            className="bvp-btn"
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Volume / Mute */}
          <div className="bvp-volume-group">
            <button
              type="button"
              className="bvp-btn"
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
            >
              {isMuted || volume === 0 ? (
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                  <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z" />
                </svg>
              )}
            </button>
            <input
              className="bvp-volume-slider"
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              aria-label="Volume slider"
              onChange={(e) => {
                const val = Number(e.target.value);
                setVolume(val);
                if (videoRef.current) {
                  videoRef.current.volume = val;
                  videoRef.current.muted = val === 0;
                }
                setIsMuted(val === 0);
              }}
            />
          </div>

          {/* Time Display */}
          <span className="bvp-time">
            {formatClock(time)} <span className="bvp-time-sep">/</span> {formatClock(duration)}
          </span>

          <div className="bvp-spacer" />

          {/* Picture in Picture */}
          {canPip && (
            <button
              type="button"
              className="bvp-btn bvp-pip-btn"
              onClick={togglePip}
              aria-label="Picture in picture"
            >
              <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor">
                <path d="M19 11h-8v6h8v-6zm4 8V4.98C23 3.88 22.1 3 21 3H3c-1.1 0-2 .88-2 1.98V19c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2zm-2 .02H3V4.97h18v14.05z" />
              </svg>
            </button>
          )}

          {/* Fullscreen Button (Optimized for Mobile & Desktop) */}
          <button
            type="button"
            className="bvp-btn bvp-fullscreen-btn"
            onClick={toggleFullscreen}
            aria-label={isFull ? 'Exit full screen' : 'Full screen'}
          >
            {isFull ? (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor">
                <path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" />
              </svg>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
