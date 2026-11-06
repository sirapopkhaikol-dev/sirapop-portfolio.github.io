# Sirapop Khaikol’s portfolio

A TypeScript and Next.js portfolio with a local question-and-answer assistant, interactive timeline, algorithm visualizer, and STAR constellation.

## Run locally

Use Node.js 22 or newer. In this folder, run `npm install` and `npm run dev`. Open the local address printed by Next.js.

Run `npm run typecheck` to check TypeScript. Run `npm run build` to generate a static website in `out`.

## Personalize

- Place your photo in `public/portrait.webp`, `public/portrait.jpg`, `public/portrait.jpeg`, or `public/portrait.png` and rebuild. Selecting the photo in the header opens the full portrait and a short introduction. Edit that introduction in `components/ProfileDialog.tsx`.
- Edit the milestone reflections in `components/Journey.tsx`. They are suggested copy based on the milestone outline. The two stock photographs are labeled illustrative and can be replaced with personal photos.
- Edit the principles and mottos in `components/Values.tsx`. Update the corresponding local replies in `components/Assistant.tsx` if you change your biography or values.

The illustrative university and laptop photographs are from Unsplash. The orbital illustration and workspace diagrams are original vector artwork.
