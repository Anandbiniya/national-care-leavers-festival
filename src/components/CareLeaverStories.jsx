import React from 'react';
import { BookOpen, Compass, MessageSquareHeart } from 'lucide-react';

const storyThemes = [
  {
    icon: Compass,
    title: 'My Journey',
    detail: 'The experiences, milestones and turning points that shape who you are.',
  },
  {
    icon: BookOpen,
    title: 'Lessons Learned',
    detail: 'What helped you grow, recover, connect or find your direction after care.',
  },
  {
    icon: MessageSquareHeart,
    title: 'My Message to Society',
    detail: 'What you want communities, allies and systems to understand about care-experienced lives.',
  },
];

export default function CareLeaverStories({ email }) {
  return (
    <section
      className="care-leaver-stories-section section-space"
      id="care-leavers-stories"
      aria-labelledby="care-leaver-stories-title"
    >
      <div className="section-wrap">
        <div className="stories-shell">
          <header className="care-leaver-stories-heading">
            <span className="section-kicker">Participant Voices</span>
            <h2 id="care-leaver-stories-title">
              Stories, shared in <span>their own words.</span>
            </h2>
            <p>
              Approved participant stories from the 2026 festival are being curated with consent. Every story is published only when a care-experienced contributor chooses to share it.
            </p>
          </header>

          <div className="care-story-theme-grid">
            {storyThemes.map(({ icon: ThemeIcon, title, detail }) => (
              <article className="care-story-theme" key={title}>
                <span className="care-story-theme-icon" aria-hidden="true">
                  <ThemeIcon size={20} strokeWidth={2} />
                </span>
                <h3>{title}</h3>
                <p>{detail}</p>
              </article>
            ))}
          </div>

          <div className="care-story-submit">
            <div>
              <span className="section-kicker">Add your perspective</span>
              <h3>Want to share your reflection with the movement?</h3>
            </div>
            <a
              className="button button-primary"
              href={`mailto:${email}?subject=${encodeURIComponent('Share my care leaver story')}`}
            >
              Share Your Story
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
