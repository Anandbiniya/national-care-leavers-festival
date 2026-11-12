import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import versionTwoTestimonial from '../Version 2.mp4';
import BrandVideoPlayer from './components/ui/BrandVideoPlayer';
import FestivalChatbot from './components/FestivalChatbot';
import TiltCascadeCarousel from './components/ui/tilt-cascade-carousel';
import { Gallery, GalleryGrid, GalleryImage } from './components/ui/shared-element-gallery';
import './styles.css';

const festivalPhotos = [
  '/photos/festival-1.jpg',
  '/photos/festival-2.jpg',
  '/photos/festival-3.jpg',
  '/photos/festival-4.jpg',
  '/photos/festival-5.jpg',
  '/photos/festival-6.jpg',
  '/photos/festival-7.jpg',
];

const festival = {
  year: '2026',
  title: 'National Care Leavers Festival',
  theme: 'A movement led by care-experienced youth.',
  dates: 'January 17–20, 2026',
  shortDates: 'Jan 17–20, 2026',
  city: 'New Delhi, India',
  registrationUrl: '#join-the-movement',
};

const festivalWhatsAppChannel = 'https://whatsapp.com/channel/0029Vb8wWtGJP21BAIBQU322';
const festivalEmail = '2026nclf@gmail.com';
const socialLinks = [
  { name: 'Instagram', href: 'https://www.instagram.com/nclf2026', icon: 'instagram' },
  { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61595764058285&sk=about', icon: 'facebook' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/nclf-cls-initiative-468474447/', icon: 'linkedin' },
];

const values = [
  {
    number: '01',
    title: 'Care leavers lead',
    text: 'A celebration of care leavers, for care leavers and by care leavers.',
  },
  {
    number: '02',
    title: 'Achievements celebrated',
    text: 'Recognising the leadership, success and contributions of care leavers.',
  },
  {
    number: '03',
    title: 'Stories shared',
    text: 'Making space for lived experience, ideas and voices from across India.',
  },
  {
    number: '04',
    title: 'Opportunity built',
    text: 'Building the voice, networks and opportunities to shape the future of aftercare.',
  },
];

const attendeeTestimonials = [
  { id: 'attendee-1', src: versionTwoTestimonial, poster: festivalPhotos[1] },
  { id: 'attendee-2', src: '/Day%203%20highlight.mp4', poster: festivalPhotos[4] },
  { id: 'attendee-3', src: null, poster: festivalPhotos[6] },
];

const festivalMoments = [
  { date: '17 JAN · HEAL AND CONNECT', title: 'Heal and Connect', detail: 'Laughter Chef Experience, Systems Thinking Workshop, theatre begins', photo: festivalPhotos[0] },
  { date: '18 JAN · RECONNECT AND REFLECT', title: 'Reconnect and Reflect', detail: 'Alumni visioning sessions, theatre practice', photo: festivalPhotos[1] },
  { date: '19 JAN · GRADUATE AND LEAD', title: 'Graduate and Lead', detail: 'LIFT Fellowship graduation (3rd cohort), theatre performance, LEAP workshop', photo: festivalPhotos[2] },
  { date: '20 JAN · SPEAK TO POLICY', title: 'Speak to Policy', detail: 'Stakeholder consultation on aftercare in Delhi NCR', photo: festivalPhotos[3] },
];

