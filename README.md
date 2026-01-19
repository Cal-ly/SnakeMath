# SnakeMath

SnakeMath is an educational mathematics website for programmers.

The core idea is to teach math the way developers think about it:

> “That big and scary-looking Sigma is basically just a for loop.”

It uses interactive visualizations, programmer-focused explanations, and Python-flavored code examples.

## Live & Routing Notes

This project is built and deployed as a single-page application (SPA). The Vite base path is configured for GitHub Pages:

- Production base path: `/SnakeMath/` (see `vite.config.ts`)
- Build step copies `dist/index.html` to `dist/404.html` to support deep links on GitHub Pages (see `scripts/copy-404.js`)

If you deploy somewhere else (or under a different subpath), you’ll need to adjust the `base` setting.

## Tech Stack

- Vue 3 + TypeScript
- Vite
- Vue Router (history mode)
- Tailwind CSS
- KaTeX (math rendering)
- Shiki (syntax highlighting for code examples)
- Vitest (unit tests)
- Playwright (E2E, visual regression, accessibility)
- axe-core (a11y auditing in Playwright)

## Requirements

- Node.js: `^20.19.0` or `>=22.12.0` (see `package.json` → `engines`)
- npm

## Quick Start

```bash
npm install
npm run dev
```

Then open the URL Vite prints (typically `http://localhost:5173`).

## Common Commands

### Development

```bash
npm run dev       # Vite dev server
npm run preview   # Serve production build locally (used by Playwright webServer)
```

### Build

```bash
npm run build      # Type-check + build
npm run build-only # Build without type-check
```

Notes:

- `npm run build` runs `type-check` and `build-only` in parallel.
- `postbuild` generates `dist/404.html` for GitHub Pages SPA routing.

### Linting & Formatting

```bash
npm run lint         # ESLint with auto-fix
npm run lint:check   # ESLint without fixes

npm run format       # Prettier write (src/)
npm run format:check # Prettier check (src/)
```

### Unit Tests (Vitest)

```bash
npm run test:unit
npm test
npm run test:watch
npm run test:coverage
```

### End-to-End & A11y Tests (Playwright)

Playwright tests live in `e2e/` and are configured to run against `npm run preview`.

```bash
npm run test:e2e       # Chromium E2E (excludes @visual)
npm run test:e2e:ui    # Playwright UI runner
npm run test:e2e:debug # Debug mode

npm run test:a11y      # Runs tests tagged @a11y
```

### Visual Regression (local-focused)

Visual tests are Playwright screenshot tests (see `e2e/__screenshots__/`).

```bash
npm run test:visual
npm run test:visual:update
npm run test:visual:mobile
```

### All Tests

```bash
npm run test:all
```

## Project Structure

High-level layout:

```
.
├── docs/                 # Project documentation (INDEX.md is the entry point)
├── e2e/                  # Playwright tests (E2E, a11y, visual)
├── src/
│   ├── assets/styles/     # Tailwind + CSS variables / global styles
│   ├── components/
│   │   ├── content/       # Content building blocks (MathBlock, CodeExample, etc.)
│   │   ├── layout/        # App shell (header/nav/footer)
│   │   ├── ui/            # Reusable UI primitives
│   │   ├── visualizations/# Plotting + visualization primitives
│   │   └── widgets/       # Interactive widgets/explorers
│   ├── composables/       # useX() logic shared by widgets/pages
│   ├── data/              # Static data (navigation, symbol tables, presets)
│   ├── router/            # Route definitions
│   ├── types/             # TypeScript types
│   ├── utils/             # Pure utilities (including math helpers)
│   └── views/             # Route-level pages
├── archive/               # Previous implementations (inspiration only; excluded from build)
└── scripts/               # Build helpers
```

### Archive Directory

`archive/` contains prior implementations and content sources for reference.

- It is **not** part of the build.
- Do not import from it.
- Copy/adapt patterns and content into `src/`.

## How Content Is Authored

SnakeMath uses **Vue components for content pages** (not Markdown rendering). This keeps math, code, and interactive widgets consistent and controllable.

Common building blocks:

- KaTeX math blocks
- Shiki-highlighted code examples
- Collapsible content sections
- “Related Topics” section on pages (see design system)

If you’re adding a new topic:

1. Add a route/view in `src/views/` and wire it in `src/router/`.
2. Use the established content components in `src/components/content/`.
3. Add any widget components under `src/components/widgets/`.
4. Put shared logic in a composable in `src/composables/`.
5. Add unit tests for math/util logic (Vitest) and E2E coverage for key interactions (Playwright).

## Testing Philosophy (At a Glance)

- **Vitest** covers math utilities, composables, and pure logic.
- **Playwright E2E** covers key flows and widget interactions.
- **Playwright + axe-core** runs WCAG-focused audits for regressions.
- **Visual regression** exists for local confidence; update snapshots intentionally.

## Documentation

Start here:

- `docs/INDEX.md` — index of all documentation
- `docs/CURRENT_STATE.md` — what’s implemented and how to resume work
- `docs/ROADMAP.md` — what’s next
- `docs/DESIGN_SYSTEM.md` — UI patterns and conventions
- `docs/DECISIONS.md` — architecture decisions (D-XXX)
- `docs/ACCESSIBILITY.md` — accessibility guidelines

There’s also a detailed project guide for AI-assisted development:

- `CLAUDE.md` — workflow, conventions, and archive usage

## Contributing

Contributions are welcome. To keep things consistent:

- Prefer small PRs that introduce one widget/topic at a time.
- Keep logic testable: put math/transformations in `src/utils/` or composables.
- Add/maintain `data-testid` hooks for reliable E2E tests.
- Run locally before pushing:

```bash
npm run type-check
npm run lint:check
npm test
```

## Troubleshooting

### Deep links 404 on GitHub Pages

This repo uses an SPA routing workaround:

- `postbuild` copies `index.html` to `404.html`.

If you’re deploying somewhere else, ensure your host is configured for SPA fallback routing, or adjust accordingly.

### Playwright base URL looks “weird”

The Playwright config expects the `/SnakeMath/` base path in preview mode, matching GitHub Pages deployment. If you change the Vite base, update Playwright’s `webServer.url`.

---

he fastest way to get oriented is `docs/CURRENT_STATE.md` 
