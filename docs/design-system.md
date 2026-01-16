# SnakeMath Design System

**Purpose**: Document UI patterns and conventions to ensure consistency across all pages.

**Last Updated**: January 2026

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
```vue
<router-link to="/topic" class="card p-4 hover:border-primary transition-colors group">
  <h3 class="group-hover:text-primary transition-colors">Topic Title</h3>
  <p class="text-text-secondary">Description</p>
</router-link>
```

### Informational Panel (Non-Clickable)

**Use for**: Static content, feature lists, "why this matters" sections, any non-interactive grouped content.

**Key distinction**: Do NOT use `.card` class — this prevents confusion with clickable elements.

**Pattern**:
```vue
<div class="bg-surface-alt rounded-lg p-4 border border-border/50">
  <h3>Section Title</h3>
  <p>Static informational content</p>
</div>
```

**Alternative** (for less emphasis):
```vue
<div class="rounded-lg p-4 border border-border/50">
  <!-- content -->
</div>
```

### Widget Container

**Use for**: Interactive widget sections, calculator displays, visualization containers.

**Pattern**: `.card` class is appropriate because interactivity is self-evident from the controls inside.

```vue
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
- `summation.py`
- `quadratic_solver.py`
- `trig_values.py`

Avoid descriptive titles like "Calculating Sums in Python" or "How to solve quadratics".

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

```vue
<!-- Standard button -->
<button class="px-3 py-1.5 rounded-md border border-border
               hover:border-primary hover:text-primary
               focus:ring-2 focus:ring-primary/30
               transition-colors">
  Button Text
</button>

<!-- Active/selected button -->
<button class="px-3 py-1.5 rounded-md
               bg-primary text-white border border-primary">
  Selected
</button>
```

### SVG Interactive Elements

SVG elements with interaction must include hover effects:

```vue
<circle
  :cx="point.x"
  :cy="point.y"
  r="6"
  class="cursor-pointer fill-primary transition-all duration-150"
  @mouseenter="onHoverStart"
  @mouseleave="onHoverEnd"
/>
```

Use `filter: drop-shadow()` for glow effects on hover.

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

```vue
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
