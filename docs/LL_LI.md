# SnakeMath: Lessons Learned - Lessons Identified

## Intent
The intent of this document is to gather lessons from this project, as it is being build. These could either be larger bugfixes, kinks in packages and libraries, good practices etc.

---

## Phase 1: Project Foundation

### LL-001: Tailwind CSS Version Mismatch
**Issue**: Running `npm install -D tailwindcss postcss autoprefixer` installed Tailwind v4 by default, but the project specified v3.x in CLAUDE.md.

**Impact**: Tailwind v4 has a completely different configuration format and API, causing configuration errors.

**Resolution**: Explicitly specify version: `npm install -D tailwindcss@3 postcss autoprefixer`

**Lesson**: Always specify major versions when installing packages to match project requirements. Check installed versions immediately after installation.

---

### LL-002: Vue Project Initialization in Non-Empty Directory
**Issue**: `npm create vue@latest` refuses to run in a non-empty directory, but we had existing files (archive/, instructions/, CLAUDE.md, docs/).

**Resolution**: Created the Vue project in a temporary directory, then copied the scaffolded files while preserving existing content.

**Lesson**: When integrating Vue scaffolding into an existing project, use a temp directory approach rather than trying to force initialization in the existing directory.

---

### LL-003: String Contains Check Order Matters
**Issue**: The `parseNumberInput` function checked for complex numbers (containing 'i') before checking for special values like "Infinity". Since "Infinity" contains the letter 'i', it was incorrectly parsed as a complex number.

**Resolution**: Reordered the checks to handle special cases (Infinity, -Infinity) before checking for complex number indicators.

**Lesson**: When parsing strings with multiple possible interpretations, handle specific/special cases before general patterns. Order of checks matters significantly.

---

### LL-004: TypeScript Optional Chaining with Array Access
**Issue**: Code like `decimalStr.split('.')[1]?.length > 10` caused TypeScript error TS2532 because the comparison with `> 10` requires a definite number, not `number | undefined`.

**Resolution**: Extract to a variable first:
```typescript
const decimalPart = decimalStr.split('.')[1]
if (decimalPart && decimalPart.length > 10) { ... }
```

**Lesson**: Optional chaining (`?.`) returns `undefined` if the chain breaks, which doesn't work directly in comparisons. Use intermediate variables for clarity and type safety.

---

### LL-005: Leftover Test Files After Refactoring
**Issue**: After removing the default HelloWorld.vue component, the corresponding test file `src/components/__tests__/HelloWorld.spec.ts` remained and caused type-check failures.

**Resolution**: Deleted the orphaned test file.

**Lesson**: When removing components, always check for and remove associated test files. Consider using co-located tests (test file next to source) rather than separate `__tests__` directories to make this relationship clearer.

---

### LL-006: Archive Folder Exclusion Requires Multiple Configurations
**Issue**: Excluding the archive folder from the build required updates in multiple places.

**Resolution**: Added exclusions to:
- `vite.config.ts` - build and dev server
- `tsconfig.app.json` - TypeScript compilation
- `tsconfig.vitest.json` - Test TypeScript compilation
- `tailwind.config.js` - CSS class scanning
- `vitest.config.ts` - Test execution
- `eslint.config.ts` - Linting
- `.prettierignore` - Formatting

**Lesson**: Legacy/archive code exclusion is not a single-point configuration. Document all exclusion points and verify each tool respects them.

---

### LL-007: SPA Routing on GitHub Pages
**Issue**: GitHub Pages serves 404 for direct URL access to Vue Router routes (e.g., `/basics/foundations`).

**Resolution**: Created a `scripts/copy-404.js` script that copies `index.html` to `404.html` during build. GitHub Pages serves 404.html for unknown paths, which loads the SPA and allows Vue Router to handle the route.

**Lesson**: Static hosting for SPAs requires a fallback mechanism. The 404.html approach is a clean solution for GitHub Pages that doesn't require server configuration.

---

### LI-001: ESLint Flat Config Format
**Identified**: ESLint 9+ uses a new "flat config" format that differs significantly from the legacy `.eslintrc` format.

**Note**: Vue's scaffolding generates `eslint.config.ts` in flat config format. Documentation and examples online may still reference the legacy format.

**Action**: When troubleshooting ESLint issues, ensure you're looking at flat config documentation.

---

## Phase 2: Layout & Navigation

### LL-008: NodeList Array Access TypeScript Strictness
**Issue**: When accessing elements from `querySelectorAll()`, TypeScript's strict mode considers array index access as potentially undefined, even after checking `.length > 0`.

**Code**:
```typescript
const elements = menuRef.value?.querySelectorAll<HTMLElement>('button, [href]')
if (!elements || elements.length === 0) return
const firstElement = elements[0]  // TS2532: possibly undefined
const lastElement = elements[elements.length - 1]  // TS2532: possibly undefined
```

**Resolution**: Add explicit null check after assignment:
```typescript
const firstElement = elements[0]
const lastElement = elements[elements.length - 1]
if (!firstElement || !lastElement) return
```

**Lesson**: TypeScript's strict mode doesn't infer that `elements[0]` is defined even after checking `elements.length > 0`. Add explicit guards for cleaner type narrowing.

---

### LL-009: Vue ESLint Rule for Optional Props Defaults
**Issue**: ESLint's `vue/require-default-prop` rule warns when optional props don't have explicit defaults in `withDefaults()`.

**Resolution**: Explicitly set `undefined` as default:
```typescript
const props = withDefaults(defineProps<Props>(), {
  title: undefined,      // explicitly undefined
  description: undefined,
  showBreadcrumbs: true, // actual default
})
```

**Lesson**: For optional props that should truly be optional (no default value), explicitly set `undefined` in `withDefaults()` to satisfy the ESLint rule while maintaining intended behavior.

---

### LI-002: Singleton Pattern for Composables
**Identified**: The theme composable uses a singleton pattern by declaring reactive state outside the function.

```typescript
// State outside function = shared across all component instances
const isDark = ref(false)
const isInitialized = ref(false)

export function useTheme() {
  // All components share the same isDark ref
}
```

**Note**: This pattern is useful for global state like theme, but not appropriate for component-local state. Consider whether state should be shared before using this pattern.

---

### LI-003: Teleport for Modal/Drawer Components
**Identified**: Vue's `<Teleport>` is essential for slide-out menus and modals to ensure proper z-index stacking.

```vue
<Teleport to="body">
  <div class="fixed inset-0 z-50">...</div>
</Teleport>
```

**Note**: Without Teleport, fixed-position elements can be clipped by parent containers with `overflow: hidden` or affected by parent transforms. Always teleport overlays to body.

---

### LI-004: RouterLink in Type-Safe Footer Links
**Identified**: When creating a footer with mixed internal and external links, TypeScript requires careful typing of the link object.

```typescript
interface FooterLink {
  label: string
  path?: string      // Internal route
  href?: string      // External URL
  external?: boolean
}
```

**Note**: Using optional properties with union types allows flexible link definitions. RouterLink requires `:to="link.path ?? '/'"` to satisfy TypeScript when `path` is optional.

---

### LI-005: Accessibility Documentation as Living Document
**Identified**: Creating `docs/ACCESSIBILITY.md` early establishes accessibility expectations and provides a checklist for future development.

**Benefits**:
- Reference for testing before PRs
- Links to helpful tools (axe, WAVE, Lighthouse)
- Documents common patterns (aria-hidden for icons, focus traps for modals)
- Sets WCAG 2.1 AA as the target standard

**Note**: Accessibility should be verified at each phase, not retrofitted at the end.

---

## Phase 2 Summary

Phase 2 introduced several patterns and lessons:

**Lessons Learned (LL)**:
- LL-008: TypeScript strict mode and NodeList array access
- LL-009: Vue ESLint rule for optional props defaults

**Lessons Identified (LI)**:
- LI-002: Singleton pattern for composables
- LI-003: Teleport for modal/drawer components
- LI-004: Type-safe mixed link objects
- LI-005: Early accessibility documentation

**Key Takeaways**:
1. TypeScript strict mode catches potential issues but requires explicit guards
2. Vue's ESLint rules enforce best practices but may need explicit `undefined` defaults
3. Accessibility should be built in from the start, not added later
4. Centralized navigation data (navigation.ts) enables consistent auto-detection across components

---

## Phase 3: Content Components

### LL-010: Tailwind Opacity Modifiers Don't Work with CSS Variables
**Issue**: Using `bg-primary/10` in a `@apply` directive failed during production build when `primary` is defined as a CSS variable (`var(--color-primary)`).

**Error**:
```
The `bg-primary/10` class does not exist. If `bg-primary/10` is a custom class,
make sure it is defined within a `@layer` directive.
```

**Resolution**: Use CSS `color-mix()` function instead:
```css
/* Before (broken) */
.copy-success {
  @apply text-primary bg-primary/10;
}

/* After (working) */
.copy-success {
  @apply text-primary;
  background-color: color-mix(in srgb, var(--color-primary) 10%, transparent);
}
```

**Lesson**: Tailwind's opacity modifiers (`/10`, `/50`, etc.) require colors to be defined in a format that supports alpha channels. CSS variables like `var(--color-primary)` don't support this out of the box. Use `color-mix()` for dynamic opacity with CSS variable colors.

---

### LL-011: ESLint v-html Warnings Are Expected for Rendered Content
**Issue**: ESLint warns about `vue/no-v-html` when using `v-html` for KaTeX and Shiki output.

**Context**: Both KaTeX and Shiki return pre-rendered HTML strings that must be inserted via `v-html`. The warning is valid for user-controlled content but expected for library-generated output.

**Resolution**: Add eslint-disable comments where the source is trusted:
```vue
<!-- eslint-disable-next-line vue/no-v-html -->
<span v-html="renderedMath" />
```

**Lesson**: Don't blindly suppress warnings, but document when they're expected. KaTeX and Shiki output is sanitized by design, making `v-html` safe in these specific cases.

---

### LL-012: Shiki Highlighter Requires Singleton Pattern
**Issue**: Creating a new Shiki highlighter instance for every code block is expensive (~100ms+ per instance).

**Resolution**: Use singleton pattern with lazy initialization:
```typescript
let highlighterInstance: Highlighter | null = null
let highlighterPromise: Promise<Highlighter> | null = null

async function getHighlighter(): Promise<Highlighter> {
  if (highlighterInstance) return highlighterInstance
  if (highlighterPromise) return highlighterPromise

  highlighterPromise = createHighlighter({ /* options */ })
  highlighterInstance = await highlighterPromise
  return highlighterInstance
}
```

**Lesson**: Heavy initialization (syntax highlighters, WASM modules) should use singleton patterns. The "promise caching" technique prevents race conditions when multiple components request the highlighter simultaneously.

---

### LL-013: Vue Dynamic Slot Names with Special Characters
**Issue**: Tab labels like "Sets & Logic" caused template parsing errors when used as dynamic slot names (`#"Sets & Logic"`).

**Resolution**: Use simple, safe slot names without special characters:
```vue
<!-- Before (broken) -->
<template #"Sets & Logic">...</template>

<!-- After (working) -->
<template #Sets>...</template>
```

**Lesson**: Dynamic slot names in Vue templates have naming restrictions. Stick to alphanumeric names for slots. Display labels can differ from slot identifiers.

---

### LI-006: KaTeX Custom Macros for Common Notation
**Identified**: KaTeX supports custom macros for frequently used notation.

