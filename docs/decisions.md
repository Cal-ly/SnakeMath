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
