# CLAUDE.md - SnakeMath Project Guide

## Project Overview

**SnakeMath** is an educational mathematics website for programmers. It bridges mathematical concepts with programming intuition through interactive visualizations, code examples, and a friendly, informal tone.

**Core Philosophy**: "That big and scary-looking Sigma is basically just a for loop."

### Target Audience
1. **Primary**: Novice developers learning mathematical foundations
2. **Secondary**: Experienced developers needing math refreshers
3. **Tertiary**: Educators seeking interactive teaching tools

### Educational Approach
- Connect abstract notation to familiar code patterns
- Use Python for code examples (hence "Snake" Math)
- Provide interactive exploration with immediate visual feedback
- Progress from simple to complex naturally

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| Vue | 3.5.x | Reactive UI framework |
| TypeScript | 5.9.x | Type safety |
| Vite | 7.x | Build tool and dev server |
| Tailwind CSS | 3.4.x | Utility-first styling |
| Vue Router | 4.6.x | Client-side routing |
| KaTeX | 0.16.x | Math rendering |
| Shiki | 1.x | Syntax highlighting |
| Vitest | 4.x | Unit testing |
| Playwright | 1.x | E2E testing |
| axe-core | 4.x | Accessibility testing |

### Key Technical Decisions
- **No Pinia**: State is local to components or passed via props; URL state for shareable widget configurations
- **No CSS frameworks**: Tailwind utilities only, no Bootstrap/Vuetify
- **No Markdown processing**: Pure Vue components for content (consistency, full control)
- **KaTeX over MathJax**: Smaller bundle, faster rendering for reactive updates
- **History mode routing**: Clean URLs, handled via 404.html fallback for GitHub Pages

---

## Project Structure

```
SnakeMath/
├── .github/
│   └── workflows/
│       └── deploy.yml           # GitHub Pages deployment
├── .vscode/
│   ├── settings.json            # Editor configuration
│   └── extensions.json          # Recommended extensions
├── archive/                     # OLD CODE - excluded from build
│   └── snake-math/              # Previous implementation (reference only)
├── docs/                        # Project documentation
│   ├── archive/                 # Completed phase summaries
│   ├── current_state.md         # Current project status
│   ├── decisions.md             # Architectural decisions
│   ├── ll_li.md                 # Lessons learned
│   └── todo.md                  # Task tracking and backlog
├── e2e/                         # Playwright E2E tests
│   ├── accessibility/           # WCAG audit tests
│   ├── navigation/              # Nav and routing tests
│   └── widgets/                 # Widget interaction tests
├── instructions/                # Claude Code task instructions
│   ├── archive/                 # Completed phase instructions
│   └── PHASE_6_PROMPT.md        # Current/recent phase
├── public/
│   └── favicon.ico
├── src/
│   ├── assets/
│   │   └── styles/
│   │       └── main.css         # Tailwind directives + CSS variables
│   ├── components/
│   │   ├── layout/              # App shell (header, nav, footer)
│   │   ├── content/             # Content blocks (MathBlock, CodeExample)
│   │   ├── widgets/             # Interactive components
│   │   └── ui/                  # Generic UI (buttons, panels)
│   ├── composables/             # Vue composition functions
│   ├── data/                    # Static data files
│   │   └── symbols/             # Math symbol definitions
│   ├── router/
│   │   └── index.ts             # Route definitions
│   ├── test/                    # Test setup and utilities
│   │   └── setup.ts             # Vitest setup file
│   ├── types/                   # TypeScript definitions
│   ├── utils/
│   │   └── math/                # Pure math functions
│   ├── views/                   # Route-level page components
│   │   ├── HomeView.vue
│   │   ├── basics/              # Foundations section
│   │   │   ├── BasicsIndex.vue
│   │   │   ├── FoundationsView.vue
│   │   │   ├── SymbolsView.vue
│   │   │   ├── NumberTypesView.vue
│   │   │   ├── FunctionsView.vue
│   │   │   ├── VariablesView.vue
│   │   │   └── OrderOfOperationsView.vue
│   │   └── algebra/             # Algebra section
│   │       ├── AlgebraIndex.vue
│   │       └── SummationView.vue
│   ├── App.vue
│   └── main.ts
├── scripts/
│   └── copy-404.js              # SPA routing fix for GitHub Pages
├── CLAUDE.md                    # This file
├── README.md
├── index.html
├── package.json
├── playwright.config.ts         # Playwright E2E config
├── tailwind.config.js
├── tsconfig.json
├── vite.config.ts
└── vitest.config.ts
```