```typescript
katex.renderToString(formula, {
  macros: {
    '\\R': '\\mathbb{R}',
    '\\N': '\\mathbb{N}',
    '\\Z': '\\mathbb{Z}',
    '\\Q': '\\mathbb{Q}',
    '\\C': '\\mathbb{C}',
  },
})
```

**Note**: Custom macros reduce repetition in content and provide consistent notation. Authors can write `\R` instead of `\mathbb{R}`.

---

### LI-007: Computed Properties Should Be Pure Functions
**Identified**: Vue computed properties should not have side effects.

**Anti-pattern**:
```typescript
const renderedHtml = computed(() => {
  try {
    return katex.renderToString(formula)
  } catch (e) {
    error.value = e.message  // Side effect! Don't do this
    return ''
  }
})
```

**Correct approach**:
```typescript
const renderResult = computed(() => {
  try {
    return { html: katex.renderToString(formula), error: null }
  } catch (e) {
    return { html: null, error: e.message }
  }
})
```

**Note**: Return an object containing both success and error states. This keeps computed properties pure and predictable.

---

### LI-008: Debounced Search Input Pattern
**Identified**: Search inputs should debounce user input to avoid excessive filtering on every keystroke.

```typescript
const searchQuery = ref('')
const debouncedQuery = ref('')

watch(searchQuery, (newValue) => {
  clearTimeout(debounceTimeout)
  debounceTimeout = setTimeout(() => {
    debouncedQuery.value = newValue
  }, 300)
})
```

**Note**: Filter/search based on `debouncedQuery`, not `searchQuery`. This provides responsive UI feedback while avoiding performance issues.

---

### LI-009: Responsive Table/Card Pattern
**Identified**: Tables don't work well on mobile. Use a responsive pattern that shows cards on small screens.

```vue
<!-- Table for desktop -->
<table class="hidden md:table">...</table>

<!-- Cards for mobile -->
<div class="md:hidden space-y-4">
  <div v-for="item in items" class="card p-4">...</div>
</div>
```

**Note**: This pattern duplicates markup but provides optimal UX for each screen size. Consider which columns are essential for mobile cards.

---

## Phase 3 Summary

Phase 3 introduced content rendering and data organization patterns:

**Lessons Learned (LL)**:
- LL-010: Tailwind opacity modifiers don't work with CSS variables
- LL-011: ESLint v-html warnings are expected for rendered content
- LL-012: Shiki highlighter requires singleton pattern
- LL-013: Vue dynamic slot names with special characters

**Lessons Identified (LI)**:
- LI-006: KaTeX custom macros for common notation
- LI-007: Computed properties should be pure functions
- LI-008: Debounced search input pattern
- LI-009: Responsive table/card pattern

**Key Takeaways**:
1. CSS `color-mix()` is a powerful alternative when Tailwind modifiers don't work
2. Singleton patterns are essential for expensive initializations like syntax highlighters
3. Keep computed properties pure by returning objects with success/error states
4. Responsive design sometimes requires separate markup for different screen sizes

---

## Phase 4: Interactive Widgets

### LL-014: Unused Variable in Vue `defineProps`
**Issue**: When defining props with TypeScript, assigning `defineProps` to a variable that's only used in the template triggers ESLint's `@typescript-eslint/no-unused-vars` error.

**Code**:
```typescript
// Error: 'props' is assigned a value but never used
const props = defineProps<Props>()
```

**Resolution**: If props are only accessed in the template, omit the variable assignment:
```typescript
// Template can still access props directly
defineProps<Props>()
```

**Lesson**: Vue's `defineProps` makes props available to the template automatically. Only assign to a variable if you need to access props in `<script setup>` code.

---

### LL-015: URL State Sync Requires Debouncing
**Issue**: Updating URL query parameters on every keystroke creates excessive browser history entries and can cause performance issues.

**Resolution**: Implement debounced URL updates:
```typescript
watch(value, (newValue) => {
  clearTimeout(debounceTimer)
  debounceTimer = window.setTimeout(() => {
    router.replace({ query: { ...route.query, [key]: newValue } })
  }, 300)
})
```

**Lesson**: Always debounce URL state synchronization to prevent history spam. Use `router.replace` instead of `router.push` to avoid cluttering the back button history.

---

### LL-016: Encoding Special Characters in URL Parameters
**Issue**: Complex numbers like `3+4i` contain the `+` character, which has special meaning in URLs (represents a space).

**Resolution**: Use `encodeURIComponent` when setting URL parameters:
```typescript
router.replace({
  query: { [key]: encodeURIComponent(value) }
})
```

**Lesson**: Always encode URL parameter values that may contain special characters (`+`, `&`, `=`, `#`, etc.). The browser's native URL handling may not encode all characters correctly.

---

### LL-017: Number Line Auto-Zoom Calculation
**Issue**: Fixed-range number lines don't work for numbers of vastly different magnitudes (1 vs 1000000).

**Resolution**: Calculate appropriate bounds based on the number's magnitude:
```typescript
const range = computed(() => {
  const absValue = Math.abs(numericValue.value)
  if (absValue <= 10) return { min: -10, max: 10 }
  if (absValue <= 100) return { min: -100, max: 100 }
  // Scale to nearest power of 10
  const magnitude = Math.pow(10, Math.ceil(Math.log10(absValue)))
  return { min: -magnitude, max: magnitude }
})
```

**Lesson**: Visualizations need to adapt to the data they're displaying. Consider the full range of possible inputs when designing visual components.

---

### LI-010: Computed Getter/Setter for Bidirectional Binding
**Identified**: When a component needs to support both local state and external state (like URL sync), use a computed with getter/setter.

```typescript
const inputValue = computed({
  get: () => (urlState ? urlState.value.value : localValue.value),
  set: (val: string) => {
    if (urlState) {
      urlState.setValue(val)
    } else {
      localValue.value = val
    }
  },
})
```

**Note**: This pattern allows the same component to work with different state sources without conditional logic scattered throughout the component.

---

### LI-011: SVG for Data Visualizations
**Identified**: SVG is excellent for mathematical visualizations in Vue components.

**Benefits**:
- Scalable at any size (Retina displays, zoom)
- Can use Vue's reactive bindings directly
- Accessible (can add ARIA labels, titles)
- Animatable with CSS transitions
- Crisp lines and text at any scale

**Pattern**:
```vue
<svg :viewBox="`0 0 ${width} ${height}`" class="w-full">
  <line v-for="tick in ticks" :key="tick" ... />
  <circle :cx="position" :cy="center" r="8" />
</svg>
```

**Note**: Use `viewBox` for responsive sizing and calculate positions as percentages or relative units.

---

### LI-012: Example Numbers by Category
**Identified**: Providing categorized example numbers enhances widget usability and educational value.

```typescript
export const exampleNumbers = {
  natural: ['1', '7', '42', '100'],
  integers: ['-5', '0', '-42'],
  rational: ['1/2', '3/4', '-2/3', '0.5'],
  irrational: ['π', 'e', '√2', 'φ'],
  complex: ['3+4i', '2-i', 'i', '-1+0i'],
}
```

**Note**: Categorized examples help users explore edge cases and understand number classifications better.

---

### LI-013: Venn Diagram as Nested Circles
**Identified**: Mathematical set relationships (ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ ⊂ ℂ) visualize well as nested circles.

**Pattern**:
- Larger circles represent supersets
- Smaller circles (subsets) are contained within
- Highlighting shows which sets contain the current value
- Labels placed at set boundaries

**Implementation Notes**:
- Use different fill opacities for visual hierarchy
- Transition colors smoothly when value changes
- Consider color-blind accessible palettes

---

### LI-014: Primality Checking for Educational Context
**Identified**: Adding primality checking enhances the NumberTypeExplorer with additional mathematical insight.

```typescript
function isPrime(n: number): boolean {
  if (!Number.isInteger(n) || n < 2) return false
  if (n === 2) return true
  if (n % 2 === 0) return false
  for (let i = 3; i <= Math.sqrt(n); i += 2) {
    if (n % i === 0) return false
  }
  return true
}
```

**Note**: Include primality as a "bonus" property alongside standard number classification. It adds educational value without overcomplicating the main classification.

---

## Phase 4 Summary

Phase 4 introduced interactive widgets with URL state synchronization and visualizations:

**Lessons Learned (LL)**:
- LL-014: Unused variable in Vue `defineProps`
- LL-015: URL state sync requires debouncing
- LL-016: Encoding special characters in URL parameters
- LL-017: Number line auto-zoom calculation

**Lessons Identified (LI)**:
- LI-010: Computed getter/setter for bidirectional binding
- LI-011: SVG for data visualizations
- LI-012: Example numbers by category
- LI-013: Venn diagram as nested circles
- LI-014: Primality checking for educational context

**Key Takeaways**:
1. URL state synchronization needs careful handling (debouncing, encoding, replace vs push)
2. SVG is the right choice for mathematical visualizations in Vue
3. Computed getter/setter enables flexible state binding patterns
4. Visualizations should adapt to their data (auto-zoom, scaling)
5. Educational widgets benefit from curated examples and bonus insights

---

## Phase 4 Continued: UI Consistency

### LL-018: Emoji-to-Icon Migration Requires Interface Updates
**Issue**: When replacing emojis with Font Awesome icons, interface property names needed updating across multiple files.

**Context**: The navigation data used an `icon` property storing emoji strings (e.g., `icon: '🧱'`). Switching to Font Awesome required changing to `faIcon` with class strings.

**Resolution**: Update interfaces and all references systematically:
```typescript
// Before
interface NavTopic {
  icon: string  // emoji: '🧱'
}

// After
interface NavTopic {
  faIcon: string  // FA class: 'fa-solid fa-cubes'
}
```

**Files affected**:
- `navigation.ts` - interface and data
- `AppHeader.vue` - template binding
- `TopicPage.vue` - props and computed properties
- `RelatedTopics.vue` - interface and template

**Lesson**: When changing property names across interfaces, use TypeScript's compiler errors to find all usage sites. Run `npm run type-check` after each change to catch missed references.

---

### LL-019: Searching for Emojis in Codebase
**Issue**: Finding all emoji occurrences required regex patterns that match Unicode emoji ranges.

**Resolution**: Use grep with Unicode-aware patterns:
```bash
# Search for common emoji ranges
grep -rn "[\x{1F300}-\x{1F9FF}]" src/
```

**Lesson**: When auditing for specific character types (emojis, special symbols), use appropriate Unicode range patterns. Simple text search won't find all emoji variants.

---

### LI-015: Prop Naming Conventions for Icon Types
**Identified**: When a component accepts different icon types, use descriptive prop names to indicate the expected format.

**Pattern**:
```typescript
// Ambiguous - what format?
icon?: string

// Clear - indicates Font Awesome class expected
faIcon?: string

// Alternative patterns
iconClass?: string      // CSS class name
iconEmoji?: string      // Emoji character
iconSvg?: string        // SVG path/content
```

**Note**: Prefixing with the icon system name (`fa` for Font Awesome) makes the expected format immediately clear to component users.

---

### LI-016: Consistent Collapsible Nesting
**Identified**: Content pages benefit from a two-level collapsible hierarchy: sections and code examples.

**Pattern**:
```vue
<ContentSection title="Topic" collapsible>
  <p>Prose content (visible when section expanded)</p>
  <CodeExample :code="code" collapsible />
</ContentSection>
```

**Benefits**:
- Users can expand a section to read prose without seeing code
- Code can be expanded separately when needed
- Reduces visual noise while maintaining access to all content
- Consistent UX across all topic pages

