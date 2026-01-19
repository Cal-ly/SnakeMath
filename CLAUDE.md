# SnakeMath - Claude Code Guide

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

## Development Workflow

SnakeMath uses a **phase-driven development** approach with planning and implementation cycles.

### Workflow Documents
| Document | Purpose |
|----------|---------|
| [docs/PLANNING_WORKFLOW.md](docs/PLANNING_WORKFLOW.md) | Full planning ↔ implementation cycle |
| [docs/CLAUDE_CODE_WORKFLOW.md](docs/CLAUDE_CODE_WORKFLOW.md) | Detailed implementation guide for Claude Code |

### How It Works
1. **Planning Session** (Claude Opus): Reviews completed work, creates Phase Plan document
2. **Implementation** (Claude Code): Executes Phase Plan using increments
3. **Documentation**: Updates all project docs after phase completion
4. **Cycle repeats**

### Phase Plans
Phase plans are provided in conversations and define:
- Strategic context and goals
- Confirmed decisions (D-XXX numbered)
- Widget/content architecture
- Math utilities specification
- Increment breakdown
- Archive references for inspiration

---

## Documentation Reference

### Key Documents

| Document | Purpose | When to Update |
|----------|---------|----------------|
| [docs/ROADMAP.md](docs/ROADMAP.md) | Strategic direction, phase status | After phase completion |
| [docs/CURRENT_STATE.md](docs/CURRENT_STATE.md) | What's currently implemented | After every phase |
| [docs/DECISIONS.md](docs/DECISIONS.md) | Architectural decision records | When making decisions |
| [docs/LL_LI.md](docs/LL_LI.md) | Lessons learned & patterns identified | After every phase |
| [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | UI patterns, component conventions | When adding new patterns |
| [docs/TESTING.md](archive/SnakeMath/planning/TESTING.md) | Testing strategy and commands | When changing test approach |
| [docs/TODO.md](docs/TODO.md) | Task tracking and backlog | When completing/adding tasks |
| [docs/ACCESSIBILITY.md](docs/ACCESSIBILITY.md) | Accessibility guidelines | When updating a11y approach |

### Numbering Conventions
| Prefix | Scope | Example |
|--------|-------|---------|
| D-XXX | Technical/implementation decisions | D-042: Use preset-based widgets |
| LL-XXX | Lessons Learned (bugs, gotchas) | LL-015: KaTeX rendering issue |
| LI-XXX | Lessons Identified (patterns, best practices) | LI-012: URL state sync pattern |

---

## Archive Usage

The `archive/` directory contains previous implementations for **inspiration only**.

### Archive Structure
```
archive/
├── snake-math/              # VitePress implementation (PRIMARY INSPIRATION)
│   ├── docs/                # Content source (prose, explanations)
│   │   ├── basics/          # Foundations content
│   │   ├── linear-algebra/  # Linear algebra content
│   │   └── .vitepress/theme/components/  # Widget reference
├── snake-math-vue/          # Vue/Bootstrap implementation (REFERENCE)
└── SnakeMath/               # Old project documents (HISTORICAL)
    └── instructions/        # Archived increment instructions
```

### Archive Content Reference
Detailed inventories are in [docs/archive_overview/](docs/archive_overview/):
- `archive_content.md` - Content files and topics
- `archive_components.md` - Widget components
- `archive_utilities.md` - Math utility functions
- `archive_data.md` - Data files and symbol tables

### How to Use Archive Content

| Archive Has | Transform To |
|-------------|--------------|
| Markdown prose | Vue component with MathBlock/CodeExample |
| MathJax notation | KaTeX syntax (usually compatible) |
| PyScript blocks | Static CodeExample with Python |
| Canvas visualizations | SVG with Vue reactivity |
| Generic explanations | Programmer-focused analogies |

**Important**: Archive is excluded from build. Do not import from it - copy and adapt.

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
├── .github/workflows/       # GitHub Pages deployment
├── .vscode/                 # Editor configuration
├── archive/                 # Previous implementations (INSPIRATION ONLY)
├── docs/                    # Project documentation (UPPERCASE names)
│   ├── CURRENT_STATE.md     # Project status snapshot
│   ├── DECISIONS.md         # Architectural decisions
│   ├── DESIGN_SYSTEM.md     # UI patterns and conventions
│   ├── LL_LI.md             # Lessons learned/identified
│   ├── ROADMAP.md           # Strategic roadmap
│   ├── TESTING.md           # Testing documentation
│   ├── TODO.md              # Task tracking
│   └── archive_overview/    # Archive inventory files
├── e2e/                     # Playwright E2E tests
│   ├── accessibility/       # WCAG audit tests
│   ├── navigation/          # Nav and routing tests
│   └── widgets/             # Widget interaction tests
├── instructions/            # Phase implementation instructions
│   ├── PHASE_12_PLAN.md     # Current phase plan
│   └── INCREMENT_*.md       # Increment details
├── src/
│   ├── assets/styles/       # Tailwind + CSS variables
│   ├── components/
│   │   ├── layout/          # App shell (header, nav, footer)
│   │   ├── content/         # MathBlock, CodeExample, etc.
│   │   ├── widgets/         # Interactive components
│   │   └── ui/              # Generic UI components
│   ├── composables/         # Vue composition functions
│   ├── data/                # Static data files
│   ├── router/              # Route definitions
│   ├── types/               # TypeScript definitions
│   ├── utils/math/          # Pure math functions + tests
│   └── views/               # Route-level page components
├── CLAUDE.md                # This file
└── README.md
```

---

## Naming Conventions

### Files and Directories

| Type | Convention | Example |
|------|------------|---------|
| Documentation files | UPPER_SNAKE_CASE | `CURRENT_STATE.md` |
| Vue components | PascalCase.vue | `MathBlock.vue` |
| Composables | camelCase with `use` prefix | `useTheme.ts` |
| Utilities | camelCase | `numberClassification.ts` |
| Types | camelCase | `content.ts` |
| Data files | camelCase | `arithmeticSymbols.ts` |
| Test files | `*.test.ts` co-located | `numberClassification.test.ts` |

### Code Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `<MathBlock />` |
| Props | camelCase | `initialValue` |
| Events | camelCase with verb | `@parameterChange` |
| CSS classes | Tailwind utilities | `class="flex items-center"` |
| Constants | SCREAMING_SNAKE_CASE | `MAX_PRECISION` |
| Types/Interfaces | PascalCase | `interface NumberClassification` |

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
- App shell components: `AppHeader.vue`, `TopicNavigation.vue`, `Breadcrumbs.vue`

**Content Components** (`src/components/content/`)
- Building blocks: `MathBlock.vue`, `CodeExample.vue`, `ContentSection.vue`

**Widget Components** (`src/components/widgets/`)
- Interactive tools: `NumberTypeExplorer.vue`, `SummationExplorer.vue`
- Often use preset-based architecture (safer than arbitrary user expressions)

**UI Components** (`src/components/ui/`)
- Generic: `CollapsiblePanel.vue`, `TabGroup.vue`, `SearchInput.vue`

---

## Content Patterns

### Page Structure
```vue
<template>
  <TopicPage title="Number Types" :breadcrumbs="breadcrumbs">
    <ContentSection id="introduction" title="Understanding Number Types">
      <p>Introductory prose...</p>
      <MathBlock formula="\mathbb{N} \subset \mathbb{Z}" display />
    </ContentSection>

    <ContentSection id="interactive" title="Explore">
      <NumberTypeExplorer :initial-value="'3.14'" />
    </ContentSection>

    <ContentSection id="code" title="In Python" :default-expanded="false">
      <CodeExample language="python" :code="pythonExample" />
    </ContentSection>

    <RelatedTopics :topics="relatedTopics" />
  </TopicPage>
</template>
```

### Math Rendering
```vue
<!-- Inline math -->
<MathBlock formula="x^2 + y^2 = r^2" />

<!-- Display mode (centered, larger) -->
<MathBlock formula="\sum_{i=1}^{n} i = \frac{n(n+1)}{2}" display />
```

### Programmer-Relatable Approach
Every math concept should connect to programming:
- "Matrices are like nested arrays"
- "Summation is a for loop with accumulator"
- Show NumPy/Python equivalents for every operation
- Reference algorithms, data structures, complexity
- Include ML/AI applications where relevant

---

## Testing Patterns

### Co-located Unit Tests
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
  it('classifies positive integers as natural', () => {
    const result = classifyNumber('5')
    expect(result.isNatural).toBe(true)
  })
})
```

### E2E Tests
```
e2e/
├── accessibility/audit.spec.ts
├── navigation/navigation.spec.ts
└── widgets/*.spec.ts
```

### What to Test
- **Always**: Math utilities, classification logic, data transformations
- **E2E**: Widget interactions, navigation, accessibility

---

## URL State Pattern

For shareable widget states:
```typescript
import { useUrlState } from '@/composables/useUrlState'

const value = useUrlState('value', defaultValue)
// URL: /page?value="3.14"
```

---

## ESLint Patterns

The project uses strict ESLint rules. These patterns prevent common CI failures:

### Unused Variables (`@typescript-eslint/no-unused-vars`)

Prefix unused variables with underscore (`_`) to suppress warnings:

```typescript
// ❌ Error: 'props' is assigned but never used
const props = defineProps<Props>()

// ✅ OK: Underscore prefix ignores the warning
const _props = defineProps<Props>()

// ✅ Better: Don't assign if only used in template
defineProps<Props>()
```

For unused imports, use alias syntax:
```typescript
// ❌ Error: 'erf' is defined but never used
import { standardNormalCdf, erf } from './distributions'

// ✅ OK: Alias with underscore
import { standardNormalCdf, erf as _erf } from './distributions'
```

### Computed Properties Must Return (`vue/return-in-computed-property`)

Every code path in computed properties must return a value:

```typescript
// ❌ Error: switch without default doesn't always return
const result = computed(() => {
  switch (type.value) {
    case 'a': return 1
    case 'b': return 2
  }
  // Implicit undefined return triggers ESLint error
})

// ✅ OK: Add default case
const result = computed(() => {
  switch (type.value) {
    case 'a': return 1
    case 'b': return 2
    default: return null
  }
})
```

### HTML Entities in Vue Templates (`vue/no-parsing-error`)

Use HTML entities for `<` and `>` in template text content:

```vue
<!-- ❌ Error: '<' interpreted as HTML tag start -->
<div>< 0.2</div>
<li>m < 0: line goes down</li>

<!-- ✅ OK: Use HTML entities -->
<div>&lt; 0.2</div>
<li>m &lt; 0: line goes down</li>
```

### Quick Checklist Before Commit
1. Run `npm run lint` to catch unused variables
2. Ensure all computed properties have explicit returns
3. Use `&lt;`/`&gt;` for math comparisons in templates

---

## Quick Reference

### Commands
```bash
npm run dev          # Start dev server
npm run build        # Production build
npm run test         # Run unit tests
npm run test:e2e     # Run E2E tests (requires dev server)
npm run lint         # Check and fix linting
npm run type-check   # TypeScript validation
```

### Before Committing
```bash
npm run type-check && npm run lint && npm run test && npm run build
```

### Key File Locations
| Purpose | Path |
|---------|------|
| Entry point | `src/main.ts` |
| Routes | `src/router/index.ts` |
| Navigation data | `src/data/navigation.ts` |
| Types | `src/types/index.ts` |
| Theme CSS | `src/assets/styles/main.css` |
| Project status | `docs/CURRENT_STATE.md` |
| Task tracking | `docs/TODO.md` |

### Path Aliases
- `@/` → `src/`
- Example: `import { classifyNumber } from '@/utils/math/numberClassification'`

---

## Do's and Don'ts

### Do
- Use `<script setup>` for all components
- Use TypeScript strict mode
- Co-locate tests with source files
- Use semantic HTML elements
- Use CSS variables for theme colors
- Make content programmer-relatable

### Don't
- Use `any` type (use `unknown` if truly unknown)
- Import from `archive/` directory
- Use MathJax (use KaTeX)
- Use Bootstrap/Vuetify classes
- Commit to GitHub - user will do it manually

---

## Git Workflow

### Commit Messages
Follow conventional commits:
- `feat:` new feature
- `fix:` bug fix
- `docs:` documentation
- `refactor:` code restructure
- `test:` add/update tests

### Branches
- `main` - Production, deploys to GitHub Pages
- Feature branches for development
