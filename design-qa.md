# Offcut — build verification

final result: blocked

## Approved visual target

`/workspace/scratch/9ada322df7f4/generated_images/exec-b59c698b-3794-4e6f-a2fa-6f75d9a82a1d.png`

The user approved the hybrid of Pigment Playground and Afterglow Workshop, with identical light/dark structure, supplied wax/crayon assets and unchanged artwork colors, then chose the name Offcut and authorized implementation.

## Implementation

Updated existing React/Konva editor on branch `offcut-v1`; original project database and schema preserved. Actual assets in `public/assets/ui/light` and `public/assets/ui/dark`. Main navigation is Make, Compose, Surface, Color. Floating inspector, layer thumbnails, Projects, Stash, Undo, Redo and Export are connected to application state.

## Browser evidence

Implementation screenshot: unavailable. Expected viewport: portrait iPad 834 × 1194 CSS pixels, plus landscape and narrow-width checks. Normalization against the source raster has not been performed.

The managed preview was started and its cloud-browser tab returned “Site Unavailable. Unable to access this site.” A reload returned the same result. The obstacle was reported through the browser's supported reporting capability. A self-contained copy of the actual app was generated for local review, but opening it was rejected because the browser URL policy allows only HTTP and HTTPS. No attempt was made to bypass that policy after the refusal.

No rendered full-view or focused-region comparison exists. No browser primary-interaction or console-log check passed. This is an environment/access blocker, not a claimed visual QA pass.

## Required fidelity surfaces — pending visual inspection

- Fonts: system sans hierarchy implemented; actual wrapping, metrics and readability unverified.
- Layout: central canvas, left thumbnails, split bottom navigation and inward floating inspector implemented; tablet fit, touch spacing and overlap unverified.
- Colors: pale neutral/cobalt light tokens and deep plum/lavender/cyan dark tokens implemented. Theme choice affects interface tokens and icon assets only. Visual contrast remains unverified.
- Images: all 18 supplied PNG buttons are used rather than approximated. The sample triangle/ring artwork is made from actual editable geometry and material rendering. It is not a flattened screenshot. Its exact visual fidelity remains unverified.
- Content: Offcut branding and approved category labels implemented. Controls outside the first workflow are not advertised as implemented future features.

## Automated evidence

17 tests pass. Coverage includes model/history integrity, IndexedDB persistence, safe backup validation, real PNG dimensions and alpha, ring/triangle/frame cutouts, all six material paths, glass sampling its backdrop, source image restoration on bypass, pixel-identical artwork PNG bytes across theme changes, capped preview rasters and packaging/worker behavior. These tests use native Canvas and fake IndexedDB where appropriate, not a real browser.

Production build emits the app, theme assets, manifest and service worker. Cold offline launch, browser storage durability, Pencil behavior and iPad performance remain unverified.

## Comparison history

No browser screenshot could be captured. No visual P0/P1/P2 finding has been marked resolved without evidence. No synthetic browser screenshots are included.

## Next action

Use a permitted hosted test URL or restore local preview access. Test the complete create/import → edit → effects → save → reload/reopen → PNG workflow, confirm both themes and exact asset swaps, capture matching tablet views, compare them with the source and fix substantive issues before release.

## GitHub Pages repair

Observed the live Pages HTML serving `/src/main.jsx` from the repository root. The branch publisher does not run Vite, leaving the page without runnable application JavaScript. Source HTML now lives in `editor/`; `npm run build:pages` emits compiled files at the repository root for the existing main/root publishing configuration. Production build and all 17 automated tests pass after the change. The repaired live URL https://lacespun.github.io/OffCut/ was opened in Chrome. The canvas artwork, actual navigation PNGs, layer selection handles and Surface inspector rendered; rendering completed and the app displayed Saved and Offline ready. A full-page screenshot confirmed the editor is visible. This establishes initial desktop loading only; full editing, reload/export, theme, offline cold-launch and real iPad checks remain pending.
