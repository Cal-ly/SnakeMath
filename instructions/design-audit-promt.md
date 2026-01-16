Excellent decisions. The unique ID approach for code examples is smart — it enables future features like cross-references, tooltips, and deep linking.

Let me craft a comprehensive Claude Code prompt that addresses all four items systematically.

---

## Claude Code Prompt: Design System & UI Standardization

**Context**: SnakeMath is an educational math website for programmers (Vue 3, TypeScript, Tailwind CSS). A UI audit identified inconsistencies in card styling and opportunities for better code example referenceability. This task creates documentation and applies fixes.

**Reference**: The audit is in `docs/ui-audit.md` (already in the project).

**Goal**: Establish a design system document, fix card styling inconsistencies, add unique IDs to code examples, and fix one missing hover state.

---

### Phase 1: Create Design System Document

**Create** `docs/design-system.md` with the following structure:

```markdown
# SnakeMath Design System

**Purpose**: Document UI patterns and conventions to ensure consistency across all pages.

**Last Updated**: [current date]

---

## Cards & Containers

### Navigational Card (Clickable)

**Use for**: Links to topic pages, related content, any clickable card that navigates.

**Required elements**:
- `router-link` or `a` tag as container
- `.card` class
- `hover:border-primary` for hover state
- `group` class if children need hover effects

**Example**:
```js
<router-link to="/topic" class="card p-4 hover:border-primary group">
  <h3 class="group-hover:text-primary transition-colors">Topic Title</h3>
  <p class="text-text-secondary">Description</p>
</router-link>
```

### Informational Panel (Non-Clickable)

**Use for**: Static content, feature lists, "why this matters" sections, any non-interactive grouped content.

**Key distinction**: Do NOT use `.card` class — this prevents confusion with clickable elements.

**Pattern**:
```js
<div class="bg-surface-alt rounded-lg p-4 border border-border/50">
  <h3>Section Title</h3>
  <p>Static informational content</p>
</div>
```

**Alternative** (for less emphasis):
```js
<div class="rounded-lg p-4 border border-border/50">
  <!-- content -->
</div>
```

### Widget Container

**Use for**: Interactive widget sections, calculator displays, visualization containers.

**Pattern**: `.card` class is appropriate because interactivity is self-evident from the controls inside.

```js
<div class="card p-4">
  <WidgetComponent />
</div>
```

---

## Code Examples

### Component Usage

All code examples use `<CodeExample>` component from `src/components/content/CodeExample.vue`.

### Required Props

| Prop | Required | Purpose |
|------|----------|---------|
| `id` | **Yes** | Unique identifier for cross-referencing |
| `title` | Yes | Display title (filename style preferred) |
| `language` | Yes | Syntax highlighting language |
| `code` | Yes | The code content |

### ID Convention

Format: `{section}-{topic}-{descriptor}`

Examples:
- `basics-numbers-classification`
- `algebra-summation-forloop`
- `algebra-quadratic-discriminant`
- `trig-unitcircle-sincos`

### Title Convention

Use **filename style** to reinforce "this is real code":
- ✅ `summation.py`
- ✅ `quadratic_solver.py`
- ✅ `trig_values.py`
- ❌ `"Calculating Sums in Python"`
- ❌ `"How to solve quadratics"`

For multiple examples in same topic, append descriptor:
- `summation_basic.py`
- `summation_nested.py`
- `summation_closed_form.py`

---

## Collapsible Sections

### Primary Component

Use `<CollapsiblePanel>` for all expandable content.

### Default States

| Content Type | Default State |
|--------------|---------------|
| Primary teaching content | Expanded |
| Supplementary examples | Collapsed |
| Advanced/optional content | Collapsed |
| Code examples in ContentSection | Follow section state |

### Animation

CollapsiblePanel uses CSS `max-height` transition (200ms). Do not mix with Vue `<Transition>` for content panels.

---

## Interactive Affordances

### Required States

All interactive elements must have:
1. **Hover state**: Visual change on mouse over
2. **Focus state**: `focus:ring-2 focus:ring-primary` or equivalent
3. **Active state**: Clear indication of current selection
4. **Cursor**: `cursor-pointer` for clickable, `cursor-not-allowed` for disabled

### Button Patterns

```js
<!-- Standard button -->
<button class="px-3 py-1.5 rounded-md border border-border 
               hover:border-primary hover:text-primary 
               focus:ring-2 focus:ring-primary/30
               transition-colors">