**Note**: Not all CodeExamples need to be collapsible. Short inline snippets (< 10 lines) may be better always visible.

---

## Phase 4 Continued Summary

**Lessons Learned (LL)**:
- LL-018: Emoji-to-icon migration requires interface updates
- LL-019: Searching for emojis in codebase

**Lessons Identified (LI)**:
- LI-015: Prop naming conventions for icon types
- LI-016: Consistent collapsible nesting

**Key Takeaways**:
1. Property name changes ripple through interfaces, components, and templates - use TypeScript to catch all sites
2. Unicode-aware grep patterns are needed for finding emojis and special characters
3. Clear naming conventions (like `faIcon` vs `icon`) prevent confusion about expected formats
4. Two-level collapsible hierarchy (section + code) provides good progressive disclosure

---

## Phase 5: Algebra Section & Summation Widget

### LL-020: Vue Reactivity Transform Not Enabled by Default
**Issue**: Using `$computed` instead of `computed` caused runtime errors because Vue's reactivity transform is not enabled by default.

**Code**:
```typescript
// Error: $computed is not defined
const selectedName = $computed(() => presets.find(p => p.id === modelValue)?.name)
```

**Resolution**: Use standard `computed` from Vue imports:
```typescript
import { computed } from 'vue'
const selectedName = computed(() => presets.find(p => p.id === modelValue)?.name)
```

**Lesson**: Vue's reactivity transform (`$ref`, `$computed`) is an opt-in feature requiring explicit configuration. Stick to standard `ref()` and `computed()` unless the project has enabled the transform.

---

### LL-021: TypeScript Array Access Returns Possibly Undefined
**Issue**: When accessing array elements by index, TypeScript's strict mode considers the result potentially undefined, even after length checks.

**Code**:
```typescript
// Error: Object is possibly 'undefined'
const bar = bars[hoveredBar]
const x = bar.x  // TS error
```

**Resolution**: Use optional chaining and nullish coalescing:
```typescript
const x = bars[hoveredBar]?.x ?? 0
const y = bars[hoveredBar]?.y ?? 0
```

**Lesson**: TypeScript doesn't narrow array element types based on index bounds checks. Always use optional chaining (`?.`) when accessing array elements by dynamic index.

---

### LL-022: Unused Imports Caught by ESLint
**Issue**: Importing `watch` from Vue but never using it triggered ESLint's `@typescript-eslint/no-unused-vars` error.

**Resolution**: Remove unused imports:
```typescript
// Before
import { ref, computed, watch, onMounted } from 'vue'

// After (watch removed)
import { ref, computed, onMounted } from 'vue'
```

**Lesson**: Clean up imports after refactoring. ESLint catches unused imports, but it's better to remove them proactively to keep code clean.

---

### LL-023: URL State Computed Getter/Setter Pattern
**Issue**: Supporting both local state and URL-synced state in the same component required conditional logic.

**Resolution**: Use computed getter/setter that delegates to the appropriate source:
```typescript
const preset = computed({
  get: () => {
    if (presetUrlState) {
      return presetUrlState.value.value as SummationPresetId
    }
    return localPreset.value
  },
  set: (val: SummationPresetId) => {
    if (presetUrlState) {
      presetUrlState.setValue(val)
    } else {
      localPreset.value = val
    }
  },
})
```

**Lesson**: Computed getter/setter is a powerful pattern for abstracting state source. Components can use `v-model` without knowing whether state is local or URL-synced.

---

### LI-017: Preset Data as Single Source of Truth
**Identified**: Creating a comprehensive preset data structure enables multiple features from one definition.

**Pattern**:
```typescript
interface SummationPreset {
  id: SummationPresetId
  name: string
  expressionLatex: string
  expressionPython: string
  closedFormLatex: string | null
  evaluate: (i: number) => number
  closedForm: ((n: number) => number) | null
}
```

**Benefits**:
- PresetSelector uses `name` for dropdown
- SummationCodeParallel uses `expressionLatex` and `expressionPython`
- FormulaComparison uses `closedFormLatex` and `closedForm`
- SummationResult uses `evaluate` for calculation

**Note**: Rich preset objects eliminate prop drilling and ensure consistency.

---

### LI-018: SVG Running Total Line Overlay
**Identified**: Overlaying a running total line on a bar chart enhances educational value.

**Implementation**:
```typescript
const runningTotalPath = computed(() => {
  let total = 0
  const points: string[] = [`M ${startX} ${baseY}`]

  for (let i = 0; i < terms.length; i++) {
    total += terms[i]
    const x = barX(i) + barWidth / 2
    const y = scaleY(total)
    points.push(`L ${x} ${y}`)
  }

  return points.join(' ')
})
```

**Note**: The path builds incrementally, showing how the total grows. Use `stroke-linecap="round"` for smooth line joins.

---

### LI-019: Animation Timer Cleanup
**Identified**: Components with `setTimeout` animations need cleanup to prevent memory leaks.

**Pattern**:
```typescript
const animationTimer = ref<ReturnType<typeof setTimeout> | null>(null)

function startAnimation() {
  const animateNext = () => {
    if (visibleBars.value < terms.length) {
      visibleBars.value++
      animationTimer.value = setTimeout(animateNext, 200)
    }
  }
  animateNext()
}

function cleanup() {
  if (animationTimer.value) {
    clearTimeout(animationTimer.value)
  }
}

// In template: @vue:unmounted="cleanup"
```

**Note**: Always clear timers on unmount. Consider also clearing when props change (terms array).

---

### LI-020: Formula Substitution for Educational Display
**Identified**: Showing formulas with actual values substituted helps users understand the calculation.

**Pattern**:
```typescript
// General formula
const formula = "\\frac{n(n+1)}{2}"

// Substituted formula
const substituted = formula.replace(/n/g, n.toString())
// Result: "\\frac{10(10+1)}{2}"
```

**Note**: Simple string replacement works for basic formulas. More complex formulas might need a proper template system.

---

### LI-021: O(n) vs O(1) Educational Comparison
**Identified**: Explicitly comparing loop iterations vs formula calculations makes complexity tangible.

**Pattern**:
```vue
<div class="comparison">
  <div>Loop: {{ n }} iterations (O(n) time)</div>
  <div>Formula: 1 calculation (O(1) time)</div>
  <p>For n = 1,000,000: loop needs 1,000,000 additions!</p>
</div>
```

**Note**: Concrete examples (n = 1,000,000) are more impactful than abstract big-O notation alone.

---

## Phase 5 Summary

Phase 5 introduced the Algebra section with the flagship SummationExplorer widget:

**Lessons Learned (LL)**:
- LL-020: Vue reactivity transform not enabled by default
- LL-021: TypeScript array access returns possibly undefined
- LL-022: Unused imports caught by ESLint
- LL-023: URL state computed getter/setter pattern

**Lessons Identified (LI)**:
- LI-017: Preset data as single source of truth
- LI-018: SVG running total line overlay
- LI-019: Animation timer cleanup
- LI-020: Formula substitution for educational display
- LI-021: O(n) vs O(1) educational comparison

**Key Takeaways**:
1. Rich data structures (presets) enable multiple features from one source
2. Computed getter/setter abstracts state source (local vs URL)
3. SVG overlays (running total line) enhance visualization
4. Always clean up timers and animations on component unmount
5. Concrete examples (n = 1,000,000) make abstract concepts tangible

---

## Phase 6: Basics Completion + E2E Testing

### LL-024: Mathematical Set Membership - ℝ ⊂ ℂ
**Issue**: Number classification tests failed because natural numbers were not marked as belonging to ℂ (complex numbers).

**Context**: Initially, `isComplex` was `false` for real numbers. But mathematically, all real numbers are complex numbers with imaginary part 0: ℕ ⊂ ℤ ⊂ ℚ ⊂ ℝ ⊂ ℂ.

**Resolution**: Changed `numberClassification.ts` to set `isComplex: true` for all real numbers:
```typescript
return {
  isNatural,
  isInteger,
  isRational: true,
  isReal: true,
  isComplex: true, // All real numbers are complex (with imaginary part = 0)
  // ...
}
```

**Follow-up Issue**: After this fix, `generatePythonCode` was generating complex number code for all inputs since it checked `isComplex`. Fixed by checking for actual imaginary part:
```typescript
const hasImaginaryPart = parsed.parsedImaginary !== undefined && parsed.parsedImaginary !== 0
if (hasImaginaryPart) {
  // Generate complex number code
}
```

**Lesson**: Mathematical correctness matters. When implementing set theory, ensure subset relationships are properly reflected (ℝ ⊂ ℂ means all real numbers are complex).

---

### LL-025: Playwright Test Selector Specificity
**Issue**: Test selector `button:has-text("42")` matched multiple buttons ("42" and "1.41421...").

**Resolution**: Use `getByRole` with `exact: true` for precise matching:
```typescript
// Before (matched multiple buttons)
await page.locator('button:has-text("42")').click()

// After (exact match)
await page.getByRole('button', { name: '42', exact: true }).click()
```

**Lesson**: E2E test selectors should be as specific as possible. Use `exact: true` when matching text that could be a substring of other elements.

---

### LL-026: WCAG Color Contrast Requirements
**Issue**: Accessibility audit failed because `text-text-muted` on `bg-border` had a contrast ratio of 3.9:1 (WCAG AA requires 4.5:1 for normal text).

**Context**: The language badge in `CodeExample.vue` used `text-text-muted` which is a lighter gray designed for less important text.

**Resolution**: Changed to `text-text-secondary` which has a darker color and meets contrast requirements:
```vue
<!-- Before (3.9:1 contrast - fails WCAG AA) -->
<span class="text-xs px-1.5 py-0.5 rounded bg-border text-text-muted">

<!-- After (4.5:1+ contrast - passes WCAG AA) -->
<span class="text-xs px-1.5 py-0.5 rounded bg-border text-text-secondary">
```

**Lesson**: Always verify color contrast ratios when using muted/lighter text colors. Use tools like axe-core in automated tests to catch these issues early.

---

### LL-027: JavaScript Template Literal Escaping in Vue
**Issue**: Python f-string `${A:.2f}` in a template literal caused a syntax error because `${}` is JavaScript template literal syntax.

**Code**:
```typescript
// Error: Unexpected token in template literal
const code = `print(f"Future value: ${A:.2f}")`
```

**Resolution**: Escape the dollar sign with backslash:
```typescript
const code = `print(f"Future value: \${A:.2f}")`
```

**Lesson**: When including Python f-strings (or any `${}` syntax) in JavaScript template literals, escape the dollar sign to prevent JavaScript from interpreting it.

---

### LL-028: TypeScript Strict Array Access with Find
**Issue**: `array.find()` returns `T | undefined`, but component logic expected a guaranteed result.

**Code**:
```typescript
// Error: Object is possibly 'undefined'
const selectedPreset = computed(() => presets.find(p => p.id === id.value))
// Using selectedPreset.value.name fails
```

**Resolution**: Use non-null assertion with fallback when array is known non-empty:
```typescript
const selectedPreset = computed((): FunctionPreset => {
  return presets.find(p => p.id === id.value) ?? presets[0]!
})
```

**Lesson**: When using `find()` on a known non-empty array with a guaranteed match, use explicit return types and the `??` operator with non-null assertion for the fallback.

---

### LI-022: Axe-Core Integration for Automated Accessibility Testing
**Identified**: `@axe-core/playwright` enables automated WCAG compliance testing in E2E tests.

**Pattern**:
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

