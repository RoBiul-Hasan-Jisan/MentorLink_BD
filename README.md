# MentorLink BD website

Marketing site for the MentorLink BD app, built with Next.js 14 (App Router) and TypeScript.
Same versions as `admin-panel/`, so it installs the same way.

```bash
npm install
npm run dev      # http://localhost:3001
npm run build && npm start
```

## What is on the page
Hero with a live phone preview, how it works, features, six interactive demos (Readiness, Mentor match,
Scam check, Hiring pipeline, Proof Arena, Career Passport), roles, principles.

## Design
Colours and fonts come from the app: `mobile/lib/core/theme.dart` ("Chrome Black + Digital Lilac")
with Bricolage Grotesque and Hind Siliguri. The tokens are at the top of `app/globals.css`.

## Where things live
- `lib/data.ts`  rules and sample data (readiness formula, match weights, scam patterns, hiring stages, arena rubric)
- `lib/store.tsx`  state shared by the phone preview, Readiness and Mentor match
- `components/`  page sections; `components/demos/` one file per demo
- `public/logo.png`, `app/icon.png`  the app icon

The demos run in the browser with sample data. Mentor names and arena entries are fictional.
To deploy on Vercel, set the project root to this folder.
