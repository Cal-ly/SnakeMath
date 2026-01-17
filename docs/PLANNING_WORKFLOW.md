# SnakeMath: Planning & Development Workflow

## Purpose

This document defines the workflow between planning sessions (Claude Opus) and implementation (Claude Code) for SnakeMath development.

---

## Workflow Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                     PLANNING SESSION                             │
│                     (Claude Opus)                                │
│                                                                  │
│  1. Review completed phase documentation                         │
│  2. Update ROADMAP_V2.md with completion                        │
│  3. Discuss next phase scope and decisions                       │
│  4. Create Phase Plan document                                   │
│  5. Confirm decisions with numbered IDs                          │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    [Phase Plan Document]
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                     IMPLEMENTATION                               │
│                     (Claude Code)                                │
│                                                                  │
│  1. Read Phase Plan and CLAUDE_CODE_WORKFLOW.md                 │
│  2. Plan detailed increments                                     │
│  3. Use archive content as inspiration                           │
│  4. Implement each increment                                     │
│  5. Update documentation post-phase                              │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
                    [Updated Documentation]
                              │
                              ▼
                    (Cycle repeats)
```

---

## Planning Session Responsibilities

### Input Required
- Updated `current_state.md` from previous phase
- Updated `decisions.md` from previous phase  
- Updated `ll_li.md` from previous phase
- `ROADMAP_V2.md` (authoritative roadmap)

### Activities

1. **Review Phase Completion**
   - Examine what was built
   - Note any deviations from plan
   - Identify patterns for future phases

2. **Update Roadmap**
   - Mark completed phase as ✅ Complete
   - Mark next phase as 🎯 Next
   - Add any roadmap-level decisions (R-XXX)
   - Update document history

3. **Plan Next Phase**
   - Define scope and goals
   - Make key decisions (numbered D-XXX)
   - Identify archive content to reference
   - Estimate increments and time

4. **Create Phase Plan Document**
   - Strategic context
   - Confirmed decisions
   - Widget/content architecture
   - Math utilities specification
   - Increment breakdown
   - Archive references

### Output
- Updated `ROADMAP_V2.md`
- `PHASE_XX_PLAN.md` document

---

## Phase Plan Document Template

```markdown
# Phase XX: [Topic] — [Subtitle]

**Theme**: *[Tagline]*

**Goal**: [One sentence goal]

---

## Strategic Context

[Why this phase matters, connections to ML/programming]

---

## Scope Decisions (Confirmed)

### D-XXX: [Decision Title]
**Decision**: [What was decided]
**Rationale**: [Why]

### D-XXX: [Another Decision]
...

---

## Widget Design: [WidgetName]

### Architecture
```
src/components/widgets/[Widget]/
├── [Widget].vue
├── [SubComponent].vue
└── index.ts
```

### Core Features
| Feature | Priority | Description |
|---------|----------|-------------|
| ... | Must/Should/Nice | ... |

---

## Math Utilities

### File: `src/utils/math/[topic].ts`

```typescript
// Types
interface ...

// Functions
export function ...
```

**Test Coverage Target**: XX+ tests

---

## Content Structure

### [Page Name]
`/path` - `ViewName.vue`

**Sections**:
1. Section name (collapsed/expanded)
2. ...

---

## Increments

### Increment XXA: [Name] (~XX min)
**Tasks**: ...
**Files**: ...
**Success Criteria**: ...

### Increment XXB: [Name] (~XX min)
...

---

## Estimated Total Time
| Increment | Time |
|-----------|------|
| XXA | XX min |
| ... | ... |
| **Total** | **~X.X hours** |

---

## Archive Reference

**Component**: `archive/snake-math/docs/.vitepress/theme/components/[Component].vue`
**Content**: `archive/snake-math/docs/[topic]/`
**Utilities**: `archive_utilities.md` section X

---

## Risk Assessment
| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| ... | ... | ... | ... |

---

## Success Metrics
- [ ] All unit tests pass (XX+)
- [ ] All E2E tests pass (XX+)
- [ ] Accessibility audit passes
- [ ] Widget URL sync works
- [ ] Mobile responsive
```

---

## Claude Code Responsibilities

### Input Required
- Phase Plan document
- `CLAUDE_CODE_WORKFLOW.md` (this workflow guide)
- Access to archive content
- Access to existing codebase

### Activities

1. **Plan Increments**
   - Break down Phase Plan into detailed tasks
   - Identify file changes per increment
   - Define verification steps

2. **Implement**
   - Follow code organization standards
   - Use archive content as inspiration
   - Make content programmer-relatable
   - Write comprehensive tests

3. **Document**
   - Add to `ll_li.md` (lessons learned/identified)
   - Add to `decisions.md` (implementation decisions)
   - Update `current_state.md` (phase summary)
   - Update `ROADMAP_V2.md` (if needed)
   - Update `design-system.md` (if new patterns)

### Output
- Implemented phase (code + tests)
- Updated documentation files

---

## Decision Numbering

| Prefix | Scope | Owner |
|--------|-------|-------|
| R-XXX | Roadmap-level decisions | Planning Session |
| D-XXX | Technical/implementation decisions | Planning Session or Claude Code |
| LL-XXX | Lessons Learned | Claude Code |
| LI-XXX | Lessons Identified | Claude Code |

**Current Counts** (update as needed):
- Roadmap decisions: R-001 through R-014
- Technical decisions: D-001 through D-100
- Lessons Learned: LL-001 through LL-044
- Lessons Identified: LI-001 through LI-047

---

## File Ownership

| File | Primary Owner | Updates |
|------|---------------|---------|
| `ROADMAP_V2.md` | Planning Session | Phase status, decisions, history |
| `docs/current_state.md` | Claude Code | Phase completion summaries |
| `docs/decisions.md` | Both | Planning confirms, Claude Code adds implementation |
| `docs/ll_li.md` | Claude Code | All entries |
| `docs/design-system.md` | Claude Code | New patterns |
| `PHASE_XX_PLAN.md` | Planning Session | Created, then read-only |

---

## Handoff Checklist

### Planning → Claude Code
- [ ] ROADMAP_V2.md updated with next phase as 🎯 Next
- [ ] Phase Plan document created with:
  - [ ] All decisions numbered (D-XXX)
  - [ ] Widget architecture defined
  - [ ] Math utilities specified
  - [ ] Increments outlined
  - [ ] Archive references provided
- [ ] Any open questions resolved

### Claude Code → Planning
- [ ] All increments implemented
- [ ] All tests passing
- [ ] Documentation updated:
  - [ ] `docs/ll_li.md`
  - [ ] `docs/decisions.md`
  - [ ] `docs/current_state.md`
- [ ] Ready for next planning session
