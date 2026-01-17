# Claude Code: Phase Implementation Guide

## Purpose

This document defines the workflow for Claude Code when implementing SnakeMath phases. It covers how to interpret phase plans, structure increments, use archive content, and maintain project documentation.

---

## Phase Implementation Workflow

### 1. Receiving a Phase Plan

Each phase begins with a **Phase Plan** document (e.g., `PHASE_12_PLAN.md`) created during planning sessions. The Phase Plan contains:

| Section | What It Provides |
|---------|------------------|
| Strategic Context | Why this phase matters, connections to ML/programming |
| Scope Decisions | Confirmed decisions with IDs (D-XXX) |
| Widget Design | Architecture, components, features |
| Math Utilities | Types, functions, test targets |
| Content Structure | Page layout, sections, code examples |
| Increments | High-level breakdown with time estimates |
| Archive Reference | Relevant files to use as inspiration |

### 2. Planning Increments

Before implementing, break down each increment into specific tasks. Use this structure:

```markdown
## Increment XXA: [Name]

### Context
- What this increment accomplishes
- Dependencies on previous increments
- Relevant decisions (D-XXX)

### Tasks
1. Specific task with file paths
2. Another task
3. ...

### Files to Create/Modify
- `src/path/to/file.ts` (new)
- `src/path/to/existing.ts` (update)

### Success Criteria
- [ ] Tests pass (XX+ tests)
- [ ] TypeScript compiles
- [ ] ESLint passes
- [ ] Specific functionality works

### Verification Commands
```bash
npm run type-check
npm run lint
npm run test -- src/path/to/tests
```
```

### 3. Using Archive Content

The `archive/` folder contains previous implementations. Use these as **inspiration**, not direct copy:

**Location Pattern**:
```
archive/snake-math/docs/{topic}/{subtopic}/
├── basics.md        # Foundational concepts
├── operations.md    # Core operations/methods
├── advanced.md      # Advanced topics
├── applications.md  # Real-world uses
```

**How to Adapt Content**:

| Archive Has | Transform To |
|-------------|--------------|
| Markdown prose | Vue component with MathBlock/CodeExample |
| MathJax notation | KaTeX syntax (usually compatible) |
| PyScript blocks | Static CodeExample with Python |
| Canvas visualizations | SVG with Vue reactivity |
| Generic explanations | Programmer-focused analogies |

**Programmer-Relatable Patterns**:
- Connect math concepts to code constructs ("matrices are like nested arrays")
- Show NumPy/Python equivalents for every operation
- Reference algorithms, data structures, complexity
- Include ML/AI applications where relevant
- Use practical examples (graphics, games, data science)

### 4. Implementation Standards

**Code Organization**:
```
src/
├── utils/math/{topic}.ts        # Pure math functions
├── utils/math/{topic}.test.ts   # Co-located tests
├── composables/use{Widget}.ts   # State management + URL sync
├── components/widgets/{Widget}/ # Widget components
│   ├── {Widget}.vue             # Main orchestrator
│   ├── {SubComponent}.vue       # Sub-components
│   └── index.ts                 # Exports
├── views/{topic}/{View}.vue     # Content pages
├── types/math.ts                # Math-related types
└── data/navigation.ts           # Navigation structure
```

**Testing Requirements**:
- Unit tests: Co-located with source (`*.test.ts`)
- Target: Coverage specified in Phase Plan (e.g., 50+ tests)
- E2E tests: `e2e/{topic}/{widget}.spec.ts`
- Accessibility: Add pages to `e2e/accessibility.spec.ts`

**Naming Conventions**:
- Composables: `use{Feature}` (e.g., `useMatrixTransformations`)
- Components: PascalCase (e.g., `TransformationCanvas.vue`)
- Utilities: camelCase functions (e.g., `rotationMatrix`)
- Types: PascalCase (e.g., `Matrix2x2`)
- Test IDs: kebab-case (e.g., `data-testid="matrix-display"`)

