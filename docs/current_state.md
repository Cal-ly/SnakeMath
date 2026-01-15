# SnakeMath Current State

## Intent
The intent with this document is to outline the current state of the project, including a short look back and what we want to do next. This is in order to easily pick up progress again, after a pause.

---

## Current Status: Phase 3 Complete

**Last Updated**: 2026-01-15

### Phase 3 Summary: Content Components (Complete)

Phase 3 added the core content components for displaying educational material with math rendering, syntax highlighting, and searchable symbol tables.

| Increment | Description | Status |
|-----------|-------------|--------|
| 3A | KaTeX + MathBlock Component | ✅ Complete |
| 3B | Shiki + CodeExample Component | ✅ Complete |
| 3C | CollapsiblePanel + ContentSection | ✅ Complete |
| 3D | TabGroup (Accessible Tabs) | ✅ Complete |
| 3E | Symbol Data Files (Split by Category) | ✅ Complete |
| 3F | SymbolTable (Responsive, Searchable) | ✅ Complete |
| 3G | Content Integration & Testing | ✅ Complete |

#### What Was Built in Phase 3

**Content Components** (`src/components/content/`):
- **MathBlock**: KaTeX-powered math formula rendering with error handling
- **CodeExample**: Shiki syntax highlighting with copy button, line numbers, collapsible
- **ContentSection**: Collapsible content sections with icons and anchor links
- **SymbolTable**: Searchable, responsive symbol tables (table on desktop, cards on mobile)

**UI Components** (`src/components/ui/`):
- **CollapsiblePanel**: Reusable expand/collapse panel with ARIA
- **TabGroup**: Accessible tabbed interface with keyboard navigation
- **CopyButton**: Copy-to-clipboard with visual feedback
- **SearchInput**: Debounced search input with clear button

**Composables** (`src/composables/`):
- **useClipboard**: Clipboard API wrapper with copied state
- **useHighlighter**: Shiki highlighter singleton for performance

**Symbol Data** (`src/data/symbols/`):
- 80+ math symbols across 7 categories
- 24 Greek letters with LaTeX and common uses
- Search and filter utilities

**Dependencies Added**:
- `katex@0.16` - Math rendering
- `shiki@1` - Syntax highlighting

#### Project Structure (Phase 3 Complete)

```
src/
├── assets/styles/main.css     # Tailwind + theme + KaTeX imports
├── components/
│   ├── layout/
│   │   ├── index.ts
│   │   ├── AppHeader.vue
│   │   ├── AppFooter.vue
│   │   ├── MobileMenu.vue
│   │   └── Breadcrumbs.vue
│   ├── content/
│   │   ├── index.ts
│   │   ├── TopicPage.vue
│   │   ├── RelatedTopics.vue
│   │   ├── MathBlock.vue       # NEW: KaTeX math rendering
│   │   ├── CodeExample.vue     # NEW: Shiki syntax highlighting
│   │   ├── ContentSection.vue  # NEW: Collapsible sections
│   │   └── SymbolTable.vue     # NEW: Searchable symbol tables
│   ├── widgets/                # (ready for Phase 4)
│   └── ui/
│       ├── index.ts
│       ├── FaIcon.vue
│       ├── CopyButton.vue      # NEW: Copy to clipboard
│       ├── CollapsiblePanel.vue # NEW: Expand/collapse
│       ├── TabGroup.vue        # NEW: Accessible tabs
│       └── SearchInput.vue     # NEW: Debounced search
├── composables/
│   ├── index.ts
│   ├── useTheme.ts
│   ├── useBreadcrumbs.ts
│   ├── useClipboard.ts         # NEW: Clipboard API
│   └── useHighlighter.ts       # NEW: Shiki singleton
├── data/
│   ├── navigation.ts
│   └── symbols/                # NEW: Symbol data
│       ├── index.ts            # Barrel + search utilities
│       ├── arithmetic.ts
│       ├── algebra.ts
│       ├── calculus.ts
│       ├── sets.ts
│       ├── constants.ts
│       ├── greek.ts
│       └── ml.ts
├── router/index.ts
├── types/
│   ├── index.ts
│   ├── components.ts
│   └── symbols.ts              # UPDATED: MathSymbol, GreekLetter
├── utils/math/
├── views/
│   ├── HomeView.vue
│   ├── NotFoundView.vue
│   └── basics/
│       ├── BasicsIndex.vue
│       ├── FoundationsView.vue # UPDATED: Full content
│       ├── SymbolsView.vue     # UPDATED: Tabbed symbol tables
│       └── NumberTypesView.vue # UPDATED: Number hierarchy
├── App.vue
└── main.ts
```

#### Key Features Working

- **Math Rendering**: KaTeX with custom macros (\\N, \\Z, \\Q, \\R, \\C)
- **Syntax Highlighting**: VSCode-quality highlighting via Shiki
- **Collapsible Content**: Accessible expand/collapse with animations
- **Accessible Tabs**: Full keyboard navigation (arrows, Home, End)
- **Symbol Search**: Debounced search across 80+ symbols
- **Responsive Tables**: Cards on mobile, tables on desktop
- **Copy to Clipboard**: Visual feedback with checkmark animation
- **All Tests Passing**: 42 tests in number classification utility
- **Production Build**: Successful with lazy-loaded language chunks

---

## Phase 2 Summary (Complete)

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

### Phase 4: Interactive Widgets
- **NumberTypeExplorer**: Interactive number classification widget
- **URL State Sync**: Shareable widget configurations
- **Content Migration**: Migrate content from archive folder
- **Additional Visualizations**: Quadratic explorer, etc.

### Future Phases
- **Phase 5**: Advanced topics (Linear Algebra, Calculus)
- **Phase 6**: Performance optimization, PWA features

---

## How to Resume Development

1. **Start dev server**: `npm run dev`
2. **Read Phase 4 instructions**: `instructions/phase_4/` (when available)
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
| Phase 3 instructions | `instructions/phase_3/` |
| Phase 3 completion | `docs/PHASE_3_COMPLETE.md` |
| Accessibility guide | `docs/ACCESSIBILITY.md` |
| Route definitions | `src/router/index.ts` |
| Navigation data | `src/data/navigation.ts` |
| Symbol data | `src/data/symbols/index.ts` |
| Theme composable | `src/composables/useTheme.ts` |
| Highlighter composable | `src/composables/useHighlighter.ts` |
| Type definitions | `src/types/index.ts` |
| Theme styles | `src/assets/styles/main.css` |
| Build config | `vite.config.ts` |
| Test config | `vitest.config.ts` |

---

## Verification Commands

```bash
npm run dev          # Start dev server
npm run type-check   # TypeScript validation
npm run lint         # ESLint check (2 expected v-html warnings)
npm run test         # Run all tests
npm run build        # Production build
npm run preview      # Preview production build
```

All commands should pass without errors (lint has 2 expected warnings for v-html in KaTeX/Shiki components).

---

## Known Build Notes

- **Chunk Size Warnings**: Shiki produces large language chunks. These are lazy-loaded and acceptable.
- **v-html Warnings**: ESLint warns about v-html in MathBlock and CodeExample. These are expected as the content comes from trusted libraries (KaTeX, Shiki).
