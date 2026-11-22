# Prototype Instructions

Run the local server yourself and open the preview in the browser available to this environment. Do not give the user server-start instructions when you can run it.

Before making substantial visual changes, use the Product Design plugin's `get-context` skill when the visual source is unclear or no longer matches the current goal. When the user gives durable prototype-specific design feedback, preferences, or decisions, record them in `AGENTS.md`.

When implementing from a selected generated mock, treat that image as the source of truth for layout, component anatomy, density, spacing, color, typography, visible content, and hierarchy.

Build app UI in `src/`. Keep `.openai/hosting.json`, `worker/index.js`, `scripts/prepare-sites-build.mjs`, and `tests/sites-worker.test.mjs` intact so the same local prototype can be handed to Sites. Before a Sites handoff, run `npm run build` and `npm run test:sites`; the build must leave `dist/client/index.html`, `dist/server/index.js`, and `dist/.openai/hosting.json`.

## Offcut — approved direction

The PWA is named Offcut. Preserve the approved hybrid light/dark layout: `/workspace/scratch/9ada322df7f4/generated_images/exec-b59c698b-3794-4e6f-a2fa-6f75d9a82a1d.png`. Use the actual supplied wax/crayon PNG UI assets in `public/assets/ui/light` and `public/assets/ui/dark`; do not substitute generic symbols for Make, Compose, Surface, Color, Projects, Stash, Undo, Redo or Export. Theme changes affect UI and navigation assets only, never project artwork or its colors. Main navigation: Make, Compose, Surface, Color. Small utilities: Projects, Stash, Undo, Redo, Export. Keep open central canvas, left layer previews, split bottom navigation and an inward floating inspector. On small screens inspectors may expand for usable editing.

Initial release scope: one complete icon create/import → layer editing → nondestructive surface effects → save → reopen → PNG export workflow. Preserve existing IndexedDB database name and project schema so earlier projects remain readable. Keep editable project backups available. Core functionality stays free and offline-capable; no AI dependency. Do not claim release-ready iPad/Pencil behavior until actually tested. See `design-qa.md` for the current verification record.