**Benefits**:
- Catches color contrast issues, missing labels, focus management problems
- Runs automatically in CI
- Tests multiple pages efficiently with loops
- Provides detailed violation reports

**Note**: Test pages after full load (`networkidle`) to ensure dynamically rendered content is evaluated.

---

### LI-023: Data-Testid Attributes for E2E Testing
**Identified**: Adding `data-testid` attributes to key interactive elements improves test reliability.

**Pattern**:
```vue
<input data-testid="number-input" ... />
<button data-testid="example-42" ... />
<div data-testid="set-membership-display" ... />
```

**Benefits**:
- Decouples tests from CSS classes/structure
- Survives refactoring (class changes, element restructuring)
- Clear intent: this element is tested
- Doesn't affect production behavior

**Note**: Add to interactive elements (inputs, buttons) and key display areas that tests need to verify.

---

### LI-024: Preset-Based Widget Pattern
**Identified**: Widgets with a fixed set of options work well with a preset-based architecture.

**Pattern**:
```typescript
interface FunctionPreset {
  id: string
  name: string
  latex: string
  python: string
  evaluate: (x: number) => number
}

const presets: FunctionPreset[] = [
  { id: 'linear', name: 'Linear', latex: '2x + 3', python: '2*x + 3', evaluate: x => 2*x + 3 },
  // ...
]
```

**Benefits**:
- Type-safe: each preset has all required fields
- Single source of truth for display and evaluation
- Easy to add new presets
- Safer than user-defined expressions (no parsing/eval)

**Note**: Used in both SimpleFunctionDemo and SummationExplorer widgets.

---

### LI-025: Keyboard Navigation Testing Pattern
**Identified**: E2E tests should verify keyboard accessibility for interactive widgets.

**Pattern**:
```typescript
test('keyboard navigation works', async ({ page }) => {
  // Focus the input
  await page.locator('[data-testid="input"]').focus()

  // Tab to next element
  await page.keyboard.press('Tab')

  // Verify focus moved to expected element
  const focused = page.locator(':focus')
  await expect(focused).toHaveAttribute('data-testid', 'expected-element')

  // Test Enter key activation
  await page.keyboard.press('Enter')
  await expect(/* result */).toBeVisible()
})
```

**Note**: Focus management and keyboard operability are critical for accessibility.

---

## Phase 6 Summary

Phase 6 completed the Basics section and added comprehensive E2E testing infrastructure:

**Lessons Learned (LL)**:
- LL-024: Mathematical set membership - ℝ ⊂ ℂ
- LL-025: Playwright test selector specificity
- LL-026: WCAG color contrast requirements
- LL-027: JavaScript template literal escaping in Vue
- LL-028: TypeScript strict array access with Find

**Lessons Identified (LI)**:
- LI-022: Axe-Core integration for automated accessibility testing
- LI-023: Data-testid attributes for E2E testing
- LI-024: Preset-based widget pattern
- LI-025: Keyboard navigation testing pattern

**Key Takeaways**:
1. Mathematical correctness matters - verify subset relationships (ℝ ⊂ ℂ)
2. Automated accessibility testing catches issues early (color contrast, focus management)
3. `data-testid` attributes make tests resilient to refactoring
4. Escape `${}` when including Python f-strings in JS template literals
5. Use `exact: true` in Playwright selectors to avoid partial matches
6. Preset-based widgets are safer and more maintainable than arbitrary expression input

---

## Phase 7: Quadratics & Visual Regression

### LL-029: Visual Regression Test Baseline Strategy
**Issue**: Adding visual regression tests to an existing project required careful consideration of when to capture baselines.

**Resolution**: Capture baselines before adding new visual components to establish a known-good state. This allows detecting unintended regressions in existing UI while developing new features.

**Lesson**: Visual regression tests work best when baselines are captured at stable points. Run baseline updates only when visual changes are intentional.

---

### LL-030: SVG Coordinate System Origin Handling
**Issue**: Mathematical coordinate systems place origin at center or bottom-left, but SVG's origin is top-left with y increasing downward.

**Resolution**: Create transformation functions that map mathematical coordinates to SVG coordinates:
```typescript
const svgY = (mathY: number) => viewHeight - ((mathY - yMin) / (yMax - yMin)) * viewHeight
```

**Lesson**: When building mathematical visualizations in SVG, always create explicit coordinate transformation utilities. This centralizes the math↔SVG conversion logic.

---

### LI-026: Reusable Coordinate System Components
**Identified**: Breaking the coordinate system into discrete components improves reusability.

**Pattern**:
```
CoordinateSystem (container with axes, grid, labels)
├── PlotCurve (render function as SVG path)
├── PlotPoint (render labeled point)
└── PlotLine (render vertical/horizontal lines)
```

**Benefits**:
- Each component has single responsibility
- Can compose different visualization types
- Consistent styling across all graphs
- Easy to add new plot types (area, scatter, etc.)

---

### LI-027: Quadratic Form Display Pattern
**Identified**: Showing multiple equivalent forms of equations enhances understanding.

**Pattern**:
```typescript
// Standard form: ax² + bx + c
// Vertex form: a(x - h)² + k
// Factored form: a(x - r₁)(x - r₂)
```

**Benefits**:
- Shows same equation from different perspectives
- Vertex form highlights the vertex directly
- Factored form shows roots directly
- Demonstrates mathematical equivalence

---

### LI-028: Real-World Presets with Context
**Identified**: Mathematical widgets benefit from real-world application presets with explanatory context.

**Pattern**:
```typescript
{
  id: 'projectile',
  name: 'Projectile Motion',
  coefficients: { a: -4.9, b: 20, c: 1.5 },
  context: 'Models a ball thrown upward at 20 m/s from 1.5m height',
  realWorld: true
}
```

**Benefits**:
- Connects abstract math to tangible applications
- Explains why coefficients have specific values
- Reinforces practical relevance of mathematics

---

## Phase 7 Summary

**Lessons Learned (LL)**:
- LL-029: Visual regression test baseline strategy
- LL-030: SVG coordinate system origin handling

**Lessons Identified (LI)**:
- LI-026: Reusable coordinate system components
- LI-027: Quadratic form display pattern
- LI-028: Real-world presets with context

**Key Takeaways**:
1. Visual regression tests need baselines captured at stable points
2. SVG coordinate transformations should be centralized in utility functions
3. Component composition enables flexible visualization building
4. Multiple equation forms enhance mathematical understanding
5. Real-world presets with context connect math to applications

---

## Phase 8: Exponentials & Logarithms

### LL-031: Locale-Dependent Number Formatting in Tests
**Issue**: Tests for `formatExponentialNumber` failed because number formatting depends on system locale. Expected `'1,000'` but received `'1.000'` (European locale uses period as thousands separator).

**Code**:
```typescript
// Failed on some systems
expect(formatExponentialNumber(1000)).toBe('1,000')
```

**Resolution**: Use regex patterns that accept either separator:
```typescript
expect(formatExponentialNumber(1000)).toMatch(/1[,.]000/)
expect(formatExponentialNumber(Math.PI)).toMatch(/3[,.]142/)
```

**Lesson**: When testing formatted number output, account for locale differences. Use flexible assertions (regex) or normalize the output before comparing.

---

### LL-032: TypeScript Array Access After Length Check
**Issue**: Even after checking array length, TypeScript considers array element access as potentially undefined.

**Code**:
```typescript
const points = generateExponentialPoints(2, 0, 5)
expect(points.length).toBeGreaterThan(0)
const lastPoint = points[points.length - 1]
expect(lastPoint.y).toBe(32) // Error: 'lastPoint' is possibly 'undefined'
```

**Resolution**: Add explicit existence check before accessing properties:
```typescript
const lastPoint = points[points.length - 1]
expect(lastPoint).toBeDefined()
expect(lastPoint!.y).toBe(32)
```

**Lesson**: TypeScript's strict mode doesn't narrow array element types based on length checks. Use explicit `toBeDefined()` assertions followed by non-null assertion (`!`) for cleaner test code.

---

### LL-033: Unused Props Variable in Vue Components
**Issue**: Assigning `defineProps` to a variable that's only used in the template triggers ESLint's unused variable warning.

**Code**:
```typescript
// Warning: 'props' is assigned but never used
const props = defineProps<Props>()
```

**Resolution**: If props are only accessed in the template, omit the variable:
```typescript
defineProps<Props>()
```

**Lesson**: Vue's `defineProps` automatically exposes props to the template. Only assign to a variable when props need to be accessed in `<script setup>` code.

---

### LI-029: Tabbed Widget Interface Pattern
**Identified**: Complex widgets with multiple distinct features benefit from a tabbed interface.

**Pattern**:
```typescript
type ExplorerTab = 'function' | 'complexity'

// URL sync: ?tab=function or ?tab=complexity
const activeTab = ref<ExplorerTab>('function')
```

**Benefits**:
- Separates distinct use cases into focused views
- Reduces visual clutter
- URL state enables deep linking to specific tabs
- Each tab can have its own state subset

**Example**: ExponentialExplorer separates function graphing from complexity comparison.

---

### LI-030: Complexity Comparison Visualization
**Identified**: Showing multiple complexity classes on a single graph with a slider for n effectively demonstrates algorithmic scaling.

**Implementation**:
```typescript
const complexityClasses = ['constant', 'logarithmic', 'linear', 'linearithmic', 'quadratic', 'exponential']

// Each class has: function, label, color, examples
complexityFunctions: Record<ComplexityClass, (n: number) => number>
complexityLabels: Record<ComplexityClass, string>  // O(1), O(log n), etc.
complexityColors: Record<ComplexityClass, string>  // Distinct colors
complexityExamples: Record<ComplexityClass, string[]>  // Algorithm examples
```

**Benefits**:
- Visual comparison makes abstract complexity tangible
- Slider shows how differences grow with n
- Color coding aids quick identification
- Real algorithm examples provide context

---

### LI-031: Growth/Decay Analysis as Computed Properties
**Identified**: Analyzing exponential function characteristics (growth vs decay, doubling time, half-life) as computed properties enables reactive display.

**Pattern**:
```typescript
const growthDecay = computed(() => analyzeGrowthDecay(base.value))

// Returns:
{
  type: 'growth' | 'decay',
  doublingTime: number | null,  // For growth (base > 1)
  halfLife: number | null,      // For decay (0 < base < 1)
  percentChangePerUnit: number  // (base - 1) * 100
}
```

**Benefits**:
- Automatically updates when base changes
- Encapsulates complex analysis logic
- Consistent calculations across components

---

### LI-032: Base Validation for Exponential Functions
**Identified**: Exponential and logarithm functions have specific domain restrictions that require validation.

**Validation Rules**:
```typescript
// Exponential base: must be positive, not 1
function isValidExponentialBase(base: number): boolean {
  return base > 0 && base !== 1 && Number.isFinite(base)
}

// Logarithm input: must be positive
function isValidLogarithmInput(value: number): boolean {
  return value > 0 && Number.isFinite(value)
}
```

**Why base ≠ 1**: f(x) = 1^x = 1 for all x, making it a constant function (not exponential).

**Lesson**: Mathematical functions have domain restrictions. Validate inputs and provide clear error messages.

---

## Phase 8 Summary

**Lessons Learned (LL)**:
- LL-031: Locale-dependent number formatting in tests
- LL-032: TypeScript array access after length check
- LL-033: Unused props variable in Vue components

**Lessons Identified (LI)**:
- LI-029: Tabbed widget interface pattern
- LI-030: Complexity comparison visualization
- LI-031: Growth/decay analysis as computed properties
- LI-032: Base validation for exponential functions

