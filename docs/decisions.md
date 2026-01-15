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
