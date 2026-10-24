# National Care Leavers Festival

An editable, responsive website for the National Care Leavers Festival.

## Run locally

1. Install Node.js (18 or newer).
2. In this folder, run `npm install`.
3. Run `npm run dev` and open the local URL shown in the terminal.
4. Run `npm run build` to create the deployable site in `dist/`.

## Edit the content

Festival details and the registration URL are at the top of `src/main.jsx` in the `festival` object. The hero uses the uploaded `public/videos/festival-hero.mp4` as a full-section background video, with a photo fallback poster. Replace it with approved festival footage if needed.

The safe joining helper links directly to the festival WhatsApp channel; it does not use AI or collect information. The navbar groups the 2025 and 2026 links under “Past festivals,” while fellow blogs remain in the page content rather than the header. Update the `fellowBlogs` array with fellows’ article titles, names, summaries and full article URLs; cards without a URL intentionally show a reminder instead of a broken link. The schedule, values and other page content are also in `src/main.jsx`. Add 2025 YouTube/Vimeo embed URLs to the `edition2025Videos` list to replace the video placeholders. Colours and responsive styles are in `src/styles.css`.

Small decorative flowers bloom when the community moments, fellow blogs and care leaders sections enter view. A brief, one-time flower burst plays alongside the subtle flowers, then fades away. The animation is disabled for visitors who prefer reduced motion.

Before publishing, confirm the dates, venue, contact email, registration link, partner names/logos and all programme details with the festival organisers. The current example uses the 2026 dates visible on the reference website. The illustrations are CSS artwork, not official festival or partner logos.

## Deploy to Netlify

Connect this folder to a Netlify site, set the build command to `npm run build`, and set the publish directory to `dist`.
