import React from 'react';

export default function CareLeaverStories() {
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
          <p>This space is reserved for stories shared and approved by care leavers.</p>
        </header>

        <article className="care-story-placeholder" aria-label="Care leaver story placeholder">
          <span className="care-story-placeholder-label">Story placeholder</span>
          <h3>Approved story to be added</h3>
          <p>Add the storyteller's words here when they are ready to share.</p>
          <span className="care-story-placeholder-attribution">
            Name and attribution to be added with the storyteller's permission.
          </span>
        </article>
      </div>
    </section>
  );
}
