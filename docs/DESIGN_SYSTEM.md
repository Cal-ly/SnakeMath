# SnakeMath Design System

**Purpose**: Document UI patterns and conventions to ensure consistency across all pages.

**Last Updated**: January 2026

---

## Icons

### Icon Libraries

We use two icon libraries:

| Library | Prefix | Use Case |
|---------|--------|----------|
| Font Awesome Free | `fa-solid fa-{name}` | Primary icon library |
| Bootstrap Icons | `bi bi-{name}` | Fallback for icons missing in FA Free |

Both are imported in `main.css`. Prefer Font Awesome; use Bootstrap Icons only when FA Free lacks a specific icon.

### Unicode Character Icons

For special characters not in either library (e.g., Greek letters like Σ), use styled `<span>` elements:

```vue
<span class="text-primary text-xl font-bold" aria-hidden="true">Σ</span>
```

---

## Cards & Containers

### Navigational Card (Clickable)

**Use for**: Links to topic pages, related content, any clickable card that navigates.

**Design rationale**: Navigational cards use a filled background (`bg-surface-alt`) to stand out and invite clicks. The background treatment signals "this is actionable."

**Required elements**:
- `router-link` or `a` tag as container
- `bg-surface-alt` background for prominence
- `hover:border-primary` for hover state
- `group` class if children need hover effects

**Example**:
```vue
<router-link
  to="/topic"
  class="block bg-surface-alt rounded-lg p-4 border border-border/50
         hover:border-primary transition-colors group"
>
  <h3 class="group-hover:text-primary transition-colors">Topic Title</h3>
  <p class="text-text-secondary">Description</p>
</router-link>
```

### Content Card (Non-Clickable)

**Use for**: Static content, feature lists, "why this matters" sections, any non-interactive grouped content.

**Design rationale**: Content cards are subtle (border-only, no background fill) so they don't overwhelm the page. They organize information without competing for attention with navigational elements.

**Pattern**:
```vue
<div class="rounded-lg p-4 border border-border">
  <h3>Section Title</h3>
  <p>Static informational content</p>
</div>
```

**With icon header**:
```vue
<div class="rounded-lg p-4 border border-border">
  <div class="flex items-start gap-3">
    <i class="fa-solid fa-icon text-primary mt-1" aria-hidden="true" />
    <div>
      <h4 class="font-medium">Title</h4>
      <p class="text-text-secondary">Description</p>
    </div>
  </div>
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

### Related Topics Section

**Use for**: Cross-linking to related content at the bottom of subpages.

**Requirement**: All subpages (non-index views) must include a Related Topics section at the bottom.

**Component**: Use `<RelatedTopics>` from `src/components/content/RelatedTopics.vue`

**Pattern**:
```vue
<script setup>
const relatedTopics = [
  {
    title: 'Topic Name',
    path: '/path/to/topic',
    description: 'Brief description',
    faIcon: 'fa-solid fa-icon',
  },
]
</script>

<template>
  <!-- At the end of the page content -->
  <RelatedTopics :topics="relatedTopics" />
</template>
```

**Guidelines**:
- Include 2-4 related topics
- Always link back to the parent index page (e.g., "Statistics Overview")
- Include at least one topic from a different section when relevant
- Use descriptive text, not just topic titles

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

Use `<CollapsiblePanel>` for standalone expandable content, or the `collapsible` prop on `<ContentSection>` for page sections.

### ContentSection Collapsible Pattern

**ALL `ContentSection` components in topic pages MUST have the `collapsible` prop.** This allows users to collapse any section to reduce cognitive load, while controlling which sections start expanded.

| Section Type | Props | Example |
|--------------|-------|---------|
| Primary content (Introduction, Interactive Explorer) | `collapsible` (expanded by default) | `<ContentSection id="intro" title="..." collapsible>` |
| Supplementary content (everything else) | `collapsible :default-expanded="false"` | `<ContentSection id="code" title="..." collapsible :default-expanded="false">` |

**Primary content (expanded by default):**
```vue
<ContentSection
  id="introduction"
  title="What is X?"
  icon="fa-solid fa-info"
  collapsible
>
  <!-- Content here -->
</ContentSection>
```
Note: When `collapsible` is present without `:default-expanded`, it defaults to `true` (expanded).

**Supplementary content (collapsed by default):**
```vue
<ContentSection
  id="python-code"
  title="In Python"
  icon="fa-brands fa-python"
  collapsible
  :default-expanded="false"
>
  <!-- Content here -->
