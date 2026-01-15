# Increment 1C: Project Structure and Router Configuration

## Context
SnakeMath needs a specific folder structure for content components, widgets, composables, and data files. The router needs to be configured for the MVP routes.

## Task
Create the folder structure and configure Vue Router with the MVP routes.

## Folder Structure Requirements
Create the following directory structure under `src/`:

```
src/
├── components/
│   ├── layout/          # App shell components (header, nav, footer)
│   ├── content/         # Content building blocks (MathBlock, CodeExample, etc.)
│   ├── widgets/         # Interactive educational components
│   └── ui/              # Generic reusable UI components
├── views/
│   ├── HomeView.vue     # Landing page
│   └── basics/          # Basics topic views
│       ├── BasicsIndex.vue
│       ├── FoundationsView.vue
│       ├── SymbolsView.vue
│       └── NumberTypesView.vue
├── composables/         # Vue composition functions
├── data/                # Static data (symbols, navigation structure)
│   └── symbols/         # Symbol definition files
├── utils/
│   └── math/            # Pure math utility functions
├── types/               # TypeScript type definitions
└── assets/
    └── styles/          # CSS files (main.css already exists)
```

Create placeholder `.gitkeep` files or simple `index.ts` barrel exports in empty directories to establish the structure.

## Router Configuration
Update `src/router/index.ts` with these routes:

| Path | Component | Name |
|------|-----------|------|
| `/` | `HomeView` | `home` |
| `/basics` | `BasicsIndex` | `basics` |
| `/basics/foundations` | `FoundationsView` | `basics-foundations` |
| `/basics/symbols` | `SymbolsView` | `basics-symbols` |
| `/basics/number-types` | `NumberTypesView` | `basics-number-types` |

Configure the router for:
- HTML5 history mode
- Scroll behavior that scrolls to top on navigation, but respects hash anchors

## View Placeholders
Create minimal placeholder components for each view that display:
- The route name as a heading
- A breadcrumb-style path indicator (just text for now, e.g., "Home > Basics > Foundations")

## Success Criteria
- All routes are navigable via browser URL
- Browser back/forward navigation works correctly
- No TypeScript errors in route configuration
- Folder structure matches specification
- `npm run type-check` passes

## Constraints
- Views should be minimal placeholders (we'll build them out later)
- Do not implement actual navigation UI yet (next increment)
- Keep route configuration simple (no guards, no lazy loading yet)