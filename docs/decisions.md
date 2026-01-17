# SnakeMath Decisions

## Intent
The intent with this document is to document decisions and why they were taken, in order to keep track on the "why" we have done things in a certain way.

---

## Phase 1 Decisions

### D-001: No Pinia for State Management
**Decision**: Do not use Pinia or any global state management library.

**Rationale**:
- Most state in an educational site is local to components (input values, toggles)
- URL query parameters can be used for shareable widget states
- Props/emits are sufficient for parent-child communication
- Reduces bundle size and complexity
- Can always add later if truly needed

**Trade-offs**:
- More prop drilling if deeply nested components need shared state
- Must implement URL state sync manually for shareable widgets

---

### D-002: KaTeX over MathJax
**Decision**: Use KaTeX for math rendering instead of MathJax.

**Rationale**:
- Smaller bundle size (~200KB vs ~1MB)
- Faster rendering (important for reactive updates in widgets)
- Sufficient feature set for educational math content
- Better performance on mobile devices

**Trade-offs**:
- Slightly smaller feature set than MathJax
- Some advanced LaTeX commands not supported (rarely needed for our content)

---

### D-003: Pure Vue Components for Content
**Decision**: Use Vue SFCs for content pages instead of Markdown with a processor.

**Rationale**:
- Full control over component composition
- Interactive widgets integrated naturally
- No build-time markdown processing complexity
- Consistent styling through Tailwind
- Better TypeScript integration

**Trade-offs**:
- More verbose than markdown for simple prose
- Contributors need Vue knowledge, not just markdown

---

### D-004: Tailwind CSS Variables for Theming
**Decision**: Use CSS custom properties (variables) for theme colors, referenced by Tailwind utilities.

**Rationale**:
- Single source of truth for colors
- Easy dark mode toggle (change CSS class on root)
- No JavaScript runtime for theme values
- Works with Tailwind's `bg-{color}` pattern naturally

**Implementation**:
```css
:root { --color-primary: #059669; }
.dark { --color-primary: #34d399; }
```
```js
// tailwind.config.js
colors: { primary: 'var(--color-primary)' }
```

---

### D-005: Co-located Tests
**Decision**: Place test files next to source files (`foo.ts` and `foo.test.ts` in same directory) rather than in a separate `__tests__` directory.

**Rationale**:
- Easy to see at a glance if a file has tests
- Deleting a source file naturally prompts consideration of its test
- No mental mapping between parallel directory structures
- Matches Vitest's default file discovery pattern

---

### D-006: History Mode Routing with 404.html Fallback
**Decision**: Use Vue Router's history mode (clean URLs) with a custom 404.html for GitHub Pages.

**Rationale**:
- Clean URLs (`/basics/symbols` instead of `/#/basics/symbols`)
- Better for SEO (if relevant later)
- More professional appearance
- GitHub Pages serves 404.html for unknown paths, which loads SPA

**Implementation**: `scripts/copy-404.js` copies `index.html` to `404.html` during build.

---

### D-007: Archive Folder Preservation
**Decision**: Keep previous implementation in `archive/` folder but exclude from all tooling.

**Rationale**:
- Reference for content (prose, explanations, data)
- Understand previous design decisions
- Don't lose historical work
- But don't let it pollute builds, tests, or linting

**Exclusion points**: Vite, TypeScript, Tailwind, Vitest, ESLint, Prettier

---

### D-008: Explicit Package Versions
**Decision**: Always specify major versions when installing packages.

**Rationale**:
- Tailwind v4 was installed by default, but project specified v3.x
- Major versions can have breaking API changes
- Ensures team members get same versions
- Prevents unexpected breakage from npm defaults

**Practice**: Use `npm install package@3` instead of `npm install package`

---

### D-009: ESLint Flat Config
**Decision**: Use ESLint 9+ flat config format (`eslint.config.ts`).

**Rationale**:
- This is the new standard, legacy config is deprecated
- Vue scaffolding generates flat config by default
- Better TypeScript support
- Clearer, more explicit configuration

**Note**: Many online examples still use legacy `.eslintrc` format - be careful when copying configurations.

---

### D-010: Google Fonts (Inter + JetBrains Mono)
**Decision**: Use Inter for body text and JetBrains Mono for code.

**Rationale**:
- Inter: Excellent readability, wide character support, modern feel
- JetBrains Mono: Programming-focused, ligature support, clear at small sizes
- Both are free and widely used in developer tools
- Loaded via Google Fonts CDN for simplicity

**Trade-off**: External dependency on Google Fonts CDN. Could self-host later if needed.

---

## Phase 2 Decisions

### D-011: Dark Emerald Green as Primary Color
**Decision**: Use Dark Emerald Green `#27592D` as the primary brand color instead of the original lighter emerald.

**Rationale**:
- More distinctive and professional appearance
- Better contrast for header backgrounds
- Works well in both light and dark modes
- Maintains the "snake/nature" theme connection

**Implementation**:
- Light mode: `#27592D` (dark emerald)
- Dark mode: `#4ade80` (lighter green for visibility)

---

### D-012: Theme Toggle in Mobile Menu Only
**Decision**: Place the theme toggle only in the mobile slide-out menu, not in the header.

**Rationale**:
- Keeps header clean and focused on navigation
- Theme changes are infrequent; doesn't need prime real estate
- Mobile users have easy access via hamburger menu
- Reduces header clutter on smaller screens

**Trade-off**: Desktop users must resize to access theme toggle (until a settings page is added).

---

### D-013: Snake Emoji as Favicon
**Decision**: Use the snake emoji 🐍 as the favicon via SVG data URI.

**Implementation**:
```html
<link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>🐍</text></svg>">
```

**Rationale**:
- Zero asset files required
- Works in all modern browsers
- Clearly communicates the "SnakeMath" brand
- Simple and memorable

---

### D-014: Font Awesome via CDN
**Decision**: Load Font Awesome icons via CDN rather than npm package.

**Rationale**:
- Simpler setup (no tree-shaking configuration)
- Icons available immediately without import statements
- CDN provides caching benefits
- Easy to use any icon without importing

**Trade-off**: External CDN dependency. Bundle size not optimized (loads full icon set). Could switch to npm package with tree-shaking if bundle size becomes an issue.

---

### D-015: Slide-Out Drawer from Right for Mobile Nav
**Decision**: Mobile navigation uses a slide-out drawer from the right side.

**Rationale**:
- Common pattern users recognize
- Doesn't obstruct header/logo
- Natural thumb reach for right-handed users
- Allows full-height navigation list

**Accessibility features**:
- Focus trap when open
- Escape key closes drawer
- Body scroll lock prevents background scrolling
- ARIA attributes for screen readers

---

### D-016: Auto-Detecting Page Titles from Navigation Data
**Decision**: `TopicPage` component auto-detects title and description from navigation data.

