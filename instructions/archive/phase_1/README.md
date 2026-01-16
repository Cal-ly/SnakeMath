# SnakeMath - Claude Code Instructions

This folder contains incremental task instructions for Claude Code to build the SnakeMath project.

## How to Use

1. Open VS Code with Claude Code extension
2. Open the instruction file for the current increment
3. Provide the file content to Claude Code as context
4. Claude Code will execute the tasks described

## Phase 1: Project Scaffold

| File | Description | Est. Time |
|------|-------------|-----------|
| `inc_1a.md` | Project initialization (Vue 3 + TS + Vite) | 15 min |
| `inc_1b.md` | Tailwind CSS setup with theming | 20 min |
| `inc_1c.md` | Project structure and Vue Router | 30 min |
| `inc_1d.md` | TypeScript type definitions | 20 min |
| `inc_1e.md` | Vitest configuration and initial tests | 30 min |
| `inc_1f.md` | GitHub Pages deployment | 20 min |
| `inc_1g.md` | ESLint and Prettier configuration | 15 min |

**Total Phase 1**: ~2.5 hours

## Execution Order

Execute increments in order (1a → 1b → 1c → ...). Each increment builds on the previous one.

After each increment:
1. Verify success criteria are met
2. Commit changes: `git add . && git commit -m "Complete increment 1X"`
3. Proceed to next increment

## Phase 2 (Coming Soon)

- Layout components (Header, Navigation)
- Theme switching
- Breadcrumbs
- TopicPage wrapper

## Phase 3 (Coming Soon)

- Content components (MathBlock, CodeExample)
- KaTeX integration
- Symbol tables

## Phase 4 (Coming Soon)

- NumberTypeExplorer widget
- Content migration

## Notes

- Each increment is self-contained with clear success criteria
- Instructions reference `CLAUDE.md` for project conventions
- Archive folder contains old code for reference (excluded from build)
