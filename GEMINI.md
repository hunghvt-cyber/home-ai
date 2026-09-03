# Home AI Operating Rules

This file supplements the Global `GEMINI.md` with rules specific to the Home AI project.

## 1. Tech Stack & Architecture
- **Frontend**: Vanilla HTML5, CSS3, and JavaScript (ES6+). No frontend frameworks (React, Vue, etc.) or build systems.
- **Database**: Firebase Firestore (accessed via the compatibility API in `js/firebase.js`).
- **Storage**: ImageKit (accessed via Vercel Serverless Functions for private operations).
- **Backend**: Vercel Serverless Functions (`api/`).
- **AI**: Google Gemini (proxied via Vercel).

## 2. Constraints
- **No Supabase**: Do not restore Supabase or add Supabase dependencies.
- **Mobile-First**: Maintain the mobile-first design; do not break phone camera/browser usage.
- **Script Loading**: Preserve the classic script loading order in `index.html`.
- **Firebase ID**: Preserve document ID generation and timestamp normalization in `js/firebase.js`.

## 3. Image Handling
- Maintain client-side compression and EXIF handling.
- Use existing Vercel endpoints for ImageKit operations requiring private keys.
- Preserve the `/home-ai` folder convention in ImageKit.

## 4. Discovery & Knowledge Base
- **Authoritative Source**: Refer to `AGENTS.md` for the full Architectural Knowledge Base.
- Traces callers and consumers in `js/database/` before changing shared data behavior.