---

## Naming Conventions

### Files and Directories

| Type | Convention | Example |
|------|------------|---------|
| Vue components | PascalCase.vue | `MathBlock.vue` |
| Composables | camelCase with `use` prefix | `useTheme.ts` |
| Utilities | camelCase | `numberClassification.ts` |
| Types | camelCase | `content.ts` |
| Data files | camelCase | `arithmeticSymbols.ts` |
| Test files | `*.test.ts` co-located | `numberClassification.test.ts` |
| CSS files | kebab-case | `main.css` |

### Code Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `<MathBlock />` |
| Props | camelCase | `initialValue` |
| Events | camelCase with verb | `@parameterChange` |
| CSS classes | Tailwind utilities | `class="flex items-center"` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_PRECISION` |
| Types/Interfaces | PascalCase | `interface NumberClassification` |
| Type props | PascalCase + Props | `interface MathBlockProps` |

---

## Component Patterns

### Standard Vue 3 SFC Structure

```vue
<script setup lang="ts">
// 1. Imports (external, then internal)
import { ref, computed, watch } from 'vue'
import type { NumberClassification } from '@/types'
import { classifyNumber } from '@/utils/math/numberClassification'

// 2. Props and Emits
interface Props {
  initialValue?: string
  showDetails?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  initialValue: '',
  showDetails: true,
})

const emit = defineEmits<{
  change: [value: string]
  classify: [result: NumberClassification]
}>()

// 3. Reactive state
const inputValue = ref(props.initialValue)

// 4. Computed properties
const classification = computed(() => classifyNumber(inputValue.value))

// 5. Watchers
watch(classification, (newVal) => {
  emit('classify', newVal)
})

// 6. Methods
function handleInput(event: Event) {
  const target = event.target as HTMLInputElement
  inputValue.value = target.value
  emit('change', target.value)
}
</script>

<template>
  <!-- Template here -->
</template>

<style scoped>
/* Minimal scoped styles - prefer Tailwind */
</style>
```

### Component Categories

**Layout Components** (`src/components/layout/`)
- App shell components
- Handle responsive behavior
- Manage navigation state
- Examples: `AppHeader.vue`, `TopicNavigation.vue`, `Breadcrumbs.vue`

**Content Components** (`src/components/content/`)
- Building blocks for educational content
- Stateless or minimally stateful
- Highly reusable across topics
- Examples: `MathBlock.vue`, `CodeExample.vue`, `ContentSection.vue`

**Widget Components** (`src/components/widgets/`)
- Interactive educational tools
- Self-contained with own state
- May sync state to URL parameters
- Often use preset-based architecture (safer than arbitrary user expressions)
- Examples: `NumberTypeExplorer.vue`, `SummationExplorer.vue`, `SimpleFunctionDemo.vue`

**UI Components** (`src/components/ui/`)
- Generic, non-domain-specific
- Pure presentation components
- Examples: `CollapsiblePanel.vue`, `TabGroup.vue`, `SearchInput.vue`

---

## TypeScript Patterns

### Type Definitions Location
All shared types go in `src/types/`. Component-specific types can be inline.

### Prefer Interfaces for Objects
```typescript
// Good - extensible
interface MathSymbol {
  symbol: string
  name: string
  meaning: string
}

// Use type for unions/computed
type SymbolCategory = 'arithmetic' | 'algebra' | 'calculus'
```

### Props Typing
```typescript
// Define interface, use withDefaults for defaults
interface Props {
  formula: string
  displayMode?: boolean
  className?: string
}

