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