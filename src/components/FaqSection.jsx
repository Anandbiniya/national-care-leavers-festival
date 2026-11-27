import React, { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, Sparkles } from 'lucide-react';

const faqs = [
  {
    id: 'what-is-nclf',
    question: 'What is the National Care Leavers Festival?',
    answer:
      'The National Care Leavers Festival (NCLF) is a national platform where care-experienced young people across India come together to connect, share their lived experiences, celebrate leadership, and shape conversations around aftercare and dignity.',
  },
  {
    id: 'dates-and-programme',
    question: 'When was the 2026 festival and what did the programme include?',
    answer:
      'The 2026 edition took place from January 17–20, 2026 across four themed days: Heal and Connect; Reconnect and Reflect; Graduate and Lead; and Speak to Policy. Activities included creative workshops, theatre, the LIFT Fellowship graduation, and a stakeholder consultation on aftercare.',
  },
  {
    id: 'who-can-join',
    question: 'Who can participate in the festival and movement?',
    answer:
      'Care leavers, care-experienced young people, alumni networks, fellows, social workers, mentors, and partner organisations working to strengthen aftercare and youth leadership are all welcome to be part of the movement.',
  },
  {
    id: 'join-2027',
    question: 'How can I register for the 2027 festival or get involved now?',
    answer:
      'Although the January 2026 festival has concluded, the movement continues year-round. You can register your interest for the 2027 festival in the Join the Movement section below, or reach out to the team to volunteer.',
  },
  {
    id: 'partnerships',
    question: 'How can organisations partner with or support the festival?',
    answer:
      'Organisations, institutions, and allies can partner on workshops, youth fellowships, policy dialogues, and community support. Email the festival team at 2026nclf@gmail.com to start a conversation.',
  },
  {
    id: 'stay-updated',
    question: 'Where can I follow updates and upcoming announcements?',
    answer:
      'Join the official NCLF WhatsApp channel or follow us on Instagram, Facebook, and LinkedIn for community stories, policy updates, and announcements about upcoming editions.',
  },
];

export default function FaqSection() {
  const sectionRef = useRef(null);
  const headingRef = useRef(null);
  const [openId, setOpenId] = useState(faqs[0].id);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const heading = headingRef.current;
    const section = sectionRef.current;
    if (!section || !('IntersectionObserver' in window)
      || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setIsVisible(true);
      return undefined;
    }

    const items = heading ? [...heading.querySelectorAll('.section-kicker, h2, p')] : [];
    items.forEach((item, index) => {
      item.style.setProperty('--section-heading-order', index);
      item.classList.add('section-heading-reveal-ready');
    });

    try {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          setIsVisible(true);
          items.forEach((item) => item.classList.add('section-heading-reveal-visible'));
          observer.disconnect();
        },
        { threshold: 0.12, rootMargin: '0px 0px -30px 0px' },
      );
      observer.observe(section);
      return () => observer.disconnect();
    } catch {
      setIsVisible(true);
      items.forEach((item) => item.classList.remove('section-heading-reveal-ready', 'section-heading-reveal-visible'));
      return undefined;
    }
  }, []);

  const toggleItem = (id) => {
    setOpenId((current) => (current === id ? null : id));
  };

  return (
    <section className="faq-section section-space" id="faq" ref={sectionRef} aria-labelledby="faq-heading">
      <div className="section-wrap">
        <div className="faq-layout">
          <div className="faq-heading" ref={headingRef}>
            <span className="section-kicker">
              <Sparkles size={14} aria-hidden="true" />
              Common questions
            </span>
            <h2 id="faq-heading">
              Frequently Asked <span>Questions</span>
            </h2>
            <p>
              Everything you need to know about the National Care Leavers Festival, our four-day programme, and how to stay connected with the movement.
            </p>
          </div>

          <div className="faq-list" role="list">
            {faqs.map((item, index) => {
              const isOpen = openId === item.id;
              const panelId = `faq-panel-${item.id}`;
              const triggerId = `faq-trigger-${item.id}`;

              return (
                <motion.div
                  key={item.id}
                  role="listitem"
                  className={`faq-item${isOpen ? ' is-open' : ''}`}
                  initial={{ opacity: 0, y: 18 }}
                  animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
                  transition={{
                    duration: 0.45,
                    delay: isVisible ? Math.min(index * 0.07, 0.35) : 0,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                >
                  <button
                    id={triggerId}
                    type="button"
                    className="faq-trigger"
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                    onClick={() => toggleItem(item.id)}
                  >
                    <span className="faq-index" aria-hidden="true">
                      {String(index + 1).padStart(2, '0')}
                    </span>
                    <span className="faq-question">{item.question}</span>
                    <span className={`faq-chevron${isOpen ? ' is-open' : ''}`} aria-hidden="true">
                      <ChevronDown size={19} />
                    </span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        id={panelId}
                        role="region"
                        aria-labelledby={triggerId}
                        className="faq-answer-wrap"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.32, ease: [0.22, 1, 0.36, 1] }}
                      >
                        <div className="faq-answer">
                          <p>{item.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
