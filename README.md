# National Care Leavers Festival

A responsive website for the National Care Leavers Festival, centred on care-leaver leadership and the January 2026 edition.

## Run locally

1. Install Node.js (18 or newer).
2. In this folder, run `npm install`.
3. Run `npm run dev` and open the local URL shown in the terminal.
4. Run `npm run build` to create the deployable site in `dist/`.

## Edit the content

The festival details, January 2026 programme and WhatsApp link are in `src/main.jsx`. The four main navigation links point to Home, Festival Editions, Care Leavers’ Stories and Join the Movement. The 2026 gallery uses local photos from `public/photos` and `Day 3 highlight.mp4`.

The project files do not currently include verified care-leader biographies or an attendee-feedback document. The stories and testimonial areas avoid inventing profiles, quotes or attributions. The attendee-video carousel uses the two playable uploaded clips, `Version 2.mp4` and `Day 3 highlight.mp4`; its third card remains marked as coming soon until another playable clip and verified attendee feedback are available. `Day 3 highlight.mp4` is also used as the hero background and 2026 festival highlight; a local festival photo provides the hero poster/fallback. Other uploaded hero candidates are empty or use media the browser cannot decode.

The footer contains the supplied festival email, Instagram, Facebook and LinkedIn links. Palette and responsive styles are in `src/styles.css`.

The floating festival guide in `src/components/FestivalChatbot.jsx` answers curated festival FAQs in English and all 22 languages listed in India's Eighth Schedule. Language selection, suggested questions and FAQ replies run locally in the browser; chat messages are not sent to an external AI or translation service. Questions outside the supported FAQs are directed to the official email contact. The additional language copy is an initial draft and should be reviewed by native speakers before publication.

The chatbot also supports voice input and spoken replies through browser-native speech recognition and speech synthesis, with girl/boy voice preferences when matching voices are available. Recognition language, microphones and voices vary by browser and device. Microphone permission is required; this site does not store audio, but the browser's speech-recognition provider may process voice input according to its own privacy policy. Speech features are not an AI voice service.

## Deploy to Netlify

Connect this folder to a Netlify site, set the build command to `npm run build`, and set the publish directory to `dist`.
