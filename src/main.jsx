import React, { useEffect, useRef, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { HeartHandshake, Megaphone, Sparkles } from 'lucide-react';
import FaqSection from './components/FaqSection';
import FestivalChatbot from './components/FestivalChatbot';
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

// The gallery collection is built by interleaving the three day manifests
// (day-1, day-2, day-3). The first three entries are the Community sign photo,
// a Day 2 photo and the large hall group photo. Start the gallery at the 4th
// entry of that collection so both excluded photographs are left out, then
// filter exclusions again for any later entries.
const galleryStartIndex = 3;
const galleryPreviewCount = 6;
const excludedGalleryPhotoPaths = new Set([
  '/day-1/DSC05551.JPG',
  '/day-3/DSC07779.JPG',
]);
const heroKickerWords = (() => {
  let order = 0;
  return 'NATIONAL CARE LEAVERS FESTIVAL'.split(' ').map((word) => ({
    word,
    letters: [...word].map((letter) => ({ letter, order: order += 1 })),
  }));
})();

const heroIllustrations = [
  {
    src: '/youth-community-hero-v2.png',
    alt: 'A diverse group of young people cooking together, sharing ideas and celebrating their community.',
  },
  {
    src: '/youth-community-hero.png',
    alt: 'A diverse group of young people listening, sharing ideas and supporting one another.',
  },
];

const aboutPillars = [
  {
    icon: HeartHandshake,
    title: 'Belonging and connection',
    description: 'Building trusted spaces, lasting friendships and peer support beyond care.',
  },
  {
    icon: Sparkles,
    title: 'Opportunities and leadership',
    description: 'Growing skills, leadership and community-led opportunities from lived experience.',
  },
  {
    icon: Megaphone,
    title: 'Care-experienced voices shaping change',
    description: 'Helping young people shape decisions about care, dignity and aftercare.',
  },
];

// Fallback images if the gallery manifests cannot be loaded. These mirror the
// first six eligible images from the interleaved collection.
const galleryPreviewPhotos = [
  { src: '/day-1/DSC05562.JPG', alt: 'Festival entrance with the Udayan Care stand on day 1.' },
  { src: '/day-2/DSC06958.JPG', alt: 'Participants listening during a day 2 session.' },
  { src: '/day-3/DSC07389.JPG', alt: 'A participant setting up a camera during the festival.' },
  { src: '/day-1/DSC05563.JPG', alt: 'The decorated festival entrance on day 1.' },
  { src: '/day-2/DSC06961.JPG', alt: 'Participants gathered in a circle outdoors on day 2.' },
  { src: '/day-3/DSC07387.JPG', alt: 'Two participants talking at a laptop during day 3.' },
];

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
    name: 'Summi Munir',
    designation: 'Counsellor · FiT, Udayan Care',
    summary: 'A psychology professional passionate about social work and community well-being, dedicated to empowering families and nurturing individuals’ emotional and social growth.',
    biography: 'A psychology professional passionate about social work and community well-being, dedicated to empowering families and nurturing individuals’ emotional and social growth. Working for a social cause gives my journey purpose and brings out my best.',
    photo: '/care-leaders/summi-munir-updated.png',
  },
  {
    name: 'Surja',
    designation: 'Programme Coordinator, AOP (Delhi) & GCLC Secretariat \u00B7 A.R.T., Udayan Care',
    summary: 'A passionate advocate with three years of experience supporting care-experienced youth and care leavers.',
    biography: 'A passionate advocate with three years of experience supporting care-experienced youth and care leavers. I believe in the power of participation, empathy and initiative. I love connecting with people, managing impactful projects and sharing real stories through my blog. My goal is to create safe spaces where care leavers can speak up, be heard and shape their own futures.',
    photo: '/care-leaders/surja.png',
  },
  {
    name: 'Rajkumar Sharma',
    designation: 'Assistant Programme Coordinator, National LIFT for Care Leavers \u00B7 A.R.T., Udayan Care',
    summary: 'India’s first openly transgender woman with lived care experience, empowering care leavers to embrace their identities, drive change and lead a national Care Leaders’ project.',
    biography: 'India’s first openly transgender woman with lived care experience, empowering care leavers to embrace their identities, drive change and lead a national Care Leaders’ project.',
    photo: '/care-leaders/rajkumar-sharma.png',
  },
  {
    name: 'Anand Biniya',
    designation: 'Associate Product & Operations Manager \u2013 IFACET, IIT Kanpur',
    summary: 'Anand Biniya is a community builder and technology enthusiast passionate about creating opportunities for young people.',
    biography: 'Anand Biniya is a community builder and technology enthusiast passionate about creating opportunities for young people. With a background in technology, product development and operations, he brings together digital innovation and social impact to address challenges faced by young people transitioning into independent adulthood.\n\nHe is interested in strengthening support systems, promoting youth participation and creating inclusive spaces where young people can connect, learn and grow. Through his work and community engagement, he believes in the power of lived experiences, collective action and youth leadership to create meaningful and lasting change.',
    photo: anandBiniyaPhoto,
  },
  {
    name: 'Shakur Ali',
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
  }
];

