import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import FestivalChatbot from './components/FestivalChatbot';
import CareLeaverStories from './components/CareLeaverStories';
import VideoBites from './components/VideoBites';
import { Gallery, GalleryImage } from './components/ui/shared-element-gallery';
import anandBiniyaPhoto from './assets/care-leaders/Anand Biniya.png';
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

const day1Photos = [
  '/day-1/DSC05551.JPG',
  '/day-1/DSC05562.JPG',
  '/day-1/DSC05563.JPG',
  '/day-1/DSC05588.JPG',
  '/day-1/DSC05593.JPG',
];

const festival = {
  year: '2026',
  title: 'National Care Leavers Festival',
};

const galleryPreviewPhotos = day1Photos.map((src, index) => ({
  src,
  alt: `National Care Leavers Festival Day 1 moment ${index + 1}.`,
}));

const festivalWhatsAppChannel = 'https://whatsapp.com/channel/0029Vb8wWtGJP21BAIBQU322';
const festivalEmail = '2026nclf@gmail.com';
const festivalRegistrationUrl = import.meta.env.VITE_NCLF_2027_REGISTRATION_URL?.trim()
  || 'https://docs.google.com/forms/d/e/1FAIpQLSc-seG9SIs3vbD4_CG4_aMJZmwT2rNuont91x2R3i72VD47mQ/viewform?usp=header';
const festivalEmailLink = (subject) => `mailto:${festivalEmail}?subject=${encodeURIComponent(subject)}`;
const socialLinks = [
  { name: 'Instagram', href: 'https://www.instagram.com/nclf2026', icon: 'instagram' },
  { name: 'Facebook', href: 'https://www.facebook.com/profile.php?id=61595764058285&sk=about', icon: 'facebook' },
  { name: 'LinkedIn', href: 'https://www.linkedin.com/in/nclf-cls-initiative-468474447/', icon: 'linkedin' },
];

const careLeaders = [
  {
    name: 'Anand Biniya',
    designation: 'Associate Product & Operations Manager · IFACET, IIT Kanpur Foundation for Advanced Technology',
    summary: 'Anand Biniya is a care leaver, community builder and technology enthusiast passionate about creating opportunities for care-experienced young people.',
    biography: 'Anand Biniya is a care leaver, community builder and technology enthusiast passionate about creating opportunities for care-experienced young people. Drawing from his lived experience of institutional care, he actively works towards strengthening support systems, promoting youth participation and creating inclusive spaces for care leavers. With a background in technology, product development and operations, he brings together social impact and digital innovation to address challenges faced by young people transitioning out of institutional care. He believes in the power of lived experiences, collective action and leadership in shaping a future where every care leaver has the opportunity to thrive.',
    photo: anandBiniyaPhoto,
  },
  {
    name: 'Jimadi Das',
    designation: 'Outreach Worker · FiT, Udayan Care',
    summary: 'A social worker at Udayan Care, working in child protection, family strengthening, community development, youth participation and child care reform advocacy.',
    biography: 'A social worker at Udayan Care, working in child protection, family strengthening, community development, youth participation and child care reform advocacy.',
    photo: '/care-leaders/jimadi-das.png',
  },
  {
    name: 'Masooma',
    designation: 'Counsellor · FiT, Udayan Care',
    summary: 'Works towards the holistic development, protection and empowerment of vulnerable children and families.',
    biography: 'Works towards the holistic development, protection and empowerment of vulnerable children and families through counselling, case management, life skills education, community engagement and coordinated support services.',
    photo: '/care-leaders/masooma.png',
  },
  {
    name: 'Rajkumar Sharma',
    designation: 'Assistant Programme Coordinator, National LIFT for Care Leavers · A.R.T., Udayan Care; Global Fellow, South Asian Fellowship; Bachelor of Social Work student, IGNOU',
    summary: 'India’s first openly transgender woman with lived care experience, empowering care leavers to embrace their identities, drive change and lead a national Care Leaders’ project.',
    biography: 'India’s first openly transgender woman with lived care experience, empowering care leavers to embrace their identities, drive change and lead a national Care Leaders’ project.',
    photo: '/care-leaders/rajkumar-sharma.png',
  },
  {
    name: 'Shakul Ali',
    designation: 'Community Mobiliser · FiT, Udayan Care',
    summary: 'Currently pursuing a Bachelor of Social Work (BSW), building a strong foundation in social work principles, community development and human behaviour.',
    biography: 'Currently pursuing a Bachelor of Social Work (BSW), building a strong foundation in social work principles, community development and human behaviour. My studies are shaping my ability to understand individual and family needs and respond with empathy and practical support. I am eager to apply what I have learned in real-world settings and contribute to meaningful social change.',
    photo: '/care-leaders/shakul-ali-updated.png',
  },
  {
    name: 'Sohail',
    designation: 'Entitlement Officer · FiT, Udayan Care',
    summary: 'Works closely with communities and young people, learning from their stories and experiences and building positive connections.',
    biography: 'Work closely with communities and young people, and I enjoy every part of it. Their stories and experiences have taught me valuable lessons that have helped me grow personally and professionally. I love meeting new people, building connections, and learning from others, because every interaction is a chance to learn something new and make a positive difference in society.',
    photo: '/care-leaders/sohail.png',
  },
  {
    name: 'Summi Munir',
    designation: 'Counsellor · FiT, Udayan Care',
    summary: 'A psychology professional passionate about social work and community well-being, dedicated to empowering families and nurturing individuals’ emotional and social growth.',
    biography: 'A psychology professional passionate about social work and community well-being, dedicated to empowering families and nurturing individuals’ emotional and social growth. Working for a social cause gives my journey purpose and brings out my best.',
    photo: '/care-leaders/summi-munir-updated.png',
  },
  {
    name: 'Surja',
    designation: 'Programme Coordinator, AOP (Delhi) & GCLC Secretariat · A.R.T., Udayan Care; Journalism & Mass Communication student, IGNOU',
    summary: 'A passionate advocate with three years of experience supporting care-experienced youth and care leavers.',
    biography: 'A passionate advocate with three years of experience supporting care-experienced youth and care leavers. I believe in the power of participation, empathy and initiative. I love connecting with people, managing impactful projects and sharing real stories through my blog. My goal is to create safe spaces where care leavers can speak up, be heard and shape their own futures.',
    photo: '/care-leaders/surja.png',
  },
];

