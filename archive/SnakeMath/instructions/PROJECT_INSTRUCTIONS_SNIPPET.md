# SnakeMath Project Instructions (Workflow Summary)

## Development Cycle

This project follows a structured planning → implementation → documentation cycle:

### Planning Sessions (Claude Opus in claude.ai)
1. Review completed phase documentation (`CURRENT_STATE.md`, `DECISIONS.md`, `LL_LI.md`)
2. Update `ROADMAP_V2.md` with phase completion
3. Plan next phase with confirmed decisions (D-XXX)
4. Create `PHASE_XX_PLAN.md` document
5. Hand off to Claude Code

### Implementation (Claude Code)
1. Read Phase Plan and `docs/CLAUDE_CODE_WORKFLOW.md`
2. Plan detailed increments using archive content as inspiration
3. Implement following project standards
4. Update documentation post-phase:
   - `docs/ll_li.md` (lessons learned/identified)
   - `docs/decisions.md` (implementation decisions)
   - `docs/current_state.md` (phase summary)
   - `ROADMAP_V2.md` (status updates)

### Key Principles
- **Archive as Inspiration**: Use `archive/snake-math/docs/` content but adapt to current stack (Vue 3, Tailwind, KaTeX)
- **Programmer-Relatable**: Connect math to code, show NumPy equivalents, reference algorithms
- **Documented Decisions**: All decisions numbered (D-XXX), lessons captured (LL-XXX, LI-XXX)

## Key Files
| Purpose | Location |
|---------|----------|
| Authoritative Roadmap | `ROADMAP_V2.md` |
| Current State | `docs/CURRENT_STATE.md` |
| Decisions | `docs/DECISIONS.md` |
| Lessons Learned | `docs/LL_LI.md` |
| Claude Code Guide | `docs/CLAUDE_CODE_WORKFLOW.md` |
| Planning Workflow | `docs/PLANNING_WORKFLOW.md` |
| Design System | `docs/DESIGN_SYSTEM.md` |

## Numbering Conventions
- `R-XXX`: Roadmap decisions (planning sessions)
- `D-XXX`: Technical decisions (planning or implementation)
- `LL-XXX`: Lessons Learned (implementation)
- `LI-XXX`: Lessons Identified (implementation)
