# SnakeMath Current State

## Intent
The intent with this document is to outline the current state of the project, including a short look back and what we want to do next. This is in order to easily pick up progress again, after a pause.

---

## Current Status: Phase 4 Complete

**Last Updated**: 2026-01-15

### Phase 4 Summary: Interactive Widgets (Complete)

Phase 4 added the NumberTypeExplorer widget and supporting components for interactive learning about number types.

| Increment | Description | Status |
|-----------|-------------|--------|
| 4A | NumberInput Component with Validation | ✅ Complete |
| 4B | NumberTypeExplorer Widget | ✅ Complete |
| 4C | URL State Synchronization | ✅ Complete |
| 4D | Visualizations (Number Line, Venn) | ✅ Complete |
| 4E | Content Migration from Archive | ✅ Complete |
| 4F | Integration & Polish | ✅ Complete |

#### What Was Built in Phase 4

**Widget Components** (`src/components/widgets/`):
- **NumberInput**: Reusable number input with real-time validation
- **NumberTypeExplorer**: Main widget combining input, results, and visualizations
- **SetMembershipDisplay**: Checklist showing set membership (ℕ, ℤ, ℚ, ℝ, ℂ)
- **NumberProperties**: Grid showing number properties (type, sign, parity, primality)
- **NumberLine**: Visual number line with auto-zoom and position marker
- **SetVennDiagram**: Nested set visualization with highlighting
- **VisualizationToggle**: Toggle button for showing/hiding visualizations

**Composables** (`src/composables/`):
- **useUrlState**: Bi-directional URL query param synchronization with debouncing

**Data** (`src/data/`):
- **exampleNumbers.ts**: Quick-select example numbers by category

**Tests** (`src/components/widgets/`):
- **NumberInput.test.ts**: 14 tests for input validation

