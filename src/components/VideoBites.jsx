import React, { useEffect, useRef, useState } from 'react';
import { Play } from 'lucide-react';
import version2Video from '../../Version 2.mp4';

const fallbackThumbnail = '/day-3/DSC07779.JPG';
const AUTO_SLIDE_MS = 5000;

const videoBites = [
  {
    id: 'nclf-2026-moments',
    personName: 'National Care Leavers Festival',
    title: 'Festival moments, 2026',
    description: 'A short collection of moments, reflections and community energy from the 2026 National Care Leavers Festival.',
    thumbnail: '/day-3/DSC07779.JPG',
    videoUrl: version2Video,
    duration: '0:52',
    displayOrder: 1,
    designation: '2026 Festival Film',
  },
  {
    id: 'nclf-day-3-highlight',
    personName: 'Care Leavers & Festival Participants',
    title: 'Day 3 voices & highlights',
    description: 'Hear directly from care-experienced young people as they share reflections, leadership moments and community spirit.',
    thumbnail: '/day-3/DSC07451.JPG',
    videoUrl: '/Day%203%20highlight.mp4',
    duration: '2:59',
    displayOrder: 2,
    designation: 'National Care Leavers Festival 2026',
  },
];

function resolveVideoSource(videoUrl) {
  if (!videoUrl) return null;
  let url;
  try {
    url = new URL(videoUrl, window.location.origin);
  } catch {
    return null;
  }

  if (!['http:', 'https:'].includes(url.protocol)) return null;

  const host = url.hostname.toLowerCase();
  const pathParts = url.pathname.split('/').filter(Boolean);
  let embedUrl;

  if (host === 'youtu.be') {
    const videoId = pathParts[0];
    if (videoId) embedUrl = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`;
  } else if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(host)) {
    const videoId = url.searchParams.get('v')
      || (['embed', 'shorts', 'live'].includes(pathParts[0]) ? pathParts[1] : null);
    if (videoId) embedUrl = `https://www.youtube-nocookie.com/embed/${encodeURIComponent(videoId)}`;
  } else if (['vimeo.com', 'www.vimeo.com', 'player.vimeo.com'].includes(host)) {
    const videoId = pathParts.find((part) => /^\d+$/.test(part));
    if (videoId) embedUrl = `https://player.vimeo.com/video/${videoId}`;
  }

  if (embedUrl) {
    const embed = new URL(embedUrl);
    embed.searchParams.set('autoplay', '1');
    return { type: 'embed', src: embed.toString() };
  }

  return { type: 'file', src: url.toString() };
}

