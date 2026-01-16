# SnakeMath - Claude Code Instructions

This folder contains incremental task instructions for Claude Code to build the SnakeMath project.

## How to Use

1. Open VS Code with Claude Code extension
2. Open the instruction file for the current increment
3. Provide the file content to Claude Code as context
4. Claude Code will execute the tasks described

## Phase 1: Project Scaffold ✅

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

## Phase 2: Layout & Navigation

| File | Description | Est. Time |
|------|-------------|-----------|
| `inc_2a.md` | Theme composable (system preference + persistence) | 20 min |
| `inc_2b.md` | AppHeader (sticky, navigation, Font Awesome) | 25 min |
| `inc_2c.md` | Mobile navigation (slide-out drawer) | 25 min |
| `inc_2d.md` | Breadcrumbs (horizontal scroll on mobile) | 15 min |
| `inc_2e.md` | TopicPage layout wrapper | 20 min |
| `inc_2f.md` | AppFooter | 10 min |
| `inc_2g.md` | Shell integration & accessibility checklist | 20 min |

**Total Phase 2**: ~2.5 hours

## Execution Order

Execute increments in order (1a → 1b → ... → 2a → 2b → ...). Each increment builds on the previous one.

After each increment:
1. Verify success criteria are met
2. Commit changes: `git add . && git commit -m "Complete increment 2X"`
3. Proceed to next increment

## Phase 3: Content Components

| File | Description | Est. Time |
|------|-------------|-----------|
| `inc_3a.md` | KaTeX + MathBlock component | 25 min |
| `inc_3b.md` | Shiki + CodeExample component | 30 min |
| `inc_3c.md` | CollapsiblePanel + ContentSection | 20 min |
| `inc_3d.md` | TabGroup (accessible tabs) | 25 min |
| `inc_3e.md` | Symbol data files (split by category) | 20 min |
| `inc_3f.md` | SymbolTable (responsive, searchable) | 30 min |
| `inc_3g.md` | Content integration & testing | 25 min |

**Total Phase 3**: ~3 hours

## Execution Order

Execute increments in order (1a → 1b → ... → 2a → 2b → ... → 3a → ...). Each increment builds on the previous one.

After each increment:
1. Verify success criteria are met
2. Commit changes: `git add . && git commit -m "Complete increment 3X"`
3. Proceed to next increment

## Phase 4: Interactive Widgets

| File | Description | Est. Time |
|------|-------------|-----------|
| `inc_4a.md` | NumberInput component with validation | 25 min |
| `inc_4b.md` | NumberTypeExplorer widget | 35 min |
| `inc_4c.md` | URL state synchronization | 25 min |
| `inc_4d.md` | Visualizations (number line, Venn) | 35 min |
| `inc_4e.md` | Content migration from archive | 30 min |
| `inc_4f.md` | Integration & polish | 25 min |

**Total Phase 4**: ~3 hours

## Execution Order

Execute increments in order (1a → 1b → ... → 4a → 4b → ...). Each increment builds on the previous one.

After each increment:
1. Verify success criteria are met
2. Commit changes: `git add . && git commit -m "Complete increment 4X"`
3. Proceed to next increment

## Phase 5 (Future)

- Additional widgets (Quadratic Explorer, etc.)
- More content migration from archive
- Advanced topics (Linear Algebra, Calculus)
- Performance optimization, PWA features

## Design Decisions (Phase 4)

- **NumberInput validation**: Inline below input
- **Explorer layout**: Responsive vertical/two-column
- **Set visualization**: Checklist + toggleable Venn diagram
- **Number line**: Auto-zoom with reasonable bounds
- **URL state**: Query params format (`?n=42`)
- **Visualizations**: Toggleable (user controls visibility)

## Archive Reference

Claude Code has access to archive content for reference:
- `archive/snake-math/` - Markdown-based content (primary source)
- `archive/snake-math-vue/` - Vue components (for patterns)

Important: **Adapt, don't copy** - Rewrite content to fit new tech stack.
- Interactive components

## Design Decisions (Phase 2)

- **Primary color**: Dark Emerald Green `#27592D`
- **Favicon**: Snake emoji 🐍
- **Icons**: Font Awesome (outlined style)
- **Mobile nav**: Slide-out drawer from right
- **Theme**: System preference with user override
- **Header**: Sticky
- **Breadcrumbs**: Full path with horizontal scroll
- **Theme toggle**: In mobile menu only

## Notes

- Each increment is self-contained with clear success criteria
- Instructions reference `CLAUDE.md` for project conventions
- Archive folder contains old code for reference (excluded from build)
- See `decisions.md` for rationale behind technical choices
- See `ll_li.md` for lessons learned during development
