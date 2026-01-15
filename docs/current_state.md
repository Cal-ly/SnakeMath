# SnakeMath Current State

## Intent
The intent with this document is to outline the current state of the project, including a short look back and what we want to do next. This is in order to easily pick up progress again, after a pause.

---

## Current Status: Phase 2 Complete

**Last Updated**: 2026-01-15

### Phase 2 Summary: Layout & Navigation (Complete)

Phase 2 established the app shell, navigation infrastructure, and accessibility foundations.

| Increment | Description | Status |
|-----------|-------------|--------|
| 2A | Theme Composable | ✅ Complete |
| 2B | AppHeader Component | ✅ Complete |
| 2C | Mobile Navigation | ✅ Complete |
| 2D | Breadcrumbs Component | ✅ Complete |
| 2E | TopicPage Layout Wrapper | ✅ Complete |
| 2F | AppFooter | ✅ Complete |
| 2G | Shell Integration & Accessibility | ✅ Complete |

#### What Was Built in Phase 2

- **Theme System**: `useTheme` composable with system preference detection and localStorage persistence
- **Primary Color**: Dark Emerald Green `#27592D`
- **Favicon**: Snake emoji 🐍 via SVG data URI
- **AppHeader**: Sticky header with desktop navigation and mobile menu button
- **MobileMenu**: Slide-out drawer with navigation links and theme toggle
- **Breadcrumbs**: Horizontal scroll on mobile, chevron separators
- **TopicPage**: Reusable layout wrapper with auto-detected titles
- **RelatedTopics**: Component for linking related content
- **AppFooter**: Site footer with topic links, GitHub links, and attribution
- **HomeView**: Polished landing page with hero, features, site structure, and CTAs
- **Font Awesome**: Icons loaded via CDN
- **Barrel Exports**: Component directories have index.ts exports
- **Accessibility**: Skip-to-content link, focus trap, ARIA attributes, sr-only utility

#### Project Structure (Phase 2 Complete)

```
src/
├── assets/styles/main.css     # Tailwind + theme CSS variables + utilities
├── components/
│   ├── layout/
│   │   ├── index.ts           # Barrel export
│   │   ├── AppHeader.vue      # Site header with navigation
│   │   ├── AppFooter.vue      # Site footer with links
│   │   ├── MobileMenu.vue     # Slide-out mobile navigation
│   │   └── Breadcrumbs.vue    # Path navigation component
│   ├── content/
│   │   ├── index.ts           # Barrel export
│   │   ├── TopicPage.vue      # Page layout wrapper
│   │   └── RelatedTopics.vue  # Related links component
│   ├── widgets/               # (empty, ready for Phase 3+)
│   └── ui/
│       ├── index.ts           # Barrel export
│       └── FaIcon.vue         # Font Awesome icon wrapper
├── composables/
│   ├── useTheme.ts            # Theme management (singleton)
│   ├── useBreadcrumbs.ts      # Route-based breadcrumbs
│   └── index.ts               # Barrel export
├── data/
│   ├── navigation.ts          # Topic structure + breadcrumbs
│   └── symbols/               # (empty, ready for content)
├── router/index.ts            # Routes configured
├── types/                     # TypeScript definitions
├── utils/math/                # Math utilities + tests
├── views/
│   ├── HomeView.vue           # Polished landing page
│   ├── NotFoundView.vue       # 404 page
│   └── basics/
│       ├── BasicsIndex.vue    # Topic index
│       ├── FoundationsView.vue
│       ├── SymbolsView.vue
│       └── NumberTypesView.vue
├── App.vue                    # Root component with shell
└── main.ts                    # Entry point
```

#### Key Features Working

- **Theme Persistence**: Saved to localStorage, follows system preference by default
- **Responsive Navigation**: Desktop nav in header, slide-out drawer on mobile
- **Accessibility**: Skip-to-content, focus trap, ARIA attributes, reduced motion support
- **Consistent Layouts**: TopicPage provides uniform structure for content pages
- **Polished Home Page**: Hero section, features grid, site structure, topic cards, CTAs
- **Footer**: Topic links, GitHub links, copyright
- **All Tests Passing**: 42 tests in number classification utility

---

## Phase 1 Summary (Complete)

Phase 1 established the development foundation:

| Increment | Description | Status |
|-----------|-------------|--------|
| 1A | Project Initialization | ✅ Complete |
| 1B | Tailwind CSS Setup | ✅ Complete |
| 1C | Project Structure & Routing | ✅ Complete |
| 1D | TypeScript Type Definitions | ✅ Complete |
| 1E | Vitest Configuration | ✅ Complete |
| 1F | GitHub Pages Deployment | ✅ Complete |
| 1G | ESLint & Prettier Configuration | ✅ Complete |

---

## Next Steps

### Phase 3: Content Components
- **MathBlock**: KaTeX integration for math rendering
- **CodeExample**: Syntax highlighting for code snippets
- **ContentSection**: Collapsible content sections
- **SymbolTable**: Searchable/filterable symbol tables
- **TabGroup**: For organizing symbol categories

### Phase 4: Interactive Widgets
- **NumberTypeExplorer**: Interactive number classification widget
- **Content Migration**: Migrate content from archive folder

---

## How to Resume Development

1. **Start dev server**: `npm run dev`
2. **Read Phase 3 instructions**: `instructions/phase_3/` (when available)
3. **Run verification before commits**:
   ```bash
   npm run type-check && npm run lint && npm run test && npm run build
   ```

---

## Key Files Reference

| Purpose | File |
|---------|------|
| Project guide | `CLAUDE.md` |
| Phase 1 instructions | `instructions/phase_1/` |
| Phase 2 instructions | `instructions/phase_2/` |
| Accessibility guide | `docs/ACCESSIBILITY.md` |
| Route definitions | `src/router/index.ts` |
| Navigation data | `src/data/navigation.ts` |
| Theme composable | `src/composables/useTheme.ts` |
| Type definitions | `src/types/index.ts` |
| Theme styles | `src/assets/styles/main.css` |
| Build config | `vite.config.ts` |
| Test config | `vitest.config.ts` |

---

## Verification Commands

```bash
npm run dev          # Start dev server
npm run type-check   # TypeScript validation
npm run lint         # ESLint check
npm run test         # Run all tests
npm run build        # Production build
```

All commands should pass without errors.