export default function VideoBites() {
  const headingRef = useRef(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const [activeSlotKey, setActiveSlotKey] = useState(null);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [playbackErrorKey, setPlaybackErrorKey] = useState(null);
  const [cardsPerView, setCardsPerView] = useState(2);
  const videoRefs = useRef({});
  const touchStartRef = useRef(null);

  useEffect(() => {
    const heading = headingRef.current;
    if (!heading || !('IntersectionObserver' in window)
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const items = [...heading.querySelectorAll('.section-kicker, h2, p')];
    items.forEach((item, index) => {
      item.style.setProperty('--section-heading-order', index);
      item.classList.add('section-heading-reveal-ready');
    });
    try {
      const observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        items.forEach((item) => item.classList.add('section-heading-reveal-visible'));
        observer.disconnect();
      }, { threshold: 0.15, rootMargin: '0px 0px -20px 0px' });
      observer.observe(heading);
      return () => observer.disconnect();
    } catch {
      items.forEach((item) => item.classList.remove('section-heading-reveal-ready', 'section-heading-reveal-visible'));
      return undefined;
    }
  }, []);

  const orderedVideos = [...videoBites].sort((a, b) => a.displayOrder - b.displayOrder);
  const visibleCount = Math.min(cardsPerView, orderedVideos.length);

  // Build seamless slides for the track so multi-card desktop view never leaves a blank slot
  const trackVideos = visibleCount > 1 && orderedVideos.length > 1
    ? [...orderedVideos, ...orderedVideos.slice(0, visibleCount - 1)]
    : orderedVideos;

  useEffect(() => {
    const updateCardsPerView = () => {
      const w = window.innerWidth;
      if (w <= 760) {
        setCardsPerView(1);
      } else if (w <= 1080) {
        setCardsPerView(2);
      } else {
        setCardsPerView(Math.min(3, orderedVideos.length));
      }
    };
    updateCardsPerView();
    window.addEventListener('resize', updateCardsPerView);
    return () => window.removeEventListener('resize', updateCardsPerView);
  }, [orderedVideos.length]);

  useEffect(() => {
    const handleGlobalPlay = (event) => {
      const sourceId = event.detail?.sourceId;
      if (!sourceId || !sourceId.startsWith('bite-')) {
        Object.values(videoRefs.current).forEach((el) => {
          if (el && !el.paused) el.pause();
        });
        setActiveSlotKey(null);
        setIsVideoPlaying(false);
      }
    };
    window.addEventListener('nclf:video-play', handleGlobalPlay);
    return () => window.removeEventListener('nclf:video-play', handleGlobalPlay);
  }, []);

  // Automatic 5-second slide timer; resets on activeIndex change and pauses while playing
  useEffect(() => {
    if (orderedVideos.length <= 1 || isVideoPlaying) return undefined;

    const timer = window.setTimeout(() => {
      setActiveIndex((current) => (current + 1) % orderedVideos.length);
    }, AUTO_SLIDE_MS);

    return () => window.clearTimeout(timer);
  }, [activeIndex, isVideoPlaying, orderedVideos.length]);

  function pauseAllVideos(exceptSlotKey = null) {
    Object.entries(videoRefs.current).forEach(([slotKey, el]) => {
      if (slotKey !== exceptSlotKey && el && !el.paused) {
        el.pause();
      }
    });
  }

  function goToSlide(nextIndex) {
    if (orderedVideos.length <= 1) return;
    pauseAllVideos();
    setActiveSlotKey(null);
    setIsVideoPlaying(false);
    setActiveIndex(((nextIndex % orderedVideos.length) + orderedVideos.length) % orderedVideos.length);
  }

  function startPlayback(slotKey) {
    pauseAllVideos(slotKey);
    window.dispatchEvent(new CustomEvent('nclf:video-play', { detail: { sourceId: `bite-${slotKey}` } }));
    setPlaybackErrorKey(null);
    setActiveSlotKey(slotKey);
    setIsVideoPlaying(true);
  }

  useEffect(() => {
    if (!activeSlotKey) return;
    const el = videoRefs.current[activeSlotKey];
    if (el) {
      el.play().catch(() => {});
    }
  }, [activeSlotKey]);

  function handleTouchStart(event) {
    if (event.touches.length !== 1) return;
    touchStartRef.current = {
      x: event.touches[0].clientX,
      y: event.touches[0].clientY,
    };
  }

  function handleTouchEnd(event) {
    if (!touchStartRef.current || event.changedTouches.length === 0) return;
    const dx = event.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = event.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;

    if (Math.abs(dx) > 42 && Math.abs(dx) > Math.abs(dy)) {
      goToSlide(dx < 0 ? activeIndex + 1 : activeIndex - 1);
    }
  }

  function handleThumbnailError(event) {
    const image = event.currentTarget;
    if (image.dataset.usingFallback === 'true') {
      image.hidden = true;
      return;
    }
    image.dataset.usingFallback = 'true';
    image.removeAttribute('srcset');
    image.parentElement?.querySelectorAll('source').forEach((source) => source.removeAttribute('srcset'));
    image.src = fallbackThumbnail;
  }

  const slideStepPercent = 100 / visibleCount;
  const trackTransform = `translate3d(-${activeIndex * slideStepPercent}%, 0, 0)`;

  return (
    <section className="video-bites-section section-space" id="video-bites" aria-labelledby="video-bites-title">
      <div className="section-wrap">
        <header className="video-bites-heading" ref={headingRef}>
          <span className="section-kicker">Lived experience, in their own words</span>
          <h2 id="video-bites-title">Video Bites – Voices, Experiences &amp; Perspectives</h2>
          <p>
            Short films from the 2026 festival, featuring moments and perspectives from participants.
          </p>
        </header>

        <div
          className="video-bites-carousel"
          role="region"
          aria-roledescription="carousel"
          aria-label="Video Bites carousel"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          <div className="video-bites-viewport">
            <div
              className="video-bites-track"
              style={{
                transform: trackTransform,
                '--visible-cards': visibleCount,
              }}
            >
              {trackVideos.map((video, slotIndex) => {
                const slotKey = `${video.id}-${slotIndex}`;
                const source = resolveVideoSource(video.videoUrl);
                const videoPoster = video.thumbnail || fallbackThumbnail;
                const isCardActive = activeSlotKey === slotKey;

                return (
                  <div className="video-bite-slide" key={slotKey}>
                    <article className="video-bite-card">
                      <div className="video-bite-media">
                        {isCardActive && source?.type === 'embed' ? (
                          <iframe
                            src={source.src}
                            title={`${video.title} shared by ${video.personName}`}
                            allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                            allowFullScreen
                            referrerPolicy="strict-origin-when-cross-origin"
                          />
                        ) : isCardActive && source?.type === 'file' ? (
                          <video
                            ref={(el) => {
                              videoRefs.current[slotKey] = el;
                            }}
                            src={source.src}
                            poster={videoPoster}
                            controls
                            autoPlay
                            playsInline
                            preload="metadata"
                            aria-label={`${video.title} shared by ${video.personName}`}
                            onPlay={() => {
                              pauseAllVideos(slotKey);
                              window.dispatchEvent(new CustomEvent('nclf:video-play', { detail: { sourceId: `bite-${slotKey}` } }));
                              setIsVideoPlaying(true);
                            }}
                            onPause={(e) => {
                              if (!e.currentTarget.ended) {
                                setIsVideoPlaying(false);
                              }
                            }}
                            onEnded={() => setIsVideoPlaying(false)}
                            onError={() => {
                              setPlaybackErrorKey(slotKey);
                              setIsVideoPlaying(false);
                            }}
                          >
                            Your browser does not support embedded video.
                          </video>
                        ) : (
                          <button
                            className="video-bite-preview"
                            type="button"
                            aria-label={`Play ${video.title}, shared by ${video.personName}`}
                            onClick={() => startPlayback(slotKey)}
                          >
                            <img
                              src={video.thumbnail || fallbackThumbnail}
                              alt={`${video.title} video thumbnail`}
                              loading="lazy"
                              decoding="async"
                              onError={handleThumbnailError}
                            />
                            <span className="video-bite-play" aria-hidden="true">
                              <span className="video-bite-play-circle">
                                <Play size={22} fill="currentColor" strokeWidth={0} />
                              </span>
                            </span>
                            {video.duration && <span className="video-bite-duration">{video.duration}</span>}
                          </button>
                        )}
                      </div>

                      {playbackErrorKey === slotKey && (
                        <p className="video-bite-playback-error" role="status">
                          This video could not be played right now. Please try again.
                        </p>
                      )}

                      <div className="video-bite-copy">
                        <span className="video-bite-person">{video.personName}</span>
                        <h3>{video.title}</h3>
                        <p>{video.description}</p>
                        {video.designation && <span className="video-bite-designation">{video.designation}</span>}
                      </div>
                    </article>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {orderedVideos.length > 1 && (
          <div className="video-bites-pagination" role="group" aria-label="Choose a video slide">
            {orderedVideos.map((video, index) => (
              <button
                className={`video-bites-dot${index === activeIndex ? ' is-active' : ''}`}
                type="button"
                key={video.id}
                aria-label={`Show ${video.title}`}
                aria-current={index === activeIndex ? 'true' : undefined}
                onClick={() => goToSlide(index)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