**Key Takeaways**:
1. Number formatting tests should be locale-agnostic (use regex or normalization)
2. TypeScript strict mode requires explicit undefined checks even after length validation
3. Tabbed interfaces effectively separate distinct widget features
4. Complexity visualization makes algorithm analysis tangible for programmers
5. Mathematical domain restrictions (base > 0, base ≠ 1) require explicit validation
6. Growth/decay characteristics (doubling time, half-life) are natural computed properties

---

## Phase 9: Trigonometry + Testing Refinement

### LL-034: E2E Test Data-Testid Mismatches
**Issue**: E2E tests failed because test selectors used different data-testid values than what was implemented in the components.

**Examples**:
- Test used `unit-radians` but component had `unit-toggle-radians`
- Test used `show-more-angles` but component had `special-angles-more`
- Test used `sin-value` but component had `trig-value-sin`

**Resolution**: Updated all E2E test selectors to match actual component data-testid attributes. Required careful audit of both test files and component templates.

**Lesson**: When writing E2E tests, verify data-testid values against actual component implementations. Consider generating a data-testid inventory or using a consistent naming convention documented upfront.

---

### LL-035: Unused Props Variable Warning in Vue 3 Composition API
**Issue**: ESLint flagged `const props = defineProps<Props>()` as unused when props were only accessed in the template.

**Code**:
```typescript
// Warning: 'props' is assigned but never used
const props = defineProps<Props>()
```

**Resolution**: Remove the variable assignment when props are only used in templates:
```typescript
defineProps<Props>()
```

**Lesson**: Vue 3's `defineProps` macro automatically exposes props to the template. Only assign to a variable when you need to access props in `<script setup>` logic. This was encountered in multiple components (AngleControls.vue, TrigValuesDisplay.vue).

---

### LL-036: Unused Variable in Computed Properties
**Issue**: ESLint flagged a variable (`startAngle`) that was declared but never used in a computed property.

**Code**:
```typescript
const startAngle = 0  // Unused
const arcPath = computed(() => {
  // startAngle was meant to be used but wasn't
})
```

**Resolution**: Remove unused variables or use them where intended.

**Lesson**: Complex SVG path calculations can accumulate unused variables during development. Clean up after implementation is complete.

---

### LI-033: Composable Pattern for Complex Widget State
**Identified**: Creating a dedicated composable (like `useUnitCircle`) for complex widget state management improves code organization.

**Pattern**:
```typescript
export function useUnitCircle(options: UseUnitCircleOptions = {}) {
  // State
  const angle = ref(options.initialAngle ?? 45)
  const unit = ref<AngleUnit>(options.initialUnit ?? 'degrees')

  // Computed values derived from state
  const trigValues = computed(() => calculateTrigValues(angle.value))
  const quadrant = computed(() => getQuadrant(angle.value))

  // Methods
  const setAngle = (degrees: number) => { ... }

  // Optional URL sync
  if (options.syncUrl) { ... }

  return { angle, unit, trigValues, quadrant, setAngle, ... }
}
```

**Benefits**:
- Separates state logic from presentation
- Composable can be unit tested independently
- Supports optional features (URL sync) via options
- Reusable if widget appears in multiple contexts

---

### LI-034: SVG Arc Path for Angular Visualization
**Identified**: Drawing arcs in SVG requires the arc command in path data.

**Pattern**:
```typescript
const arcPath = computed(() => {
  const radius = 30
  const endAngle = -(angle.value * Math.PI) / 180  // Negate for SVG coords
  const endX = center + radius * Math.cos(endAngle)
  const endY = center - radius * Math.sin(endAngle)  // Subtract for SVG y-flip
  const largeArc = angle.value > 180 ? 1 : 0

  return `M ${center + radius} ${center} A ${radius} ${radius} 0 ${largeArc} 0 ${endX} ${endY}`
})
```

**Key Points**:
- SVG y-axis is inverted (positive y goes down)
- Large-arc flag determines which arc to draw when angle > 180°
- Sweep flag determines clockwise vs counter-clockwise

---

### LI-035: Special Angle Data Structure with Exact Values
**Identified**: Storing exact trigonometric values as strings enables display of mathematical expressions.

**Pattern**:
```typescript
interface SpecialAngle {
  degrees: number
  radians: { numerator: number; denominator: number; symbolic: string }
  exact: { sin: string; cos: string; tan: string }
}

const specialAngles: SpecialAngle[] = [
  { degrees: 45, radians: { numerator: 1, denominator: 4, symbolic: 'π/4' },
    exact: { sin: '√2/2', cos: '√2/2', tan: '1' } },
  // ...
]
```

**Benefits**:
- Display exact values (√2/2) instead of decimals (0.7071)
- Symbolic radian display (π/4) instead of numeric (0.7854)
- Single source of truth for all special angle data

---

### LI-036: Tiered CI Workflow for Performance
**Identified**: Running full E2E tests on every push is slow and expensive. Tiering tests improves developer experience.

**Pattern**:
```yaml
jobs:
  quick-check:  # Always runs: type-check, lint, unit tests, build
    if: always()

  full-test:    # Only on PRs: E2E functional, accessibility
    if: github.event_name == 'pull_request'
```

**Benefits**:
- Fast feedback on routine commits (< 2 minutes)
- Comprehensive testing before merge
- Reduced CI costs and queue times

---

### LI-037: Test Tag System with Grep
**Identified**: Using grep patterns in test names enables flexible test filtering.

**Pattern**:
```typescript
// In test files
test.describe('Widget Tests @e2e', () => { ... })
test.describe('Accessibility Audits @a11y', () => { ... })
test.describe('Visual Regression @visual', () => { ... })

// In package.json scripts
"test:e2e": "playwright test --grep-invert @visual",
"test:a11y": "playwright test --grep @a11y",
"test:visual": "playwright test --grep @visual"
```

**Benefits**:
- Run specific test categories easily
- Self-documenting test organization
- Works with Playwright's built-in grep functionality

---

## Phase 9 Summary

**Lessons Learned (LL)**:
- LL-034: E2E test data-testid mismatches
- LL-035: Unused props variable warning in Vue 3
- LL-036: Unused variable in computed properties

**Lessons Identified (LI)**:
- LI-033: Composable pattern for complex widget state
- LI-034: SVG arc path for angular visualization
- LI-035: Special angle data structure with exact values
- LI-036: Tiered CI workflow for performance
- LI-037: Test tag system with grep

**Key Takeaways**:
1. Verify data-testid values match between tests and components before running E2E tests
2. Only assign `defineProps()` to a variable when props are used in script logic
3. Composables effectively encapsulate complex widget state and optional features
4. SVG arcs require careful coordinate transformation (y-axis inversion)
5. Exact values as strings enable mathematical display (√2/2 vs 0.7071)
6. Tiered CI (quick on push, full on PR) balances speed and thoroughness
7. Test tags (@e2e, @a11y, @visual) enable flexible test filtering

---

## Phase 10: Statistics Foundation

### LL-037: Linear Interpolation for Quartile Calculation
**Issue**: Quartile calculation tests failed because there are multiple valid methods for calculating percentiles, and our implementation uses linear interpolation.

**Context**: Different statistical software uses different methods for quartile calculation. Our implementation uses the linear interpolation method:
```typescript
const sortedIndex = (percentile / 100) * (sorted.length - 1)
const lowerIndex = Math.floor(sortedIndex)
const fraction = sortedIndex - lowerIndex
return sorted[lowerIndex]! + fraction * (sorted[upperIndex]! - sorted[lowerIndex]!)
```

**Resolution**: Adjusted test expectations to match the linear interpolation method rather than the exclusive/inclusive quartile methods.

**Lesson**: When implementing statistical functions, document which method you're using and ensure tests match that specific method.

---

### LL-038: WCAG Color Contrast - Green-600 vs Green-700
**Issue**: Accessibility audit failed because Tailwind's `text-green-600` (#16a34a) has insufficient contrast (3.29:1) against white background. WCAG AA requires 4.5:1 for normal text.

