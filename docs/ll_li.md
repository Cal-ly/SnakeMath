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