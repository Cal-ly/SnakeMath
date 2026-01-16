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