<!-- Active/selected button -->
<button class="px-3 py-1.5 rounded-md 
               bg-primary text-white border border-primary">
```

### SVG Interactive Elements

SVG elements with interaction must include hover effects:

```js
<circle
  class="cursor-pointer fill-primary transition-all
         hover:fill-primary/80"
  style="filter: drop-shadow(0 0 0px transparent)"
  @mouseenter="$event.target.style.filter = 'drop-shadow(0 0 4px var(--color-primary))'"
  @mouseleave="$event.target.style.filter = 'drop-shadow(0 0 0px transparent)'"
/>
```

---

## Color Usage

### Semantic Colors

| Purpose | Class | Usage |
|---------|-------|-------|
| Primary action | `text-primary`, `bg-primary` | Buttons, links, active states |
| Success/valid | `text-green-600`, `border-green-500` | Validation, positive results |
| Error/invalid | `text-red-600`, `border-red-500` | Errors, negative results |
| Warning | `text-amber-600` | Cautions, edge cases |
| Muted | `text-text-secondary` | Secondary information |

### Highlight Backgrounds

| Purpose | Classes |
|---------|---------|
| Key insight | `bg-primary/10 border border-primary/30 rounded-lg p-4` |
| Informational panel | `bg-surface-alt rounded-lg p-4 border border-border/50` |
| Code background | Handled by CodeExample component |

---

## Responsive Patterns

### Two-Column Layout

```js
<div class="grid gap-4 md:grid-cols-2">
  <div><!-- Left content --></div>
  <div><!-- Right content --></div>
</div>
```

### Mobile-First

- All widgets must be usable on mobile
- Use `md:` breakpoint for desktop enhancements
- Touch targets minimum 44x44px

---

## Component Checklist

When creating new components, verify:

- [ ] Cards: Clickable uses `.card` + hover, non-clickable uses `bg-surface-alt`
- [ ] Code examples: Has unique `id` prop, filename-style title
- [ ] Collapsibles: Uses CollapsiblePanel, appropriate default state
- [ ] Interactive elements: Has hover, focus, active states
- [ ] Colors: Uses semantic color classes
- [ ] Responsive: Works on mobile, enhanced on desktop

---

### Phase 2: Update CodeExample Component

**File**: `src/components/content/CodeExample.vue`

**Task**: Add optional `id` prop for referenceability.

1. Add `id` to props:
   ```typescript
   id?: string  // Unique identifier for cross-referencing
   ```

2. Apply id to the root element or a wrapper that can be targeted:
   ```js
   <div :id="id" class="...">
   ```

3. Ensure the id is optional and backward-compatible (existing usages without id should still work).

---

### Phase 3: Fix Card Styling Issues

Based on the audit, update these files to use informational panel styling instead of `.card`:

**File: `src/views/HomeView.vue`**

1. Around line 103 — "philosophy pillars" section: If these cards are NOT clickable links, change from `.card` to `bg-surface-alt rounded-lg p-4 border border-border/50`

2. Around line 122 — topic preview items: Same treatment if non-clickable

**File: `src/views/trigonometry/TrigonometryIndexView.vue`**

1. Lines 39-82 — "Why Programmers Need This" items: Verify these use informational panel styling, not `.card`. The audit noted they use `p-4 rounded-lg border border-border` which is close but should add `bg-surface-alt` for consistency.

**File: `src/views/statistics/StatisticsIndexView.vue`**

1. Lines 39-71 — Same pattern as TrigonometryIndexView. Add `bg-surface-alt` to informational panels.

**General rule**: Any `div` with `.card` class that is NOT wrapped in `router-link` or `a` tag should be reviewed. If it's purely informational, remove `.card` and use the informational panel pattern.

---

### Phase 4: Add IDs to Existing Code Examples

**Task**: Add unique `id` props to all `<CodeExample>` usages across the codebase.

**ID Format**: `{section}-{topic}-{descriptor}`

**Files to update** (prioritize by section):

#### Basics Section
- `src/views/basics/FoundationsView.vue` — 4 examples
- `src/views/basics/NumberTypesView.vue` — 8 examples  
- `src/views/basics/VariablesView.vue` — 6 examples
- `src/views/basics/FunctionsView.vue` — 6 examples
- `src/views/basics/OrderOfOperationsView.vue` — 6 examples

#### Algebra Section
- `src/views/algebra/SummationView.vue` — 5 examples
- `src/views/algebra/QuadraticsView.vue` — 4 examples
- `src/views/algebra/ExponentialsView.vue` — 10 examples

#### Trigonometry Section
- `src/views/trigonometry/UnitCircleView.vue` — 4 examples

#### Statistics Section
- `src/views/statistics/DescriptiveStatsView.vue` — 5 examples

**Example transformation**:
```js
<!-- Before -->
<CodeExample
  title="summation.py"
  language="python"
  :code="sumCode"