const festivalMoments = [
  { date: '17 JANUARY · DAY 1', title: 'Heal and Connect', detail: 'Making space to laugh, share experiences and begin building trust through creative and systems-led activities.', photo: day1Photos[0] || festivalPhotos[0] },
  { date: '18 JANUARY · DAY 2', title: 'Reconnect and Reflect', detail: 'Returning to shared memories, reconnecting with alumni and reflecting on the journeys that brought everyone together.', photo: day1Photos[1] || festivalPhotos[1] },
  { date: '19 JANUARY · DAY 3', title: 'Graduate and Lead', detail: 'Celebrating the LIFT Fellowship journey and exploring how theatre, learning and leadership can create the next opportunity.', photo: day1Photos[2] || festivalPhotos[2] },
  { date: '20 JANUARY · DAY 4', title: 'Speak to Policy', detail: 'Bringing care-experienced voices into a stakeholder conversation about aftercare and the future of support.', photo: day1Photos[3] || festivalPhotos[3] },
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
  const menuToggleRef = useRef(null);
  const navItems = [
    ['Home', '#home', 'home'],
    ['Festival editions', '#festival-editions', 'festival-editions'],
    ['Gallery', '#festival-gallery', 'festival-gallery'],
    ['Care Leaders', '#care-leaders', 'care-leaders'],
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

  useEffect(() => {
    if (!menuOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setMenuOpen(false);
        menuToggleRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [menuOpen]);

  return (
    <header className="site-header">
      <a className="brand" href="#home" aria-label={`${festival.title} home`} onClick={() => { setMenuOpen(false); setActiveSection('home'); }}>
        <BrandMark />
        <span className="brand-copy">
          <strong>{festival.title}</strong>
          <small>Lived experience. Leading the future.</small>
        </span>
      </a>
      <button
        ref={menuToggleRef}
        className="menu-toggle"
        type="button"
        aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
        aria-expanded={menuOpen}
        aria-controls="primary-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <Icon name={menuOpen ? 'close' : 'menu'} size={23} />
      </button>
      <nav id="primary-navigation" className={`main-nav${menuOpen ? ' is-open' : ''}`} aria-label="Main navigation">
        {navItems.map(([label, href, id]) => (
          <a
            className={`nav-link${activeSection === id ? ' active' : ''}`}
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
    >
      <img
        className="hero-background-image"
        src={day1Photos[0] || festivalPhotos[0]}
        alt=""
        aria-hidden="true"
        fetchpriority="high"
        decoding="async"
      />
      <div className="hero-copy">
        <span className="hero-kicker">National Care Leavers Festival</span>
        <h1 id="hero-title">A movement led by<br /><span>care-experienced youth.</span></h1>
        <p className="hero-secondary">
          We exist. Our voices matter. Together, we are creating belonging, opportunity and a future shaped by care-experienced leadership.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href="#about">
            Explore the Movement
          </a>
          <a className="button button-quiet" href="#day-1-highlight">
            Watch Our Journey
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
        <span className="section-kicker">First of its kind festival for Care Leavers</span>
        <h2>More than an event.<br /><span>A movement.</span></h2>
      </div>
      <div className="about-copy">
        <p className="about-lead">
          The movement exists because care-experienced young people deserve to be seen, heard and recognised as leaders—not only as beneficiaries of change.
        </p>
        <p>
          It brings lived experience into everyday action: building belonging, strengthening friendships, creating opportunities and challenging the systems that shape life after care.
        </p>
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
        <div className="edition-video" id="day-1-highlight">
          <video
            src="/Day%203%20highlight.mp4"
            poster={day1Photos[4] || festivalPhotos[0]}
            controls
            playsInline
            preload="metadata"
            aria-label="National Care Leavers Festival 2026 highlights"
          >
            Your browser does not support embedded video. You can play the festival highlights in a video-capable browser.
          </video>
        </div>
        <div className="moments-heading edition-gallery-heading">
          <div>
            <h3 className="moments-primary-heading">From the 2026 Edition</h3>
          </div>
          <a className="text-link" href="#festival-gallery">View all moments <Icon name="arrow" size={17} /></a>
        </div>
        <FestivalMomentsWall />
        <PhotoGallery />
        <FestivalImpact />
      </div>
    </section>
  );
}

function FestivalMomentsWall() {
  return (
    <div className="moment-day-grid">
      {festivalMoments.map((moment) => (
        <article className="moment-day-card" key={moment.date}>
          <img
            src={moment.photo}
            alt={`National Care Leavers Festival, ${moment.date}`}
            loading="lazy"
            decoding="async"
          />
          <div className="moment-day-copy">
            <span className="moment-day-date">{moment.date}</span>
            <p>{moment.detail}</p>
            <h4>{moment.title}</h4>
          </div>
        </article>
      ))}
    </div>
  );
}

function FestivalImpact() {
  const impacts = [
    { number: '04', title: 'Days of lived experience', detail: 'A full journey of connection, reflection, graduation and policy conversation.' },
    { number: '04', title: 'Purposes brought together', detail: 'Healing, reflection, leadership and policy voice shaped the 2026 edition.' },
    { number: '01', title: 'Shared movement', detail: 'Care-experienced people connected across the festival to lead and create change.' },
  ];

  return (
    <section className="festival-impact" aria-labelledby="festival-impact-title">
      <div className="festival-impact-heading">
        <span className="section-kicker">The Impact We Are Building</span>
        <h3 id="festival-impact-title">A festival that moves beyond the moment</h3>
      </div>
      <div className="festival-impact-grid">
        {impacts.map((impact) => (
          <article className="festival-impact-card" key={impact.title}>
            <span className="festival-impact-number">{impact.number}</span>
            <h4>{impact.title}</h4>
            <p>{impact.detail}</p>
          </article>
        ))}
      </div>
    </section>
  );
}

function CareLeaders() {
  const [selectedLeader, setSelectedLeader] = useState(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (selectedLeader && !dialog.open) dialog.showModal();
    if (!selectedLeader && dialog.open) dialog.close();
  }, [selectedLeader]);

  return (
    <>
      <section className="care-leaders-section section-space" id="care-leaders" aria-labelledby="care-leaders-title">
        <div className="section-wrap">
          <header className="care-leaders-heading">
            <h2 id="care-leaders-title">THE PEOPLE BEHIND<br /><span>THE MOVEMENT</span></h2>
            <p className="care-leaders-introduction">
              Care Leaders bring lived experience, professional insight and community purpose to every part of the movement.
            </p>
          </header>

          <div className="care-leaders-grid">
            {careLeaders.map((leader, index) => (
              <button
                className="care-leader-card"
                key={leader.name}
                type="button"
                aria-haspopup="dialog"
                aria-label={`Read ${leader.name}'s full profile`}
                onClick={() => setSelectedLeader(leader)}
              >
                <span className="care-leader-photo">
                  <img
                    src={leader.photo}
                    alt={`${leader.name}, Care Leader at the National Care Leavers Festival`}
                    loading="lazy"
                    decoding="async"
                  />
                  <span className="care-leader-number">0{index + 1}</span>
                </span>
                <span className="care-leader-copy">
                  <span className="care-leader-name">{leader.name}</span>
                  <span className="care-leader-designation">{leader.designation}</span>
                  <span className="care-leader-summary">{leader.summary}</span>
                  <span className="care-leader-link">Read full profile <Icon name="arrow" size={17} /></span>
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <dialog
        ref={dialogRef}
        className="care-leader-dialog"
        aria-labelledby="care-leader-dialog-title"
        onClose={() => setSelectedLeader(null)}
        onCancel={() => setSelectedLeader(null)}
        onKeyDown={(event) => {
          if (event.key === 'Escape') {
            event.preventDefault();
            dialogRef.current?.close();
          }
        }}
        onClick={(event) => {
          if (event.target === dialogRef.current) dialogRef.current.close();
        }}
      >
        {selectedLeader && (
          <article className="care-leader-dialog-content">
            <div className="care-leader-dialog-photo">
              <img src={selectedLeader.photo} alt={`${selectedLeader.name}, Care Leader at the National Care Leavers Festival`} />
            </div>
            <div className="care-leader-dialog-copy">
              <button
                className="care-leader-dialog-close"
                type="button"
                aria-label="Close profile"
                onClick={() => dialogRef.current?.close()}
              >
                <Icon name="close" size={20} />
              </button>
              <span className="section-kicker">Care Leader · National Care Leavers Festival</span>
              <h2 id="care-leader-dialog-title">{selectedLeader.name}</h2>
              <p className="care-leader-dialog-designation">{selectedLeader.designation}</p>
              <p className="care-leader-dialog-biography">{selectedLeader.biography}</p>
            </div>
          </article>
        )}
      </dialog>
    </>
  );
}

function PhotoGallery() {
  const galleryRef = useRef(null);
  const photoRefs = useRef([]);
  const [galleryPhotos, setGalleryPhotos] = useState([]);

  useEffect(() => {
    let active = true;

    fetch('/day-1/manifest.json')
      .then((response) => {
        if (!response.ok) throw new Error('Could not load the Day 1 gallery.');
        return response.json();
      })
      .then((names) => {
        if (!active) return;
        setGalleryPhotos(names.map((name, index) => ({
          src: `/day-1/${encodeURIComponent(name)}`,
          alt: `National Care Leavers Festival Day 1 moment ${index + 1}.`,
        })));
      })
      .catch(() => {
        if (active) setGalleryPhotos(galleryPreviewPhotos);
      });

    return () => {
      active = false;
    };
  }, []);

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
      const nextIndex = (currentIndex + 1) % galleryPhotos.length;
      const nextPhoto = photoRefs.current[nextIndex];
      if (!nextPhoto) return;

      gallery.dataset.activeSlide = String(nextIndex);
      gallery.scrollTo({
        left: nextPhoto.offsetLeft - gallery.offsetLeft,
        behavior: 'smooth',
      });
    }, 5000);

    return () => window.clearInterval(intervalId);
  }, [galleryPhotos.length]);

  return (
    <div className="photo-gallery" id="festival-gallery" aria-labelledby="photo-gallery-title">
      <div className="photo-gallery-heading">
        <span className="section-kicker">Festival gallery · 2026 Edition</span>
        <h3 id="photo-gallery-title">The people. The energy. <span>All together.</span></h3>
      </div>

      {/* Desktop View: Shared Element Interactive Grid (1 big featured hero + 6 surrounding layout) */}
      <div className="photo-gallery-desktop-view">
        <Gallery>
          <div className="photo-gallery-grid photo-gallery-desktop-grid">
            {galleryPhotos.map((photo, index) => (
              <GalleryImage
                key={'desktop-photo-' + index}
                id={'festival-photo-' + index}
                src={photo.src}
                alt={photo.alt}
                className={'photo-gallery-item photo-gallery-item-' + (index + 1) + ' festival-gallery-thumb'}
                imgClassName="festival-gallery-img"
              />
            ))}
          </div>
        </Gallery>
      </div>

      {/* Mobile View: Horizontal Auto-scrolling Gallery */}
      <div className="photo-gallery-mobile-view">
        <div className="photo-gallery-grid" ref={galleryRef} onScroll={updateActivePhoto} role="region" aria-label="National Care Leavers Festival photo gallery">
          {galleryPhotos.map((photo, index) => (
            <figure
              className={'photo-gallery-item photo-gallery-item-' + (index + 1)}
              key={photo.src}
              ref={(element) => { photoRefs.current[index] = element; }}
            >
              <img
                src={photo.src}
                alt={photo.alt}
                loading="lazy"
                decoding="async"
              />
            </figure>
          ))}
        </div>
      </div>
    </div>
  );
}

function CommunityOrganisations() {
  const organisations = [
    'Udayan Care',
    'IFACET, IIT Kanpur',
    'FiT',
    'A.R.T.',
    'IGNOU',
    'South Asian Fellowship',
  ];

  return (
    <section className="community-organisations section-space" aria-labelledby="community-organisations-title">
      <div className="section-wrap">
        <header className="community-organisations-heading">
          <span className="section-kicker">Community connections</span>
          <h2 id="community-organisations-title">Organisations represented in the movement</h2>
          <p>
            The people behind the movement bring experience from organisations across care, education, advocacy and community development.
          </p>
        </header>
        <div className="community-organisations-list" aria-label="Organisations represented by Care Leaders">
          {organisations.map((organisation) => (
            <span className="community-organisation" key={organisation}>{organisation}</span>
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
            <p>The January 2026 festival has passed, but the movement continues. Choose how you would like to stay connected or contribute.</p>
          </div>
          <div className="involved-options">
            <a
              className="involved-option"
              href={festivalRegistrationUrl || undefined}
              target={festivalRegistrationUrl ? '_blank' : undefined}
              rel={festivalRegistrationUrl ? 'noopener noreferrer' : undefined}
              aria-disabled={!festivalRegistrationUrl}
            >
              <span className="option-number">01</span>
              <span>
                <strong>Join the 2027 Festival</strong>
                <small>{festivalRegistrationUrl ? 'Register for the festival' : 'Registration link to be configured'}</small>
              </span>
              <Icon name="arrow" />
            </a>
            <a className="involved-option" href={festivalEmailLink('Volunteering with the National Care Leavers Festival')}>
              <span className="option-number">02</span>
              <span><strong>Become a Volunteer</strong><small>Contact the team to discuss volunteering</small></span>
              <Icon name="arrow" />
            </a>
            <a className="involved-option" href={festivalEmailLink('Partnering with the National Care Leavers Festival')}>
              <span className="option-number">03</span>
              <span><strong>Partner With Us</strong><small>Explore a partnership with the festival team</small></span>
              <Icon name="arrow" />
            </a>
            <a className="involved-option" href={festivalEmailLink('Supporting the National Care Leavers Festival')}>
              <span className="option-number">04</span>
              <span><strong>Support the Movement</strong><small>Contact the team to discuss ways to help</small></span>
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
              <span className="brand-copy"><strong>{festival.title}</strong><small>Lived experience. Leading the future.</small></span>
            </a>
            <p>A festival for care-experienced young people to connect, create and celebrate.</p>
          </div>
          <div className="footer-links">
            <span>Explore</span>
            <a href="#home">Home</a>
            <a href="#festival-editions">Festival editions</a>
            <a href="#care-leaders">Care Leaders</a>
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
        <CareLeaders />
        <VideoBites />
        <CareLeaverStories />
        <CommunityOrganisations />
        <GetInvolved />
      </main>
      <Footer />
      <FestivalChatbot email={festivalEmail} whatsappUrl={festivalWhatsAppChannel} />
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