const props = withDefaults(defineProps<Props>(), {
  displayMode: false,
  className: '',
})
```

### Avoid `any`
```typescript
// Bad
function process(data: any) { ... }

// Good - be specific or use unknown
function process(data: unknown) {
  if (typeof data === 'string') { ... }
}
```

---

## Styling Patterns

### Tailwind Usage
- Use utility classes directly in templates
- Prefer responsive utilities over media queries in CSS
- Use CSS variables for theme colors

```vue
<template>
  <!-- Responsive: stack on mobile, row on desktop -->
  <div class="flex flex-col md:flex-row gap-4">
    <!-- Theme-aware colors via CSS variables -->
    <div class="bg-surface text-primary rounded-lg p-4">
      Content
    </div>
  </div>
</template>
```

### Theme System
CSS variables defined in `main.css`:

```css
:root {
  --color-primary: theme('colors.emerald.600');
  --color-surface: theme('colors.white');
  --color-text: theme('colors.gray.900');
  /* ... */
}

.dark {
  --color-primary: theme('colors.emerald.400');
  --color-surface: theme('colors.gray.800');
  --color-text: theme('colors.gray.100');
}
```

Reference in Tailwind config and use as `bg-surface`, `text-primary`, etc.

### When to Use Scoped Styles
- Canvas drawing styles
- Third-party component overrides
- Complex animations
- Keep minimal - Tailwind should handle 90%+

---

## Content Patterns

### Page Structure
Each content page follows this hierarchy:

```vue
<template>
  <TopicPage 
    title="Number Types" 
    :breadcrumbs="breadcrumbs"
  >
    <ContentSection id="introduction" title="Understanding Number Types">
      <p>Introductory prose...</p>
      <MathBlock formula="\mathbb{N} \subset \mathbb{Z}" display />
    </ContentSection>

    <ContentSection id="interactive" title="Explore">
      <NumberTypeExplorer :initial-value="'3.14'" />
    </ContentSection>

    <ContentSection id="code" title="In Python" :default-expanded="false">
      <CodeExample 
        language="python"
        :code="pythonExample"
      />
    </ContentSection>

    <RelatedTopics :topics="relatedTopics" />
  </TopicPage>
</template>
```

### Math Rendering
Use `MathBlock` component for all math:

```vue
<!-- Inline math -->
<MathBlock formula="x^2 + y^2 = r^2" />

<!-- Display mode (centered, larger) -->
<MathBlock formula="\sum_{i=1}^{n} i = \frac{n(n+1)}{2}" display />
```

### Code Examples
Use `CodeExample` for all code:

```js
<CodeExample
  language="python"
  title="Natural number check"
  :code="codeString"
  :collapsible="true"
/>
```

---

## Testing Patterns

### Co-located Tests
Tests live next to source files:

```
src/utils/math/
├── numberClassification.ts
└── numberClassification.test.ts
```

### Test Structure
```typescript
import { describe, it, expect } from 'vitest'
import { classifyNumber } from './numberClassification'

describe('classifyNumber', () => {
  describe('natural numbers', () => {
    it('classifies positive integers as natural', () => {
      const result = classifyNumber('5')
      expect(result.isNatural).toBe(true)
      expect(result.isInteger).toBe(true)
    })

    it('does not classify zero as natural', () => {
      const result = classifyNumber('0')
      expect(result.isNatural).toBe(false)
      expect(result.isInteger).toBe(true)
    })
  })

  describe('edge cases', () => {
    it('handles empty input', () => {
      const result = classifyNumber('')
      expect(result.isValid).toBe(false)
    })
  })
})
```

### What to Test (Unit)
- **Always test**: Math utilities, classification logic, data transformations
- **Test selectively**: Component logic via composables
- **Don't test**: Vue internals, Tailwind classes, static content

### E2E Testing with Playwright

E2E tests live in the `e2e/` directory, organized by feature:

```
e2e/
├── accessibility/audit.spec.ts    # WCAG 2.1 AA audits
├── navigation/navigation.spec.ts  # Nav, breadcrumbs, routing
└── widgets/
    ├── number-type-explorer.spec.ts
    └── summation-explorer.spec.ts
