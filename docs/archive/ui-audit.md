# SnakeMath UI/UX Audit Report

**Date:** January 2026
**Purpose:** Inventory UI patterns, component usage, and behavioral defaults to inform design standardization.

---

## Executive Summary

This audit examined all Vue components and views in the SnakeMath codebase across five categories: collapsible patterns, code examples, card components, code-concept visualizations, and interactive affordances.

### Key Findings

| Category | Status | Critical Issues |
|----------|--------|-----------------|
| **Collapsibles** | Generally consistent | 3 different animation approaches (CSS max-height, Vue Transition, none) |
| **Code Examples** | Highly consistent | CodeExample used everywhere; only 1 multi-language instance |
| **Cards** | **Inconsistent** | Clickable and non-clickable cards often use identical styling |
| **Visualizations** | Polished | Summation parallels are excellent; consistent patterns |
| **Affordances** | Strong | 1 missing hover state (SVG point); otherwise excellent |

### Priority Recommendations

1. **HIGH:** Visually distinguish non-clickable cards from navigational cards
2. **MEDIUM:** Standardize collapsible animation approach across components
3. **LOW:** Add hover state to UnitCircleExplorer SVG point

---

## 1. Collapsible/Expandable Patterns

### Summary

| Component | Variable | Default State | Visibility Method | Animated |
|-----------|----------|---------------|-------------------|----------|
| CollapsiblePanel | `isExpanded` | Open (configurable) | `v-if` + max-height | Yes |
| CodeExample | `isCollapsed` | Open (configurable) | `v-show` | No |
| ContentSection | Delegates | Configurable | Delegates to CollapsiblePanel | Yes |
| TabGroup | `activeTab` | First tab | `:hidden` attribute | No |
| MobileMenu | `isOpen` | Closed | `v-if` + Vue Transition | Yes |
| SummationResult | `showAllTerms` | Collapsed | Conditional render | No |
| SpecialAngleButtons | `showMore` | Collapsed | `v-if` | No |
| StatisticsCalculator | `isCustomMode` | Hidden | `<Transition v-if>` | Yes |

### Detailed Findings

#### CollapsiblePanel (`src/components/ui/CollapsiblePanel.vue`)
- **Primary reusable component** for collapsible content
- **Animation:** Smooth CSS max-height transition (200ms)
- **Accessibility:** Full ARIA support (`aria-expanded`, `aria-controls`, role="region")
- **Variants:** 'default', 'card', 'subtle' with different hover styles
- **Exposed Methods:** `toggle()`, `expand()`, `collapse()`
- **Chevron Icon:** Rotates 90° when expanded

#### CodeExample (`src/components/content/CodeExample.vue`)
- **Animation:** None (uses `v-show` for instant toggle)
- **Props:** `collapsible` (default: false), `defaultCollapsed` (default: false)
- **Accessibility:** Has `aria-expanded`, `aria-controls`
- **Note:** Collapsible behavior rarely used (only 2 instances across all views)

#### ContentSection (`src/components/content/ContentSection.vue`)
- Wraps CollapsiblePanel for content organization
- Delegates all expand/collapse logic to CollapsiblePanel
- **Pattern:** Most views make ContentSection collapsible, not CodeExample

#### MobileMenu (`src/components/layout/MobileMenu.vue`)
- Uses Vue `<Transition>` components for backdrop and drawer
- **Accessibility:** Focus trap, body scroll lock, Escape key handling
- Slide animation for drawer, fade for backdrop

### Inconsistencies Identified

| Issue | Files | Recommendation |
|-------|-------|----------------|
| Mixed animation approaches | CollapsiblePanel uses CSS, MobileMenu uses Vue Transition | Standardize on one approach or document when to use each |
| `v-show` vs `v-if` inconsistency | CodeExample uses `v-show`, others use `v-if` | CodeExample should match CollapsiblePanel pattern |
| Some components lack animation | SummationResult, SpecialAngleButtons | Consider adding subtle transitions |