</ContentSection>
```

### What Qualifies as Primary Content

Only these section types should be **expanded by default**:
- Introduction / "What is X?" sections
- Interactive widget/explorer sections
- "Topics in This Section" (on index pages) — users need to see navigation options

### What Qualifies as Supplementary Content

Everything else should be **collapsed by default**:
- "In Python" / "In Code" sections
- "Operations" / "Common Rules" / "Formulas"
- "Applications" / "Use Cases"
- "Advanced Topics"
- "Common Pitfalls" (when in its own section)
- Any section that's supplementary to the main teaching

### Common Mistake

**WRONG:** Setting `:default-expanded="false"` without `collapsible`
```vue
<!-- ❌ This doesn't work - section will always be expanded -->
<ContentSection
  id="code"
  title="Code"
  :default-expanded="false"
>
```

**CORRECT:** Always include `collapsible` prop
```vue
<!-- ✅ This works - section will be collapsed by default -->
<ContentSection
  id="code"
  title="Code"
  collapsible
  :default-expanded="false"
>
```

### Default States Summary

| Content Type | Default State |
|--------------|---------------|
| Primary teaching content | Expanded |
| Topics in This Section (index pages) | Expanded |
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
| Navigational card | `bg-surface-alt rounded-lg p-4 border border-border/50` |
| Content card | `rounded-lg p-4 border border-border` |
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

## Content Page Patterns

### Three-Analogy Block (Required)

**Use for**: Every topic page introduction section. Provides three perspectives on the concept.

**Design rationale**: Different learners connect with different analogies. The three perspectives (everyday, programming, visual) ensure at least one resonates with each user.

**Required structure**: Three-column grid with consistent color coding.

| Analogy Type | Header Color | Icon Color | Purpose |
|--------------|--------------|------------|---------|
| Everyday Analogy | `text-amber-600 dark:text-amber-400` | amber | Real-world metaphor |
| Programming Analogy | `text-emerald-600 dark:text-emerald-400` | emerald | Code/CS connection |
| Visual Intuition | `text-blue-600 dark:text-blue-400` | blue | Geometric/graphical insight |

**Pattern**:
```vue
<!-- Three Analogies - place after introduction content -->
<div class="grid gap-4 sm:grid-cols-3 mt-6 mb-4">
  <div class="p-4 bg-surface-alt rounded-lg border border-border">
    <h4 class="font-semibold text-amber-600 dark:text-amber-400 mb-2">
      <i class="fa-solid fa-icon mr-2" aria-hidden="true" />
      Everyday Analogy
    </h4>
    <p class="text-sm text-text-secondary">
      Real-world metaphor that connects the concept to familiar experience.
    </p>
  </div>
  <div class="p-4 bg-surface-alt rounded-lg border border-border">
    <h4 class="font-semibold text-emerald-600 dark:text-emerald-400 mb-2">
      <i class="fa-solid fa-code mr-2" aria-hidden="true" />
      Programming Analogy
    </h4>
    <p class="text-sm text-text-secondary">
      Connection to programming concepts, data structures, or algorithms.
    </p>
  </div>
  <div class="p-4 bg-surface-alt rounded-lg border border-border">
    <h4 class="font-semibold text-blue-600 dark:text-blue-400 mb-2">
      <i class="fa-solid fa-chart-line mr-2" aria-hidden="true" />
      Visual Intuition
    </h4>
    <p class="text-sm text-text-secondary">
      Geometric or graphical way to understand the concept.
    </p>
  </div>
</div>
```

**Guidelines**:
- Always use `bg-surface-alt` for card backgrounds
- Keep text concise (2-3 sentences max)
- Choose icons that match the analogy content
- Programming analogy should reference code, CS concepts, or algorithms
- Visual intuition should describe a picture or mental model

### Common Pitfall Callout (Required)

**Use for**: Every topic page introduction section. Highlights a frequent misconception or error.

**Design rationale**: Preventing errors is as valuable as teaching concepts. The warning style ensures visibility.

**Pattern**:
```vue
<!-- Pitfall Callout - place after the three analogies -->
<div class="p-4 bg-amber-50 dark:bg-amber-900/30 border border-amber-200 dark:border-amber-800 rounded-lg">
  <p class="font-semibold text-amber-700 dark:text-amber-300 mb-2">
    <i class="fa-solid fa-triangle-exclamation mr-2" aria-hidden="true" />
    Common Pitfall: [Specific Error Name]
  </p>
  <p class="text-sm text-amber-600 dark:text-amber-400">
    Explanation of what goes wrong and how to avoid it. Include code snippets
    if relevant: <code>example_code()</code>.
  </p>