**Rationale**:
- Single source of truth (navigation.ts)
- Reduces duplication across views
- Props can still override when needed
- Views become simpler and more focused on content

**Implementation**:
```vue
<!-- Auto-detection (uses navigation.ts) -->
<TopicPage>...</TopicPage>

<!-- Override when needed -->
<TopicPage title="Custom Title" description="Custom description">
```

---

### D-017: Breadcrumbs with Horizontal Scroll on Mobile
**Decision**: Show full breadcrumb path on mobile with horizontal scroll instead of truncation.

**Rationale**:
- Users see complete navigation context
- No information is hidden
- Scroll hint is discoverable
- Simpler implementation than truncation logic

**Implementation**: `overflow-x-auto scrollbar-hide` classes enable scroll without visible scrollbar.

---

### D-018: Footer with Dynamic Topic Links
**Decision**: Generate footer topic links dynamically from navigation data.

**Rationale**:
- Single source of truth (navigation.ts)
- Footer updates automatically when topics are added
- No manual synchronization needed
- Consistent with TopicPage auto-detection pattern

**Implementation**:
```typescript
const footerLinks = [
  {
    title: 'Topics',
    links: topics.map((t) => ({ label: t.title, path: t.path })),
  },
  // ...
]
```

---

### D-019: Barrel Exports for Component Directories
**Decision**: Create `index.ts` barrel exports for each component directory.

**Rationale**:
- Cleaner imports: `from '@/components/layout'` instead of `from '@/components/layout/AppHeader.vue'`
- Single point of export for each component category
- Easier refactoring (can move files without changing imports)
- Standard practice in Vue/React ecosystems

**Implementation**:
```typescript
// src/components/layout/index.ts
export { default as AppHeader } from './AppHeader.vue'
export { default as AppFooter } from './AppFooter.vue'
// ...
```

---

### D-020: Screen Reader Only Utility Class
**Decision**: Add custom `.sr-only` utility class for screen reader accessibility.

**Rationale**:
- Tailwind v3 includes `sr-only` by default, but having explicit control is useful
- Used for "(opens in new tab)" hints on external links
- Standard accessibility pattern for visually hidden but screen-reader-accessible text

**Implementation**:
```css
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}
```

---

## Phase 3 Decisions

### D-021: Shiki over Prism/Highlight.js for Syntax Highlighting
**Decision**: Use Shiki for code syntax highlighting instead of Prism or Highlight.js.