#### Project Structure (Phase 4 Complete)

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
│   │   ├── MathBlock.vue
│   │   ├── CodeExample.vue
│   │   ├── ContentSection.vue
│   │   └── SymbolTable.vue
│   ├── widgets/               # NEW: Phase 4
│   │   ├── index.ts
│   │   ├── NumberInput.vue
│   │   ├── NumberInput.test.ts
│   │   ├── NumberTypeExplorer.vue
│   │   ├── SetMembershipDisplay.vue
│   │   ├── NumberProperties.vue
│   │   ├── NumberLine.vue
│   │   ├── SetVennDiagram.vue
│   │   └── VisualizationToggle.vue
│   └── ui/
│       ├── index.ts
│       ├── FaIcon.vue
│       ├── CopyButton.vue
│       ├── CollapsiblePanel.vue
│       ├── TabGroup.vue
│       └── SearchInput.vue
├── composables/
│   ├── index.ts
│   ├── useTheme.ts
│   ├── useBreadcrumbs.ts
│   ├── useClipboard.ts
│   ├── useHighlighter.ts
│   └── useUrlState.ts         # NEW: URL state sync
├── data/
│   ├── navigation.ts
│   ├── exampleNumbers.ts      # NEW: Example numbers
│   └── symbols/
│       ├── index.ts
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
│   ├── math.ts                # UPDATED: NumberProperties type
│   └── symbols.ts
├── utils/math/
│   └── numberClassification.ts # UPDATED: getNumberProperties fn
├── views/
│   ├── HomeView.vue
│   ├── NotFoundView.vue
│   └── basics/
│       ├── BasicsIndex.vue
│       ├── FoundationsView.vue
│       ├── SymbolsView.vue
│       └── NumberTypesView.vue # UPDATED: Full content + explorer
├── App.vue
└── main.ts
```

#### Key Features Working

- **NumberTypeExplorer**: Interactive number classification with all visualizations
- **URL State Sync**: Shareable links via `?n=42` query params
- **Number Line**: Auto-zoom to fit value, tick marks, position marker
- **Venn Diagram**: Nested sets with highlighting for current value
- **Toggleable Visualizations**: User controls visibility
- **Comprehensive Content**: Educational explanations with Python code examples
- **56 Tests Passing**: 42 numberClassification + 14 NumberInput tests
- **Production Build**: Successful with lazy-loaded chunks

---

## Previous Phases

### Phase 3 Summary (Complete)

Phase 3 added the core content components for displaying educational material.

| Increment | Description | Status |
|-----------|-------------|--------|
| 3A | KaTeX + MathBlock | ✅ Complete |
| 3B | Shiki + CodeExample | ✅ Complete |
| 3C | CollapsiblePanel + ContentSection | ✅ Complete |
| 3D | TabGroup (Accessible Tabs) | ✅ Complete |
| 3E | Symbol Data Files | ✅ Complete |
| 3F | SymbolTable (Searchable) | ✅ Complete |
| 3G | Content Integration | ✅ Complete |

### Phase 2 Summary (Complete)

Phase 2 established the app shell, navigation, and accessibility foundations.

| Increment | Description | Status |
|-----------|-------------|--------|
| 2A | Theme Composable | ✅ Complete |
| 2B | AppHeader | ✅ Complete |
| 2C | Mobile Navigation | ✅ Complete |
| 2D | Breadcrumbs | ✅ Complete |
| 2E | TopicPage Layout | ✅ Complete |
| 2F | AppFooter | ✅ Complete |
| 2G | Shell Integration | ✅ Complete |

### Phase 1 Summary (Complete)

Phase 1 established the development foundation.

| Increment | Description | Status |
|-----------|-------------|--------|
| 1A | Project Initialization | ✅ Complete |
| 1B | Tailwind CSS Setup | ✅ Complete |
| 1C | Project Structure & Routing | ✅ Complete |
| 1D | TypeScript Type Definitions | ✅ Complete |
| 1E | Vitest Configuration | ✅ Complete |
| 1F | GitHub Pages Deployment | ✅ Complete |
| 1G | ESLint & Prettier | ✅ Complete |

---

## Next Steps

### Phase 5: Future Possibilities
- **More Widgets**: Quadratic formula explorer, derivative visualizer
- **Content Migration**: Bring more content from archive (algebra, calculus)
- **Advanced Topics**: Linear algebra, statistics, calculus content
- **Interactivity**: Animations, step-by-step solutions
- **PWA Features**: Offline support, installability

---

## How to Resume Development

1. **Start dev server**: `npm run dev`
2. **Read instructions**: `instructions/phase_X/` for next phase
3. **Run verification before commits**:
   ```bash
   npm run type-check && npm run lint && npm run test && npm run build
   ```

---

## Key Files Reference

| Purpose | File |
|---------|------|
| Project guide | `CLAUDE.md` |
| Phase 1-4 instructions | `instructions/phase_*/` |
| Phase 4 completion | `docs/PHASE_4_COMPLETE.md` |
| Accessibility guide | `docs/ACCESSIBILITY.md` |
| Route definitions | `src/router/index.ts` |
| Navigation data | `src/data/navigation.ts` |
| Widget components | `src/components/widgets/` |
| URL state composable | `src/composables/useUrlState.ts` |
| Type definitions | `src/types/index.ts` |
| Theme styles | `src/assets/styles/main.css` |

---

## Verification Commands

```bash
npm run dev          # Start dev server
npm run type-check   # TypeScript validation
npm run lint         # ESLint check (2 expected v-html warnings)
npm run test         # Run all 56 tests
npm run build        # Production build
npm run preview      # Preview production build
```

All commands should pass without errors. Lint has 2 expected warnings for v-html in KaTeX/Shiki components.

---

## Known Build Notes

- **Chunk Size Warnings**: Shiki produces large language chunks. These are lazy-loaded and acceptable.
- **v-html Warnings**: ESLint warns about v-html in MathBlock and CodeExample. These are expected as the content comes from trusted libraries (KaTeX, Shiki).
