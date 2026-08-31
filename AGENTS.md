# AGENTS.md

## Project

Home AI (Storage & Forget) is a small family web application for cataloging household items, storage locations, photos, rooms, and AI-assisted item recognition.

Repository: `hunghvt-cyber/home-ai`
Default branch: `main`

## Current architecture

Treat the current source code as the source of truth. Older documentation may describe the previous Supabase architecture and must not override the implementation.

- Frontend: HTML5 + CSS3 + Vanilla JavaScript (ES6+).
- No frontend framework or build system is currently used.
- Database: **Firebase Firestore**.
- `js/firebase.js` initializes Firestore and provides a Supabase-style compatibility query API used by the existing database modules. This compatibility API does **not** mean the project uses Supabase.
- Image storage: **ImageKit**.
- Backend: **Vercel Serverless Functions** under `api/`.
- AI: **Google Gemini**, accessed through the Vercel backend proxy.
- Server-only Gemini and ImageKit private credentials belong in Vercel environment variables.
- Static frontend assets are loaded directly by `index.html` from the repository/CDNs.

### Migration rule

The current application uses Firebase Firestore + ImageKit, not Supabase.

- Do not add new Supabase dependencies.
- Do not restore Supabase Database or Supabase Storage.
- Do not copy the old Supabase architecture into new code.
- If an old document, workflow, comment, or filename mentions Supabase, verify it against the current source before relying on it.
- Current source code wins over stale documentation.

## Main source layout

- `index.html` — HTML UI and script loading order.
- `css/style.css` — application styling.
- `js/config.js` — frontend runtime configuration and API endpoint configuration.
- `js/firebase.js` — Firebase initialization, Firestore access, data normalization, and compatibility query adapter.
- `js/image.js` — image capture/selection and client-side image handling.
- `js/imagekit.js` — ImageKit client configuration.
- `js/app.js` — application initialization and global coordination.
- `js/database/` — item persistence, loading, editing, deletion, trash, rendering, gallery, and image-storage flows.
- `js/rooms/` — room management and room statistics.
- `js/search/` — search, filtering, and QR/barcode scanning.
- `js/ai/` — Gemini client, Vision, Multi-Scan, Burst Mode, and AI UI flows.
- `api/gemini.js` — Gemini proxy, validation, retry, model fallback, and response processing.
- `api/prompt.js` — AI prompts.
- `api/response.js` — Gemini response cleaning/parsing.
- `api/models.js` — model-related helpers/configuration.
- `api/imagekit-auth.js` — ImageKit authentication endpoint.
- `api/imagekit-storage.js` — server-side ImageKit listing/deletion operations.
- `docs/` — technical documentation; some files may still contain historical Supabase references.

## Functional areas

The current source implements:

1. Single Scan — analyze one image with Gemini and populate item fields.
2. Multi-Scan — detect multiple items from one image and review them in a batch modal.
3. Burst Mode — process multiple captured images concurrently and review/save results.
4. Item management — create, edit, load, render, soft-delete, restore, and cleanup.
5. Image management — client-side compression, ImageKit upload/storage, primary/extra images, and cleanup.
6. Room management — room CRUD and room statistics.
7. Search/filter — in-memory filtering plus QR/barcode lookup.
8. Trash — soft deletion, restoration, cleanup, and removal of old deleted items.

## Architecture and code rules

- Preserve the existing Vanilla JavaScript architecture unless the task explicitly requests a migration.
- Do not introduce React, Vue, TypeScript, a bundler, or another framework for a local fix.
- Keep files focused on their existing responsibilities.
- Prefer small, targeted changes over broad rewrites.
- Reuse existing helpers and services instead of duplicating logic.
- Preserve the script dependency/load order in `index.html` unless there is a concrete reason to change it.
- Before changing shared data behavior, inspect all consumers.
- Do not change Firestore collection names, document fields, ID behavior, or timestamp behavior without tracing all affected modules.
- When changing `js/firebase.js`, inspect all files under `js/database/`, `js/rooms/`, and `js/search/` that depend on its compatibility API.
- Preserve existing Single Scan, Multi-Scan, and Burst Mode semantics unless the task explicitly changes them.
- Preserve mobile-first behavior; the application is designed to be used from a phone camera/browser.

## Firebase / Firestore