**Rationale**:
- VSCode-quality highlighting using TextMate grammars
- Accurate tokenization (same as user's IDE)
- Built-in theme support matching our light/dark modes
- Tree-shaking friendly with lazy language loading
- No runtime CSS required (inline styles)

**Trade-offs**:
- Larger initial download for language support
- Async initialization required (uses WASM)
- Build output includes many language chunk files

**Implementation**: Singleton pattern with lazy initialization in `useHighlighter` composable.

---

### D-022: Symbol Data Split by Category
**Decision**: Organize math symbol data into separate files by category rather than one large file.

**Rationale**:
- Easier to maintain and extend individual categories
- Clear ownership and organization
- Smaller, focused files are easier to review
- Categories map naturally to UI tabs

**Structure**:
```
src/data/symbols/
├── index.ts      # Barrel export + search utilities
├── arithmetic.ts # +, -, ×, ÷, etc.
├── algebra.ts    # =, ≠, variables, etc.
├── calculus.ts   # ∫, ∂, lim, etc.
├── sets.ts       # ∈, ⊂, ∪, ∩, + logic
├── constants.ts  # π, e, i, ∞, φ
├── greek.ts      # α, β, γ, etc.
└── ml.ts         # ML-specific notation
```

---

### D-023: Responsive Table with Card Fallback
**Decision**: Use separate table (desktop) and card (mobile) layouts rather than a responsive table solution.

**Rationale**:
- Tables are inherently difficult to make responsive
- CSS-only responsive table solutions often compromise readability
- Cards provide better mobile UX than horizontal scrolling tables
- Explicit control over what information appears on mobile

**Implementation**:
```vue
<table class="hidden md:table">...</table>
<div class="md:hidden"><!-- Cards --></div>
```

**Trade-off**: Markup duplication. Accepted because it provides significantly better UX.

---

### D-024: Debounced Search with Immediate Visual Feedback
**Decision**: Debounce search filtering (300ms) but update input value immediately.

**Rationale**:
- Immediate input feedback feels responsive
- Debouncing prevents excessive re-renders during fast typing
- 300ms delay is imperceptible for most users
- Reduces CPU usage on large symbol tables

**Implementation**: Two refs - `searchQuery` (immediate) and `debouncedQuery` (filtered).

---

### D-025: TabGroup with Dynamic Slots
**Decision**: Use Vue's dynamic slots for TabGroup content rather than render functions.

**Rationale**:
- More natural Vue template syntax
- Content stays in parent component (better for content pages)
- Slot names provide clear mapping to tabs
- No need for render function complexity

**Implementation**:
```vue
<TabGroup :tabs="tabs">
  <template #Arithmetic>
    <SymbolTable :symbols="arithmeticSymbols" />
  </template>
  <template #Algebra>
    <SymbolTable :symbols="algebraSymbols" />
  </template>
</TabGroup>
```

---

### D-026: MathBlock with Graceful Error Handling
**Decision**: MathBlock renders error messages inline instead of throwing exceptions.

**Rationale**:
- Invalid LaTeX shouldn't crash the page
- Authors see immediate feedback on syntax errors
- Error messages help debug formula issues
- Production users see graceful degradation

**Implementation**:
```vue
<div v-if="renderResult.error" class="text-red-500">
  {{ renderResult.error }}
</div>
<span v-else v-html="renderResult.html" />
```

---

### D-027: CodeExample with Optional Features
**Decision**: CodeExample component has optional line numbers, collapsible, and copy functionality.

**Rationale**:
- Not all code examples need line numbers
- Short snippets don't need to be collapsible
- Opt-in features keep simple usage simple
- Props provide flexibility for different contexts

**Props**:
- `lineNumbers?: boolean` - Show line numbers
- `collapsible?: boolean` - Can collapse/expand
- `title?: string` - Header with filename

---

### D-028: ContentSection Inherits CollapsiblePanel
**Decision**: ContentSection wraps CollapsiblePanel with content-specific defaults.

**Rationale**:
- Separation of concerns: CollapsiblePanel is generic UI, ContentSection is content-specific
- ContentSection adds icon support, anchor links, consistent spacing
- CollapsiblePanel can be reused in non-content contexts
- Single responsibility principle

**Hierarchy**:
```
CollapsiblePanel (generic, reusable)
  └── ContentSection (content-specific wrapper)
```

---

### D-029: Greek Letters as Separate Data Type
**Decision**: Greek letters have a distinct interface from MathSymbol.

**Rationale**:
- Greek letters have unique properties (lowercase, uppercase, both LaTeX forms)
- Different display requirements (show both cases)
- CommonUses differs from programmingAnalogy
- Cleaner type safety

**Implementation**:
```typescript
interface GreekLetter {
  lowercase: string
  uppercase: string
  name: string
  latex: string
  uppercaseLaTeX: string
  commonUses: string[]
}
```

---

### D-030: color-mix() for Dynamic Opacity
**Decision**: Use CSS `color-mix()` instead of Tailwind opacity modifiers for CSS variable colors.

**Rationale**:
- Tailwind's `/10` modifier doesn't work with CSS custom properties
- `color-mix()` has good browser support (baseline 2023)
- Works with any color format
- No build-time processing required

**Implementation**:
```css
background-color: color-mix(in srgb, var(--color-primary) 10%, transparent);
```

**Trade-off**: Slightly more verbose than Tailwind utilities. Necessary workaround.

---

## Phase 4 Decisions

### D-031: useUrlState Composable for Shareable Widget States
**Decision**: Create a dedicated `useUrlState` composable for bi-directional URL query parameter synchronization.

**Rationale**:
- Validates the D-001 decision (no Pinia, use URL for shareable state)
- Reusable across multiple widgets
- Encapsulates debouncing, encoding, and router integration
- Composable pattern fits Vue 3 idioms

**Implementation**:
```typescript
export function useUrlState(key: string, defaultValue: string) {
  const route = useRoute()
  const router = useRouter()

  // Initialize from URL or default
  const value = ref(route.query[key]?.toString() ?? defaultValue)

  // Debounced sync to URL
  watch(value, (newValue) => {
    // ... debounced router.replace
  })

  return { value, setValue }
}
```

---

### D-032: Debounce Duration of 300ms for URL Updates
**Decision**: Use 300ms debounce delay when syncing state to URL query parameters.

**Rationale**:
- Fast enough to feel responsive
- Slow enough to batch rapid keystrokes
- Matches the search debounce duration (D-024) for consistency
- Prevents browser history from being spammed

**Trade-off**: Very fast typists might see a slight delay before URL updates. Acceptable for the benefit of clean history.

---

### D-033: router.replace Over router.push for URL State
**Decision**: Use `router.replace()` instead of `router.push()` when updating URL query parameters from widget state.

**Rationale**:
- Doesn't create new history entries for each state change
- Back button works as expected (returns to previous page, not previous state)
- Reduces memory usage from history stack
- Users can still share current URL

**Trade-off**: Users cannot use browser back/forward to navigate widget state history. This is intentional — use explicit undo/redo if needed.

---

### D-034: NumberTypeExplorer as Composition of Sub-Components
**Decision**: Build the NumberTypeExplorer from discrete sub-components rather than one monolithic component.

**Rationale**:
- Each sub-component has single responsibility
- Easier to test individual pieces
- Components can be reused in other contexts
- Maintainable and extensible

**Component Structure**:
```
NumberTypeExplorer (orchestrator)
├── NumberInput (validated input)
├── SetMembershipDisplay (ℕ, ℤ, ℚ, ℝ, ℂ checklist)
├── NumberProperties (type, sign, parity grid)
├── NumberLine (SVG visualization)
├── SetVennDiagram (SVG nested circles)
└── VisualizationToggle (show/hide controls)
```

---

### D-035: SVG for Mathematical Visualizations
**Decision**: Use inline SVG for the number line and Venn diagram visualizations instead of Canvas or a charting library.

**Rationale**:
- Vue can bind directly to SVG attributes (reactive updates)
- Scalable and crisp at any size
- No external dependencies
- Accessible (can add ARIA labels, titles)
- Lightweight for our simple visualization needs

**Trade-offs**:
- More complex visualizations might need a library (D3, Chart.js)
- Manual calculation of positions and scaling
- No built-in animation library (CSS transitions work though)

---

### D-036: Auto-Zoom Number Line Based on Value Magnitude
**Decision**: Number line automatically adjusts its range based on the magnitude of the displayed number.

**Rationale**:
- Static range (e.g., -10 to 10) would clip large numbers
- Infinite range would make small numbers invisible
- Auto-zoom provides optimal viewing for any input
- Educational: shows relative position regardless of scale

**Implementation**:
- Values ≤ 10: range -10 to 10
- Values ≤ 100: range -100 to 100
- Larger values: scale to nearest power of 10

---

### D-037: Nested Circles for Set Venn Diagram
**Decision**: Represent the number set hierarchy (ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ ⊂ ℂ) as concentric nested circles rather than overlapping Venn-style ovals.

**Rationale**:
- Accurately represents proper subset relationships
- Simpler to implement and understand
- Clear visual hierarchy (larger = contains more)
- No ambiguous overlap regions

**Implementation**:
- ℂ: largest circle (outermost)
- ℝ, ℚ, ℤ, ℕ: progressively smaller, nested inside
- Active sets highlighted with color

---

### D-038: Example Numbers Organized by Category
**Decision**: Provide pre-defined example numbers grouped by their mathematical category.

**Rationale**:
- Helps users explore edge cases
- Educational: shows examples of each number type
- Faster than typing complex numbers
- Demonstrates widget capabilities

**Categories**:
- Natural (1, 7, 42)
- Integers (-5, 0)
- Rational (1/2, 3/4)
- Irrational (π, e, √2)
- Complex (3+4i, i)

---

### D-039: Optional URL Sync via Props
**Decision**: URL state synchronization in NumberTypeExplorer is opt-in via `syncUrl` prop, not default behavior.

**Rationale**:
- Not all widget instances need shareable URLs
- Allows widget to be used in contexts where URL sync is undesirable
- Explicit is better than implicit
- Avoids conflicts if multiple widgets try to use same URL key

**Usage**:
```vue
<!-- URL sync enabled -->
<NumberTypeExplorer sync-url url-key="n" />

<!-- Local state only (default) -->
<NumberTypeExplorer initial-value="42" />
```

---

### D-040: NumberProperties Type for Extended Classification
**Decision**: Create a dedicated `NumberProperties` type that extends basic classification with additional properties.

**Rationale**:
- Basic classification (isNatural, isInteger, etc.) is for set membership
- Extended properties (isPrime, isEven, sign) provide educational value
- Separation of concerns: classification vs properties
- Type safety for property display

**Implementation**:
```typescript
interface NumberProperties {
  type: string         // "Natural" | "Integer" | etc.
  sign: string         // "Positive" | "Negative" | "Zero"
  parity: string       // "Even" | "Odd" | "N/A"
  isPrime: boolean
  // ... additional properties
}
```

---

### D-041: Font Awesome Icons Over Emojis
**Decision**: Use Font Awesome icons throughout the UI instead of emojis, with the single exception of the snake emoji (🐍) for branding.

**Rationale**:
- Consistent visual style across the application
- Font Awesome icons are monochromatic and outlined, matching the design system
- Emojis render differently across operating systems and browsers
- Font Awesome provides semantic icon classes (fa-solid fa-gamepad vs 🎮)
- Better accessibility through `aria-hidden="true"` pattern

**Exception**: The snake emoji 🐍 is retained for:
- Logo in header
- Hero section on homepage
- Brand identity recognition

**Implementation**:
```vue
<!-- Before (inconsistent) -->
<span>🎮</span>
<span>{{ topic.icon }}</span>  <!-- emoji string -->

<!-- After (consistent) -->
<i class="fa-solid fa-gamepad" aria-hidden="true" />
<i :class="topic.faIcon" aria-hidden="true" />
```

---

### D-042: Consistent Collapsible Pattern for Content Sections
**Decision**: Apply consistent collapsible behavior across content pages: introductory sections remain open, deeper topic sections are collapsible, and code examples within collapsible sections are also collapsible.

**Rationale**:
- Reduces initial page length for scan-ability
- Users can focus on sections relevant to them
- Code examples don't dominate the page when collapsed
- Progressive disclosure: overview first, details on demand

**Pattern**:
```
Page Structure:
├── Intro Section (NOT collapsible) - establishes context
├── Topic Section A (collapsible) - deeper content
│   └── CodeExample (collapsible)
├── Topic Section B (collapsible)
│   └── CodeExample (collapsible)
└── Summary/Reference (NOT collapsible) - quick lookup
```

**Implementation**:
```vue
<!-- Intro - always visible -->
<ContentSection id="intro" title="Overview">...</ContentSection>

<!-- Topic sections - collapsible with collapsible code -->
<ContentSection id="summation" title="Summation" collapsible>
  <p>Explanation...</p>
  <CodeExample :code="code" collapsible />
</ContentSection>
```

---

### D-043: Mathematical Symbols in Section Titles
**Decision**: Use actual mathematical symbols (Σ, Π) in section titles rather than ASCII approximations (E, P).

**Rationale**:
- Reinforces the visual connection between notation and code
- More professional appearance
- Educational: users see the real symbols they'll encounter
- Browsers and fonts handle Unicode math symbols well

**Implementation**:
```vue
<!-- Before -->
<ContentSection title="Summation: E = for loop">

<!-- After -->
<ContentSection title="Summation: Σ = for loop">
```

**Note**: The ASCII version can still appear in code comments where Unicode may cause issues.

---

## Phase 5 Decisions

### D-044: Preset-Based Summation Widget
**Decision**: Use a preset-based architecture with 5 fixed formulas rather than arbitrary user-defined expressions.

**Rationale**:
- Educational focus: each preset has a known closed-form formula to demonstrate
- Safer: no need to parse/evaluate arbitrary user expressions
- Richer content: each preset can have curated LaTeX, Python, and JavaScript representations
- Simpler UX: dropdown selection vs expression input

**Presets**:
| ID | Expression | Closed Form |
|----|------------|-------------|
| arithmetic | i | n(n+1)/2 |
| squares | i² | n(n+1)(2n+1)/6 |
| cubes | i³ | [n(n+1)/2]² |
| geometric | 2^(i-1) | 2^n - 1 |
| constant | 1 | n |

**Trade-off**: Less flexible than arbitrary expressions, but more educational and safer.

---

### D-045: Orchestrator Pattern for Complex Widgets
**Decision**: Structure the SummationExplorer as an orchestrator component with discrete sub-components for each feature.

**Rationale**:
- Single responsibility: each sub-component handles one concern
- Testable: sub-components can be tested in isolation
- Reusable: components like BoundsInput could be used elsewhere
- Maintainable: changes to visualization don't affect input handling

**Structure**:
```
SummationExplorer.vue (orchestrator)
├── PresetSelector.vue (formula selection)
├── BoundsInput.vue (start/end inputs)
├── SummationResult.vue (total display)
├── SummationCodeParallel.vue (math ↔ code)
├── SummationBarChart.vue (visualization)
└── FormulaComparison.vue (O(n) vs O(1))
```

---

### D-046: Python as Default Code Language
**Decision**: Show Python code by default in the SummationCodeParallel component, with JavaScript as secondary.

**Rationale**:
- Aligns with "SnakeMath" branding (Python = snake)
- Python syntax is cleaner for mathematical examples
- Python's `range()` maps well to summation bounds
- Target audience (programmers learning math) often knows Python

**Implementation**: Language toggle in component, defaulting to Python.

---

### D-047: SVG Bar Chart for Term Visualization
**Decision**: Use inline SVG for the term visualization bar chart rather than a charting library (Chart.js, D3).

**Rationale**:
- Consistent with Phase 4 visualizations (NumberLine, VennDiagram)
- Vue can bind directly to SVG attributes
- No external dependencies
- Full control over accessibility (aria-labels, reduced motion)
- Simple requirements don't justify a charting library

**Features implemented**:
- Bar per term with height proportional to value
- Running total line overlay
- Animation with play/stop controls
- Hover tooltips
- Max 20 bars with truncation warning

---

### D-048: Animation Opt-In with Reduced Motion Support
**Decision**: Bar chart animation is opt-in (requires clicking "Animate" button) and respects `prefers-reduced-motion`.

**Rationale**:
- Accessibility: users with motion sensitivity aren't surprised
- Performance: static rendering is faster for initial page load
- User control: animation can be stopped/reset
- Educational: users can choose to see terms appear sequentially

**Implementation**:
```typescript
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
if (prefersReducedMotion) {
  // Show all bars immediately, skip animation
  visibleBars.value = displayTerms.value.length
}
```

---

### D-049: Closed-Form Formula Data Structure
**Decision**: Create a comprehensive `SummationPreset` interface that includes both evaluation functions and display strings.

**Rationale**:
- Single source of truth for each preset
- Supports multiple output formats (LaTeX, Python, JavaScript)
- Includes both loop evaluation and closed-form functions
- Enables formula comparison feature

**Interface**:
```typescript
interface SummationPreset {
  id: SummationPresetId
  name: string
  description: string
  expressionLatex: string        // "i^2"
  expressionPython: string       // "i ** 2"
  expressionJavaScript: string   // "i ** 2"
  closedFormLatex: string | null // "\\frac{n(n+1)(2n+1)}{6}"
  closedFormName: string | null  // "Sum of squares formula"
  evaluate: (i: number) => number
  closedForm: ((n: number) => number) | null
}
```

---

### D-050: Bounds Limited to 0-100 Range
**Decision**: Limit summation bounds to integers between 0 and 100.

**Rationale**:
- Prevents performance issues from large loops
- Bar chart limited to 20 terms anyway (D-047)
- Educational examples don't need larger ranges
- Keeps URL parameters reasonable length
- Avoids integer overflow for sum of cubes (100³ × 100 is large but safe)

**Trade-off**: Can't demonstrate truly large summations, but formula comparison section explains the scaling.

---

## Phase 6 Decisions

### D-051: Playwright over Cypress for E2E Testing
**Decision**: Use Playwright for end-to-end testing instead of Cypress.

**Rationale**:
- Native TypeScript support without additional configuration
- Multi-browser testing (Chromium, Firefox, WebKit) out of the box
- Better async/await handling (no Cypress command chaining)
- Smaller bundle size and faster execution
- Better integration with modern testing patterns
- `@axe-core/playwright` for accessibility testing

**Trade-offs**:
- Less community resources compared to Cypress
- No built-in test runner GUI (but Playwright Inspector works well)

---

### D-052: Data-Testid for E2E Selectors
**Decision**: Use `data-testid` attributes for E2E test selectors rather than CSS classes or text content.

**Rationale**:
- Decouples tests from styling (class changes don't break tests)
- Clear intent: elements marked for testing
- Survives refactoring (element structure changes)
- Explicit and searchable in codebase
- Doesn't affect production behavior

**Implementation**:
```vue
<input data-testid="number-input" ... />
<div data-testid="set-membership-display" ... />
```

**Trade-off**: Adds attributes that aren't used in production. Acceptable for testing reliability.

---

### D-053: WCAG 2.1 AA as Accessibility Target
**Decision**: Target WCAG 2.1 AA compliance with automated testing via axe-core.

**Rationale**:
- AA is the standard for public websites
- Automated testing catches common issues (contrast, labels, focus)
- Educational content should be accessible to all learners
- Legal compliance in many jurisdictions

**Implementation**:
```typescript
const results = await new AxeBuilder({ page })
  .withTags(['wcag2a', 'wcag2aa', 'wcag21aa'])
  .analyze()
```

**Note**: Automated testing catches ~30-50% of accessibility issues. Manual testing still needed for complex interactions.

---

### D-054: SimpleFunctionDemo Widget with Preset Functions
**Decision**: Create a simple function widget with 4 preset functions rather than arbitrary user input.

**Rationale**:
- Educational focus: demonstrate f(x) notation, not expression parsing
- Safe: no need to evaluate arbitrary user expressions
- Focused: shows key concepts (linear, quadratic, absolute value, reciprocal)
- Interactive: slider for x value provides immediate feedback

**Presets**:
| Function | f(x) | Educational Value |
|----------|------|-------------------|
| Linear | 2x + 3 | Basic function composition |
| Quadratic | x² | Powers and growth |
| Absolute Value | \|x\| | Piecewise behavior |
| Reciprocal | 1/x | Division by zero, asymptotes |

**Trade-off**: Less flexible than arbitrary input, but more focused on teaching the core concept.

---

### D-055: Content Pages Without Interactive Widgets
**Decision**: Variables & Expressions and Order of Operations pages use only code examples, no interactive widgets.

**Rationale**:
- Not every concept needs an interactive widget
- Code examples effectively demonstrate these concepts
- Avoids widget fatigue
- Focuses attention on the explanatory content
- Widgets planned for future (expression builder, PEMDAS calculator) but not MVP

**Content Strategy**:
- Variables: Python code examples for assignment, naming, expressions
- Order of Operations: Step-by-step Python examples for PEMDAS

---

### D-056: Mathematical Correctness Over Simplification
**Decision**: Represent mathematical set relationships correctly even when it complicates the code.

**Context**: Natural numbers should be marked as belonging to ℂ (complex numbers) because ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ ⊂ ℂ.

**Rationale**:
- Educational site must be mathematically accurate
- Teaches correct set theory relationships
- Venn diagram visualization depends on correct subset membership
- Users might share/cite content

**Implementation**:
```typescript
// All real numbers are complex (imaginary part = 0)
isComplex: true
```

**Trade-off**: Code distinguishes "is mathematically complex" from "has non-zero imaginary part" in different contexts.

---

### D-057: E2E Tests Organized by Feature
**Decision**: Organize E2E tests by feature/page rather than by test type.

**Structure**:
```
e2e/
├── navigation/
│   └── navigation.spec.ts      # Nav links, breadcrumbs
├── widgets/
│   ├── number-type-explorer.spec.ts
│   └── summation-explorer.spec.ts
└── accessibility/
    └── audit.spec.ts           # WCAG audits for all pages
```

**Rationale**:
- Easy to find tests for a specific feature
- Tests can be run in isolation for faster feedback
- Mirrors source code organization
- Accessibility tests centralized for comprehensive coverage

---

### D-058: Collapsible Sections for Deep Content
**Decision**: Use collapsible `ContentSection` for detailed explanations while keeping introductory content always visible.

**Pattern** (applied in Phase 6 content pages):
```
Page Structure:
├── Intro Section (NOT collapsible) - hooks the reader
├── Core Concept (NOT collapsible) - essential content
├── Details Section A (collapsible) - deeper exploration
│   └── CodeExample (collapsible)
├── Details Section B (collapsible)
└── Summary/Reference (NOT collapsible) - quick lookup
```

**Rationale**:
- Progressive disclosure reduces cognitive load
- Users can scan page structure easily
- Detailed content available on demand
- Consistent with Phase 4 decision (D-042)

**Note**: All three new content pages (Functions, Variables, Order of Operations) follow this pattern.

---

## Phase 7 Decisions

### D-059: Visual Regression Before New Visuals
**Decision**: Capture visual baseline screenshots before adding new complex visualizations.

**Rationale**:
- Establishes baseline for detecting unintended visual changes
- Allows confident refactoring of existing components
- CI can catch visual regressions before merge
- Documents expected visual appearance

**Implementation**: Visual tests run in Playwright with `toHaveScreenshot()` comparison.

---

### D-060: Coordinate System Supports Negative Domain/Range
**Decision**: The reusable CoordinateSystem component supports any combination of positive and negative x/y ranges.

**Rationale**:
- Quadratic parabolas with a < 0 extend below the x-axis
- Real-world applications (projectile motion) involve negative y values
- Roots of equations can be positive or negative
- Generalized component is more reusable

**Implementation**:
- Axes render at origin if visible, or at edge if origin out of view
- Grid lines and labels work correctly for any range
- Arrow heads point in positive x and y directions

---

### D-061: Static Form Display (No Animation) for MVP
**Decision**: Display equation forms (standard, vertex, factored) as static text rather than animated transitions.

**Rationale**:
- Simpler implementation for MVP
- Animation can be distracting when adjusting coefficients
- Focus on educational content, not visual effects
- Animation can be added later if valuable

**Trade-off**: Less visually dynamic, but clearer for learning.

---

### D-062: "No Real Roots" with Link for Δ < 0
**Decision**: When discriminant is negative, show "No real roots" with a link to the Number Types page.

**Rationale**:
- Avoid complex arithmetic on the quadratics page
- Connect to existing content about complex numbers
- Educational progression: "you'll learn about this here"
- Keeps quadratics focused on real-valued analysis

**Implementation**:
```vue
<RouterLink to="/basics/number-types">
  The roots are complex numbers. Learn more in Number Types.
</RouterLink>
```

---

### D-063: 8 Presets (5 Basic + 3 Real-World)
**Decision**: Provide 8 preset configurations for the QuadraticExplorer.

**Basic Presets**:
| ID | Name | Coefficients | Purpose |
|----|------|--------------|---------|
| standard | Standard | a=1, b=0, c=0 | y = x² baseline |
| wide | Wide | a=0.5, b=0, c=0 | Show |a| < 1 effect |
| narrow | Narrow | a=2, b=0, c=0 | Show |a| > 1 effect |
| shifted | Shifted | a=1, b=-4, c=3 | Show vertex shift |
| inverted | Inverted | a=-1, b=0, c=4 | Show a < 0 effect |

**Real-World Presets**:
| ID | Name | Coefficients | Application |
|----|------|--------------|-------------|
| projectile | Projectile Motion | a=-4.9, b=20, c=1.5 | Physics |
| profit | Profit Optimization | a=-0.1, b=50, c=-200 | Economics |
| reflector | Parabolic Reflector | a=0.25, b=0, c=0 | Optics |

**Rationale**:
- 5 basic presets cover all coefficient effects
- 3 real-world presets reinforce practical math
- Real-world presets include contextual explanations
- Total of 8 gives good variety without overwhelming

---

## Phase 8 Decisions

### D-064: Widget Named "ExponentialExplorer"
**Decision**: Name the exponential/logarithm widget "ExponentialExplorer" following the naming pattern of QuadraticExplorer.

**Rationale**:
- Consistent naming with other explorer widgets
- Clearly communicates the widget's purpose
- "Explorer" suffix indicates interactive exploration capability

---

### D-065: Presets + Custom Base Input
**Decision**: Provide quick-access preset buttons for common bases (e, 2, 10) plus a custom input field.

**Rationale**:
- Most educational examples use e, 2, or 10 as bases
- Quick selection improves UX for common cases
- Custom input allows exploration of any valid base (0.1 to 100)
- Balances ease of use with flexibility

**Implementation**:
- Preset buttons: e (natural), 2 (binary), 10 (common)
- Custom input: number field with validation (0.1 ≤ base ≤ 100, base ≠ 1)

---

### D-066: Tabbed Interface (Function Explorer | Complexity Comparison)
**Decision**: Use a tabbed interface to separate the function exploration from algorithm complexity comparison.

**Rationale**:
- Two distinct use cases warrant separate focused views
- Function Explorer: visualize exp/log functions, growth/decay analysis
- Complexity Comparison: compare O(1), O(log n), O(n), etc.
- Tabs keep the widget clean without overwhelming users

**Implementation**: Standard tab navigation with URL state sync (?tab=function or ?tab=complexity)

---

### D-067: Core Complexity Set
**Decision**: Use six complexity classes for comparison: O(1), O(log n), O(n), O(n log n), O(n²), O(2^n).

**Rationale**:
- Covers the most common algorithm complexities programmers encounter
- Demonstrates the dramatic difference between logarithmic and exponential growth
- Six functions show clear patterns without overwhelming the visualization
- Each has real algorithm examples for context

**Trade-off**: Doesn't include O(n³) or O(n!) which are less common but can be dramatic.

---

### D-068: Single Content Page for Exponentials + Logarithms
**Decision**: Combine exponentials and logarithms into a single content page rather than splitting them.

**Rationale**:
- Exponentials and logarithms are inverse functions - deeply connected
- Splitting would fragment the narrative (log is meaningless without exp context)
- Algorithm complexity analysis connects both concepts
- Single page allows natural progression: exp → log → properties → applications

---

### D-069: Mobile Optimization via Responsive Layouts
**Decision**: Prioritize responsive layouts with minimum 44px touch targets for mobile.

**Rationale**:
- Foundation for mobile experience before adding advanced gestures
- 44px is Apple's recommended minimum touch target size
- Responsive grid layouts stack on mobile, side-by-side on desktop
- Slider thumb enlarged on desktop for better precision

**Implementation**:
- Tab buttons: min-height 44px
- Preset buttons: min-width/height 44px
- Slider thumb: 20px mobile, 44px desktop
- Grid: single column mobile, two columns desktop (lg:grid-cols-2)

---

## Phase 9 Decisions

### D-070: Tiered CI Workflow
**Decision**: Implement tiered CI with quick-check on push and full-test on PR only.

**Rationale**:
- Reduces CI time for routine commits
- Full E2E tests only needed for code review
- Visual regression tests are flaky in CI (font rendering, timing)
- Faster feedback loop for development

**Implementation**:
```yaml
jobs:
  quick-check:  # Always: type-check, lint, unit tests, build
    if: always
  full-test:    # PR only: E2E functional, accessibility
    if: github.event_name == 'pull_request'
```

---

### D-071: Visual Regression Tests Local-Only
**Decision**: Remove visual regression tests from CI, run locally only.

**Rationale**:
- CI environments have different fonts, rendering engines
- Screenshot comparison is inherently flaky across environments
- Local tests are sufficient for developer validation
- Reduces CI complexity and failure rate

**Trade-off**: Visual regressions might slip through if developers don't run local tests. Mitigated by code review.

---

### D-072: Test Tag System
**Decision**: Use grep-based test tags (@e2e, @a11y, @visual) in test names for filtering.

**Rationale**:
- Simple to implement (just add tag to test name)
- Works with Playwright's built-in grep functionality
- Easy to run specific test categories
- Self-documenting test organization

**Implementation**:
```typescript
test.describe('Widget Tests @e2e', () => { ... })
test.describe('Accessibility Audits @a11y', () => { ... })
test.describe('Visual Regression @visual', () => { ... })
```

---

### D-073: Composable Pattern for Widget State
**Decision**: Create `useUnitCircle` composable for all unit circle widget state and logic.

**Rationale**:
- Separates state logic from presentation
- Composable can be tested independently
- Supports optional URL state synchronization
- Reusable if unit circle appears in multiple contexts

**Implementation**:
```typescript
export function useUnitCircle(options: UseUnitCircleOptions = {}) {
  // State: angle, unit, showMoreAngles, showWaves
  // Computed: trigValues, exactValues, quadrant, pointOnCircle, etc.
  // Methods: setAngle, setUnit, incrementAngle
  // Optional URL sync
}
```

---

### D-074: Modular Component Architecture for UnitCircleExplorer
**Decision**: Build UnitCircleExplorer from discrete sub-components.

**Rationale**:
- Each sub-component has single responsibility
- Easier to test and maintain
- Components can be reused elsewhere
- Follows established pattern from other widgets

**Structure**:
```
UnitCircleExplorer/ (orchestrator)
├── AngleControls.vue (slider, input, unit toggle)
├── SpecialAngleButtons.vue (quick angle selection)
├── TrigValuesDisplay.vue (sin, cos, tan values)
├── WaveGraphs.vue (optional wave visualization)
└── index.ts (exports)
```

---

### D-075: Optional Wave Graphs
**Decision**: Wave graphs are hidden by default, shown via toggle checkbox.

**Rationale**:
- Reduces initial visual complexity
- Users can focus on unit circle first
- Progressive disclosure of related concepts
- Keeps widget usable on smaller screens

**Implementation**: `showWaves` ref in composable, checkbox toggle in main component.

---

### D-076: Data-Driven Special Angles
**Decision**: Define special angles as an array of SpecialAngle objects with exact values.

**Rationale**:
- Single source of truth for angle data
- Exact values (√2/2, √3/2, etc.) stored as strings
- Easy to add/modify special angles
- Enables quick validation of calculations

**Data Structure**:
```typescript
interface SpecialAngle {
  degrees: number
  radians: { numerator: number; denominator: number; symbolic: string }
  exact: { sin: string; cos: string; tan: string }
}
```

---

## Phase 10 Decisions

### D-077: Widget Named "StatisticsCalculator"
**Decision**: Name the statistics widget "StatisticsCalculator" rather than "StatisticsExplorer".

**Rationale**:
- "Calculator" more accurately reflects the widget's purpose (computing statistics)
- Distinguishes from "Explorer" widgets which focus on visualization/exploration
- Aligns with user expectations for a statistics tool
- Clear and descriptive naming

---

### D-078: Preset Datasets + Custom Data Input
**Decision**: Provide 5 preset datasets with quick-select buttons plus a custom data input option.

**Rationale**:
- Presets demonstrate different statistical scenarios (normal, skewed, outliers)
- Quick exploration without typing data
- Custom input allows users to analyze their own data
- Educational: each preset has different characteristics to explore

**Presets**:
| ID | Name | Purpose |
|----|------|---------|
| test-scores | Test Scores | Normal distribution, familiar context |
| heights | Heights | Real-world measurements, tight spread |
| salaries | Salaries | Right-skewed with outliers |
| reaction-times | Reaction Times | Small values, milliseconds |
| symmetric | Symmetric | Perfectly symmetric for comparison |

---

### D-079: Composable Pattern for Statistics State
**Decision**: Create `useStatistics` composable following the established pattern for complex widget state.

**Rationale**:
- Consistent with Phase 9's `useUnitCircle` pattern
- Separates state logic from presentation
- Supports optional URL state synchronization
- Testable independently of components
- Reusable if statistics appears in multiple contexts

**Implementation**:
```typescript
export function useStatistics(options: UseStatisticsOptions = {}) {
  // State: selectedDataset, customInput, binCount, showCustom
  // Computed: currentData, statistics, histogramData
  // Optional URL sync
  return { ... }
}
```

---

### D-080: Panel-Based Component Architecture
**Decision**: Organize statistics display into category-specific panels rather than a single monolithic display.

**Rationale**:
- Clear visual organization for users
- Each panel has single responsibility
- Easy to add/remove stat categories
- Independent styling per category
- Components can be reused in other contexts

**Structure**:
```
StatisticsCalculator (orchestrator)
├── DatasetSelector (preset buttons + custom toggle)
├── CustomDataInput (text area with validation)
├── StatisticsPanel (count, sum, mean, median, mode)
├── SpreadPanel (variance, std dev, range, skewness)
├── QuartilesPanel (Q1, Q2, Q3, IQR)
├── OutliersPanel (fences, outlier list)
├── HistogramChart (SVG visualization)
└── BoxPlotChart (SVG visualization)
```

---

### D-081: Tukey's Fences for Outlier Detection
**Decision**: Use Tukey's fences method (1.5 × IQR) for outlier detection.

**Rationale**:
- Industry standard method, widely taught
- Non-parametric (doesn't assume normal distribution)
- Simple to understand and compute
- Clear visual representation in box plot
- Robust to extreme values

**Implementation**:
```typescript
lowerFence = Q1 - 1.5 * IQR
upperFence = Q3 + 1.5 * IQR
outliers = values.filter(v => v < lowerFence || v > upperFence)
```

---

### D-082: Sturges' Rule for Default Bin Count
**Decision**: Use Sturges' rule to calculate default histogram bin count.

**Rationale**:
- Simple formula: k = ⌈log₂(n) + 1⌉
- Works well for normally distributed data
- Widely used default in statistical software
- User can override with slider (3-20 bins)

**Implementation**:
```typescript
const suggestedBins = Math.ceil(Math.log2(data.length) + 1)
return Math.max(3, Math.min(20, suggestedBins))
```

---

### D-083: Green-700 for WCAG Color Contrast
**Decision**: Use Tailwind's `green-700` instead of `green-600` for success/positive text colors.

**Rationale**:
- `green-600` (#16a34a) has 3.29:1 contrast ratio - fails WCAG AA
- `green-700` (#15803d) has 4.61:1 contrast ratio - passes WCAG AA
- WCAG AA requires 4.5:1 for normal text
- Applies to all success indicators (validation messages, "No outliers", etc.)

**Implementation**:
```vue
<!-- Before (fails WCAG AA) -->
<span class="text-green-600 dark:text-green-400">Valid</span>

<!-- After (passes WCAG AA) -->
<span class="text-green-700 dark:text-green-400">Valid</span>
```

**Note**: Dark mode uses `green-400` which has sufficient contrast against dark backgrounds.

---

## Post-Phase 10: Algebra Expansion Decisions

### D-084: Preset-Based Product Notation Explorer
**Decision**: Use preset formulas (factorial, even numbers, odd numbers, powers, fractions) for the product notation explorer rather than arbitrary expressions.

**Rationale**:
- Consistent with SummationExplorer approach (D-044)
- Safer: no need to evaluate arbitrary user expressions
- Educational: each preset demonstrates key concepts
- Richer content: presets include closed-form formulas where applicable

**Trade-off**: Less flexible than arbitrary input, but more focused and safer.

---

### D-085: Interactive Equation Solvers with Computed Properties
**Decision**: Use reactive computed properties for the linear equation solvers (single equation and 2×2 system).

**Rationale**:
- Immediate feedback as coefficients change
- No need for "solve" button - solution updates automatically
- Educational: shows relationship between inputs and outputs
- Consistent with other widget patterns (QuadraticExplorer, ExponentialExplorer)

**Implementation**:
```typescript
const solution = computed(() => {
  // For ax + b = c: x = (c - b) / a
  if (a.value === 0) return { valid: false, error: 'No solution (a=0)' }
  return { valid: true, x: (c.value - b.value) / a.value }
})
```

---

### D-086: Computed Property for Dynamic Formula Display
**Decision**: Use computed properties to construct MathBlock formulas dynamically rather than template string interpolation.

**Context**: Vue template literals in `:formula` attributes caused parsing issues with complex LaTeX expressions.

**Rationale**:
- Cleaner separation of logic and template
- Avoids template parsing issues with `${}`
- Type-safe formula construction
- Easier to debug and maintain

**Implementation**:
```typescript
// Instead of inline template literal
// :formula="`\\prod_{i=${start}}^{${end}} ${latex}`"

// Use computed property
const fullFormula = computed(() => {
  return `\\prod_{i=${startValue.value}}^{${endValue.value}} ${formulaLatex.value}`
})
```

---

### D-087: HTML Entities for Comparison Operators in Vue Templates
**Decision**: Use HTML entities (`&lt;`, `&gt;`) instead of raw `<` and `>` symbols in Vue template text content.

**Rationale**:
- Vue/ESLint parser interprets `< 0` as a malformed HTML tag start
- HTML entities are valid in text content and render correctly
- Consistent with HTML best practices

**Implementation**:
```vue
<!-- Before (causes parsing error) -->
<li>m < 0: line goes down</li>

<!-- After (works correctly) -->
<li>m &lt; 0: line goes down</li>
```

---

## Phase 11 Decisions

### D-088: 2D Vectors Only (No 3D)
**Decision**: Limit vector visualization and operations to 2D vectors only.

**Rationale**:
- 2D is easier to visualize and understand
- Core concepts (addition, dot product, angles) transfer directly to higher dimensions
- 3D visualization requires more complex rendering (perspective, rotation controls)
- Keeps the widget focused on fundamental concepts
- 3D can be added in a future phase if needed

**Trade-off**: Cannot demonstrate cross product (3D-specific) or concepts unique to higher dimensions.

---

### D-089: Widget Defaults to Addition Operation
**Decision**: The VectorOperations widget starts with the "Add" operation selected by default.

**Rationale**:
- Addition is the most intuitive vector operation
- Parallelogram law provides immediate visual feedback
- Natural starting point for exploration
- Most users will understand A + B conceptually

**Implementation**:
```typescript
const operation = ref<VectorOperation>('add')
```

---

### D-090: Angles Displayed in Degrees with Radians in Parentheses
**Decision**: Show angles primarily in degrees with radians as supplementary information.

**Rationale**:
- Degrees are more intuitive for most users
- Programmers may need radians for code (Math.atan2 returns radians)
- Showing both educates users about the relationship
- Consistent with UnitCircleExplorer pattern

**Implementation**:
```vue
<span>45° (0.79 rad)</span>
```

---

### D-091: Fixed Coordinate System Range (-5 to +5)
**Decision**: Use a fixed coordinate system range of -5 to +5 for both axes.

**Rationale**:
- Predictable, consistent visual space
- Inputs are clamped to this range
- Grid lines and labels remain readable
- Avoids complexity of auto-scaling
- Educational focus: understand vectors in a bounded space

**Trade-off**: Cannot visualize very large vectors. Acceptable for educational purposes.

**Implementation**:
```typescript
export const VECTOR_COORDINATE_RANGE = { min: -5, max: 5 }
```

---

### D-092: Composable Pattern for Vector State (useVectors)
**Decision**: Create a dedicated `useVectors` composable for vector widget state management.

**Rationale**:
- Consistent with established patterns (useUnitCircle, useStatistics)
- Separates state logic from presentation
- Supports optional URL synchronization
- Computed properties handle derived values (magnitudes, relationships, results)
- Testable independently of components

**Implementation**:
```typescript
export function useVectors(options: UseVectorsOptions = {}) {
  // State
  const vectorA = ref<Vector2D>({ x: 3, y: 2 })
  const vectorB = ref<Vector2D>({ x: 1, y: 4 })
  const operation = ref<VectorOperation>('add')
  const scalar = ref(2)

  // Computed
  const operationResult = computed(() => calculateResult())
  const areParallel = computed(() => isParallel(vectorA.value, vectorB.value))
  const arePerpendicular = computed(() => isPerpendicular(vectorA.value, vectorB.value))

  // URL sync
  if (options.syncUrl) { ... }

  return { vectorA, vectorB, operation, scalar, operationResult, ... }
}
```

---

### D-093: Modular Widget Component Architecture
**Decision**: Build VectorOperations from discrete sub-components following established patterns.

**Rationale**:
- Each component has single responsibility
- Easier to test and maintain
- Components can be reused elsewhere
- Consistent with QuadraticExplorer, StatisticsCalculator patterns

**Structure**:
```
VectorOperations/ (orchestrator)
├── VectorInputPanel.vue (coordinate inputs with color coding)
├── VectorCanvas.vue (SVG visualization)
├── OperationSelector.vue (operation buttons)
├── ResultDisplay.vue (results with badges)
├── VectorPresets.vue (preset selector + swap button)
└── index.ts (exports)
```

---

### D-094: Vector Presets with Educational Context
**Decision**: Provide 5 presets demonstrating key vector relationships.

**Presets**:
| ID | Name | Vectors | Purpose |
|----|------|---------|---------|
| unit-vectors | Unit Vectors | î, ĵ | Standard basis vectors |
| perpendicular | Perpendicular | (3,0), (0,4) | Demonstrate dot product = 0 |
| parallel | Parallel | (2,1), (4,2) | Same direction, different magnitude |
| opposite | Opposite | (3,2), (-3,-2) | Parallel but opposite direction |
| arbitrary | Arbitrary | (3,2), (1,4) | General case for exploration |

**Rationale**:
- Each preset demonstrates a specific mathematical concept
- Unit vectors show basis concept
- Perpendicular preset makes dot product = 0 obvious
- Parallel/opposite show scalar relationships
- Covers common educational scenarios

---

### D-095: Parallelogram Law Visualization for Addition
**Decision**: Show dashed parallelogram lines when displaying vector addition results.

**Rationale**:
- Visual proof of the parallelogram law
- Shows A + B geometrically as diagonal of parallelogram
- Demonstrates commutativity visually
- Common in educational materials
- Enhances understanding beyond just showing the result vector

**Implementation**: Dashed lines from tip of A to result and tip of B to result when operation is "add".