```

**Test Pattern**:
```typescript
import { test, expect } from '@playwright/test'

test.describe('Widget Name', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/path/to/page')
  })

  test('user interaction works', async ({ page }) => {
    // Use data-testid for reliable selectors
    await page.locator('[data-testid="input"]').fill('42')

    // Use exact matching to avoid substring matches
    await page.getByRole('button', { name: 'Submit', exact: true }).click()

    // Assert on visible results
    await expect(page.locator('[data-testid="result"]')).toContainText('42')
  })
})
```

**Accessibility Testing**:
```typescript
import AxeBuilder from '@axe-core/playwright'

test('page passes WCAG 2.1 AA', async ({ page }) => {
  await page.goto('/path')
  await page.waitForLoadState('networkidle')

  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
    .analyze()

  expect(results.violations).toEqual([])
})
```

**Data-Testid Convention**: Add `data-testid` attributes to interactive elements and key display areas that E2E tests need to target.

---

## URL State Pattern

For shareable widget states, sync parameters to URL:

```typescript
// composables/useUrlState.ts
import { ref, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'

export function useUrlState<T>(key: string, defaultValue: T) {
  const route = useRoute()
  const router = useRouter()
  
  // Initialize from URL or default
  const value = ref<T>(
    route.query[key] !== undefined 
      ? JSON.parse(route.query[key] as string) 
      : defaultValue
  )

  // Sync changes to URL
  watch(value, (newVal) => {
    router.replace({
      query: { ...route.query, [key]: JSON.stringify(newVal) }
    })
  }, { deep: true })

  return value
}
```

Usage: `/basics/number-types?value="3.14"` → shareable link to specific state.

---

## Do's and Don'ts

### Do ✓
- Use `<script setup>` for all components
- Use TypeScript strict mode
- Co-locate tests with source files
- Use semantic HTML elements
- Provide meaningful alt text and ARIA labels
- Use CSS variables for theme colors
- Write descriptive commit messages
- Keep components focused (single responsibility)
- Use composables for shared reactive logic

### Don't ✗
- Use `any` type (use `unknown` if truly unknown)
- Use inline styles (use Tailwind)
- Import from `archive/` directory
- Use MathJax (use KaTeX)
- Add dependencies without discussion
- Use Bootstrap/Vuetify classes
- Put business logic in templates
- Use Options API (use Composition API)
- Skip TypeScript in Vue components
- Commit to GitHub, user will do it manually

---

## Archive Folder

The `archive/` directory contains the previous implementation for reference only.

**Important**: This folder is **excluded from the build**. Do not import from it.

Use archive contents for:
- Content inspiration (prose, explanations, analogies)
- Understanding previous design decisions
- Extracting data (symbol tables, etc.) - copy and adapt, don't import

The archive exclusion is configured in:
- `vite.config.ts` - excluded from build
- `tsconfig.json` - excluded from type checking
- `tailwind.config.js` - excluded from class scanning

---

## Instructions Directory

Claude Code task instructions are in `/instructions/`:

| File | Description |
|------|-------------|
| `archive/` | Completed phase instructions (Phase 1-5) |
| `PHASE_6_PROMPT.md` | Phase 6 instructions (completed) |
| `todo.md` | Moved to `docs/todo.md` |

**Instruction File Pattern**: Each phase has a `PHASE_X_PROMPT.md` file with increments (6A, 6B, etc.) that define specific tasks. After completion, instructions are archived.

---

## Common Tasks

### Adding a New Topic Page
1. Create view in `src/views/<topic>/<SubtopicView>.vue`
2. Add route in `src/router/index.ts`
3. Update navigation data in `src/data/navigation.ts`
4. Create any needed widgets in `src/components/widgets/`

### Adding a New Widget
1. Create component in `src/components/widgets/<WidgetName>.vue`
2. Define props interface with sensible defaults
3. Implement URL state sync if widget should be shareable
4. Add unit tests for calculation logic
5. Document usage in component JSDoc

### Adding Symbol Data
1. Add to appropriate file in `src/data/symbols/`
2. Follow `MathSymbol` or `GreekLetter` interface
3. Include programming analogy where applicable

### Documentation
The project maintains four key documentation files in `docs/`:

**1. `docs/ll_li.md` - Lessons Learned & Lessons Identified**
- **When to update**: After every phase, or when encountering significant bugs/patterns
- **What to document**:
  - **Lessons Learned (LL)**: Bugs, gotchas, and issues encountered with their resolutions
  - **Lessons Identified (LI)**: Patterns, best practices, and reusable solutions discovered
- **Format**: Numbered entries (LL-001, LI-001) with Issue, Resolution, and Lesson sections

**2. `docs/decisions.md` - Architectural Decision Records**
- **When to update**: When making significant technical or design decisions
- **What to document**:
  - Technology choices (e.g., KaTeX over MathJax)
  - Architectural patterns (e.g., preset-based widgets)
  - Trade-offs considered and rationale
- **Format**: Numbered entries (D-001) with Decision, Rationale, and Trade-offs sections

**3. `docs/current_state.md` - Project Status Snapshot**
- **When to update**: After every phase completion
- **What to document**:
  - Current phase status and what's next
  - What's live (content, widgets, infrastructure)
  - Test coverage summary
  - Quick reference for resuming development
- **Purpose**: Enable easy project resumption after pauses

**4. `docs/todo.md` - Task Tracking**
- **When to update**: When completing tasks, identifying issues, or planning future work
- **What to document**:
  - Current phase tasks (with checkboxes)
  - Known issues/bugs to fix
  - Items needing review
  - Future ideas and enhancements
- **Purpose**: Track work in progress and backlog

**5. `CLAUDE.md` - Project Guide (this file)**
- **When to update**: When conventions, patterns, or workflows change
- **Purpose**: Single source of truth for project standards and practices

---

## Git Workflow

### Branches
- `main` - Production, deploys to GitHub Pages
- Feature branches for development

### Commit Messages
Follow conventional commits:
- `feat: add NumberTypeExplorer widget`
- `fix: correct quadratic formula edge case`
- `docs: update CLAUDE.md with testing patterns`
- `style: format components with Prettier`
- `refactor: extract math utilities to composable`
- `test: add edge case tests for classification`

### Before Pushing
```bash
npm run type-check  # TypeScript validation
npm run lint        # ESLint
npm run test        # Vitest
npm run build       # Production build
```

---

## Quick Reference

### Useful Commands
```bash
npm run dev          # Start dev server
npm run build        # Production build (includes 404.html copy)
npm run preview      # Preview production build
npm run test         # Run unit tests once
npm run test:watch   # Run unit tests in watch mode
npm run test:coverage # Run unit tests with coverage report
npm run test:e2e     # Run Playwright E2E tests (requires dev server)
npm run lint         # Check and fix linting issues
npm run lint:check   # Check linting (no fix)
npm run format       # Format with Prettier
npm run format:check # Check formatting (no fix)
npm run type-check   # TypeScript validation
```

### Before Committing
```bash
npm run type-check && npm run lint && npm run test && npm run build
```

### Running E2E Tests
```bash
npm run dev &        # Start dev server in background
npm run test:e2e     # Run all E2E tests
npx playwright test --ui  # Interactive test runner
```

### Path Aliases
- `@/` → `src/`
- Example: `import { classifyNumber } from '@/utils/math/numberClassification'`

### Key Files
- Entry point: `src/main.ts`
- Routes: `src/router/index.ts`
- Navigation data: `src/data/navigation.ts`
- Types: `src/types/index.ts`
- Theme CSS: `src/assets/styles/main.css`
- Tailwind config: `tailwind.config.js`
- Unit test setup: `src/test/setup.ts`
- E2E test config: `playwright.config.ts`
- Project status: `docs/current_state.md`
- Task tracking: `docs/todo.md`