---

## 2. Code Example Presentation

### Summary Statistics

| Metric | Count |
|--------|-------|
| Total CodeExample usages | 57+ |
| Single-language (Python-only) | 56 |
| Multi-language switcher | 1 (SummationCodeParallel) |
| Always visible | ~35 |
| Within collapsible ContentSection | ~52 |
| CodeExample `collapsible` prop used | 2 |
| CodeExample with `lineNumbers` | 2 |

### Patterns by Section

#### Basics Section
| File | Code Examples | Pattern |
|------|---------------|---------|
| FoundationsView.vue | 4 | Intro visible, follow-ups in collapsible ContentSections |
| NumberTypesView.vue | 8 | One per number type, all within collapsible sections |
| VariablesView.vue | 6 | Consistent structure throughout |
| FunctionsView.vue | 6 | Each concept has Python example |
| OrderOfOperationsView.vue | 6 | Operator precedence examples |

#### Algebra Section
| File | Code Examples | Pattern |
|------|---------------|---------|
| SummationView.vue | 5 | Core insight visible, applications collapsible |
| QuadraticsView.vue | 4 | Following quadratic concepts |
| ExponentialsView.vue | 10 | Most comprehensive usage |

#### Trigonometry Section
| File | Code Examples | Pattern |
|------|---------------|---------|
| UnitCircleView.vue | 4 | All within collapsible ContentSections |

#### Statistics Section
| File | Code Examples | Pattern |
|------|---------------|---------|
| DescriptiveStatsView.vue | 5 | Statistical calculations |

### Multi-Language Example

**Only instance:** `src/components/widgets/summation/SummationCodeParallel.vue`
- Toggle buttons: Python | JavaScript
- Grid layout: Math panel (left) | Code panel (right)
- Generates code from same preset for both languages

### Title Conventions

Two patterns observed:
1. **Filename style:** `basic_operators.py`, `summation.py`
2. **Descriptive style:** `"Powers of 2 in Python"`, `"Calculating Trig Values in Python"`

### Recommendations

| Priority | Recommendation |
|----------|----------------|
| Low | Consider adding Python/JavaScript toggle to more examples |
| Low | Standardize title convention (filename vs descriptive) |
| Low | Use `lineNumbers` prop more consistently for longer examples |

---

## 3. Card Component Audit

### Base Card Definition

**File:** `src/assets/styles/main.css:98-100`
```css
.card {
  @apply bg-surface rounded-lg border border-border shadow-sm;
}
```

### Card Categories

#### Navigational Cards (RouterLink)

| Location | Classes | Hover State |
|----------|---------|-------------|
| HomeView.vue:137-163 | `card p-6 hover:border-primary hover:shadow-md` | Border + shadow + text color |
| BasicsIndex.vue:16-41 | `card p-4 hover:border-primary` | Border only |
| AlgebraIndex.vue:40-69 | `card p-4 hover:border-primary` | Border + icon background |
| TrigonometryIndexView.vue:88-117 | `card p-4 hover:border-primary` | Border + icon background |
| StatisticsIndexView.vue:126-155 | `card p-4 hover:border-primary` | Border + icon background |
| RelatedTopics.vue:29-52 | `card p-4 hover:border-primary` | Border |

**Pattern:** All use `group` class for hover effects on child elements.

#### Informational Cards (Non-Clickable)

| Location | Classes | Issue |
|----------|---------|-------|
| HomeView.vue:103 | `card p-6 text-center` | **No hover state but styled like clickable** |
| HomeView.vue:122 | `card p-4` | **No hover state but styled like clickable** |
| HomeView.vue:76 | `card p-6 md:p-8` | Story section, acceptable |
| HomeView.vue:168 | `card p-6 md:p-8 bg-surface-alt` | Different background distinguishes |
| AlgebraIndex.vue:80-119 | `p-3 bg-surface-alt rounded-lg` | **Good:** Uses different background |
| TrigonometryIndexView.vue:39-82 | `p-4 rounded-lg border border-border` | Not using `.card` class |
| StatisticsIndexView.vue:39-71 | `p-4 rounded-lg border border-border` | Not using `.card` class |

