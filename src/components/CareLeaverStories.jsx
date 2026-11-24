import React from 'react';

export default function CareLeaverStories() {
  const storyThemes = [
    {
      number: '01',
      title: 'My Journey',
      detail: 'The experiences and turning points that shape who you are.',
    },
    {
      number: '02',
      title: 'Lessons Learned',
      detail: 'What helped you grow, recover, connect or find your direction.',
    },
    {
      number: '03',
      title: 'My Message to Society',
      detail: 'What you want people and systems to understand about care-experienced lives.',
    },
  ];

  return (
    <section
      className="care-leaver-stories-section section-space"
      id="care-leavers-stories"
      aria-labelledby="care-leaver-stories-title"
    >
      <div className="section-wrap">
        <header className="care-leaver-stories-heading">
          <span className="section-kicker">Care Leavers' Stories</span>
          <h2 id="care-leaver-stories-title">Stories, shared in their own words</h2>
          <p>
            Every voice carries a perspective that can change how care-experienced lives are understood. Share a reflection, with your story published only with your permission.
          </p>
        </header>
        <div className="care-story-theme-grid">
          {storyThemes.map((theme) => (
            <article className="care-story-theme" key={theme.title}>
              <span className="care-story-theme-number">{theme.number}</span>
              <h3>{theme.title}</h3>
              <p>{theme.detail}</p>
            </article>
          ))}
        </div>
        <div className="care-story-submit">
          <div>
            <span className="section-kicker">Share your story</span>
            <h3>Want to add your voice to the movement?</h3>
          </div>
          <a
            className="button button-primary"
            href="mailto:2026nclf@gmail.com?subject=Share%20my%20care%20leaver%20story"
          >
            Share Your Story
          </a>
        </div>
      </div>
    </section>
  );
}