- Firebase Firestore is the current database.
- The browser uses the Firebase client SDK loaded by `index.html`.
- `js/firebase.js` intentionally exposes a compatibility API resembling common Supabase query calls because existing application modules use that interface.
- Do not mistake compatibility method names for a requirement to use Supabase.
- Avoid unnecessary full-collection reads/writes when a targeted operation is possible.
- Preserve document ID generation and timestamp normalization implemented by `js/firebase.js`.
- Do not weaken or bypass Firestore security controls.

## ImageKit

- ImageKit is the current image-storage provider.
- Public ImageKit configuration may be used client-side as required by the SDK.
- Never put an ImageKit private API key in frontend code.
- Use the existing Vercel endpoints for operations requiring the private key.
- Preserve the `/home-ai` folder convention unless explicitly changed.
- Avoid unnecessary duplicate image uploads.
- Before deleting an image, account for references from active items, extra images, trash, and other application data.

## Gemini / AI

- Browser code calls the existing Gemini client/service; the private Gemini API key remains server-side in `api/gemini.js`.
- Keep prompts in `api/prompt.js` and response normalization/parsing in `api/response.js` when appropriate.
- Preserve the current retry and model-fallback behavior unless the task explicitly changes it.
- Preserve the distinction between `single` and `multi` modes.
- Validate and normalize AI responses before using them in application state or the DOM.
- AI output is assistance for item entry; do not silently replace user-confirmed data.
- Do not expose API keys or other private credentials in source, logs, responses, or documentation.

## Security

- Never add API keys, private keys, passwords, tokens, service-account credentials, or other secrets to new files.
- Never copy an existing exposed secret into another file.
- Keep server-only credentials in Vercel environment variables.
- Preserve request authorization such as `x-app-secret` where it is part of the current API design.
- Preserve DOM/data sanitization and do not insert untrusted user or AI content into HTML unsafely.
- Do not weaken CORS, authorization, validation, or storage-deletion protections merely to make a request work.

## Images and UI

- Preserve client-side image compression and orientation/EXIF handling.
- Avoid unnecessary image re-encoding.
- Preserve existing Viewer.js, SortableJS, Toastify, SweetAlert2, DOMPurify, Compressor.js, and html5-qrcode integrations unless explicitly removing/replacing them.
- Keep camera capture, gallery selection, Multi-Scan, Burst Mode, extra-image management, and QR/barcode scanning working.
- Avoid desktop-only changes that break phone usage.

## Documentation

- Current source code is authoritative.
- Do not use historical Supabase documentation as implementation guidance for the current system.
- When updating architecture documentation, describe the current flow as:

  `Vanilla JS frontend → Firebase Firestore + ImageKit → Vercel API → Gemini`

- Keep file names and documented behavior aligned with the repository.

## Change workflow

Before modifying code:

1. Read the relevant source files.
2. Trace callers and consumers of the code being changed.
3. Check related database, image-storage, AI, and UI flows when the change crosses boundaries.
4. Use documentation only as supplementary context.

While modifying code:

1. Make the smallest change that correctly solves the task.
2. Preserve unrelated behavior.
3. Avoid speculative refactors.
4. Preserve the current browser-based deployment model.

Before finishing:

1. Inspect `git status`.
2. Inspect the complete `git diff`.
3. Check for accidental secrets and unrelated changes.
4. Run every relevant test, syntax check, validation, or build command available in the repository.
5. If there is no automated test/build system, perform appropriate static/syntax checks and report that limitation.
6. Re-read the changed code for regressions.

## Git workflow for Codex

When the user explicitly asks to complete a coding task and commit/push it:

1. Work only on the requested change.
2. Do not include unrelated working-tree changes.
3. Validate the change before committing.
4. Review the final diff.
5. Create a concise, descriptive commit message.
6. Commit only after validation succeeds.
7. Push to the requested/current branch when write access is available.
8. Report the commit SHA and validation result.

If the user asks for a PR, use a dedicated branch and open the PR against `main` instead of pushing the change directly to `main`.

Do not force-push, rewrite history, or delete branches unless explicitly requested.

## Definition of done

A task is complete when:

- The requested behavior is implemented.
- Relevant existing behavior is preserved.
- No new secret exposure is introduced.
- Relevant checks/tests have been run as far as the repository permits.
- The final diff contains only intentional changes.
- If requested, the change is committed and pushed.
