import React, { useEffect, useRef, useState } from 'react';

const fallbackThumbnail = '/photos/festival-1.jpg';
const videoBites = [
  {
    personName: 'Care Leavers and Festival Participants',
    title: 'A look back at the 2026 Festival',
    description: 'Shared moments of connection, learning and celebration from the National Care Leavers Festival 2026.',
    thumbnail: '/photos/festival-1.jpg',
    videoUrl: '/Day%203%20highlight.mp4',
    duration: '2:59',
    displayOrder: 1,
    designation: 'National Care Leavers Festival 2026',
  },
];

function resolveVideoSource(videoUrl) {
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

function useVideoDialog(selectedVideo, dialogRef) {
  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (selectedVideo && !dialog.open) dialog.showModal();
    if (!selectedVideo && dialog.open) dialog.close();
  }, [selectedVideo, dialogRef]);
}

export default function VideoBites() {
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [playbackError, setPlaybackError] = useState('');
  const dialogRef = useRef(null);
  const orderedVideos = [...videoBites].sort((a, b) => a.displayOrder - b.displayOrder);
  const playbackSource = selectedVideo ? resolveVideoSource(selectedVideo.videoUrl) : null;

  useVideoDialog(selectedVideo, dialogRef);

  function closePlayer() {
    if (dialogRef.current?.open) dialogRef.current.close();
  }

  function handleThumbnailError(event) {
    const image = event.currentTarget;
    if (image.dataset.usingFallback === 'true') {
      image.hidden = true;
      return;
    }
    image.dataset.usingFallback = 'true';
    image.src = fallbackThumbnail;
  }

  return (
    <section className="video-bites-section section-space" id="video-bites" aria-labelledby="video-bites-title">
      <div className="section-wrap">
        <header className="video-bites-heading">
          <span className="section-kicker">Lived experience, in their own words</span>
          <h2 id="video-bites-title">Video Bites – Voices, Experiences &amp; Perspectives</h2>
          <p>
            Real stories. Lived experiences. Powerful voices. Hear directly from care leavers as they share their journeys, reflections and perspectives.
          </p>
        </header>

        <div className="video-bites-grid">
          {orderedVideos.map((video) => (
            <article className="video-bite-card" key={`${video.displayOrder}-${video.title}`}>
              <button
                className="video-bite-preview"
                type="button"
                aria-label={`Play ${video.title}, shared by ${video.personName}`}
                onClick={() => {
                  setPlaybackError('');
                  setSelectedVideo(video);
                }}
              >
                <img
                  src={video.thumbnail || fallbackThumbnail}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  onError={handleThumbnailError}
                />
                <span className="video-bite-play" aria-hidden="true">
                  <span />
                </span>
                {video.duration && <span className="video-bite-duration">{video.duration}</span>}
              </button>
              <div className="video-bite-copy">
                <span className="video-bite-person">{video.personName}</span>
                <h3>{video.title}</h3>
                <p>{video.description}</p>
                {video.designation && <span className="video-bite-designation">{video.designation}</span>}
              </div>
            </article>
          ))}
        </div>
      </div>

      <dialog
        ref={dialogRef}
        className="video-bite-dialog"
        aria-labelledby="video-bite-dialog-title"
        onClose={() => setSelectedVideo(null)}
        onClick={(event) => {
          if (event.target === dialogRef.current) closePlayer();
        }}
      >
        {selectedVideo && (
          <div className="video-bite-dialog-content">
            <div className="video-bite-dialog-heading">
              <div>
                <span className="section-kicker">{selectedVideo.personName}</span>
                <h3 id="video-bite-dialog-title">{selectedVideo.title}</h3>
              </div>
              <button
                className="video-bite-dialog-close"
                type="button"
                aria-label="Close video player"
                onClick={closePlayer}
              >
                <span aria-hidden="true">×</span>
              </button>
            </div>
            <div className="video-bite-player">
              {playbackSource?.type === 'embed' ? (
                <iframe
                  src={playbackSource.src}
                  title={`${selectedVideo.title} shared by ${selectedVideo.personName}`}
                  allow="autoplay; encrypted-media; picture-in-picture"
                  allowFullScreen
                  referrerPolicy="strict-origin-when-cross-origin"
                />
              ) : playbackSource ? (
                <video
                  src={playbackSource.src}
                  poster={selectedVideo.thumbnail || fallbackThumbnail}
                  controls
                  autoPlay
                  playsInline
                  preload="metadata"
                  aria-label={`${selectedVideo.title} shared by ${selectedVideo.personName}`}
                  onError={() => setPlaybackError('This video could not be played. Check its URL in the video bites configuration.')}
                >
                  Your browser does not support embedded video.
                </video>
              ) : (
                <p className="video-bite-playback-error">This video has an invalid URL. Check the video bites configuration.</p>
              )}
            </div>
            {playbackError && <p className="video-bite-playback-error" role="status">{playbackError}</p>}
            <p className="video-bite-dialog-description">{selectedVideo.description}</p>
          </div>
        )}
      </dialog>
    </section>
  );
}