#### Interactive/Display Cards (Widget Containers)

| Component | Location | Classes |
|-----------|----------|---------|
| NumberTypeExplorer | :170, :218, :238, :265, :277 | `card p-6`, `card p-4` |
| SummationExplorer | :164, :169, :193, :224, :229 | `card p-6`, `card p-4` |
| QuadraticExplorer | :79, :187, :196, :209 | `card p-4` |
| UnitCircleExplorer | :123, :269, :297 | `card p-4` |
| ExponentialExplorer | Multiple | `card p-4` |
| StatisticsCalculator | :93, :100, :109, :116, :126, :134 | `card p-4` |

### Semantic Callout Boxes

| Type | Pattern | Usage |
|------|---------|-------|
| Info/Insight | `bg-primary/10 border-primary/30` | Multiple views |
| Error/Warning | `bg-red-50 dark:bg-red-900/20 border-red-200` | OrderOfOperationsView, SummationView |
| Success | `bg-green-50 dark:bg-green-900/20 border-green-200` | OrderOfOperationsView, FunctionsView |
| Warning | `bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200` | FunctionsView, UnitCircleView |
| Subtle | `bg-surface-alt border-border/50` | "Coming Soon" placeholders |

### Critical Issue: Visual Distinction

**Problem:** Non-clickable informational cards at `HomeView.vue:103` and `HomeView.vue:122` use identical `.card` styling as navigational cards without hover states, potentially confusing users.

**Affected Files:**
- `src/views/HomeView.vue:103` - Features grid cards
- `src/views/HomeView.vue:122` - Site structure cards

**Recommendation:** Non-clickable cards should:
1. Use `bg-surface-alt` background (like "Coming Soon" cards)
2. Or remove `.card` class entirely
3. Or add explicit non-interactive indicator

---

## 4. Code Concept Visualizations

### Ranked by Polish Level

#### Tier 1: Excellent (Reference implementations)

**1. Summation Bar Chart** (`src/components/widgets/summation/SummationBarChart.vue`)
- Sequential bar animation (200ms intervals)
- Running total overlay line
- Hover tooltips
- Respects `prefers-reduced-motion`
- Play/stop controls

**2. Sigma-to-For-Loop Parallel** (`src/components/widgets/summation/SummationCodeParallel.vue`)
- Two-column grid layout
- Language toggle (Python/JavaScript)
- Dynamic code generation
- "Key Insight" callout box

**3. Summation Explorer** (`src/components/widgets/SummationExplorer.vue`)
- Comprehensive integration of all summation components
- URL state sync for shareable configurations

#### Tier 2: Very Polished

**4. Unit Circle Explorer** (`src/components/widgets/UnitCircleExplorer/`)
- SVG-based interactive visualization
- Angle arc rendering
- Wave graphs for sin/cos
- Multiple input methods (slider, buttons, number input)

**5. Formula Comparison** (`src/components/widgets/summation/FormulaComparison.vue`)
- O(n) vs O(1) complexity comparison
- Color-coded status indicators
- Educational callout

**6. Complexity Comparison Tab** (`src/components/widgets/ExponentialExplorer/ComplexityComparisonTab.vue`)
- Multiple complexity classes visualized
- Table and graph views
- Logarithmic slider

#### Tier 3: Functional

**7. Side-by-Side Math/Code** (Multiple files)
- Pattern: `grid gap-4 md:grid-cols-2`
- Used in: SummationView, VariablesView, OrderOfOperationsView
- Simple but effective

**8. PEMDAS Grid** (`src/views/basics/OrderOfOperationsView.vue:188-213`)
- 6-column responsive grid
- Large letters with descriptions