function Icon({ name, size = 18 }) {
  const shared = {
    width: size,
    height: size,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round',
    strokeLinejoin: 'round',
    'aria-hidden': true,
  };

  const paths = {
    arrow: <><path d="M5 12h14" /><path d="m13 6 6 6-6 6" /></>,
    calendar: <><rect x="3" y="5" width="18" height="16" rx="2" /><path d="M16 3v4M8 3v4M3 10h18" /></>,
    pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z" /><circle cx="12" cy="10" r="2.5" /></>,
    search: <><circle cx="10.8" cy="10.8" r="6.8" /><path d="m16 16 4.5 4.5" /></>,
    menu: <><path d="M4 7h16M4 12h16M4 17h16" /></>,
    close: <><path d="m18 6-12 12M6 6l12 12" /></>,
    mail: <><rect x="3" y="5" width="18" height="14" rx="2" /><path d="m3 7 9 6 9-6" /></>,
    sparkle: <><path d="m12 3 1.9 5.8L20 11l-6.1 2.2L12 19l-1.9-5.8L4 11l6.1-2.2L12 3Z" /><path d="m19 14 1.2 2.8L23 18l-2.8 1.2L19 22l-1.2-2.8L15 18l2.8-1.2L19 14Z" /></>,
    instagram: <><rect x="3" y="3" width="18" height="18" rx="5" /><circle cx="12" cy="12" r="4" /><circle cx="18" cy="6" r=".7" fill="currentColor" /></>,
    facebook: <path d="M14.5 21v-8h2.8l.5-3h-3.3V8c0-1 .3-1.6 1.7-1.6h1.7V3.7c-.6-.1-1.5-.2-2.6-.2-2.7 0-4.5 1.6-4.5 4.6V10H8v3h2.8v8" />,
    linkedin: <><rect x="3" y="9" width="4" height="12" /><path d="M5 5.5v.1M11 21V9h4v2c.8-1.5 2-2.2 3.4-2.2 2.5 0 3.6 1.6 3.6 4.7V21h-4v-7c0-1.5-.4-2.4-1.7-2.4-1.5 0-2.3 1-2.3 3V21Z" /></>,
    lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3M12 14v3" /></>,
    play: <path d="m9 6 10 6-10 6V6Z" fill="currentColor" stroke="none" />,
  };

  return <svg {...shared}>{paths[name] || paths.sparkle}</svg>;
}