---

## Post-Phase Documentation

After completing all increments, update the following documents:

### 1. Lessons Learned / Lessons Identified (`docs/ll_li.md`)

Add a new section for the phase:

```markdown
## Phase XX: [Phase Name]

### LL-XXX: [Issue Title]
**Issue**: What went wrong or was unexpected
**Code**: Example if relevant
**Resolution**: How it was fixed
**Lesson**: The takeaway

### LI-XXX: [Pattern Title]  
**Identified**: What pattern/approach was discovered
**Pattern**: Code example
**Benefits**: Why this is useful

## Phase XX Summary

**Lessons Learned (LL)**:
- LL-XXX: Brief description

**Lessons Identified (LI)**:
- LI-XXX: Brief description

**Key Takeaways**:
1. Summary point
2. Summary point
```

### 2. Decisions (`docs/decisions.md`)

Add decisions made during implementation:

```markdown
## Phase XX Decisions

### D-XXX: [Decision Title]
**Decision**: What was decided

**Rationale**:
- Reason 1
- Reason 2

**Trade-off**: What was given up (if any)

**Implementation**:
```code example if helpful```
```

### 3. Current State (`docs/current_state.md`)

Update the following sections:

- **Project Summary table**: Add new phase row
- **What's Live**: Add new content sections and widgets
- **Interactive Widgets**: Add new widget with features
- **Test Coverage**: Update test counts
- **Key Files**: Add new important files
- **Phase Completion Summary**: Add detailed summary

### 4. Roadmap (`ROADMAP_V2.md`)

Update if needed:

- Phase status: Change from 🎯 Next to ✅ Complete
- Next phase: Mark as 🎯 Next
- Review Points: Fill in outcome if applicable
- Decision Log: Add any roadmap-level decisions (R-XXX)
- Document History: Add completion entry

### 5. Design System (`docs/design-system.md`)

Update if new patterns were established:

- New component patterns
- New color usage
- New interactive affordances

---

## Increment Execution Checklist

For each increment:

- [ ] Read increment plan and understand scope
- [ ] Check archive content for inspiration
- [ ] Implement following code organization standards
- [ ] Write tests to meet coverage targets
- [ ] Verify with commands:
  ```bash
  npm run type-check && npm run lint && npm run test && npm run build
  ```
- [ ] For final increment: Run E2E tests
  ```bash
  npm run build && npm run test:e2e
  ```

---

## Phase Completion Checklist

Before declaring phase complete:

- [ ] All increments implemented
- [ ] All unit tests pass (target count met)
- [ ] All E2E tests pass
- [ ] Accessibility audit passes
- [ ] Widget URL sync works
- [ ] Mobile responsive
- [ ] Documentation updated:
  - [ ] `docs/ll_li.md`
  - [ ] `docs/decisions.md`
  - [ ] `docs/current_state.md`
  - [ ] `ROADMAP_V2.md`
  - [ ] `docs/design-system.md` (if applicable)

---

## Key File Locations

| Purpose | Path |
|---------|------|
| Phase Plans | Provided in conversation or `/docs/phases/` |
| Roadmap | `ROADMAP_V2.md` |
| Current State | `docs/current_state.md` |
| Decisions | `docs/decisions.md` |
| Lessons Learned | `docs/ll_li.md` |
| Design System | `docs/design-system.md` |
| Archive Content | `archive/snake-math/docs/` |
| Archive Components | `archive/snake-math/docs/.vitepress/theme/components/` |
| Navigation Data | `src/data/navigation.ts` |
| Routes | `src/router/index.ts` |
| Math Types | `src/types/math.ts` |

---

## Communication Notes

- If a decision needs to be made that isn't covered in the Phase Plan, document it as a new D-XXX decision
- If you discover a better approach than planned, implement it and document why in Lessons Identified
- If blocked or unclear, note the issue and proceed with best judgment, documenting the assumption
