import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import './styles.css';

const festival = {
  year: '2026',
  title: 'National Care Leavers Festival',
  theme: 'From lived experience to leadership',
  dates: 'January 17–20, 2026',
  shortDates: 'Jan 17–20, 2026',
  venue: 'Don Bosco, Okhla',
  city: 'New Delhi, India',
  registrationUrl: '#get-involved',
};

const festivalWhatsAppChannel = 'https://whatsapp.com/channel/0029Vb8wWtGJP21BAIBQU322';

const values = [
  {
    number: '01',
    title: 'Rights-based',
    text: 'Moving beyond charity to dignity, opportunity and equal rights.',
  },
  {
    number: '02',
    title: 'Strength-driven',
    text: 'Connecting lived experience, skills and leadership with opportunity.',
  },
  {
    number: '03',
    title: 'Systemic change',
    text: 'Working together to improve aftercare, policy and workplaces.',
  },
  {
    number: '04',
    title: 'Evidence-led',
    text: 'Building practical, lasting solutions informed by lived experience.',
  },
];

const reasons = [
  {
    icon: '✳',
    title: 'A first-of-its-kind gathering',
    text: 'Care-experienced leaders from across India connect, learn and celebrate together.',
  },
  {
    icon: '↗',
    title: 'Lived experience, amplified',
    text: 'Care leavers lead the conversation as advocates, changemakers and experts.',
  },
  {
    icon: '◎',
    title: 'Stronger aftercare systems',
    text: 'Young people, practitioners and partners co-create ideas for lasting change.',
  },
  {
    icon: '⌘',
    title: 'A community that lasts',
    text: 'A national network built on connection, shared experience and collective vision.',
  },
];

const days = [
  {
    date: 'JAN 17',
    day: 'Day 01',
    title: 'Laughter, food & culture',
    items: ['Interactive cooking', 'Theatre workshops', 'Poster presentations', 'Cultural celebration'],
    color: 'coral',
  },
  {
    date: 'JAN 18',
    day: 'Day 02',
    title: 'Visioning & systems',
    items: ['Appreciative inquiry', 'Visioning workshops', 'Systems thinking', 'Meet the network'],
    color: 'blue',
  },
  {
    date: 'JAN 19',
    day: 'Day 03',
    title: 'Graduation & awards',
    items: ['Graduation ceremony', 'Aftercare Hero Awards', 'Key announcements', 'Motivational dialogues'],
    color: 'gold',
  },
  {
    date: 'JAN 20',
    day: 'Day 04',
    title: 'Outreach & next steps',
    items: ['Stakeholder consultation', 'Delhi NCR focus', 'Shared commitments', 'Closing ceremony'],
    color: 'teal',
  },
];

const edition2025Videos = [
  {
    title: 'Festival highlights',
    description: 'A look back at the moments that brought everyone together.',
    embedUrl: '',
    style: 'highlights',
  },
  {
    title: 'Care leaver voices',
    description: 'Stories, ideas and perspectives from the community.',
    embedUrl: '',
    style: 'voices',
  },
  {
    title: 'Moments we made together',
    description: 'A celebration of connection, creativity and possibility.',
    embedUrl: '',
    style: 'together',
  },
];

const leaderProfiles = [
  { id: 'leader-one', name: 'Add leader name', location: 'Add city, state', focus: 'Add focus area', bio: 'Add a short introduction about this care leader.' },
  { id: 'leader-two', name: 'Add leader name', location: 'Add city, state', focus: 'Add focus area', bio: 'Add a short introduction about this care leader.' },
  { id: 'leader-three', name: 'Add leader name', location: 'Add city, state', focus: 'Add focus area', bio: 'Add a short introduction about this care leader.' },
];

const fellowBlogs = [
  { title: 'Add fellow article title', fellow: 'Add fellow name', summary: 'Add a short excerpt or summary of the article here.', url: '' },
  { title: 'Add fellow article title', fellow: 'Add fellow name', summary: 'Add a short excerpt or summary of the article here.', url: '' },
  { title: 'Add fellow article title', fellow: 'Add fellow name', summary: 'Add a short excerpt or summary of the article here.', url: '' },
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
  };

  return <svg {...shared}>{paths[name] || paths.sparkle}</svg>;
}

