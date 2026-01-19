# Workflow: Design System Compliance Update for Topic Pages

This workflow enables incremental updates to topic pages to ensure design system compliance. Use this when applying a pattern change (like adding `collapsible` to all ContentSections) across multiple existing pages.

## When to Use This Workflow

- A new design system pattern needs to be applied to existing pages
- A bug or inconsistency is found that affects multiple topic pages
- A component API change requires updating all usages

## Workflow Steps

### 1. Identify Scope

Run grep checks to find affected files:

```bash
# Example: Find ContentSections missing collapsible prop
grep -rn "<ContentSection" src/views/ | grep -v "collapsible"

# Example: Find CodeExamples missing id prop
grep -rn "<CodeExample" src/views/ | grep -v 'id="'

# List all topic view files
find src/views -name "*View.vue" -type f
```

### 2. Group by Section

Organize files into logical increments (typically by topic section):

| Section | Files |
|---------|-------|
| Basics | `NumbersView.vue`, `FunctionsView.vue` |
| Algebra | `SummationView.vue`, `QuadraticView.vue`, `ExponentialView.vue` |
| Trigonometry | `UnitCircleView.vue`, `RightTrianglesView.vue`, etc. |
| Linear Algebra | `VectorsView.vue`, `MatricesView.vue`, etc. |
| Calculus | `LimitsView.vue`, `DerivativesView.vue`, `IntegrationView.vue` |
| Statistics | `DescriptiveView.vue`, `DistributionsView.vue`, etc. |

### 3. Process Each File Incrementally

For each file:

#### a. Read and Analyze
```bash
# Find all instances of the component to update
grep -n "ContentSection" src/views/{section}/{file}.vue
```

#### b. Apply Pattern

**For ContentSection collapsible pattern:**

Primary content (intro, explorer) - expanded by default:
```vue
<ContentSection
  id="introduction"
  title="..."
  icon="fa-solid fa-..."
  collapsible
>
```

Supplementary content - collapsed by default:
```vue
<ContentSection
  id="..."
  title="..."
  icon="fa-solid fa-..."
  collapsible
  :default-expanded="false"
>
```

#### c. Verify
```bash
npm run type-check
```

### 4. Final Verification

After all files are updated:

```bash
# Run full verification
npm run type-check && npm run lint && npm run test

# Re-run initial grep to confirm all issues resolved
grep -rn "<ContentSection" src/views/ | grep -v "collapsible"
# Should return empty or only index pages
```

## Example: Collapsible Sections Update

### Pattern to Apply

**Rule:** ALL `ContentSection` components must have `collapsible` prop.

| Section Type | Props |
|--------------|-------|
| Introduction | `collapsible` (expanded by default) |
| Interactive Explorer | `collapsible` (expanded by default) |
| Everything else | `collapsible :default-expanded="false"` |

### Increment Template

```markdown
## Increment X: Fix {SectionName}View.vue

1. Read the file
2. Find all `<ContentSection` usages
3. For each ContentSection:
   - If Introduction or Explorer: add `collapsible` (no default-expanded needed)
   - Otherwise: add `collapsible` and `:default-expanded="false"`
4. Run `npm run type-check`
5. Mark increment complete
```

### Section Order (suggested)

Process one section at a time for manageable changes:

1. **Basics** (2 files)
2. **Algebra** (3 files)
3. **Trigonometry** (5 files)
4. **Linear Algebra** (4 files) - DONE
5. **Calculus** (3 files) - DONE
6. **Statistics** (5 files)

## Tracking Progress

Use a simple checklist format:

```markdown
## Collapsible Sections Update Progress

### Completed
- [x] VectorsView.vue (7 sections updated)
- [x] MatricesView.vue (7 sections updated)
- [x] Vectors3DView.vue (5 sections updated)
- [x] Matrices3DView.vue (7 sections updated)
- [x] LimitsView.vue (7 sections updated)
- [x] DerivativesView.vue (6 sections updated)
- [x] IntegrationView.vue (5 sections updated)

### Pending
- [ ] NumbersView.vue
- [ ] FunctionsView.vue
- [ ] SummationView.vue
...
```

## Common Pitfalls

1. **Forgetting `collapsible` prop**: The `default-expanded` prop has no effect without `collapsible`
2. **Making intro sections collapsed**: Introduction and Explorer should stay expanded by default
3. **Not running type-check**: Always verify after each file change
4. **Batch commits**: Prefer committing after each section for easier rollback

## Reference

- Design System: `docs/DESIGN_SYSTEM.md` (see "Collapsible Sections" section)
- ContentSection component: `src/components/content/ContentSection.vue`
- CollapsiblePanel component: `src/components/ui/CollapsiblePanel.vue`