</div>
```

**Guidelines**:
- Title should be specific (e.g., "Division by Zero" not "Common Mistakes")
- Include code examples when the pitfall is code-related
- Mention what error users will see (e.g., `ZeroDivisionError`, `ValueError`)
- Provide the fix or workaround, not just the problem

**Good pitfall examples**:
- "0.1 + 0.2 ≠ 0.3" (floating point)
- "log(0) and log(negative)" (domain errors)
- "= Means Assignment, Not Equality" (Python vs math)
- "-3**2 = -9, Not 9!" (operator precedence)

### Navigation Descriptions

**Use for**: The `description` field in `navigation.ts` entries.

**Guidelines**:
- Keep descriptions under 60 characters
- Use engaging hooks, not dry summaries
- Reference the core insight or "aha moment"
- Avoid generic phrases like "Learn about X"

**Good examples**:
- "Sigma is just a for loop" (not "Learn summation notation")
- "Every angle tells a story through its coordinates" (not "Sine and cosine")
- "Nested sets from counting numbers to complex" (not "Number classification")
- "What happens when we get really, really close?" (not "Understanding limits")

---

## Component Checklist

When creating new components, verify:

- [ ] Cards: Navigational uses `bg-surface-alt` + hover, content uses border-only
- [ ] Code examples: Has unique `id` prop, filename-style title
- [ ] Collapsibles: Uses CollapsiblePanel, appropriate default state
- [ ] Interactive elements: Has hover, focus, active states
- [ ] Colors: Uses semantic color classes
- [ ] Responsive: Works on mobile, enhanced on desktop
- [ ] Related Topics: Subpages have RelatedTopics section at bottom

When creating new content pages, additionally verify:

- [ ] TopicPage wrapper: With `title` and `description` props
- [ ] Three-Analogy Block: Amber/Emerald/Blue cards with `bg-surface-alt` backgrounds
- [ ] Pitfall Callout: Amber warning box with specific error name
- [ ] Collapsible sections: **ALL** ContentSections have `collapsible`; primary expanded, supplementary collapsed
- [ ] CodeExample props: All have `id` (format: `section-topic-descriptor`) and `title` (filename.py style)
- [ ] RelatedTopics: 3-4 items including parent index and cross-section links
- [ ] Dark mode: Color text has `dark:` variant (e.g., `text-amber-600 dark:text-amber-400`)
- [ ] Navigation description: Engaging hook under 60 characters

---

## Compliance Verification

### Quick Grep Checks

Run these commands to verify design system compliance across content:

```bash
# Find pages missing RelatedTopics
grep -rL "RelatedTopics" src/views/*/

# Find CodeExamples missing id prop
grep -rn "<CodeExample" src/views/ | grep -v 'id="'

# Find pages missing TopicPage wrapper
grep -rL "TopicPage" src/views/*/*View.vue

# Find pages missing three-analogy block
grep -rL "Everyday Analogy" src/views/*/*View.vue

# Find pages missing pitfall callout
grep -rL "Common Pitfall" src/views/*/*View.vue

# Find ContentSections missing collapsible prop
grep -rn "<ContentSection" src/views/ | grep -v "collapsible"
```

### Phase Completion Checklist

Before marking any phase complete, verify new content:

1. **Run grep checks** above - fix any missing elements
2. **Visual review** in both light and dark mode
3. **Check collapsible states** - primary content expanded, advanced collapsed
4. **Verify CodeExample props** - unique IDs, filename-style titles
5. **Test RelatedTopics links** - all paths valid, 3-4 topics included

### Common Issues to Watch For

| Issue | Symptom | Fix |
|-------|---------|-----|
| Wrong analogy background | Colored `bg-amber-50` instead of neutral | Use `bg-surface-alt` |
| Missing dark mode | Text invisible in dark mode | Add `dark:text-{color}-400` variant |
| Pitfall wrong color | Red styling instead of amber | Use `bg-amber-50 dark:bg-amber-900/30` |
| CodeExample no ID | Can't cross-reference examples | Add `id="section-topic-descriptor"` |
| All sections expanded | Page feels overwhelming | Add `collapsible :default-expanded="false"` to advanced sections |
| Sections not collapsible | Users can't collapse sections | Add `collapsible` prop to ALL ContentSections |
| `default-expanded` has no effect | Section always expanded | Must add `collapsible` prop for `default-expanded` to work |