function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [pastFestivalsOpen, setPastFestivalsOpen] = useState(false);
  const navItems = [
    ['Home', '#home'],
    ['The festival', '#about'],
    ['Programme', '#programme'],
    ['Moments', '#moments'],
    ['Care leaders', '#leaders'],
  ];

  return (
    <header className="site-header">
      <a className="brand" href="#home" aria-label={`${festival.title} home`} onClick={() => setMenuOpen(false)}>
        <span className="brand-mark" aria-hidden="true">N</span>
        <span className="brand-copy">
          <strong>{festival.title}, {festival.year}</strong>
          <small>When care leavers care</small>
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
        {navItems.map(([label, href], index) => (
          <a
            className={`nav-link${index === 0 ? ' active' : ''}`}
            href={href}
            key={label}
            onClick={() => {
              setMenuOpen(false);
              setPastFestivalsOpen(false);
            }}
          >
            {label}
          </a>
        ))}
        <div className={`past-festivals${pastFestivalsOpen ? ' is-open' : ''}`}>
          <button
            className="nav-link past-festivals-toggle"
            type="button"
            aria-expanded={pastFestivalsOpen}
            aria-controls="past-festivals-menu"
            onClick={() => setPastFestivalsOpen((open) => !open)}
          >
            Past festivals <span aria-hidden="true">⌄</span>
          </button>
          <div className="past-festivals-menu" id="past-festivals-menu">
            <a href="#edition-2025" onClick={() => { setMenuOpen(false); setPastFestivalsOpen(false); }}>2025 Edition</a>
            <a href="#home" onClick={() => { setMenuOpen(false); setPastFestivalsOpen(false); }}>2026 Edition</a>
          </div>
        </div>
        <a className="nav-register" href={festival.registrationUrl} onClick={() => { setMenuOpen(false); setPastFestivalsOpen(false); }}>
          Get involved <Icon name="arrow" size={16} />
        </a>
      </nav>
    </header>
  );
}

function Hero() {
  return (
    <section className="hero" id="home" aria-labelledby="hero-title">
      <video
        className="hero-background-video"
        src="/videos/festival-hero.mp4"
        poster="https://images.unsplash.com/photo-1529156069898-49953e39b3ac?auto=format&fit=crop&w=2000&q=90"
        aria-hidden="true"
        autoPlay
        muted
        loop
        playsInline
      />
      <div className="hero-copy">
        <span className="eyebrow"><span className="eyebrow-dot" /> When care leavers care</span>
        <h1 id="hero-title">Lived experience.<br /><span>Leading the future.</span></h1>
        <p className="hero-description">
          A national celebration of care leavers as leaders, advocates and changemakers.
          Together, we are shaping a brighter future for aftercare in India.
        </p>
        <div className="hero-actions">
          <a className="button button-primary" href={festival.registrationUrl}>
            Join the festival <Icon name="arrow" />
          </a>
          <a className="button button-quiet" href="#programme">
            Explore the festival
          </a>
        </div>
        <div className="hero-facts">
          <div className="fact">
            <span className="fact-icon"><Icon name="sparkle" /></span>
            <span><small>Our focus</small><strong>Leadership &amp; community</strong></span>
          </div>
          <div className="fact">
            <span className="fact-icon"><Icon name="arrow" /></span>
            <span><small>Our belief</small><strong>Care leavers lead change</strong></span>
          </div>
        </div>
      </div>
    </section>
  );
}

function About() {
  return (
    <>
      <section className="intro-band">
        <div className="section-wrap intro-content">
          <span className="intro-index">01 / THE FESTIVAL</span>
          <p>
            Not a story of what is missing. A celebration of what is possible when care leavers
            are <strong>believed, supported and leading change.</strong>
          </p>
          <a href="#about" className="intro-link" aria-label="Discover the festival"><Icon name="arrow" /></a>
        </div>
      </section>
      <section className="about-section section-wrap section-space" id="about">
        <div className="section-heading">
          <span className="section-kicker">A new reality</span>
          <h2>From doubt<br />to <span>confidence.</span></h2>
        </div>
        <div className="about-body">
          <p>
            Across India, care leavers are turning lived experience into leadership. Through
            fellowships, networks and community-led initiatives, young people are creating
            opportunities and shaping how aftercare is understood.
          </p>
          <p>
            This festival brings care leavers, practitioners and partners together to celebrate
            those achievements—and to keep building systems where every young person can thrive.
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
    </>
  );
}