const festivalMoments = [
  { date: '17 JANUARY · DAY 1', title: 'Heal and Connect', detail: 'Making space to laugh, share experiences and begin building trust through creative and systems-led activities.', photo: day1Photos[0] || festivalPhotos[0] },
  { date: '18 JANUARY · DAY 2', title: 'Reconnect and Reflect', detail: 'Returning to shared memories, reconnecting with alumni and reflecting on the journeys that brought everyone together.', photo: '/day-2/DSC06961.JPG' },
  { date: '19 JANUARY · DAY 3', title: 'Graduate and Lead', detail: 'Celebrating the LIFT Fellowship journey and exploring how theatre, learning and leadership can create the next opportunity.', photo: '/day-3/DSC07451.JPG' },
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
  const [headerHeight, setHeaderHeight] = useState(null);
  const headerRef = useRef(null);
  const menuToggleRef = useRef(null);
  const navItems = [
    ['Home', '#home', 'home'],
    ['Festival editions', '#festival-editions', 'festival-editions'],
    ['Gallery', '#festival-gallery', 'festival-gallery'],
    ['Care Leaders', '#care-leaders', 'care-leaders'],
    ['Join the Movement', '#join-the-movement', 'join-the-movement'],
  ];

  useEffect(() => {
    const header = headerRef.current;
    if (!header || menuOpen) return undefined;

    const syncHeight = () => {
      const nextHeight = Math.ceil(header.getBoundingClientRect().height);
      if (nextHeight > 0) setHeaderHeight(nextHeight);
    };

    syncHeight();
    if (!('ResizeObserver' in window)) {
      window.addEventListener('resize', syncHeight);
      return () => window.removeEventListener('resize', syncHeight);
    }

    const observer = new ResizeObserver(syncHeight);
    observer.observe(header);
    return () => observer.disconnect();
  }, [menuOpen]);

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
    <>
      <div
        className="site-header-spacer"
        aria-hidden="true"
        style={headerHeight ? { height: `${headerHeight}px` } : undefined}
      />
      <header className="site-header" ref={headerRef}>
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
    </>
  );
}