**9. Coordinate System** (`src/components/visualizations/`)
- SVG-based graphing
- Configurable bounds and grid

### Common Patterns

| Pattern | Implementation |
|---------|----------------|
| Two-column layout | `grid gap-4 md:grid-cols-2` |
| Card containers | `card p-4` or `card p-6` |
| Icon badges | Icons with uppercase text labels |
| Key insight callout | `bg-primary/10 border border-primary/30` |
| Color coding | Green (success), Red (error), Primary (interactive) |
| Responsive | Mobile stack fallback on all visualizations |

---

## 5. Interactive Element Affordances

### Summary

| Quality | Count | Percentage |
|---------|-------|------------|
| Excellent | 18 | 72% |
| Good | 6 | 24% |
| Partial/Missing | 1 | 4% |

### Affordance Patterns

#### Buttons
- **Hover:** `hover:text-text-primary`, `hover:bg-surface-alt`, `hover:border-primary`
- **Active:** `bg-primary text-white`, `border-primary`
- **Disabled:** `opacity-50 cursor-not-allowed`
- **Focus:** `focus:ring-2 focus:ring-primary`

#### Sliders
- **Cursor:** `cursor-pointer`
- **Accent:** `accent-primary`
- **Feedback:** Live value display next to slider
- **ARIA:** Full `aria-valuemin`, `aria-valuemax`, `aria-valuenow`

#### Text Inputs
- **Valid:** `border-primary/50`
- **Invalid:** `border-red-500`
- **Focus:** `focus:ring-2 focus:ring-primary/30`
- **Feedback:** Status icons (checkmark/X), error messages

#### Toggles
- **Active:** `bg-primary text-white` or `bg-primary/10 border-primary`
- **ARIA:** `aria-pressed` attribute

### Detailed Findings

| Component | Type | File:Line | Hover | Cursor | Visual | Quality |
|-----------|------|-----------|-------|--------|--------|---------|
| CopyButton | Button | ui/CopyButton.vue:21 | Yes | Implicit | Icon + pulse | Excellent |
| CollapsiblePanel | Button | ui/CollapsiblePanel.vue:54 | Variant | Implicit | Chevron rotate | Excellent |
| TabGroup | Button | ui/TabGroup.vue:114 | Yes | not-allowed | Active underbar | Excellent |
| SearchInput Clear | Button | ui/SearchInput.vue:64 | Yes | Implicit | X icon | Good |
| MobileMenu | Button/Link | layout/MobileMenu.vue:* | Yes | Implicit | Active bg | Excellent |
| NumberTypeExplorer | Button | widgets/NumberTypeExplorer.vue:185 | Yes | Implicit | Border + text | Good |
| **UnitCircleExplorer Point** | **SVG** | **widgets/UnitCircleExplorer.vue:226** | **MISSING** | **cursor-pointer** | **MISSING** | **Partial** |
| SpecialAngleButtons | Button | widgets/UnitCircleExplorer/SpecialAngleButtons.vue:29 | Yes | Implicit | Active bg | Excellent |
| DatasetSelector | Button | widgets/StatisticsCalculator/DatasetSelector.vue:24 | Yes | Implicit | Active bg | Excellent |
| CoefficientControls | Slider | widgets/QuadraticExplorer/CoefficientControls.vue:49 | N/A | cursor-pointer | Live value | Excellent |
| BoundsInput | Input | widgets/summation/BoundsInput.vue:103 | N/A | Implicit | Error border | Excellent |
| NumberInput | Input | widgets/NumberInput.vue:140 | N/A | Implicit | Status icon | Excellent |
| CustomDataInput | Textarea | widgets/StatisticsCalculator/CustomDataInput.vue:45 | N/A | Implicit | Validation msg | Excellent |
| VisualizationToggle | Button | widgets/VisualizationToggle.vue:17 | Yes | Implicit | Eye icon | Excellent |

### Issue: Missing Hover State

**File:** `src/components/widgets/UnitCircleExplorer/UnitCircleExplorer.vue:226`