**Resolution**: Changed to `text-green-700` (#15803d) which achieves 4.61:1 contrast ratio:
```vue
<!-- Before (fails WCAG AA) -->
<td class="text-green-600 dark:text-green-400">Yes</td>

<!-- After (passes WCAG AA) -->
<td class="text-green-700 dark:text-green-400">Yes</td>
```

**Lesson**: Always verify color contrast ratios when using colored text. Tailwind's 600-weight colors often fail WCAG AA; 700-weight colors are generally safer. Use automated accessibility testing to catch these issues early.

---

### LL-039: SVG Line Elements Visibility in Playwright
**Issue**: Playwright's `toBeVisible()` assertion failed for SVG `<line>` elements even though they were rendered correctly in the browser.

**Context**: The boxplot median line element existed and was visible to users, but Playwright reported it as "hidden".

**Resolution**: Use `toHaveCount(1)` instead of `toBeVisible()` for SVG line elements:
```typescript
// Before (fails for SVG lines)
await expect(page.locator('[data-testid="boxplot-median"]')).toBeVisible()

// After (works reliably)
await expect(page.locator('[data-testid="boxplot-median"]')).toHaveCount(1)
```

**Lesson**: Some SVG elements may not pass Playwright's visibility checks due to how SVG visibility is computed. Use existence checks (`toHaveCount`) when visibility checks fail unexpectedly.

---

### LI-038: Composable Pattern for Statistics State
**Identified**: Creating `useStatistics` composable follows the established pattern for complex widget state management.

**Pattern**:
```typescript
export function useStatistics(options: UseStatisticsOptions = {}) {
  // State
  const selectedDataset = ref(options.initialDataset ?? 'test-scores')
  const binCount = ref(options.initialBinCount ?? 10)

  // Computed
  const statistics = computed(() => calculateFullStatistics(currentData.value))
  const histogramData = computed(() => generateHistogramBins(currentData.value, binCount.value))

  // URL sync
  if (options.syncUrl) {
    watch([selectedDataset, binCount], updateUrl)
  }

  return { selectedDataset, binCount, statistics, histogramData, ... }
}
```

**Benefits**:
- Encapsulates all statistics state and derived computations
- Optional URL sync for shareable links
- Reusable across multiple contexts
- Testable independently of components

---

### LI-039: Panel-Based Component Architecture
**Identified**: Organizing statistics display into category-specific panels improves code organization and user experience.

**Pattern**:
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

**Benefits**:
- Each panel has single responsibility
- Clear visual organization for users
- Easy to add/remove panels
- Independent styling and layout per category
- Components can be reused in other contexts

---

### LI-040: Use toHaveCount for SVG Element Assertions
**Identified**: When Playwright's `toBeVisible()` fails for SVG elements, `toHaveCount(1)` provides a reliable alternative.

**Pattern**:
```typescript
// For SVG elements that may report as "hidden"
await expect(page.locator('[data-testid="svg-element"]')).toHaveCount(1)

// For regular DOM elements, toBeVisible() still works
await expect(page.locator('[data-testid="dom-element"]')).toBeVisible()
```

**When to use**:
- SVG `<line>` elements (no fill area)
- SVG `<path>` elements with stroke only
- Any SVG element where Playwright visibility check fails unexpectedly

---

## Phase 10 Summary

**Lessons Learned (LL)**:
- LL-037: Linear interpolation for quartile calculation
- LL-038: WCAG color contrast - green-600 vs green-700
- LL-039: SVG line elements visibility in Playwright

**Lessons Identified (LI)**:
- LI-038: Composable pattern for statistics state
- LI-039: Panel-based component architecture
- LI-040: Use toHaveCount for SVG element assertions

**Key Takeaways**:
1. Statistical functions have multiple valid implementations - document and test against the specific method used
2. Tailwind's green-600 fails WCAG AA contrast; green-700 passes
3. SVG elements may not pass Playwright visibility checks - use toHaveCount as alternative
4. Composable pattern continues to be effective for complex widget state
5. Panel-based architecture provides clean separation for different data categories

---

## Post-Phase 10: Algebra Expansion

### LL-040: Vue Template Literals vs Python F-Strings
**Issue**: Python f-string syntax `${variable}` conflicts with JavaScript template literal interpolation in Vue components.

**Code**:
```typescript
// Error: Vue interprets ${final} as JavaScript template interpolation
const code = `print(f"Final: ${final:.2f}")`
```

**Resolution**: Remove the extraneous `$` - Python f-strings use `{var}` not `${var}`:
```typescript
// Correct Python f-string syntax
const code = `print(f"Final: {final:.2f}")`
```

**Lesson**: When writing Python code in JavaScript template literals, remember that Python f-strings use `{var}` syntax, not `${var}`. The `$` prefix is JavaScript-specific.

---

### LL-041: HTML Entities Required for Comparison Operators in Vue Templates
**Issue**: Using `< 0` in Vue template text content caused ESLint parsing errors because the parser interpreted `<` as the start of an HTML tag.

**Code**:
```vue
<!-- Error: Parsing error - unexpected character '0' -->
<li>• m < 0: line goes down ↘</li>
```

**Resolution**: Use HTML entities for comparison operators:
```vue
<!-- Works correctly -->
<li>• m &lt; 0: line goes down ↘</li>
<li>• m &gt; 0: line goes up ↗</li>
```

**Lesson**: When displaying mathematical comparisons in Vue template text content, use HTML entities (`&lt;`, `&gt;`) to avoid parser confusion with HTML tags.

---

### LL-042: MathBlock Formula with Dynamic Template Strings
**Issue**: Complex template strings in `:formula` attributes caused Vue template parsing errors.

**Code**:
```vue
<!-- Error: Vue can't parse this complex expression -->
<MathBlock :formula="`\\prod_{i=${startValue}}^{${endValue}} ${formulaLatex}`" display />
```

**Resolution**: Move formula construction to a computed property:
```typescript
const fullFormula = computed(() => {
  return `\\prod_{i=${startValue.value}}^{${endValue.value}} ${formulaLatex.value}`
})
```
```vue
<MathBlock :formula="fullFormula" display />
```

**Lesson**: For complex dynamic formulas, use computed properties instead of inline template expressions. This improves readability and avoids parser issues.

---

### LI-041: Computed Properties for Dynamic Formula Display
**Identified**: Using computed properties for MathBlock formulas provides cleaner code organization.

**Pattern**:
```typescript
// Define formula as computed property
const fullFormula = computed(() => {
  const latex = getPresetLatex(currentPreset.value)
  return `\\prod_{i=${start.value}}^{${end.value}} ${latex}`
})

// Use in template
<MathBlock :formula="fullFormula" display />
```

**Benefits**:
- Separates logic from template
- Easier to debug and test
- Avoids template parsing issues
- Can include complex conditional logic

---

### LI-042: Related Topics Cross-Linking Pattern
**Identified**: Consistent use of RelatedTopics component improves content discoverability and user navigation.

**Pattern**:
```typescript
const relatedTopics = [
  {
    title: 'Summation (Σ)',
    description: 'Addition-based notation',
    path: '/algebra/summation',
    unicodeIcon: 'Σ',
  },
  {
    title: 'Quadratic Functions',
    description: 'Parabolas and the quadratic formula',
    path: '/algebra/quadratics',
    faIcon: 'fa-solid fa-chart-line',
  },
]
```

**Benefits**:
- Encourages exploration of related content
- Reinforces conceptual connections
- Consistent navigation pattern across pages
- Supports both Font Awesome icons and Unicode symbols

---

### LI-043: Product Notation Utilities Pattern
**Identified**: Creating dedicated utility functions for product notation follows the established math utilities pattern.

**Pattern**:
```typescript
// Core evaluation function
export function evaluateProduct(
  expression: (i: number) => number,
  start: number,
  end: number
): ProductResult {
  if (start > end) return { product: 1, factors: [], factorCount: 0 }
  // ... iteration logic
}

// Higher-level functions built on top
export function factorial(n: number): number { ... }
export function permutations(n: number, r: number): number { ... }
export function combinations(n: number, r: number): number { ... }
```

**Benefits**:
- Core function handles edge cases (empty product = 1)
- Higher-level functions compose naturally
- Each function is testable in isolation
- Consistent with summation utilities pattern

---

## Post-Phase 10 Algebra Expansion Summary

**Lessons Learned (LL)**:
- LL-040: Vue template literals vs Python f-strings
- LL-041: HTML entities required for comparison operators in Vue templates
- LL-042: MathBlock formula with dynamic template strings

**Lessons Identified (LI)**:
- LI-041: Computed properties for dynamic formula display
- LI-042: Related topics cross-linking pattern
- LI-043: Product notation utilities pattern

**Key Takeaways**:
1. Python f-strings use `{var}`, not `${var}` - watch for this in JS template literals
2. Use HTML entities for `<` and `>` in Vue template text content
3. Move complex dynamic formulas to computed properties for cleaner code
4. RelatedTopics component improves content discoverability
5. Product notation utilities follow the same patterns as summation utilities

---

## Phase 11: Linear Algebra — Vectors

### LL-043: Floating Point Precision at Tolerance Boundary
**Issue**: Unit test for `isParallel` floating point handling failed because the test used a precision value (`1e-10`) exactly at the `VECTOR_TOLERANCE` boundary.

**Code**:
```typescript
// Failed - precision exactly at tolerance boundary
const v1: Vector2D = { x: 1, y: 2 }
const v2: Vector2D = { x: 2 + 1e-10, y: 4 + 1e-10 }
expect(isParallel(v1, v2)).toBe(true)
```

**Resolution**: Use a precision value safely within the tolerance:
```typescript
// Works - precision safely within tolerance
const v2: Vector2D = { x: 2 + 1e-12, y: 4 + 1e-12 }
```

**Lesson**: When testing floating point tolerance, use values well within the tolerance boundary, not at the exact boundary where floating point arithmetic could cause unexpected results.

---

### LL-044: ESLint Unused Variables in Composables
**Issue**: When computing results for multiple operations in a composable, intermediate calculations may not all be used in every code path.

**Code**:
```typescript
// ESLint error: 'magB' is assigned but never used
const magB = magnitude(vectorB.value)
switch (operation.value) {
  case 'magnitude':
    return { type: 'scalar', value: magA }  // magB unused!
}
```

**Resolution**: Only compute values when needed, or structure code to avoid unused assignments:
```typescript
case 'magnitude':
  return { type: 'scalar', value: magnitude(vectorA.value) }
```

**Lesson**: Be mindful of variable scope in switch statements. Compute values inside case blocks when they're only needed for that specific case.

---

### LI-044: SVG Arrow Markers for Vector Visualization
**Identified**: SVG `<marker>` elements provide reusable arrowheads for vector visualization.

**Pattern**:
```vue
<defs>
  <marker
    id="arrowhead-a"
    markerWidth="10"
    markerHeight="7"
    refX="9"
    refY="3.5"
    orient="auto"
  >
    <polygon points="0 0, 10 3.5, 0 7" fill="currentColor" />
  </marker>
</defs>

<line
  :x1="x1" :y1="y1" :x2="x2" :y2="y2"
  marker-end="url(#arrowhead-a)"
/>
```

**Benefits**:
- Arrowheads automatically orient to line direction
- Single definition, reused across multiple vectors
- `refX`/`refY` control arrow positioning relative to line endpoint
- `currentColor` inherits from parent element's color

---

### LI-045: Parallelogram Law Visualization for Vector Addition
**Identified**: Showing the parallelogram formed by two vectors and their sum enhances understanding of vector addition.

**Pattern**:
```typescript
// Draw dashed lines from vector endpoints to result
const parallelogramPath = computed(() => {
  // Line from tip of A to tip of result (parallel to B)
  // Line from tip of B to tip of result (parallel to A)
  return `M ${tipA.x} ${tipA.y} L ${result.x} ${result.y} M ${tipB.x} ${tipB.y} L ${result.x} ${result.y}`
})
```

**Benefits**:
- Visual proof that A + B = B + A (commutativity)
- Shows how the result vector is formed geometrically
- Reinforces "tip-to-tail" addition concept

---

### LI-046: Operation Result Types with Discriminated Unions
**Identified**: Using discriminated unions for operation results enables type-safe handling of different result types.

**Pattern**:
```typescript
type OperationResult =
  | { type: 'vector'; value: Vector2D }
  | { type: 'scalar'; value: number }
  | { type: 'angle'; value: number; radians: number }
  | { type: 'none' }

// Type-safe handling in template
<template v-if="result.type === 'vector'">
  ({{ result.value.x }}, {{ result.value.y }})
</template>
<template v-else-if="result.type === 'scalar'">
  {{ result.value }}
</template>
```

**Benefits**:
- TypeScript ensures all result types are handled
- Clear distinction between vector results (2D) and scalar results (single value)
- Angle results can include both degrees and radians

---

### LI-047: Relationship Badges for Mathematical Properties
**Identified**: Displaying badges for mathematical relationships (parallel, perpendicular) provides immediate visual feedback.

**Pattern**:
```vue
<span
  v-if="arePerpendicular"
  data-testid="perpendicular-badge"
  class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-purple-100 text-purple-800"
>
  ⊥ Perpendicular
</span>
```

**Benefits**:
- Immediate visual feedback on vector relationships
- Educational: highlights important mathematical properties
- Uses consistent badge styling from design system
- `data-testid` attributes enable E2E testing

---

## Phase 11 Summary

**Lessons Learned (LL)**:
- LL-043: Floating point precision at tolerance boundary
- LL-044: ESLint unused variables in composables

**Lessons Identified (LI)**:
- LI-044: SVG arrow markers for vector visualization
- LI-045: Parallelogram law visualization for vector addition
- LI-046: Operation result types with discriminated unions
- LI-047: Relationship badges for mathematical properties

**Key Takeaways**:
1. Test floating point tolerance with values well within the boundary, not at the edge
2. Compute values inside switch case blocks when they're case-specific
3. SVG markers with `orient="auto"` automatically rotate arrowheads
4. Parallelogram visualization reinforces vector addition concepts
5. Discriminated unions enable type-safe handling of different result types
6. Visual badges for perpendicular/parallel provide immediate educational feedback

---

## Phase 12: Linear Algebra — Matrices

### LL-045: URL Parameter Names Must Match Composable Implementation
**Issue**: E2E test for URL state sync failed because the test used `scaleX` as the parameter name, but the composable uses `sx`.

**Code**:
```typescript
// Failed - wrong parameter name
expect(page.url()).toContain('scaleX=2')

// Composable actually uses:
query.sx = scaleX.value.toString()
```

**Resolution**: Check the composable implementation for actual URL parameter names:
```typescript
// Works - matches composable implementation
expect(page.url()).toContain('sx=1.5')
```

**Lesson**: When writing E2E tests for URL state sync, verify the actual parameter names used in the composable's `updateUrl()` function rather than assuming based on internal variable names.

---

### LL-046: Default Values Are Not Included in URL Parameters
**Issue**: E2E test failed because it set a slider to the default value (2), which is intentionally not included in the URL to keep URLs clean.

**Code**:
```typescript
// Failed - default value not in URL
await page.locator('[data-testid="scale-x-slider"]').fill('2')  // 2 is default
expect(page.url()).toContain('sx=2')  // Not present!

// Composable logic:
if (scaleX.value !== defaults.scaleX) {  // defaults.scaleX = 2
  query.sx = scaleX.value.toString()
}
```

**Resolution**: Use a non-default value when testing URL parameter persistence:
```typescript
// Works - non-default value is included
await page.locator('[data-testid="scale-x-slider"]').fill('1.5')
expect(page.url()).toContain('sx=1.5')
```

**Lesson**: URL state sync composables typically omit default values to keep URLs clean. When testing URL persistence, use non-default values.

---

### LI-048: Transformation Type Architecture with Parameter Mapping
**Identified**: Matrix transformations benefit from a clear mapping between transformation types and their required parameters.

**Pattern**:
```typescript
type TransformationType =
  | 'identity' | 'rotation' | 'scale' | 'uniformScale'
  | 'shearX' | 'shearY' | 'reflectX' | 'reflectY' | 'reflectOrigin' | 'custom'

// Each type maps to specific parameters
switch (transformationType.value) {
  case 'rotation':
    return rotationMatrix(angle.value)  // Uses angle
  case 'scale':
    return scaleMatrix(scaleX.value, scaleY.value)  // Uses scaleX, scaleY
  case 'uniformScale':
    return uniformScaleMatrix(scaleX.value)  // Uses only scaleX
  case 'shearX':
    return shearXMatrix(shear.value)  // Uses shear
  // ...
}
```

**Benefits**:
- Clear separation of transformation logic
- Each type has well-defined parameters
- Easy to extend with new transformation types
- URL sync only includes relevant parameters per type

---

### LI-049: Determinant-Based Property Badges
**Identified**: Matrix properties can be visually communicated through badges computed from the determinant.

**Pattern**:
```typescript
const propertyBadges = computed(() => {
  const badges = []

  if (isOrthogonal) {
    badges.push({ label: 'Orthogonal', testId: 'badge-orthogonal' })
  }
  if (Math.abs(determinant - 1) < 0.001) {
    badges.push({ label: 'Area Preserving', testId: 'badge-area-preserving' })
  }
  if (determinant < 0) {
    badges.push({ label: 'Orientation Reversing', testId: 'badge-orientation-reversing' })
  }
  if (Math.abs(determinant) < 0.001) {
    badges.push({ label: 'Singular', testId: 'badge-singular' })
  }

  return badges
})
```

**Benefits**:
- Immediate visual feedback on matrix properties
- Educational: teaches relationship between determinant and geometric effects
- `data-testid` attributes enable E2E testing of mathematical properties

---

### LI-050: Unit Square Transformation Visualization
**Identified**: Showing a unit square before and after transformation effectively demonstrates matrix effects.

**Pattern**:
```typescript
// Original unit square corners
const original = [
  { x: 0, y: 0 },  // origin
  { x: 1, y: 0 },  // corner1
  { x: 1, y: 1 },  // corner2
  { x: 0, y: 1 },  // corner3
]

// Transform each corner by matrix multiplication
const transformed = computed(() => ({
  origin: { x: 0, y: 0 },
  corner1: matrixVectorMultiply(matrix, { x: 1, y: 0 }),
  corner2: matrixVectorMultiply(matrix, { x: 1, y: 1 }),
  corner3: matrixVectorMultiply(matrix, { x: 0, y: 1 }),
}))
```

**Benefits**:
- Intuitive visualization of linear transformation
- Shows area scaling (determinant) geometrically
- Demonstrates shear, rotation, reflection effects clearly
- Original square shown dashed for comparison

---

### LI-051: Preset System for Educational Transformations
**Identified**: Transformation presets with descriptive names aid learning.

**Pattern**:
```typescript
const TRANSFORMATION_PRESETS = [
  { id: 'rotate-90', name: '90° Rotation', type: 'rotation', parameters: { angle: 90 } },
  { id: 'flip-x', name: 'Flip Horizontal', type: 'reflectY', parameters: {} },
  { id: 'shear-right', name: 'Shear Right', type: 'shearX', parameters: { k: 0.5 } },
  { id: 'double', name: 'Double Size', type: 'uniformScale', parameters: { k: 2 } },
]
```

**Benefits**:
- Quick access to common transformations
- Educational naming (e.g., "Flip Horizontal" vs "reflectY")
- Demonstrates variety of transformation effects
- URL-shareable configurations

---

## Phase 12 Summary

**Lessons Learned (LL)**:
- LL-045: URL parameter names must match composable implementation
- LL-046: Default values are not included in URL parameters

**Lessons Identified (LI)**:
- LI-048: Transformation type architecture with parameter mapping
- LI-049: Determinant-based property badges
- LI-050: Unit square transformation visualization
- LI-051: Preset system for educational transformations

**Key Takeaways**:
1. Verify URL parameter names against composable implementation when writing E2E tests
2. Test URL persistence with non-default values since defaults are omitted
3. Transformation types map cleanly to their required parameters
4. Determinant provides rich information for educational badges (area, orientation)
5. Unit square visualization makes abstract matrix operations concrete
6. Named presets ("90° Rotation") are more educational than raw parameters

---

## Phase 13: Calculus — Limits

### LL-047: Infinite Limit Detection Requires Monotonic Divergence Check
**Issue**: Initial infinite limit detection only checked if values became very large, but this also triggered for oscillating functions near discontinuities.

**Context**: At x=0, sin(1/x) oscillates rapidly with large values appearing sporadically, incorrectly flagged as infinite.

**Resolution**: Check that values are consistently increasing (or decreasing) as they approach the point:
```typescript
function isInfiniteLimit(values: number[]): boolean {
  // Check if values are monotonically diverging, not just occasionally large
  const isMonotonic = values.every((v, i) =>
    i === 0 || Math.abs(v) >= Math.abs(values[i-1])
  )
  return isMonotonic && Math.abs(values[values.length - 1]) > 1e6
}
```

**Lesson**: When detecting mathematical properties numerically, check for consistent patterns rather than point-in-time values.

---

### LL-048: Numerical Precision for Limits Needs Both Absolute and Relative Tolerance
**Issue**: Using only absolute tolerance (e.g., |a - b| < 0.0001) failed for limits near zero and for very large limits.

**Context**: For f(x) = x² approaching 0, values like 0.0001 and 0.00001 are "close" but differ by 10x relatively.

**Resolution**: Use both absolute and relative tolerance:
```typescript
function areValuesConverging(values: number[]): boolean {
  const last = values[values.length - 1]
  const prev = values[values.length - 2]

  const absDiff = Math.abs(last - prev)
  const relDiff = Math.abs(last) > 1e-10 ? absDiff / Math.abs(last) : absDiff

  return absDiff < 1e-6 || relDiff < 1e-4
}
```

**Lesson**: Numerical convergence detection requires both absolute tolerance (for values near zero) and relative tolerance (for large values).

---

### LI-052: Preset Functions with Interesting Points
**Identified**: Each limit preset should define "interesting points" where educational discontinuities occur.

**Pattern**:
```typescript
interface LimitPreset {
  id: string
  name: string
  fn: (x: number) => number
  interestingPoints: number[]  // Points with educational value
  defaultPoint: number
  description: string
}

const LIMIT_PRESETS: LimitPreset[] = [
  {
    id: 'rational',
    name: 'Rational',
    fn: (x) => (x * x - 1) / (x - 1),
    interestingPoints: [1],  // Removable discontinuity at x=1
    defaultPoint: 1,
    description: 'Removable discontinuity example'
  },
  // ...
]
```

**Benefits**:
- Quick navigation to educational examples
- Each preset demonstrates specific limit behavior
- Default point is the most interesting case

---

### LI-053: Epsilon-Delta Visualization with Band Overlays
**Identified**: SVG band overlays effectively visualize the ε-δ definition of limits.

**Pattern**:
```vue
<!-- Epsilon band (horizontal) around limit value L -->
<rect
  :x="0"
  :y="scaleY(L + epsilon)"
  :width="width"
  :height="scaleY(L - epsilon) - scaleY(L + epsilon)"
  fill="rgba(59, 130, 246, 0.2)"
  stroke="#3b82f6"
/>

<!-- Delta band (vertical) around approach point a -->
<rect
  :x="scaleX(a - delta)"
  :y="0"
  :width="scaleX(a + delta) - scaleX(a - delta)"
  :height="height"
  fill="rgba(34, 197, 94, 0.2)"
  stroke="#22c55e"
/>
```

**Benefits**:
- Visual proof that for any ε, there exists δ
- Interactive adjustment shows relationship
- "Find δ" button demonstrates existence

---

### LI-054: Numerical Animation Shows Approach Pattern
**Identified**: Animating numerical values approaching the limit reinforces the concept.

**Pattern**:
```typescript
const approachValues = computed(() => {
  const deltas = [0.5, 0.2, 0.1, 0.05, 0.01, 0.005, 0.001]
  return deltas.map(d => ({
    x: point - d,  // or point + d for right approach
    fx: fn(point - d),
    delta: d
  }))
})

// Animate rows appearing one by one
function playAnimation() {
  visibleRows.value = 0
  const interval = setInterval(() => {
    if (visibleRows.value >= approachValues.value.length) {
      clearInterval(interval)
    } else {
      visibleRows.value++
    }
  }, 400)
}
```

**Benefits**:
- Shows convergence pattern visually
- Reinforces "getting closer and closer"
- Table format mirrors numerical limit calculation

---

### LI-055: Continuity Classification as Visual Feedback
**Identified**: Displaying continuity type as a badge provides immediate educational feedback.

**Pattern**:
```typescript
type ContinuityType = 'continuous' | 'removable' | 'jump' | 'infinite' | 'oscillating'

const continuityInfo = computed((): { type: ContinuityType; message: string } => {
  if (!limitResult.value) return { type: 'continuous', message: 'Evaluating...' }

  const { leftLimit, rightLimit, functionValue } = limitResult.value

  if (leftLimit === null || rightLimit === null) {
    return { type: 'oscillating', message: 'Limit does not exist (oscillation)' }
  }
  if (!isFinite(leftLimit) || !isFinite(rightLimit)) {
    return { type: 'infinite', message: 'Infinite discontinuity' }
  }
  if (Math.abs(leftLimit - rightLimit) > 1e-6) {
    return { type: 'jump', message: 'Jump discontinuity' }
  }
  if (functionValue === undefined || Math.abs(leftLimit - functionValue) > 1e-6) {
    return { type: 'removable', message: 'Removable discontinuity' }
  }
  return { type: 'continuous', message: 'Continuous at this point' }
})
```

**Benefits**:
- Immediate feedback on function behavior
- Educational: teaches discontinuity types
- Color-coded badges for quick identification

---

## Phase 13 Summary

**Lessons Learned (LL)**:
- LL-047: Infinite limit detection requires monotonic divergence check
- LL-048: Numerical precision for limits needs both absolute and relative tolerance

**Lessons Identified (LI)**:
- LI-052: Preset functions with interesting points
- LI-053: Epsilon-delta visualization with band overlays
- LI-054: Numerical animation shows approach pattern
- LI-055: Continuity classification as visual feedback

**Key Takeaways**:
1. Detect infinite limits by checking monotonic divergence, not just large values
2. Use both absolute and relative tolerance for numerical convergence
3. Interesting points in presets guide users to educational examples
4. ε-δ bands make the formal definition visual and interactive
5. Animated numerical approach reinforces the limit concept
6. Continuity classification badges provide immediate educational feedback

---

## Phase 14: Calculus — Derivatives

### LL-049: Numerical Differentiation Tolerance Varies by Method
**Issue**: Unit tests for forward/backward difference methods expected 4 decimal places of precision, but only achieved 3.

**Context**: Central difference has O(h²) error while forward/backward have O(h) error. With h=0.0001:
- Central difference: ~8 decimal places accurate
- Forward/backward: ~4 decimal places accurate

**Resolution**: Adjusted test tolerances from `toBeCloseTo(expected, 4)` to `toBeCloseTo(expected, 3)` for forward/backward methods.

**Lesson**: Different numerical methods have different accuracy characteristics. Tests should reflect the actual precision achievable by each method, not an arbitrary uniform standard.

---

### LL-050: vitest/no-conditional-expect Requires Test Restructuring
**Issue**: Vitest's `no-conditional-expect` lint rule flagged expects inside conditional statements in loops.

**Context**: Testing derivative presets required filtering out invalid test points (where function or derivative is undefined/infinite) before running assertions:
```typescript
// Flagged by linter
for (const x of testPoints) {
  if (isFinite(fn(x)) && isFinite(derivative(x))) {
    expect(numerical).toBeCloseTo(exact, 3)  // conditional expect
  }
}
```

**Resolution**: Restructure to filter valid test points first, then run assertions unconditionally:
```typescript
// Valid: filter first, then assert
const validTestPoints = testPoints.filter(x =>
  isFinite(fn(x)) && isFinite(derivative(x))
)
for (const x of validTestPoints) {
  expect(numerical).toBeCloseTo(exact, 3)  // unconditional
}
```

**Lesson**: Separate data filtering from assertions. The lint rule prevents flaky tests where assertions may or may not run depending on runtime conditions.

---

### LI-056: Secant-to-Tangent Animation for Limit Definition
**Identified**: Animating the secant line approaching the tangent line effectively demonstrates the limit definition of derivative.

**Pattern**:
```typescript
const SECANT_H_VALUES = [1, 0.5, 0.2, 0.1, 0.05, 0.02, 0.01, 0.005, 0.001]

const secantSequence = computed(() => {
  if (!selectedPreset.value) return []
  return SECANT_H_VALUES.map(h => calculateSecantLine(
    selectedPreset.value.fn,
    pointX.value,
    h
  ))
})

// Animation cycles through h values
function playAnimation() {
  currentIndex.value = 0
  const interval = setInterval(() => {
    if (currentIndex.value >= SECANT_H_VALUES.length - 1) {
      clearInterval(interval)
    } else {
      currentIndex.value++
    }
  }, 500)
}
```

**Benefits**:
- Directly visualizes lim(h→0) [f(x+h) - f(x)] / h
- Connects Phase 13 (Limits) to Phase 14 (Derivatives)
- Table shows numerical convergence alongside visual
- Interactive h-slider allows manual exploration

---

### LI-057: Slope Interpretation Badges Aid Understanding
**Identified**: Displaying derivative value with interpretation (increasing/decreasing/horizontal) provides immediate educational feedback.

**Pattern**:
```typescript
const slopeInterpretation = computed(() => {
  const slope = derivativeResult.value?.value ?? 0
  const tolerance = 0.01

  if (Math.abs(slope) < tolerance) {
    return {
      label: 'Horizontal',
      description: 'Critical point - potential maximum, minimum, or inflection',
      icon: '→',
      class: 'text-yellow-600'
    }
  }
  if (slope > 0) {
    return {
      label: 'Increasing',
      description: 'Function is going up',
      icon: '↗',
      class: 'text-green-600'
    }
  }
  return {
    label: 'Decreasing',
    description: 'Function is going down',
    icon: '↘',
    class: 'text-red-600'
  }
})
```

**Benefits**:
- Immediate visual feedback on function behavior
- Color-coded badges for quick recognition
- Connects abstract derivative value to geometric meaning

---

### LI-058: Preset Interesting Points Guide Exploration
**Identified**: Including "interesting points" in function presets guides users to educational examples.

**Pattern**:
```typescript
interface DerivativeFunctionPreset {
  id: string
  name: string
  fn: (x: number) => number
  derivative: (x: number) => number
  interestingPoints: Array<{
    x: number
    label: string
    description: string
  }>
}

// Example preset
const quadratic: DerivativeFunctionPreset = {
  id: 'quadratic',
  name: 'Quadratic',
  fn: x => x * x,
  derivative: x => 2 * x,
  interestingPoints: [
    { x: 0, label: 'x = 0', description: 'Minimum (f\'(0) = 0)' },
    { x: 1, label: 'x = 1', description: 'Positive slope (f\'(1) = 2)' },
    { x: -1, label: 'x = -1', description: 'Negative slope (f\'(-1) = -2)' }
  ]
}
```

**Benefits**:
- Quick access to pedagogically important points
- Buttons guide users to explore critical points, inflection points, etc.
- Consistent pattern with LimitsExplorer presets

---

## Phase 14 Summary

**Lessons Learned (LL)**:
- LL-049: Numerical differentiation tolerance varies by method (central > forward/backward)
- LL-050: vitest/no-conditional-expect requires filtering before assertions

**Lessons Identified (LI)**:
- LI-056: Secant-to-tangent animation visualizes limit definition
- LI-057: Slope interpretation badges aid understanding
- LI-058: Preset interesting points guide exploration

**Key Takeaways**:
1. Central difference is more accurate than forward/backward - test tolerances should reflect this
2. Lint rules like no-conditional-expect improve test reliability - restructure rather than disable
3. The secant→tangent animation powerfully demonstrates derivative as limit of difference quotient
4. Slope interpretation (increasing/decreasing/horizontal) bridges abstract values to geometric meaning
5. Interesting points in presets create a guided learning experience

---

## Interim: Content Review Phase

**Date**: 2026-01-18

This phase systematically reviewed and upgraded existing topic pages with consistent patterns.

### LI-059: Three-Analogy Pattern for Topic Pages
**Identified**: Every topic page benefits from three perspectives on the concept.

**Pattern**:
```vue
<div class="grid gap-4 sm:grid-cols-3 mt-6 mb-4">
  <!-- Everyday Analogy (amber) -->
  <div class="p-4 bg-surface-alt rounded-lg border border-border">
    <h4 class="font-semibold text-amber-600 dark:text-amber-400 mb-2">
      <i class="fa-solid fa-icon mr-2" aria-hidden="true" />
      Everyday Analogy
    </h4>
    <p class="text-sm text-text-secondary">Real-world metaphor...</p>
  </div>
  <!-- Programming Analogy (emerald) -->
  <div class="p-4 bg-surface-alt rounded-lg border border-border">
    <h4 class="font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
      <i class="fa-solid fa-code mr-2" aria-hidden="true" />
      Programming Analogy
    </h4>
    <p class="text-sm text-text-secondary">Code/CS connection...</p>
  </div>
  <!-- Visual Intuition (blue) -->
  <div class="p-4 bg-surface-alt rounded-lg border border-border">
    <h4 class="font-semibold text-blue-600 dark:text-blue-400 mb-2">
      <i class="fa-solid fa-chart-line mr-2" aria-hidden="true" />
      Visual Intuition
    </h4>
    <p class="text-sm text-text-secondary">Geometric insight...</p>
  </div>
</div>
```

**Benefits**:
- Different learners connect with different perspectives
- Consistent visual structure across all topic pages
- Color coding creates recognizable pattern (amber=everyday, emerald=programming, blue=visual)

---

### LI-060: Common Pitfall Callout Pattern
**Identified**: Every topic page should highlight a common misconception or error.

**Pattern**:
```vue
<div class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg">
  <p class="font-semibold text-amber-700 dark:text-amber-300 mb-2">
    <i class="fa-solid fa-triangle-exclamation mr-2" aria-hidden="true" />
    Common Pitfall: [Specific Error Name]
  </p>
  <p class="text-sm text-amber-600 dark:text-amber-400">
    Explanation with <code>code_example()</code> if relevant.
  </p>
</div>
```

**Benefits**:
- Prevents common errors before they happen
- Warning styling ensures visibility
- Code snippets show what goes wrong and how to fix it

**Good pitfall examples from review**:
- "0.1 + 0.2 ≠ 0.3" (floating point precision)
- "= Means Assignment, Not Equality" (Python vs math notation)
- "-3**2 = -9, Not 9!" (operator precedence)
- "log(0) and log(negative)" (domain errors)
- "Negative Discriminant" (complex roots)
- "Division by Coefficient" (degenerate cases)

---

### LI-061: Navigation Descriptions as Engaging Hooks
**Identified**: Navigation descriptions should be engaging hooks, not dry summaries.

**Good examples**:
- "Sigma is just a for loop" (not "Learn summation notation")
- "Every angle tells a story through its coordinates" (not "Sine and cosine")
- "Nested sets from counting numbers to complex—pick the right container" (not "Number classification")
- "What happens when we get really, really close?" (not "Understanding limits")
- "Labeled boxes for values, recipes that combine them" (not "Variable assignment")
- "PEMDAS: the dressing order for math operations" (not "Operator precedence")

**Guidelines**:
- Keep under 60 characters
- Reference the core insight or "aha moment"
- Avoid generic phrases like "Learn about X"
- Use metaphors from the content itself

---

### LI-062: RelatedTopics Cross-Section Linking
**Identified**: RelatedTopics should include 3-4 items with at least one cross-section link.

**Pattern**:
```typescript
const relatedTopics = [
  { title: 'Section Overview', path: '/section', description: 'All topics in this section' },
  { title: 'Related Topic 1', path: '/section/topic1', description: 'Connection to this concept' },
  { title: 'Cross-Section Topic', path: '/other-section/topic', description: 'How this connects to other areas' },
  { title: 'Related Topic 2', path: '/section/topic2', description: 'Another related concept' },
]
```

**Benefits**:
- Always link back to parent index for navigation
- Cross-section links help users discover related content
- Descriptions explain the relationship, not just the topic name

---

## Content Review Summary

**Topics Reviewed**: 15 topic pages

- /calculus/limits
- /statistics/descriptive
- /trigonometry/unit-circle
- /linear-algebra/vectors
- /linear-algebra/matrices
- /algebra/summation
- /algebra/product-notation
- /basics/functions
- /basics/number-types
- /basics/variables
- /basics/order-of-operations
- /basics/foundations
- /algebra/linear-equations
- /algebra/quadratics
- /algebra/exponentials

**Patterns Applied**:
- Three-Analogy Block: Amber/Emerald/Blue cards
- Common Pitfall Callout: Amber warning box
- RelatedTopics: 3-4 items with cross-section links
- Navigation descriptions: Engaging hooks under 60 chars

**Lessons Identified (LI)**:
- LI-059: Three-analogy pattern for topic pages
- LI-060: Common pitfall callout pattern
- LI-061: Navigation descriptions as engaging hooks
- LI-062: RelatedTopics cross-section linking

**Key Takeaways**:
1. Consistent visual patterns help users recognize and navigate content
2. Multiple perspectives (everyday, programming, visual) serve different learning styles
3. Proactive pitfall warnings are as valuable as teaching concepts
4. Navigation descriptions are marketing copy—hook the user with insight
5. Cross-section links in RelatedTopics improve content discoverability