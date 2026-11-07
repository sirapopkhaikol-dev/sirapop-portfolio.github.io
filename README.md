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


## Updating Contact and Resume

- Edit `components/contactDetails.ts` to replace the example email, phone, GitHub, and LinkedIn values and their `href` destinations. Set `isPlaceholder: false` when all details are ready; this removes the example notices from Contact, Resume, and the assistant.
- The Contact page is `/contact/`; the web resume is `/resume/`. Both are reachable from the navigation, home page, and workspace links.
- Edit `components/Resume.tsx` to update the online resume content.
- Replace `public/resume.pdf` with a newer PDF using the same filename to update the download. The supplied original PDF was copied without alteration.
- Rebuild and redeploy after updating either the content or PDF.
