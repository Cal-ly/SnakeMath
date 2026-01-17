# Claude Code Task: Documentation Integration & CLAUDE.md Update

## Context

We have formalized the development workflow between planning sessions (Claude Opus) and implementation (Claude Code). The workflow documents have been created and placed in `docs/`. Now we need to:

1. Update `CLAUDE.md` to reference these workflows and documentation
2. Ensure consistent document naming and structure
3. Clean up references to match the new organization

## Document Structure

### Current Organization

```
SnakeMath/
├── CLAUDE.md                    # Project guide for Claude Code (UPDATE THIS)
├── ROADMAP_V2.md                # Authoritative roadmap
├── archive/                     # Reference materials
│   ├── snake-math/              # Previous VitePress implementation (INSPIRATION)
│   ├── snake-math-vue/          # Previous Vue/Bootstrap implementation (INSPIRATION)
│   └── SnakeMath/               # Archived SnakeMath documents (OLD DOCS GO HERE)
├── docs/
│   ├── CLAUDE_CODE_WORKFLOW.md  # Implementation guide for Claude Code (NEW)
│   ├── PLANNING_WORKFLOW.md     # Planning ↔ Implementation cycle (NEW)
│   ├── CURRENT_STATE.md         # Current project state
│   ├── DECISIONS.md             # Technical decisions log
│   ├── LL_LI.md                 # Lessons Learned / Lessons Identified
│   ├── DESIGN_SYSTEM.md         # UI patterns and conventions
│   ├── TESTING.md               # Testing documentation
│   └── VISUAL_TESTING.md        # Visual regression testing
└── src/                         # Source code
```

### Naming Convention
- All documentation files use UPPER_SNAKE_CASE (e.g., `CLAUDE_CODE_WORKFLOW.md`, `LL_LI.md`)
- The `archive/` folder structure:
  - `archive/snake-math/` - VitePress implementation (inspiration source)
  - `archive/snake-math-vue/` - Vue/Bootstrap implementation (inspiration source)
  - `archive/SnakeMath/` - Old SnakeMath documents that have been superseded

## Task 1: Update CLAUDE.md

Rewrite `CLAUDE.md` to be a comprehensive project guide that:

1. **Opens with project overview** - What SnakeMath is, core philosophy ("Sigma is a for loop")

2. **References the development workflow**
   - Point to `docs/CLAUDE_CODE_WORKFLOW.md` for implementation guidelines
   - Point to `docs/PLANNING_WORKFLOW.md` for the full development cycle
   - Explain that phases come from planning sessions with Phase Plan documents

3. **References key documentation**
   - `ROADMAP_V2.md` - Strategic direction and phase status
   - `docs/CURRENT_STATE.md` - What's currently implemented
   - `docs/DECISIONS.md` - Why things are built the way they are
   - `docs/LL_LI.md` - Lessons learned and patterns identified
   - `docs/DESIGN_SYSTEM.md` - UI patterns, component conventions, styling
   - `docs/TESTING.md` - Testing strategy and commands

4. **Explains archive usage**
   - `archive/snake-math/docs/` - Content inspiration (adapt, don't copy)
   - `archive/snake-math/docs/.vitepress/theme/components/` - Widget reference
   - Archive inventory documents in project files for quick reference
   - `archive/SnakeMath/` - Old project docs (historical reference only)

5. **Includes essential quick reference**
   - Key commands (dev, test, build)
   - File locations for common tasks
   - Numbering conventions (R-XXX, D-XXX, LL-XXX, LI-XXX)

6. **Emphasizes the "programmer-relatable" philosophy**
   - Connect math to code constructs
   - Show NumPy/Python equivalents
   - Reference algorithms and complexity
   - Include ML/AI applications

## Task 2: Verify Document References

Check that references in the following files use correct paths and naming:

1. `docs/CLAUDE_CODE_WORKFLOW.md` - Verify all file paths are correct
2. `docs/PLANNING_WORKFLOW.md` - Verify all file paths are correct
3. `ROADMAP_V2.md` - Check any doc references

Update any incorrect references (e.g., `ll_li.md` → `LL_LI.md`).

## Task 3: Archive Old Documents

If any of these exist and are superseded, move them to `archive/SnakeMath/`:
- Old phase plan documents that have been completed
- Superseded workflow documents
- Any duplicate or outdated documentation

## Implementation Notes

### CLAUDE.md Structure Suggestion

```markdown
# SnakeMath - Claude Code Guide

## Project Overview
[What SnakeMath is, philosophy]

## Development Workflow
[Reference to workflow docs, how phases work]

## Documentation Reference
[Table of key docs with purposes]

## Archive Usage
[How to use archive content as inspiration]

## Quick Reference
[Commands, file locations, conventions]

## Code Standards
[Brief standards or reference to where they live]
```

### Key Principles to Embed

1. **Phase-driven development**: Work comes from Phase Plan documents created in planning sessions
2. **Archive as inspiration**: Transform old content to current stack (Vue 3, Tailwind, KaTeX)
3. **Programmer-relatable**: Every math concept connects to programming
4. **Document everything**: Decisions get D-XXX, lessons get LL/LI-XXX
5. **Follow the design system**: Consistent UI patterns from `docs/DESIGN_SYSTEM.md`

## Verification

After completing updates:

```bash
# Verify no broken internal references
grep -r "ll_li.md\|decisions.md\|current_state.md" docs/ CLAUDE.md ROADMAP_V2.md

# Check document exists
ls -la docs/CLAUDE_CODE_WORKFLOW.md docs/PLANNING_WORKFLOW.md docs/LL_LI.md docs/DECISIONS.md docs/CURRENT_STATE.md docs/DESIGN_SYSTEM.md

# Verify CLAUDE.md updated
head -50 CLAUDE.md
```

## Success Criteria

- [ ] `CLAUDE.md` comprehensively references all workflow and documentation
- [ ] All document references use correct UPPER_SNAKE_CASE naming
- [ ] Archive structure is clear (inspiration vs. old docs)
- [ ] Workflow integration is complete
- [ ] Any old/superseded docs moved to `archive/SnakeMath/`