function BrandMark() {
  return (
    <span className="brand-mark" aria-hidden="true">
      <svg viewBox="0 0 48 48" focusable="false">
        <path d="M13 34V14l22 20V14" />
        <circle cx="36" cy="12" r="4" />
      </svg>
    </span>
  );
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const navItems = [
    ['Home', '#home', 'home'],
    ['Festival editions', '#festival-editions', 'festival-editions'],
    ["Care Leavers' stories", '#care-leavers-stories', 'care-leavers-stories'],
    ['Join the Movement', '#join-the-movement', 'join-the-movement'],
  ];

  useEffect(() => {
    const sections = navItems
      .map(([, , id]) => document.getElementById(id))
      .filter(Boolean);
    if (!('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) setActiveSection(entry.target.id);
      });
    }, { rootMargin: '-25% 0px -65% 0px' });
    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="site-header">
      <a className="brand" href="#home" aria-label={`${festival.title} home`} onClick={() => { setMenuOpen(false); setActiveSection('home'); }}>
        <BrandMark />
        <span className="brand-copy">
          <strong>{festival.title}</strong>
          <small>Care leavers lead.</small>
        </span>
      </a>
      <button
        className="menu-toggle"
        type="button"
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={menuOpen}
        onClick={() => setMenuOpen((open) => !open)}
      >
        <Icon name={menuOpen ? 'close' : 'menu'} size={23} />
      </button>
      <nav className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
        {navItems.map(([label, href, id], index) => (
          <a
            className={`nav-link${index === 3 ? ' nav-register' : ''}${activeSection === id ? ' active' : ''}`}
            href={href}
            key={label}
            aria-current={activeSection === id ? 'location' : undefined}
            onClick={() => {
              setMenuOpen(false);
              setActiveSection(id);
            }}
          >
            {label}
          </a>
        ))}
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section
      className="hero"
      id="home"
      aria-labelledby="hero-title"
      style={{ backgroundImage: `url("${festivalPhotos[0]}")` }}
    >
      <video
        className="hero-background-video"
        src="/Day%203%20highlight.mp4"
        poster={festivalPhotos[0]}
        aria-hidden="true"
        autoPlay
        muted
        loop
        playsInline
        preload="auto"
      />
      <div className="hero-copy">
        {/* <span className="eyebrow"><span className="eyebrow-dot" /> A movement led by care-experienced youth</span> */}
        <h1 id="hero-title">A movement led by<br /><span>care-experienced youth.</span></h1>
        <p className="hero-secondary">
          A national festival where care leavers lead. Celebrate their success, hear their stories,
          and discover the opportunities for care leavers across India.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href={festival.registrationUrl}>
            Join the movement <Icon name="arrow" />
          </a>
          <a className="button button-quiet" href="#festival-editions">
            Explore the 2026 edition
          </a>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <section className="about-section section-wrap section-space" id="about">
      <div className="section-heading">
        <span className="section-kicker">First of it's kind festival for Care Leavers</span>
        <h2>More than an event.<br /><span>A movement.</span></h2>
      </div>
      <div className="about-body">
        <p>
          This festival isn’t about what’s missing. It’s about what’s possible when care leavers are believed, supported and leading the way.
        </p>
        <p>
          Celebrating a future where care leavers have the voice, the networks and the opportunities to lead.
        </p>
        <p>
          A national festival to bring the diverse care experienced people at one place to share and build a strong community
        </p>
        <p>
          a celebration of the Care Leavers, For the Care Leavers and By the Care Leavers
        </p>
        <div className="values-grid">
          {values.map((value) => (
            <article className="value-card" key={value.number}>
              <span>{value.number}</span>
              <h3>{value.title}</h3>
              <p>{value.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Edition2026() {
  return (
    <section className="edition-section section-space" aria-labelledby="edition-2026-title">
      <div className="section-wrap">
        <div className="edition-heading">
          <div>
            <span className="section-kicker">Festival Editions · January 2026</span>
            <h2 id="edition-2026-title">2026 Edition:<br /><span>Honour the journey</span></h2>
          </div>
          <p>
            A four-day learning experience created by care leavers for care leavers.
          </p>
        </div>
        <div className="edition-feature">
          <div className="edition-feature-copy">
            <span className="archive-number">2026 FESTIVAL FILM</span>
            <h3>Festival highlights</h3>
            <p>A look back at the connections, celebrations and shared moments from January 2026.</p>
          </div>
          <a className="edition-film-link" href="#home">
            <span className="edition-film-play" aria-hidden="true">▶</span>
            <span>
              <strong>Watch the festival highlights</strong>
              <small>Return to the film playing in the home-page hero</small>
            </span>
            <Icon name="arrow" size={20} />
          </a>
        </div>
        <div className="moments-heading edition-gallery-heading">
          <div>
            <span className="section-kicker">From the 2026 festival</span>
            <h3>Moments from the <span>festival.</span></h3>
          </div>
        </div>
        <FestivalMomentsWall />
        <PhotoGallery />
      </div>
    </section>
  );
}

function FestivalMomentsWall() {
  const wallRef = useRef(null);
  const [activeFlipped, setActiveFlipped] = useState(0);
  const [userOverrides, setUserOverrides] = useState({});
  const [isPaused, setIsPaused] = useState(false);
  const [isInView, setIsInView] = useState(false);

  const momentCascadeItems = festivalMoments.map((moment, index) => ({
    title: moment.title,
    number: "0" + (index + 1),
    date: moment.date,
    detail: moment.detail,
    caption: moment.date,
    src: moment.photo,
    alt: "National Care Leavers Festival moment 0" + (index + 1) + ": " + moment.title,
  }));

  useEffect(() => {
    const wall = wallRef.current;
    if (!wall || !('IntersectionObserver' in window)) {
      setIsInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsInView(entry.isIntersecting);
      },
      { threshold: 0.15 }
    );

    observer.observe(wall);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView || isPaused) return undefined;

    const interval = setInterval(() => {
      setActiveFlipped((prev) => (prev + 1) % festivalMoments.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isInView, isPaused]);

  const toggleCard = (index) => {
    setUserOverrides((prev) => {
      const current = prev[index] !== undefined ? prev[index] : (activeFlipped === index);
      return { ...prev, [index]: !current };
    });
  };

  const isCardRevealed = (index) => {
    if (userOverrides[index] !== undefined) {
      return userOverrides[index];
    }
    return activeFlipped === index;
  };

  const jumpToCard = (index) => {
    setActiveFlipped(index);
    setUserOverrides((prev) => ({ ...prev, [index]: true }));
  };

  return (
    <div
      className="moments-wrap"
      ref={wallRef}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      {/* Mobile-only view: Tilt Cascade Carousel */}
      <div className="moments-mobile-view">
        <TiltCascadeCarousel
          items={momentCascadeItems}
          height="410px"
          slideSize="clamp(210px, 68vw, 260px)"
          angle={16}
          drop={0.32}
          inactiveScale={0.72}
          autoplay={3800}
          autoFlip={true}
          flipDelay={1700}
          loop={true}
          controls={false}
          background="transparent"
          ariaLabel="National Care Leavers Festival Moments"
        />
      </div>

      {/* Desktop view: 3s sequential auto-flip wall */}
      <div className="moments-desktop-view">
        <div className="moments-controls">
          <div className="moments-steps" aria-label="Moments flip sequence">
            {festivalMoments.map((moment, index) => (
              <button
                key={moment.date}
                type="button"
                className={"moments-step-btn" + (activeFlipped === index ? " active" : "")}
                onClick={() => jumpToCard(index)}
                aria-label={"Show Moment 0" + (index + 1)}
              >
                <strong>0{index + 1}</strong>
                <span>{moment.title}</span>
              </button>
            ))}
          </div>
          <button
            type="button"
            className="moments-auto-badge"
            onClick={() => setIsPaused(!isPaused)}
            aria-label={isPaused ? "Resume auto-flip sequence" : "Pause auto-flip sequence"}
          >
            <span className={"moments-dot" + (isPaused ? " is-paused" : "")} />
            <span>{isPaused ? "Paused · Tap to play" : "Auto 3s flip · 1 to 4"}</span>
          </button>
        </div>

        <div className="moments-wall">
          {festivalMoments.map((moment, index) => {
            const revealed = isCardRevealed(index);
            const isActive = activeFlipped === index && !isPaused;
            return (
              <article
                className={"moment-card moment-story moment-story-" + (index + 1) + (isActive ? " is-active" : "")}
                key={moment.date}
              >
                <button
                  className="moment-card-button"
                  type="button"
                  aria-pressed={Boolean(revealed)}
                  aria-label={(revealed ? "Show story" : "Show photo") + " for moment 0" + (index + 1) + ": " + moment.title}
                  onClick={() => toggleCard(index)}
                >
                  <span className={"moment-card-inner" + (revealed ? " is-revealed" : "")}>
                    <span className="moment-card-face moment-card-front" aria-hidden={Boolean(revealed)}>
                      {isActive && <span className="moment-progress-bar" key={activeFlipped} />}
                      <span className="moment-story-number">0{index + 1}</span>
                      <span className="moment-story-date">{moment.date}</span>
                      <span className="moment-story-title">{moment.title}</span>
                      <span className="moment-story-detail">{moment.detail}</span>
                      <span className="moment-card-hint">Tap to see the photo</span>
                    </span>
                    <span className="moment-card-face moment-card-back" aria-hidden={!revealed}>
                      <img src={moment.photo} alt={"National Care Leavers Festival moment 0" + (index + 1)} loading="lazy" decoding="async" />
                      <span className="moment-card-back-caption">
                        <span className="moment-story-number">0{index + 1}</span>
                        <span>{moment.title}</span>
                      </span>
                    </span>
                  </span>
                </button>
              </article>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function CareLeaversStories() {
  const [search, setSearch] = useState('');

  return (
    <section className="leaders-section section-space" aria-labelledby="leaders-title">
      <div className="section-wrap">
        <div className="leaders-directory-heading">
          <span className="section-kicker">Care Leavers' stories</span>
          <h2 id="leaders-title">Our Care Leavers' community</h2>
          <p>
            Across India, care-experienced leaders are turning lived experience into lasting change. These are their stories: where they come from, what they are building and the impact they are creating.
          </p>
          <label className="leader-search">
            <Icon name="search" size={18} />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search care-leaver stories..."
              aria-label="Search care-leaver stories"
            />
          </label>
        </div>
        <div className="stories-empty-state" role="status" aria-live="polite">
          <span className="section-kicker">{search.trim() ? 'No matching stories yet' : 'Stories coming soon'}</span>
          <p>
            Verified care-leaver profiles and their approved photographs were not included in the
            available project files. They can be featured here once the source stories and image
            permissions are available.
          </p>
        </div>
      </div>
    </section>
  );
}

function PhotoGallery() {
  const galleryRef = useRef(null);
  const photoRefs = useRef([]);

  function updateActivePhoto() {
    const gallery = galleryRef.current;
    if (!gallery || !window.matchMedia('(max-width: 760px)').matches) return;

    const activeIndex = photoRefs.current.reduce((closest, photo, index) => {
      if (!photo) return closest;
      const currentDistance = Math.abs(photo.offsetLeft - gallery.offsetLeft - gallery.scrollLeft);
      const closestDistance = Math.abs(
        photoRefs.current[closest].offsetLeft - gallery.offsetLeft - gallery.scrollLeft,
      );
      return currentDistance < closestDistance ? index : closest;
    }, 0);
    gallery.dataset.activeSlide = String(activeIndex);
  }

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      const gallery = galleryRef.current;
      if (
        !gallery ||
        !window.matchMedia('(max-width: 760px)').matches ||
        window.matchMedia('(prefers-reduced-motion: reduce)').matches ||
        document.hidden ||
        gallery.matches(':focus-within') ||
        (window.matchMedia('(hover: hover)').matches && gallery.matches(':hover'))
      ) return;

      const currentIndex = Number(gallery.dataset.activeSlide || 0);
      const nextIndex = (currentIndex + 1) % festivalPhotos.length;
      const nextPhoto = photoRefs.current[nextIndex];
      if (!nextPhoto) return;

      gallery.dataset.activeSlide = String(nextIndex);
      gallery.scrollTo({
        left: nextPhoto.offsetLeft - gallery.offsetLeft,
        behavior: 'smooth',
      });
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, []);

  return (
    <div className="photo-gallery" aria-labelledby="photo-gallery-title">
      <div className="photo-gallery-heading">
        <span className="section-kicker">Festival gallery · 2026</span>
        <h3 id="photo-gallery-title">The people. The energy. <span>All together.</span></h3>
        <p>Photographs from the National Care Leavers Festival.</p>
      </div>

      {/* Desktop View: Shared Element Interactive Grid (1 big featured hero + 6 surrounding layout) */}
      <div className="photo-gallery-desktop-view">
        <Gallery>
          <div className="photo-gallery-grid photo-gallery-desktop-grid">
            {festivalPhotos.map((photo, index) => (
              <GalleryImage
                key={'desktop-photo-' + index}
                id={'festival-photo-' + index}
                src={photo}
                alt={'National Care Leavers Festival 2026, photograph ' + (index + 1)}
                className={'photo-gallery-item photo-gallery-item-' + (index + 1) + ' festival-gallery-thumb'}
                imgClassName="festival-gallery-img"
              />
            ))}
          </div>
        </Gallery>
      </div>

      {/* Mobile View: Horizontal Auto-scrolling Gallery */}
      <div className="photo-gallery-mobile-view">
        <div className="photo-gallery-grid" ref={galleryRef} onScroll={updateActivePhoto} aria-label="National Care Leavers Festival photographs">
          {festivalPhotos.map((photo, index) => (
            <figure
              className={'photo-gallery-item photo-gallery-item-' + (index + 1)}
              key={photo}
              ref={(element) => { photoRefs.current[index] = element; }}
            >
              <img
                src={photo}
                alt={'National Care Leavers Festival 2026, photograph ' + (index + 1)}
                loading={index < 3 ? 'eager' : 'lazy'}
                decoding="async"
              />
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}

function Testimonials() {
  const testimonialGridRef = useRef(null);
  const testimonialRefs = useRef([]);

  function updateActiveTestimonial() {
    const carousel = testimonialGridRef.current;
    if (!carousel || !window.matchMedia('(max-width: 760px)').matches) return;

    const activeIndex = testimonialRefs.current.reduce((closest, testimonial, index) => {
      if (!testimonial) return closest;
      const currentDistance = Math.abs(
        testimonial.offsetLeft - carousel.offsetLeft - carousel.scrollLeft,
      );
      const closestDistance = Math.abs(
        testimonialRefs.current[closest].offsetLeft - carousel.offsetLeft - carousel.scrollLeft,
      );
      return currentDistance < closestDistance ? index : closest;
    }, 0);
    carousel.dataset.activeSlide = String(activeIndex);
  }

  return (
    <section className="testimonials-section section-space" aria-labelledby="testimonials-title">
      <div className="section-wrap">
        <span className="section-kicker">Attendee voices</span>
        <h2 id="testimonials-title">What the attendees have to say about the festival</h2>
        <div className="testimonial-grid" ref={testimonialGridRef} onScroll={updateActiveTestimonial}>
          {attendeeTestimonials.map((testimonial, index) => (
            <article
              className="testimonial-card"
              key={testimonial.id}
              ref={(element) => { testimonialRefs.current[index] = element; }}
            >
              <div className="testimonial-media">
                {testimonial.src ? (
                  <BrandVideoPlayer
                    src={testimonial.src}
                    poster={testimonial.poster}
                    title={"Attendee video " + (index + 1)}
                    autoPlayOnVisible={true}
                  />
                ) : (
                  <div className="testimonial-placeholder-media">
                    <img src={testimonial.poster} alt="" aria-hidden="true" />
                    <span className="testimonial-coming-soon">Video coming soon</span>
                  </div>
                )}
              </div>
              <div className="testimonial-card-footer">
                <strong>Attendee video {index + 1}</strong>
                <span>Festival reflection</span>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function GetInvolved() {
  return (
    <section className="involved-section section-space" id="join-the-movement">
      <div className="section-wrap">
        <div className="involved-panel">
          <div className="involved-heading">
            <span className="section-kicker">Join the Movement</span>
            <h2>Keep the movement<br /><span>going.</span></h2>
            <p>The January 2026 festival has passed, but the movement continues. Stay connected with care-experienced leaders and find ways to support the community.</p>
          </div>
          <div className="involved-options">
            <a className="involved-option" href={festivalWhatsAppChannel} target="_blank" rel="noopener noreferrer">
              <span className="option-number">01</span>
              <span><strong>Connect with the community</strong><small>Stay in touch with care-experienced leaders</small></span>
              <Icon name="arrow" />
            </a>
            <a className="involved-option" href={festivalWhatsAppChannel} target="_blank" rel="noopener noreferrer">
              <span className="option-number">02</span>
              <span><strong>Share your creativity</strong><small>Bring your ideas and energy to the movement</small></span>
              <Icon name="arrow" />
            </a>
            <a className="involved-option" href={festivalWhatsAppChannel} target="_blank" rel="noopener noreferrer">
              <span className="option-number">03</span>
              <span><strong>Join the celebration</strong><small>Help make the festival a great time</small></span>
              <Icon name="arrow" />
            </a>
            <a className="involved-option" href={festivalWhatsAppChannel} target="_blank" rel="noopener noreferrer">
              <span className="option-number">04</span>
              <span><strong>Join our WhatsApp channel</strong><small>Follow festival news and updates</small></span>
              <Icon name="arrow" />
            </a>
          </div>
          <div className="involved-contact"><Icon name="arrow" size={17} /> Questions? <a href={`mailto:${festivalEmail}`}>{festivalEmail}</a></div>
        </div>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="site-footer">
      <div className="section-wrap">
        <div className="footer-main">
          <div className="footer-about">
            <a className="brand footer-brand" href="#home">
              <BrandMark />
              <span className="brand-copy"><strong>{festival.title}</strong><small>Care leavers lead.</small></span>
            </a>
            <p>A festival for care-experienced young people to connect, create and celebrate.</p>
          </div>
          <div className="footer-links">
            <span>Explore</span>
            <a href="#home">Home</a>
            <a href="#festival-editions">Festival editions</a>
            <a href="#care-leavers-stories">Care Leavers' stories</a>
            <a href="#join-the-movement">Join the Movement</a>
          </div>
          <div className="footer-links">
            <span>Connect</span>
            <a href={festivalWhatsAppChannel} target="_blank" rel="noopener noreferrer">Festival WhatsApp channel ↗</a>
            <a href={`mailto:${festivalEmail}`}>{festivalEmail}</a>
            <div className="footer-socials" aria-label="Festival social media">
              {socialLinks.map((social) => (
                <a
                  href={social.href}
                  key={social.name}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Visit the festival on ${social.name} (opens in a new tab)`}
                >
                  <Icon name={social.icon} size={19} />
                  <span>{social.name}</span>
                </a>
              ))}
            </div>
          </div>
          <div className="footer-date"><span>{festival.year} FESTIVAL</span><strong>{festival.dates}</strong><small>{festival.city}</small></div>
        </div>
        <div className="footer-bottom">
          <span>© {festival.year} National Care Leavers Festival</span>
          <span>Made for creativity, friendship and celebration.</span>
          <a href="#home">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}

function App() {
  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header />
      <main id="main-content">
        <Hero />
        <About />
        <div className="festival-editions-group" id="festival-editions">
          <Edition2026 />
        </div>
        <div className="stories-group" id="care-leavers-stories">
          <CareLeaversStories />
          <Testimonials />
        </div>
        <GetInvolved />
      </main>
      <Footer />
      <FestivalChatbot email={festivalEmail} whatsappUrl={festivalWhatsAppChannel} />
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