/>

<!-- After -->
<CodeExample
  id="algebra-summation-forloop"
  title="summation.py"
  language="python"
  :code="sumCode"
/>
```

**Naming guidance**:
- Keep IDs lowercase with hyphens
- Make descriptors meaningful but concise
- Ensure uniqueness across entire codebase
- When multiple similar examples exist, use numbered suffixes or more specific descriptors

---

### Phase 5: Fix SVG Hover State

**File**: `src/components/widgets/UnitCircleExplorer/UnitCircleExplorer.js`

**Location**: Around line 226, the draggable point circle.

**Current code** (approximate):
```js
<circle
  :cx="point.x"
  :cy="point.y"
  r="6"
  class="cursor-pointer fill-primary"
/>
```

**Updated code**:
```js
<circle
  :cx="point.x"
  :cy="point.y"
  r="6"
  class="cursor-pointer fill-primary transition-all duration-150 hover:opacity-80"
  :style="{ filter: isHovering ? 'drop-shadow(0 0 4px var(--color-primary))' : 'none' }"
  @mouseenter="isHovering = true"
  @mouseleave="isHovering = false"
/>
```

**Alternative** (CSS-only if hover works on SVG in your setup):
```js
<circle
  :cx="point.x"
  :cy="point.y"
  r="6"
  class="cursor-pointer fill-primary transition-all duration-150"
  style="--hover-glow: drop-shadow(0 0 4px var(--color-primary))"
  @mouseenter="$el.style.filter = 'drop-shadow(0 0 4px var(--color-primary))'; $el.setAttribute('r', '8')"
  @mouseleave="$el.style.filter = 'none'; $el.setAttribute('r', '6')"
/>
```

Add `isHovering` ref if using the first approach:
```typescript
const isHovering = ref(false)
```

Choose whichever approach integrates cleanly with the existing component structure.

---

### Verification Checklist

After completing all phases, verify:

1. [ ] `docs/design-system.md` exists and is comprehensive
2. [ ] `CodeExample` component accepts `id` prop
3. [ ] HomeView.js non-clickable cards use informational panel styling
4. [ ] TrigonometryIndexView.js informational panels have `bg-surface-alt`
5. [ ] StatisticsIndexView.js informational panels have `bg-surface-alt`
6. [ ] All 57+ CodeExample usages have unique `id` props
7. [ ] UnitCircleExplorer point has hover visual feedback
8. [ ] No TypeScript errors
9. [ ] Visual inspection: non-clickable cards look distinct from navigational cards

---

### Output

After completion, provide:
1. Summary of changes made
2. List of all CodeExample IDs added (for reference)
3. Any issues encountered or decisions made
4. Screenshots or descriptions of before/after for card styling changes (if possible)

---

This prompt covers all four items systematically. Shall I adjust anything before you run it, or add any specific constraints?