**Problem:** The SVG circle point has `cursor-pointer` class but no visual hover state.

```vue
<circle
  :cx="point.x"
  :cy="point.y"
  r="6"
  class="cursor-pointer fill-primary"
/>
```

**Recommendation:** Add hover effect:
```vue
<circle
  :cx="point.x"
  :cy="point.y"
  r="6"
  class="cursor-pointer fill-primary hover:r-8 transition-all"
  @mouseenter="..."
  @mouseleave="..."
/>
```

Or use CSS:
```css
circle.point:hover {
  r: 8;
  filter: drop-shadow(0 0 4px var(--color-primary));
}
```

---

## Appendix: File Index

### Components Audited

| Path | Category |
|------|----------|
| src/components/ui/CollapsiblePanel.vue | Collapsible |
| src/components/ui/TabGroup.vue | Collapsible |
| src/components/ui/CopyButton.vue | Affordance |
| src/components/ui/SearchInput.vue | Affordance |
| src/components/content/CodeExample.vue | Code Example, Collapsible |
| src/components/content/ContentSection.vue | Collapsible |
| src/components/content/RelatedTopics.vue | Card |
| src/components/content/SymbolTable.vue | Card |
| src/components/layout/AppHeader.vue | Affordance |
| src/components/layout/MobileMenu.vue | Collapsible, Affordance |
| src/components/widgets/NumberTypeExplorer.vue | Card, Affordance |
| src/components/widgets/SummationExplorer.vue | Card, Visualization |
| src/components/widgets/SimpleFunctionDemo.vue | Card |
| src/components/widgets/NumberInput.vue | Affordance |
| src/components/widgets/VisualizationToggle.vue | Affordance |
| src/components/widgets/summation/* | Visualization, Affordance |
| src/components/widgets/QuadraticExplorer/* | Card, Affordance |
| src/components/widgets/UnitCircleExplorer/* | Visualization, Affordance |
| src/components/widgets/ExponentialExplorer/* | Visualization |
| src/components/widgets/StatisticsCalculator/* | Card, Affordance |
| src/components/visualizations/* | Visualization |

### Views Audited

| Path | Categories |
|------|------------|
| src/views/HomeView.vue | Card |
| src/views/basics/BasicsIndex.vue | Card |
| src/views/basics/FoundationsView.vue | Code Example |
| src/views/basics/NumberTypesView.vue | Code Example |
| src/views/basics/VariablesView.vue | Code Example, Visualization |
| src/views/basics/FunctionsView.vue | Code Example |
| src/views/basics/OrderOfOperationsView.vue | Code Example, Visualization |
| src/views/algebra/AlgebraIndex.vue | Card |
| src/views/algebra/SummationView.vue | Code Example, Visualization |
| src/views/algebra/QuadraticsView.vue | Code Example |
| src/views/algebra/ExponentialsView.vue | Code Example |
| src/views/trigonometry/TrigonometryIndexView.vue | Card |
| src/views/trigonometry/UnitCircleView.vue | Code Example |
| src/views/statistics/StatisticsIndexView.vue | Card |
| src/views/statistics/DescriptiveStatsView.vue | Code Example |

---

## Action Items Summary

| Priority | Issue | Location | Recommendation |
|----------|-------|----------|----------------|
| **HIGH** | Non-clickable cards look clickable | HomeView.vue:103, :122 | Use `bg-surface-alt` or remove `.card` |
| **MEDIUM** | Animation inconsistency | CodeExample vs CollapsiblePanel | Standardize on CSS transitions or Vue Transition |
| **MEDIUM** | Title convention inconsistency | Various CodeExample usages | Document standard (filename vs descriptive) |
| **LOW** | Missing hover state on SVG | UnitCircleExplorer.vue:226 | Add hover visual effect |
| **LOW** | Only 1 multi-language example | SummationCodeParallel.vue | Consider expanding to other topics |
