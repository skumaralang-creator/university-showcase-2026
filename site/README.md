# University Showcase — To‑Do App (React + PWA)

This folder contains a small Next.js site (TypeScript) with a React To‑Do app demonstrating:

- LocalStorage persistence
- Theme preference persistence (light/dark)
- Drag & drop reorder (HTML5 drag)
- Export / import tasks (JSON)
- PWA support (service worker + manifest)

How to run locally

1. Install deps: npm install
2. Dev: npm run dev
3. Production build + export (static): npm run build -> outputs to out/ for static hosting

Deploy

- Vercel: Connect the repository and deploy the root `site/` folder; Vercel detects Next.js automatically.
- GitHub Pages (static): run `npm run build` then push the generated `out/` folder to the gh-pages branch or use actions to publish `out/`.

Notes

- The original vanilla JS to-do app is still in /todo (root) for a simple fallback if you prefer no build step.