function useSectionHeadingReveal(ref) {
  useEffect(() => {
    const heading = ref.current;
    if (!heading || !('IntersectionObserver' in window)
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const items = [...heading.querySelectorAll('.section-kicker, h2, h3, p')];
    if (!items.length) return undefined;

    try {
    items.forEach((item, index) => {
      item.style.setProperty('--section-heading-order', index);
      item.classList.add('section-heading-reveal-ready');
    });
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
  }, [ref]);
}

function Hero() {
  return (
    <section
      className="hero"
      id="home"
      aria-labelledby="hero-title"
    >
      <picture className="hero-background-picture">
        <img className="hero-background-image" src={festivalPhotos[6]} alt="" aria-hidden="true" fetchPriority="high" decoding="async" />
      </picture>
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

function MovementHeroPreview() {
  const [isVisible, setIsVisible] = useState(false);
  const [activeIllustration, setActiveIllustration] = useState(0);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);
  const previewRef = useRef(null);

  useEffect(() => {
    const preview = previewRef.current;
    if (!preview || !('IntersectionObserver' in window)) {
      setIsVisible(true);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setIsVisible(true);
        observer.disconnect();
      }
    }, { threshold: 0.2 });
    observer.observe(preview);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const motionPreference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMotionPreference = () => setPrefersReducedMotion(motionPreference.matches);
    updateMotionPreference();
    if (motionPreference.addEventListener) motionPreference.addEventListener('change', updateMotionPreference);
    else motionPreference.addListener?.(updateMotionPreference);
    return () => {
      if (motionPreference.removeEventListener) motionPreference.removeEventListener('change', updateMotionPreference);
      else motionPreference.removeListener?.(updateMotionPreference);
    };
  }, []);

  useEffect(() => {
    if (!isVisible || prefersReducedMotion) return undefined;

    let rotationTimer;
    const startRotation = () => {
      window.clearInterval(rotationTimer);
      if (document.visibilityState !== 'visible') return;
      rotationTimer = window.setInterval(() => {
        setActiveIllustration((current) => (current + 1) % heroIllustrations.length);
      }, 5000);
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') window.clearInterval(rotationTimer);
      else startRotation();
    };

    startRotation();
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      window.clearInterval(rotationTimer);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isVisible, prefersReducedMotion]);

  return (
    <section className="movement-hero-preview-section" id="home" aria-labelledby="movement-hero-kicker">
      <div ref={previewRef} className={`movement-hero-preview${isVisible ? ' is-visible' : ''}`}>
        <div className="movement-hero-shape movement-hero-shape-one" aria-hidden="true" />
        <div className="movement-hero-shape movement-hero-shape-two" aria-hidden="true" />
        <div className="movement-hero-layout">
          <div className="movement-hero-copy">
            <h2 className="movement-hero-title">
              <span className="movement-hero-title-line movement-hero-title-first">A movement led by</span>
              <span className="movement-hero-title-line movement-hero-title-second">care-experienced youth.</span>
            </h2>
            <p className="movement-hero-description">
              We exist. Our voices matter. Together, we are creating belonging, opportunity and a future shaped by care-experienced leadership.
            </p>
            <div className="movement-hero-actions">
              <a className="button button-primary movement-hero-cta movement-hero-cta-one" href="#about">Explore the Movement</a>
              <a className="button button-quiet movement-hero-secondary-button movement-hero-cta movement-hero-cta-two" href="#day-1-highlight">Watch Our Journey</a>
            </div>
          </div>
          <div className="movement-hero-art">
            <span
              className="movement-hero-kicker movement-hero-art-kicker"
              id="movement-hero-kicker"
              aria-label="National Care Leavers Festival"
            >
              {heroKickerWords.map(({ word, letters }, wordIndex) => (
                <span className="movement-kicker-word" key={word} aria-hidden="true">
                  {letters.map(({ letter, order }) => (
                    <span
                      className="movement-kicker-letter"
                      key={`${word}-${order}`}
                      style={{ '--letter-order': order }}
                    >
                      {letter}
                    </span>
                  ))}
                  {wordIndex < heroKickerWords.length - 1 && (
                    <span className="movement-kicker-space">&nbsp;</span>
                  )}
                </span>
              ))}
            </span>
            <div className="movement-hero-art-stage">
              <svg className="movement-hero-connections" viewBox="0 0 620 540" fill="none" aria-hidden="true">
                <path className="movement-connection-path path-one" pathLength="1" d="M72 118 C168 86 228 168 306 156 S443 113 538 177" />
                <path className="movement-connection-path path-two" pathLength="1" d="M44 310 C150 258 207 334 304 290 S447 251 576 335" />
                <path className="movement-connection-path path-three" pathLength="1" d="M124 452 C205 398 268 422 333 384 S464 401 532 454" />
                <circle className="movement-connection-point point-one" cx="72" cy="118" r="7" />
                <circle className="movement-connection-point point-two" cx="306" cy="156" r="6" />
                <circle className="movement-connection-point point-three" cx="538" cy="177" r="8" />
                <circle className="movement-connection-point point-four" cx="44" cy="310" r="6" />
                <circle className="movement-connection-point point-five" cx="304" cy="290" r="8" />
                <circle className="movement-connection-point point-six" cx="576" cy="335" r="6" />
                <circle className="movement-connection-point point-seven" cx="124" cy="452" r="8" />
                <circle className="movement-connection-point point-eight" cx="532" cy="454" r="7" />
              </svg>
              {heroIllustrations.map((illustration, index) => (
                <img
                  className={`movement-hero-illustration${activeIllustration === index ? ' is-active' : ''}`}
                  key={illustration.src}
                  src={illustration.src}
                  width="1536"
                  height="1024"
                  alt={activeIllustration === index ? illustration.alt : ''}
                  aria-hidden={activeIllustration !== index}
                  loading="lazy"
                  decoding="async"
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  const aboutRef = useRef(null);

  useEffect(() => {
    const section = aboutRef.current;
    if (!section || !('IntersectionObserver' in window)
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const revealItems = section.querySelectorAll(
      '.section-heading .section-kicker, .section-heading h2, .about-copy, .about-pillar, .about-media img, .about-media figcaption',
    );
    let observer;
    const fallbackTimers = new Map();

    try {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const item = entry.target;
          const finishAnimation = () => {
            window.clearTimeout(fallbackTimers.get(item));
            fallbackTimers.delete(item);
          };
          item.addEventListener('animationend', finishAnimation, { once: true });
          item.classList.add('about-reveal-visible');
          fallbackTimers.set(item, window.setTimeout(() => {
            item.removeEventListener('animationend', finishAnimation);
            item.classList.add('about-reveal-fallback');
          }, 3000));
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.12, rootMargin: '0px 0px -24px 0px' });

      revealItems.forEach((item) => observer.observe(item));
      revealItems.forEach((item) => item.classList.add('about-reveal-ready'));
    } catch {
      observer?.disconnect();
      fallbackTimers.forEach((timer) => window.clearTimeout(timer));
      revealItems.forEach((item) => item.classList.remove('about-reveal-ready', 'about-reveal-visible'));
      return undefined;
    }

    return () => {
      observer.disconnect();
      fallbackTimers.forEach((timer) => window.clearTimeout(timer));
    };
  }, []);

  return (
    <section ref={aboutRef} className="about-section section-wrap section-space" id="about" aria-labelledby="about-title">
      <div className="about-left">
        <div className="section-heading">
          <span className="section-kicker">First of its kind festival for Care Leavers</span>
          <h2 id="about-title">
            More than an event.<br />
            <span>A movement.</span>
          </h2>
        </div>
        <div className="about-copy">
          <p className="about-lead">
            Care-experienced young people deserve recognition as leaders, with real influence over decisions that shape their lives.
          </p>
          <p>
            The movement turns lived experience into action: building connection and opportunity while challenging barriers after care.
          </p>
        </div>
        <ul className="about-pillars" aria-label="Core ideas of the movement">
          {aboutPillars.map(({ icon: PillarIcon, title, description }) => (
            <li className="about-pillar" key={title}>
              <span className="about-pillar-icon" aria-hidden="true">
                <PillarIcon size={18} strokeWidth={2} />
              </span>
              <div>
                <h3>{title}</h3>
                <p>{description}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>

      <figure className="about-media">
        <img
          src="/day-2/DSC07150.JPG"
          alt="Care-experienced young people gathered in conversation around a shared chart during the 2026 festival"
          loading="lazy"
          decoding="async"
        />
        <figcaption>
          Lived experience guiding reflection, leadership and community action at the 2026 edition.
        </figcaption>
      </figure>
    </section>
  );
}

function Edition2026() {
  const editionHeadingRef = useRef(null);
  useSectionHeadingReveal(editionHeadingRef);

  return (
    <section className="edition-section section-space" aria-labelledby="edition-2026-title">
      <div className="section-wrap">
        <div className="edition-heading" ref={editionHeadingRef}>
          <div>
            <span className="section-kicker">Festival Editions · January 2026</span>
            <h2 id="edition-2026-title">2026 Edition:<br /><span>Honour the journey</span></h2>
          </div>
          <p>
            A four-day learning experience created by care leavers for care leavers.
          </p>
        </div>
        <div className="edition-video" id="day-1-highlight">
          <img
            src={festivalPhotos[6]}
            alt="A group of young people gathered at the National Care Leavers Festival."
            loading="lazy"
            decoding="async"
          />
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

function FestivalImpact() {
  const impactRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = impactRef.current;
    if (!section || !('IntersectionObserver' in window)
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setIsVisible(true);
      observer.disconnect();
    }, { threshold: 0.16 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={impactRef}
      className={`festival-impact${isVisible ? ' is-visible' : ''}`}
      aria-labelledby="festival-impact-title"
    >
      <header className="festival-impact-heading">
        <span className="section-kicker">THE IMPACT WE ARE BUILDING</span>
        <h3 id="festival-impact-title">A festival that moves beyond the moment</h3>
      </header>
      <div className="festival-impact-grid">
        <article className="festival-impact-item">
          <ImpactIllustration theme="journey" />
          <h4>Days of lived experience</h4>
          <p>A full journey of connection, reflection, graduation and policy conversation.</p>
        </article>
        <article className="festival-impact-item">
          <ImpactIllustration theme="purpose" />
          <h4>Purposes brought together</h4>
          <p>Healing, reflection, leadership and policy voice shaped the 2026 edition.</p>
        </article>
        <article className="festival-impact-item">
          <ImpactIllustration theme="movement" />
          <h4>Shared movement</h4>
          <p>Care-experienced people connected across the festival to lead and create change.</p>
        </article>
      </div>
    </section>
  );
}

function ImpactIllustration({ theme }) {
  const illustrations = {
    journey: {
      src: '/assets/impact/days-lived.webp',
      alt: 'A diverse group of young people sharing a supportive conversation.',
    },
    purpose: {
      src: '/assets/impact/purposes-together.webp',
      alt: 'Young people learning and collaborating together around a workshop table.',
    },
    movement: {
      src: '/assets/impact/shared-movement.webp',
      alt: 'A diverse group of young people standing together and speaking up.',
    },
  };
  const illustration = illustrations[theme];

  return (
    <img
      className="festival-impact-illustration"
      src={illustration.src}
      alt={illustration.alt}
      loading="lazy"
      decoding="async"
    />
  );
}

function FestivalMomentsWall() {
  const momentsRef = useRef(null);

  useEffect(() => {
    const grid = momentsRef.current;
    if (!grid || !('IntersectionObserver' in window)
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    let observer;
    try {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('moment-day-card-visible');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -20px 0px' });
      grid.querySelectorAll('.moment-day-card').forEach((card) => observer.observe(card));
    } catch {
      observer?.disconnect();
      return undefined;
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div className="moment-day-grid" ref={momentsRef}>
      {festivalMoments.map((moment) => (
        <article className="moment-day-card" key={moment.date}>
          <div className="moment-day-media">
            <img
              src={moment.photo}
              alt={`National Care Leavers Festival, ${moment.date}`}
              loading="lazy"
              decoding="async"
            />
          </div>
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

function CareLeaders() {
  const [selectedLeader, setSelectedLeader] = useState(null);
  const [isMobileCarousel, setIsMobileCarousel] = useState(() => window.matchMedia('(max-width: 760px)').matches);
  const [activeCarouselIndex, setActiveCarouselIndex] = useState(0);
  const [carouselPhase, setCarouselPhase] = useState('visible');
  const [carouselInteractionPaused, setCarouselInteractionPaused] = useState(false);
  const [showAllLeaders, setShowAllLeaders] = useState(false);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [hasEnteredViewport, setHasEnteredViewport] = useState(false);
  const dialogRef = useRef(null);
  const leadersSectionRef = useRef(null);
  const pointerStartXRef = useRef(null);
  const suppressCardClickRef = useRef(false);
  const pendingCarouselDirectionRef = useRef(1);
  const resumeCarouselTimerRef = useRef(null);

  useEffect(() => {
    const mobileQuery = window.matchMedia('(max-width: 760px)');
    const reducedMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    const updateMobile = () => {
      setIsMobileCarousel(mobileQuery.matches);
    };
    const updateReducedMotion = () => setPrefersReducedMotion(reducedMotionQuery.matches);
    updateMobile();
    updateReducedMotion();
    mobileQuery.addEventListener?.('change', updateMobile);
    reducedMotionQuery.addEventListener?.('change', updateReducedMotion);
    return () => {
      mobileQuery.removeEventListener?.('change', updateMobile);
      reducedMotionQuery.removeEventListener?.('change', updateReducedMotion);
    };
  }, []);

  useEffect(() => {
    if (!isMobileCarousel && showAllLeaders) {
      setShowAllLeaders(false);
      setActiveCarouselIndex(0);
      setCarouselPhase('visible');
      setCarouselInteractionPaused(false);
    }
  }, [isMobileCarousel, showAllLeaders]);

  useEffect(() => {
    const section = leadersSectionRef.current;
    if (!section || !('IntersectionObserver' in window)) return undefined;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setHasEnteredViewport(true);
      observer.disconnect();
    }, { threshold: 0.12 });
    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isMobileCarousel || prefersReducedMotion || selectedLeader || showAllLeaders) return undefined;
    let timer;
    if (carouselPhase === 'visible') {
      if (carouselInteractionPaused) return undefined;
      timer = window.setTimeout(() => {
        pendingCarouselDirectionRef.current = 1;
        setCarouselPhase('fading-out');
      }, 4500);
    } else if (carouselPhase === 'fading-out') {
      timer = window.setTimeout(() => {
        setActiveCarouselIndex((current) => (current + pendingCarouselDirectionRef.current + careLeaders.length) % careLeaders.length);
        setCarouselPhase('fading-in');
      }, prefersReducedMotion ? 0 : 800);
    } else if (carouselPhase === 'fading-in') {
      timer = window.setTimeout(() => setCarouselPhase('visible'), prefersReducedMotion ? 0 : 800);
    }
    return () => window.clearTimeout(timer);
  }, [isMobileCarousel, prefersReducedMotion, selectedLeader, showAllLeaders, carouselInteractionPaused, carouselPhase]);

  useEffect(() => () => window.clearTimeout(resumeCarouselTimerRef.current), []);

  function pauseCarousel() {
    setCarouselInteractionPaused(true);
    window.clearTimeout(resumeCarouselTimerRef.current);
  }

  function pauseCarouselAfterInteraction() {
    pauseCarousel();
    resumeCarouselTimerRef.current = window.setTimeout(() => setCarouselInteractionPaused(false), 5000);
  }

  function viewAllLeaders() {
    pauseCarousel();
    setShowAllLeaders(true);
  }

  function showLessLeaders() {
    setShowAllLeaders(false);
    setActiveCarouselIndex(0);
    setCarouselPhase('visible');
    setCarouselInteractionPaused(false);
    window.requestAnimationFrame(() => {
      const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
      leadersSectionRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
    });
  }

  function moveCarousel(direction) {
    pauseCarouselAfterInteraction();
    if (carouselPhase !== 'visible') return;
    pendingCarouselDirectionRef.current = direction;
    if (prefersReducedMotion) {
      setActiveCarouselIndex((current) => (current + direction + careLeaders.length) % careLeaders.length);
      return;
    }
    setCarouselPhase('fading-out');
  }

  function handleCarouselPointerDown(event) {
    if (!isMobileCarousel) return;
    pointerStartXRef.current = event.clientX;
    suppressCardClickRef.current = false;
    pauseCarousel();
    event.currentTarget.setPointerCapture?.(event.pointerId);
  }

  function handleCarouselPointerUp(event) {
    if (pointerStartXRef.current === null) return;
    const distance = event.clientX - pointerStartXRef.current;
    pointerStartXRef.current = null;
    if (Math.abs(distance) > 36) {
      suppressCardClickRef.current = true;
      moveCarousel(distance < 0 ? 1 : -1);
      window.setTimeout(() => { suppressCardClickRef.current = false; }, 0);
    } else {
      pauseCarouselAfterInteraction();
    }
  }

  function handleCarouselKeyDown(event) {
    if (event.key !== 'ArrowLeft' && event.key !== 'ArrowRight') return;
    event.preventDefault();
    moveCarousel(event.key === 'ArrowRight' ? 1 : -1);
  }

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;

    if (selectedLeader && !dialog.open) dialog.showModal();
    if (!selectedLeader && dialog.open) dialog.close();
  }, [selectedLeader]);

  return (
    <>
      <section ref={leadersSectionRef} className={`care-leaders-section section-space${hasEnteredViewport ? ' is-revealed' : ''}`} id="care-leaders" aria-labelledby="care-leaders-title">
        <div className="section-wrap">
          <header className="care-leaders-heading">
            <div className="care-leaders-heading-copy">
              <h2 id="care-leaders-title">THE PEOPLE BEHIND<br /><span>THE MOVEMENT</span></h2>
              <p className="care-leaders-introduction">
                Care Leaders bring lived experience, professional insight and community purpose to every part of the movement.
              </p>
            </div>
            <img
              className="care-leaders-heading-illustration"
              src="/photos/Hands%20Together_%20Unity%20in%20Every%20Color.png"
              alt=""
              aria-hidden="true"
            />
          </header>

          <div
            className={`care-leaders-carousel${isMobileCarousel ? ' is-mobile-carousel' : ''}`}
            role={isMobileCarousel ? 'region' : undefined}
            aria-label={isMobileCarousel ? 'Care Leaders profiles carousel' : undefined}
            aria-roledescription={isMobileCarousel ? 'carousel' : undefined}
            tabIndex={isMobileCarousel ? 0 : undefined}
            onKeyDown={handleCarouselKeyDown}
            onFocusCapture={pauseCarouselAfterInteraction}
            onPointerDown={handleCarouselPointerDown}
            onPointerUp={handleCarouselPointerUp}
            onPointerCancel={() => {
              pointerStartXRef.current = null;
              pauseCarouselAfterInteraction();
            }}
            onClickCapture={(event) => {
              if (!suppressCardClickRef.current) return;
              event.preventDefault();
              event.stopPropagation();
            }}
          >
            <div className={`care-leaders-grid${showAllLeaders && isMobileCarousel ? ' care-leaders-grid--all' : ''}`}>
              {careLeaders.map((leader, slideIndex) => {
                const leaderIndex = slideIndex;
                const isActiveSlide = !isMobileCarousel || activeCarouselIndex === slideIndex || showAllLeaders;
                return (
                  <div
                    className={`care-leaders-slide${isActiveSlide ? ' is-active' : ''}${isActiveSlide && carouselPhase === 'fading-out' ? ' is-fading-out' : ''}${isActiveSlide && carouselPhase === 'fading-in' ? ' is-fading-in' : ''}`}
                    key={leader.name}
                    role={isMobileCarousel ? 'group' : undefined}
                    aria-hidden={isMobileCarousel && !showAllLeaders && !isActiveSlide ? 'true' : undefined}
                    aria-roledescription={isMobileCarousel ? 'slide' : undefined}
                    aria-label={isMobileCarousel ? `${leaderIndex + 1} of ${careLeaders.length}: ${leader.name}` : undefined}
                  >
                    <button
                      className="care-leader-card"
                      style={{ '--leader-order': leaderIndex }}
                      type="button"
                      tabIndex={isMobileCarousel && !showAllLeaders && !isActiveSlide ? -1 : 0}
                      aria-haspopup="dialog"
                      aria-label={`Read ${leader.name}'s full profile`}
                      onClick={() => setSelectedLeader(leader)}
                    >
                      <span className="care-leader-photo">
                        <img
                          src={leader.photo}
                          className={leader.photo === '/care-leaders/rajkumar-sharma.png' ? 'care-leader-photo-rajkumar' : undefined}
                          alt={`${leader.name}, Care Leader at the National Care Leavers Festival`}
                          loading="lazy"
                          decoding="async"
                        />
                      </span>
                      <span className="care-leader-copy">
                        <span className="care-leader-name">{leader.name}</span>
                        <span className="care-leader-designation">{leader.designation}</span>
                        <span className="care-leader-summary">{leader.summary}</span>
                        <span className="care-leader-link">Read full profile <Icon name="arrow" size={17} /></span>
                      </span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {isMobileCarousel && !showAllLeaders && (
            <div className="care-leaders-view-all-slot">
              <button type="button" className="button button-primary" onClick={viewAllLeaders}>
                View All Care Leaders
              </button>
            </div>
          )}

          {isMobileCarousel && showAllLeaders && (
            <div className="care-leaders-view-all-slot">
              <button type="button" className="button button-primary" onClick={showLessLeaders}>
                Show Less
              </button>
            </div>
          )}
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
              <img src={selectedLeader.photo} alt={`${selectedLeader.name}, Care Leader at the National Care Leavers Festival`} loading="eager" decoding="async" />
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
  const [galleryPhotos, setGalleryPhotos] = useState([]);
  const [galleryLoadError, setGalleryLoadError] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [galleryInView, setGalleryInView] = useState(false);
  const [isCollapsing, setIsCollapsing] = useState(false);
  const galleryRef = useRef(null);
  const galleryHeadingRef = useRef(null);
  useSectionHeadingReveal(galleryHeadingRef);
  const collapseTimerRef = useRef(null);
  // Start at the 4th image of the interleaved collection, while keeping every
  // eligible photograph in the expanded gallery exactly once.
  const galleryStartInEligible = Math.max(
    0,
    galleryPhotos.findIndex((photo) => photo.order >= galleryStartIndex),
  );
  const previewPhotos = galleryPhotos.slice(
    galleryStartInEligible,
    galleryStartInEligible + galleryPreviewCount,
  );
  const extraPhotos = [
    ...galleryPhotos.slice(0, galleryStartInEligible),
    ...galleryPhotos.slice(galleryStartInEligible + galleryPreviewCount),
  ];

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery) return undefined;
    if (!('IntersectionObserver' in window)) {
      setGalleryInView(true);
      return undefined;
    }

    const observer = new IntersectionObserver(([entry]) => {
      setGalleryInView(entry.isIntersecting);
    }, { rootMargin: '-12% 0px -12% 0px' });
    observer.observe(gallery);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const gallery = galleryRef.current;
    if (!gallery || window.matchMedia('(prefers-reduced-motion: reduce)').matches
      || !('IntersectionObserver' in window)) return undefined;

    const revealItems = gallery.querySelectorAll('.gallery-reveal:not(.gallery-reveal-visible)');
    if (!revealItems.length) return undefined;

    let observer;
    try {
      observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add('gallery-reveal-visible');
          observer.unobserve(entry.target);
        });
      }, { threshold: 0.14, rootMargin: '0px 0px -24px 0px' });
      revealItems.forEach((item) => {
        item.classList.add('gallery-reveal-ready');
        observer.observe(item);
      });
    } catch {
      observer?.disconnect();
      revealItems.forEach((item) => item.classList.remove('gallery-reveal-ready'));
      return undefined;
    }
    return () => observer.disconnect();
  }, [galleryPhotos.length, showAllPhotos]);

  useEffect(() => () => window.clearTimeout(collapseTimerRef.current), []);

  function toggleGallery() {
    if (showAllPhotos) {
      if (isCollapsing) return;
      setIsCollapsing(true);
      collapseTimerRef.current = window.setTimeout(() => {
        setShowAllPhotos(false);
        setIsCollapsing(false);
        window.requestAnimationFrame(() => {
          const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
          galleryHeadingRef.current?.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block: 'start' });
        });
      }, window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 240);
      return;
    }

    setShowAllPhotos(true);
  }

  useEffect(() => {
    let active = true;

    const loadManifest = (day) => fetch(`/${day}/manifest.json`)
      .then((response) => {
        if (!response.ok) throw new Error(`Could not load the ${day} photo gallery.`);
        return response.json();
      });

    Promise.all([loadManifest('day-1'), loadManifest('day-2'), loadManifest('day-3')])
      .then(([day1Names, day2Names, day3Names]) => {
        if (!active) return;
        const days = [
          ['day-1', day1Names],
          ['day-2', day2Names],
          ['day-3', day3Names],
        ];
        const allGalleryPhotos = [];
        const seenSources = new Set();

        for (let index = 0; index < Math.max(...days.map(([, names]) => names.length)); index += 1) {
          days.forEach(([day, names]) => {
            if (!names[index]) return;
            const src = `/${day}/${encodeURIComponent(names[index])}`;
            if (seenSources.has(src)) return;
            seenSources.add(src);
            allGalleryPhotos.push({
              src,
              order: allGalleryPhotos.length,
              alt: `National Care Leavers Festival ${day.replace('day-', 'Day ')} moment ${index + 1}.`,
            });
          });
        }

        // Keep the interleaved manifest order and drop excluded photographs.
        // The 4th-image start is applied when splitting preview / expanded photos.
        setGalleryPhotos(
          allGalleryPhotos.filter((photo) => !excludedGalleryPhotoPaths.has(photo.src)),
        );
      })
      .catch((error) => {
        console.error('Could not load the festival photo galleries.', error);
        if (active) {
          setGalleryPhotos(galleryPreviewPhotos);
          setGalleryLoadError(true);
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className={`photo-gallery${showAllPhotos ? ' is-expanded' : ''}${isCollapsing ? ' is-collapsing' : ''}`} id="festival-gallery" ref={galleryRef} aria-labelledby="photo-gallery-title">
      <div className="photo-gallery-heading" ref={galleryHeadingRef}>
        <span className="section-kicker">Festival gallery · 2026 Edition</span>
        <h3 id="photo-gallery-title">The people. The energy. <span>All together.</span></h3>
      </div>

      <div id="festival-gallery-images">
        <Gallery>
          <div
            className="photo-gallery-grid"
            role="region"
            aria-label="National Care Leavers Festival photo gallery"
          >
            {previewPhotos.map((photo, index) => (
              <GalleryImage
                key={'festival-photo-' + photo.src}
                id={'festival-photo-' + index}
                src={photo.src}
                alt={photo.alt}
                className="photo-gallery-item gallery-reveal festival-gallery-thumb"
                imgClassName="festival-gallery-img"
              />
            ))}
          </div>

          {galleryPhotos.length > galleryPreviewCount && (
            <div className={`photo-gallery-actions-slot${showAllPhotos && galleryInView ? ' is-fixed' : ''}`}>
              <div className={`photo-gallery-actions${showAllPhotos && galleryInView ? ' is-fixed' : ''}`}>
                <button
                  type="button"
                  className="button button-primary"
                  aria-controls="festival-gallery-images"
                  aria-expanded={showAllPhotos}
                  disabled={isCollapsing}
                  onClick={toggleGallery}
                >
                  {showAllPhotos ? 'Show Fewer Images' : 'View All Images'}
                </button>
              </div>
            </div>
          )}

          {showAllPhotos && (
            <div
              className="photo-gallery-grid gallery-extra-grid"
              role="region"
              aria-label="More National Care Leavers Festival photos"
            >
              {extraPhotos.map((photo, index) => (
                <GalleryImage
                  key={'festival-extra-photo-' + photo.src}
                  id={'festival-extra-photo-' + (index + galleryPreviewCount)}
                  src={photo.src}
                  alt={photo.alt}
                  className="photo-gallery-item gallery-reveal festival-gallery-thumb"
                  imgClassName="festival-gallery-img"
                />
              ))}
            </div>
          )}
        </Gallery>
      </div>
      {galleryLoadError && (
        <p className="photo-gallery-error" role="alert">
          Some festival photos could not be loaded. Please refresh to try again.
        </p>
      )}
    </div>
  );
}

const registrationPopupSessionKey = 'nclf-registration-popup-seen';
const registrationPopupOpenDelay = 12000;
const registrationPopupVisibleDuration = 12000;

function RegistrationPopup() {
  const [phase, setPhase] = useState('hidden');
  const delayTimerRef = useRef(null);
  const closeTimerRef = useRef(null);
  const exitTimerRef = useRef(null);

  useEffect(() => {
    let alreadySeen = false;
    try {
      alreadySeen = window.sessionStorage.getItem(registrationPopupSessionKey) === 'true';
    } catch {
      alreadySeen = false;
    }
    if (alreadySeen) return undefined;

    delayTimerRef.current = window.setTimeout(() => setPhase('visible'), registrationPopupOpenDelay);
    return () => {
      window.clearTimeout(delayTimerRef.current);
      window.clearTimeout(closeTimerRef.current);
      window.clearTimeout(exitTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (phase !== 'visible') return undefined;
    closeTimerRef.current = window.setTimeout(closePopup, registrationPopupVisibleDuration);
    return () => window.clearTimeout(closeTimerRef.current);
  }, [phase]);

  function markAsSeen() {
    try {
      window.sessionStorage.setItem(registrationPopupSessionKey, 'true');
    } catch {
      // Storage can be unavailable in private browsing; session state still holds.
    }
  }

  function closePopup() {
    window.clearTimeout(delayTimerRef.current);
    window.clearTimeout(closeTimerRef.current);
    markAsSeen();
    setPhase('closing');
    exitTimerRef.current = window.setTimeout(() => setPhase('hidden'), 280);
  }

  if (phase === 'hidden') return null;

  return (
    <aside
      className={`registration-popup${phase === 'visible' ? ' is-visible' : ''}`}
      role="dialog"
      aria-labelledby="registration-popup-title"
      aria-describedby="registration-popup-description"
    >
      <button
        className="registration-popup-close"
        type="button"
        aria-label="Close registration invitation"
        onClick={closePopup}
      >
        <span aria-hidden="true">&times;</span>
      </button>
      <h2 id="registration-popup-title">Join Us for the 2027 Festival</h2>
      <p id="registration-popup-description">Be part of a movement led by care-experienced young people.</p>
      <a
        className="button button-primary registration-popup-button"
        href={festivalRegistrationUrl || undefined}
        target={festivalRegistrationUrl ? '_blank' : undefined}
        rel={festivalRegistrationUrl ? 'noopener noreferrer' : undefined}
        aria-disabled={!festivalRegistrationUrl}
        onClick={closePopup}
      >
        Register Now
        <Icon name="arrow" size={17} />
      </a>
    </aside>
  );
}

function GetInvolved() {
  const involvedHeadingRef = useRef(null);
  useSectionHeadingReveal(involvedHeadingRef);

  return (
    <section className="involved-section section-space" id="join-the-movement">
      <div className="section-wrap">
        <div className="involved-panel">
          <div className="involved-heading" ref={involvedHeadingRef}>
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

function RegistrationSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section || !('IntersectionObserver' in window)
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;

    const copy = section.querySelector('.registration-section-copy');
    const art = section.querySelector('.registration-section-art');
    const items = [copy, art].filter(Boolean);
    items.forEach((item) => item.classList.add('registration-section-reveal-ready'));

    try {
      const observer = new IntersectionObserver(([entry]) => {
        if (!entry.isIntersecting) return;
        items.forEach((item) => item.classList.add('registration-section-reveal-visible'));
        observer.disconnect();
      }, { threshold: 0.15, rootMargin: '0px 0px -30px 0px' });
      observer.observe(section);
      return () => observer.disconnect();
    } catch {
      items.forEach((item) => item.classList.remove('registration-section-reveal-ready'));
      return undefined;
    }
  }, []);

  return (
    <section
      ref={sectionRef}
      className="registration-section section-space"
      id="take-action"
      aria-labelledby="registration-section-title"
    >
      <div className="section-wrap registration-section-panel">
        <div className="registration-section-copy">
          <span className="section-kicker">JOIN THE MOVEMENT</span>
          <h2 id="registration-section-title">Be Part of the Movement</h2>
          <p>
            Join us for the next National Care Leavers Festival. Be part of a community built on connection, leadership and lived experience.
          </p>
          <a
            className="button button-primary registration-section-button"
            href={festivalRegistrationUrl || undefined}
            target={festivalRegistrationUrl ? '_blank' : undefined}
            rel={festivalRegistrationUrl ? 'noopener noreferrer' : undefined}
            aria-disabled={!festivalRegistrationUrl}
          >
            Register for Festival <span aria-hidden="true">→</span>
          </a>
        </div>
        <div className="registration-section-art">
          <img
            src="/photos/Youth%20Activists%20Taking%20Action.png"
            alt="Five young activists taking action together, including a person with a megaphone, a young woman raising her fist and another person holding a placard."
            loading="lazy"
            decoding="async"
          />
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
        {/* <Hero /> remains preserved for future use. */}
        <MovementHeroPreview />
        <About />
        <div className="festival-editions-group" id="festival-editions">
          <Edition2026 />
        </div>
        <CareLeaders />
        <VideoBites />
        <FaqSection />
        <RegistrationSection />
        <GetInvolved />
      </main>
      <Footer />
      <RegistrationPopup />
      <FestivalChatbot email={festivalEmail} whatsappUrl={festivalWhatsAppChannel} />
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