function Edition2025() {
  return (
    <section className="edition-section section-space" id="edition-2025" aria-labelledby="edition-2025-title">
      <div className="section-wrap">
        <div className="edition-heading">
          <div>
            <span className="section-kicker">The story continues</span>
            <h2 id="edition-2025-title">2025 Edition:<br /><span>look back, move forward.</span></h2>
          </div>
          <p>Revisit the people, stories and moments from last year’s festival. Add the official videos to bring this archive to life.</p>
        </div>
        <div className="archive-grid">
          {edition2025Videos.map((video, index) => (
            <article className="archive-card" key={video.title}>
              {video.embedUrl ? (
                <iframe
                  className="archive-embed"
                  src={video.embedUrl}
                  title={video.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  referrerPolicy="strict-origin-when-cross-origin"
                  allowFullScreen
                />
              ) : (
                <div className={`archive-poster poster-${video.style}`} aria-label={`${video.title} video placeholder`}>
                  <span className="poster-edition">NATIONAL CARE LEAVERS FESTIVAL · 2025</span>
                  <span className="poster-play" aria-hidden="true">▶</span>
                  <span className="poster-title">{video.title}</span>
                  <span className="poster-note">VIDEO COMING SOON</span>
                </div>
              )}
              <div className="archive-card-copy">
                <span className="archive-number">0{index + 1} / 2025</span>
                <h3>{video.title}</h3>
                <p>{video.description}</p>
              </div>
            </article>
          ))}
        </div>
        <div className="archive-footer">
          <span><Icon name="sparkle" size={18} /> One festival. Many voices. A movement that keeps growing.</span>
          <a href="#home">Explore the 2026 edition <Icon name="arrow" size={16} /></a>
        </div>
      </div>
    </section>
  );
}

function WhyItMatters() {
  return (
    <section className="why-section section-space">
      <div className="section-wrap">
        <div className="why-heading">
          <div>
            <span className="section-kicker">Why we come together</span>
            <h2>More than an event.<br /><span>A movement.</span></h2>
          </div>
          <p>Building a future where care leavers have the voice, networks and opportunities to lead.</p>
        </div>
        <div className="reason-grid">
          {reasons.map((reason, index) => (
            <article className="reason-card" key={reason.title}>
              <span className={`reason-icon reason-icon-${index + 1}`}>{reason.icon}</span>
              <span className="reason-number">0{index + 1}</span>
              <h3>{reason.title}</h3>
              <p>{reason.text}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Programme() {
  return (
    <section className="programme-section section-space" id="programme">
      <div className="section-wrap">
        <div className="programme-heading">
          <div>
            <span className="section-kicker">Four days, one shared vision</span>
            <h2>Make room<br />for <span>what’s next.</span></h2>
          </div>
          <p>Learning, celebration and co-creation with care leaders from across India.</p>
        </div>
        <div className="day-grid">
          {days.map((day) => (
            <article className={`day-card day-${day.color}`} key={day.day}>
              <div className="day-card-top"><span>{day.date}</span><span>{day.day}</span></div>
              <div className="day-card-content">
                <h3>{day.title}</h3>
                <ul>{day.items.map((item) => <li key={item}>{item}</li>)}</ul>
              </div>
              <div className="day-card-footer"><span>National Care Leavers Festival</span><span>{festival.year}</span></div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function CommunityMoments() {
  const moments = [
    { number: '01', label: 'Add a festival photo', caption: 'A moment of joy', style: 'moment-one' },
    { number: '02', label: 'Add a festival photo', caption: 'Friends & community', style: 'moment-two' },
    { number: '03', label: 'Add a festival photo', caption: 'Care leaders in action', style: 'moment-three' },
    { number: '04', label: 'Add a festival photo', caption: 'Celebrating together', style: 'moment-four' },
  ];

  return (
    <section className="moments-section section-space bloom-section" id="moments" aria-labelledby="moments-title">
      <BloomGarden />
      <div className="section-wrap">
        <div className="moments-heading">
          <div>
            <span className="section-kicker">The people make the festival</span>
            <h2 id="moments-title">Big moments.<br /><span>Real connection.</span></h2>
          </div>
          <p>A photo wall for the friendships, ideas and celebrations that make this community what it is. Replace each space with your festival photos.</p>
        </div>
        <div className="moments-wall">
          {moments.map((moment) => (
            <figure className={`moment-card ${moment.style}`} key={moment.number}>
              <div className="moment-photo" role="img" aria-label={moment.label}>
                <span className="moment-plus" aria-hidden="true">+</span>
                <span className="moment-add">{moment.label}</span>
              </div>
              <figcaption><span>{moment.number} / COMMUNITY</span><strong>{moment.caption}</strong></figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}

function FellowBlogs() {
  return (
    <section className="blogs-section section-space bloom-section" id="blogs" aria-labelledby="blogs-title">
      <BloomGarden />
      <div className="section-wrap">
        <div className="blogs-heading">
          <div>
            <span className="section-kicker">Ideas and reflections from fellows</span>
            <h2 id="blogs-title">In their <span>own words.</span></h2>
          </div>
          <p>Read fellows’ perspectives and experiences, with a short preview and a link to each full article.</p>
        </div>
        <div className="blogs-grid">
          {fellowBlogs.map((blog, index) => (
            <article className="blog-card" key={`fellow-blog-${index}`}>
              <span className="blog-number">0{index + 1} / FELLOW VOICES</span>
              <h3>{blog.title}</h3>
              <p className="blog-byline">By {blog.fellow}</p>
              <p className="blog-summary">{blog.summary}</p>
              {blog.url ? (
                <a className="blog-link" href={blog.url} target="_blank" rel="noreferrer">
                  Read the full article <Icon name="arrow" size={16} />
                </a>
              ) : (
                <span className="blog-link blog-link-pending">Add the full article link</span>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Leaders() {
  const [search, setSearch] = useState('');
  const filteredLeaders = leaderProfiles.filter((leader) =>
    `${leader.name} ${leader.location} ${leader.focus} ${leader.bio}`
      .toLowerCase()
      .includes(search.trim().toLowerCase()),
  );

  return (
    <section className="leaders-section section-space bloom-section" id="leaders" aria-labelledby="leaders-title">
      <BloomGarden />
      <div className="section-wrap">
        <div className="leaders-directory-heading">
          <span className="section-kicker">Their stories. Their leadership.</span>
          <h2 id="leaders-title">Meet the <span>care leaders.</span></h2>
          <p>
            Care-experienced leaders are driving systemic change across India. Add their names,
            stories, locations and areas of work to introduce the people behind the movement.
          </p>
          <label className="leader-search">
            <Icon name="search" size={18} />
            <input
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search by name, skills, or state..."
              aria-label="Search care leaders"
            />
          </label>
        </div>
        <div className="leader-card-grid">
          {filteredLeaders.map((leader, index) => (
            <article className="leader-profile-card" key={leader.id}>
              <div className="leader-photo-wrap">
                <span className="leader-badge">CARE LEADER</span>
                <div className={`leader-photo leader-photo-${index + 1}`} aria-label="Add leader photo">
                  <span aria-hidden="true">{leader.name === 'Add leader name' ? '+' : leader.name.charAt(0)}</span>
                </div>
              </div>
              <div className="leader-profile-heading">
                <div>
                  <h3>{leader.name}</h3>
                  <p>{leader.location}</p>
                </div>
                <span className="leader-role">FELLOW</span>
              </div>
              <div className="leader-profile-content">
                <span className="leader-focus">{leader.focus}</span>
                <p className="leader-bio">{leader.bio}</p>
                <a
                  className="leader-profile-link"
                  href={festivalWhatsAppChannel}
                  target="_blank"
                  rel="noreferrer"
                >
                  <Icon name="arrow" size={14} /> Connect with the festival
                </a>
              </div>
            </article>
          ))}
          {filteredLeaders.length === 0 && (
            <p className="leader-empty">No care leaders match that search. Try another name, skill or state.</p>
          )}
        </div>
      </div>
    </section>
  );
}

function BloomGarden() {
  return (
    <div className="bloom-garden" aria-hidden="true">
      {[1, 2, 3].map((flower) => (
        <span className={`bloom-flower bloom-flower-${flower}`} key={flower}>
          <span className="bloom-petals">
            <i /><i /><i /><i /><i /><i />
            <b />
          </span>
        </span>
      ))}
      {[1, 2, 3, 4, 5].map((flower) => (
        <span className={`bloom-burst bloom-burst-${flower}`} key={`burst-${flower}`}>
          <span className="bloom-petals">
            <i /><i /><i /><i /><i /><i />
            <b />
          </span>
        </span>
      ))}
    </div>
  );
}

function GetInvolved() {
  return (
    <section className="involved-section section-space" id="get-involved">
      <div className="section-wrap">
        <div className="involved-panel">
          <div className="involved-heading">
            <span className="section-kicker">Every voice matters</span>
            <h2>There’s a place<br />for <span>you here.</span></h2>
            <p>Be part of a community creating a stronger future for care leavers.</p>
          </div>
          <div className="involved-options">
            <a className="involved-option" href={festivalWhatsAppChannel} target="_blank" rel="noreferrer">
              <span className="option-number">01</span>
              <span><strong>Take part</strong><small>Join the festival community</small></span>
              <Icon name="arrow" />
            </a>
            <a className="involved-option" href={festivalWhatsAppChannel} target="_blank" rel="noreferrer">
              <span className="option-number">02</span>
              <span><strong>Share your story</strong><small>Help bring lived experience forward</small></span>
              <Icon name="arrow" />
            </a>
            <a className="involved-option" href={festivalWhatsAppChannel} target="_blank" rel="noreferrer">
              <span className="option-number">03</span>
              <span><strong>Partner with us</strong><small>Help make change possible</small></span>
              <Icon name="arrow" />
            </a>
            <a className="involved-option" href={festivalWhatsAppChannel} target="_blank" rel="noreferrer">
              <span className="option-number">04</span>
              <span><strong>Join our WhatsApp channel</strong><small>Follow festival news and updates</small></span>
              <Icon name="arrow" />
            </a>
          </div>
          <div className="involved-contact"><Icon name="arrow" size={17} /> Questions? <a href={festivalWhatsAppChannel} target="_blank" rel="noreferrer">Join the festival WhatsApp channel</a></div>
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
              <span className="brand-mark" aria-hidden="true">N</span>
              <span className="brand-copy"><strong>{festival.title}</strong><small>When care leavers care</small></span>
            </a>
            <p>Celebrating care leavers as leaders, changemakers and advocates.</p>
          </div>
          <div className="footer-links">
            <span>Explore</span>
            <a href="#about">The festival</a>
            <a href="#programme">Programme</a>
            <a href="#blogs">Fellows’ blogs</a>
            <a href="#leaders">Care leaders</a>
          </div>
          <div className="footer-links">
            <span>Connect</span>
            <a href={festivalWhatsAppChannel} target="_blank" rel="noreferrer">Festival WhatsApp channel ↗</a>
            <a href="#get-involved">Get involved</a>
          </div>
          <div className="footer-date"><span>{festival.year} FESTIVAL</span><strong>{festival.dates}</strong><small>{festival.city}</small></div>
        </div>
        <div className="footer-bottom">
          <span>© {festival.year} National Care Leavers Festival</span>
          <span>Designed around dignity, belonging and possibility.</span>
          <a href="#home">Back to top ↑</a>
        </div>
      </div>
    </footer>
  );
}

function JoinHelper() {
  const [open, setOpen] = useState(false);

  return (
    <aside className="join-helper">
      {open && (
        <div className="join-helper-panel" role="dialog" aria-labelledby="join-helper-title">
          <div className="join-helper-heading">
            <div>
              <span>FESTIVAL COMMUNITY</span>
              <h2 id="join-helper-title">Want to join us?</h2>
            </div>
            <button type="button" className="join-helper-close" onClick={() => setOpen(false)} aria-label="Close joining help">×</button>
          </div>
          <p>Join the festival’s WhatsApp channel for community updates and ways to take part. Don’t share personal or sensitive information in public channels.</p>
          <a className="join-helper-link" href={festivalWhatsAppChannel} target="_blank" rel="noreferrer">
            Join the WhatsApp channel <Icon name="arrow" size={16} />
          </a>
        </div>
      )}
      <button
        type="button"
        className="join-helper-toggle"
        aria-expanded={open}
        onClick={() => setOpen((isOpen) => !isOpen)}
      >
        {open ? 'Close' : 'Join the festival'}
      </button>
    </aside>
  );
}

function App() {
  useEffect(() => {
    const sections = document.querySelectorAll('.bloom-section');
    if (!('IntersectionObserver' in window)) {
      sections.forEach((section) => section.classList.add('is-blooming'));
      return undefined;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-blooming');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header />
      <main id="main-content">
        <Hero />
        <Edition2025 />
        <About />
        <WhyItMatters />
        <Programme />
        <CommunityMoments />
        <FellowBlogs />
        <Leaders />
        <GetInvolved />
      </main>
      <Footer />
      <JoinHelper />
    </>
  );
}

createRoot(document.getElementById('root')).render(<App />);
