# Offcut V1

Icons, artwork, and beautiful detours. A free, local-first, iPad-oriented creative editor. This first implementation concentrates on one workflow: create or import an icon, edit its layers and materials, save it, reopen it, and export a PNG.

**Status: implementation prepared, not release-verified.** Production compilation and 17 automated tests pass. Interactive browser QA is blocked by the current preview gateway. Real iPad / Safari / Pencil behavior and offline installation have not yet been verified. Source is hosted in [LaceSpun/OffCut](https://github.com/LaceSpun/OffCut). The app has not been deployed.

## Run

Requires Node 20.19+ (or 22.12+) and npm.

```sh
npm ci
npm run dev
npm test
npm run build
npm run preview
```

For GitHub Pages, publish **dist/client**, not the root dist folder. The app uses relative asset URLs and a relative PWA scope. A manually dispatched Pages workflow is included; it does not automatically deploy on push. Enable Pages with GitHub Actions before running it.

## First workflow

1. Start with the editable Prism study or use the project menu → New icon.
2. Make → import a PNG, JPEG or WebP, add a shape or text, or draw.
3. Compose → select, rename, move, resize, rotate, duplicate, reorder, hide or lock a layer.
4. Surface → choose a material and adjust finish, lighting, texture and depth. Settings remain separate from source artwork.
5. Color → create colors with a picker or hue/saturation/lightness sliders; apply them to a layer or canvas. Save materials as reusable styles within a project.
6. Wait for “Saved on this iPad.” Open the project menu to reopen another project or download an editable `.studio.json` backup.
7. Export PNG → choose opaque or transparent canvas → Download PNG. Selection handles are excluded. Icons export at 1024 × 1024.

## What is implemented

- Editable rectangular, elliptical, arch, triangular-band, ring, frame, text, imported-image and drawing layers.
- Canvas manipulation using Konva; numeric transform fields and layer ordering.
- Approved hybrid floating layout with an open central canvas, left layer previews and split bottom navigation: Make, Compose, Surface, Color.
- Light/dark toggle with all 18 supplied theme-specific PNG assets. The choice persists separately from artwork; switching themes does not recolor projects.
- Functional Stash for project styles, palette colors and editable layer copies.
- Pointer-event drawing; pressure recorded for pen input; optional Pencil-only mode. No tilt engine or advanced palm rejection yet.
- Adjustable flat, glass, frosted glass, chrome, metal and paper materials.
- Separate texture, fold shading, crease, torn shape edge, emboss highlight and shadow settings.
- Shared renderer for preview and export; preview rasters are capped at 768 pixels per layer to limit memory.
- IndexedDB projects, debounced transactional autosave, save-failure notification, downloadable backups, guarded backup import, undo/redo.
- Manifest, PWA icons and production service-worker precache. Updates wait for explicit Save & update.
- No accounts, remote project storage, required AI service, API keys, paid services, or runtime CDN requests.

## Honest limits

These are **2D material simulations**, not physically based 3D surfaces. Glass samples layers beneath it, and frosted glass uses a reduced-resolution backdrop. Fold shading creates an illusion; it does not fold mesh geometry. Torn edges currently affect shape silhouettes, not imported-image alpha edges. Emboss is a highlight treatment rather than a normal-map relief engine. Chrome uses stylized light bands and a radial highlight rather than environmental ray tracing.

The prototype supports 32 layers per project, 40 undo steps and 32 saved styles. Image files up to 20 MB are normalized to at most 1536 pixels on their longest side. PNG, JPEG and WebP are supported; HEIC, SVG and animated images are not. Single-icon projects are the current scope. Wallpaper sizing, multiple artboards, pack assembly/batch export, grouping, masks, crop tools, advanced brushes and geometry folds are future work.

Browser-managed storage can be removed by the browser or by clearing site data. Keep editable backups in Files. Multiple-tab conflict resolution is not implemented. Undo history is session-local and is not restored after closing the app. Projects, palettes, source images and styles are restored.

## Architecture

- `src/model.js`: versioned project schema, validation and undo/redo reducer.
- `src/storage.js`: IndexedDB transactions and backup downloads.
- `src/render.js`: canvas material renderer; sources and settings remain independent.
- `src/App.jsx`: touch-oriented editor, layers, drawer navigation and dialogs.
- `src/styles.css`: selected multicolor Sliding Studio direction and responsive layout.
- `vite.config.mjs`: local Vite build plus production PWA precache.
- `tests/editor.test.mjs`: state integrity, history, validation and project persistence.

The supplied wax/crayon icon assets live in `public/assets/ui/light` and `public/assets/ui/dark`.

React, Vite, Konva/react-konva, Phosphor icons and vite-plugin-pwa are open-source dependencies; see their licenses in `node_modules`. Generated paper and launcher assets are bundled. The application source is MIT licensed. No Groq integration is needed for the core editor. A future optional integration should use explicit opt-in and must not embed API keys in a public bundle.

## Verified in automated tests

17 checks pass, including IndexedDB round trips, nondestructive edits, undo/redo, unsafe backup rejection, shape cutouts, real PNG pixel dimensions and alpha, image restoration when effects are bypassed, glass backdrop sampling, all material render paths, preview memory caps, and identical artwork PNG bytes before/after a theme change. Renderer tests use a native Canvas implementation, not a browser, and do not establish actual iPad/Safari behavior.

## Verification still required

- Open the selected design and rendered editor at matching tablet dimensions; check all drawers, modal focus, overflow and touch targets.
- Create/import → change geometry and effects → undo/redo → save → reload → reopen → export; inspect the PNG and JSON backup.
- Install production PWA on actual iPad Safari, load once, disconnect, cold launch, edit, reopen and export.
- Check Pencil pressure, Pencil-only mode, touch dragging and palm interaction on actual hardware.
- Measure memory and frame times with multiple large imports, and implement concurrency protection before treating browser storage as release-ready.

Primary technical references: [Konva](https://konvajs.org/docs/about.html), [React Konva exports](https://konvajs.org/docs/react/Canvas_Export.html), [IndexedDB](https://developer.mozilla.org/en-US/docs/Web/API/IndexedDB_API/Using_IndexedDB), [service workers](https://developer.mozilla.org/en-US/docs/Web/API/Service_Worker_API/Using_Service_Workers).
