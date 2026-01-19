# Handover: Add Collapsible Sections to Linear Algebra Content Pages

## Context

The SnakeMath project uses collapsible sections in content pages to reduce cognitive overload. Per the Design System (`docs/DESIGN_SYSTEM.md`):

| Content Type | Default State |
|--------------|---------------|
| Primary teaching content (Introduction, Interactive Explorer) | **Expanded** |
| All other sections | **Collapsed** |

## Problem

Several content pages have `ContentSection` components that are **missing the `collapsible` prop entirely**, or have `:default-expanded="false"` but are missing `collapsible`. Without `collapsible`, sections cannot be collapsed by users and the `default-expanded` prop has no effect.

This was just fixed for the three Calculus pages (Limits, Derivatives, Integration). The same issue exists in the Linear Algebra pages.

## Task

Make ALL `ContentSection` components collapsible in the following files:

1. `src/views/linear-algebra/VectorsView.vue` (2D Vectors)
2. `src/views/linear-algebra/MatricesView.vue` (2D Matrices)
3. `src/views/linear-algebra/Vectors3DView.vue` (3D Vectors)
4. `src/views/linear-algebra/Matrices3DView.vue` (3D Matrices)

## Pattern

**All sections should be collapsible.** The only difference is the default state:

**Primary content (expanded by default):**
```vue
<ContentSection
  id="introduction"
  title="Introduction"
  icon="fa-solid fa-info"
  collapsible
>
```
Note: When `collapsible` is present without `:default-expanded`, it defaults to `true` (expanded).

**Supplementary content (collapsed by default):**
```vue
<ContentSection
  id="advanced-topic"
  title="Advanced Topic"
  icon="fa-solid fa-code"
  collapsible
  :default-expanded="false"
>
```

## Guidelines

1. **Primary content = expanded by default**: Only these section types should be expanded:
   - Introduction / "What is X?" sections
   - Interactive widget/explorer sections

2. **Everything else = collapsed by default**: Including:
   - "In Python" / "In Code" sections
   - "Operations" / "Common Rules" / "Formulas"
   - "Applications" / "Use Cases"
   - "Advanced Topics"
   - Any section that's supplementary to the main teaching

3. **All sections must have `collapsible`**: Even primary content should be collapsible (so users can collapse it if they want), just expanded by default.

4. **Verification**: After each file, run `npm run type-check` to ensure no TypeScript errors.

## Incremental Approach

Process one file at a time:

### Increment A: Fix `VectorsView.vue`
1. Grep for `ContentSection` to find all sections
2. Add `collapsible` to ALL sections
3. Add `:default-expanded="false"` to non-primary sections (if not already present)
4. Run `npm run type-check`

### Increment B: Fix `MatricesView.vue`
Same process

### Increment C: Fix `Vectors3DView.vue`
Same process

### Increment D: Fix `Matrices3DView.vue`
Same process

## Commands

```bash
# Find all ContentSection usage in a file
grep -n "ContentSection" src/views/linear-algebra/VectorsView.vue

# Find sections that may already have default-expanded
grep -n ":default-expanded" src/views/linear-algebra/VectorsView.vue

# Verify after changes
npm run type-check
```

## Success Criteria

- ALL `ContentSection` components have the `collapsible` prop
- Primary content sections (intro, explorer) are expanded by default
- All other sections are collapsed by default (`:default-expanded="false"`)
- `npm run type-check` passes after all changes
