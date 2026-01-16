# SnakeMath - Increment 1A: Project Initialization

## Context
SnakeMath is an educational mathematics website targeting programmers. It uses Vue 3 + TypeScript + Vite + Tailwind CSS. The project will be deployed to GitHub Pages.

The repository already exists and has been cloned locally. There may be existing files (README.md, archive folder, etc.) that should be preserved.

## Task
Initialize the Vue 3 project with TypeScript in the current repository.

## Requirements

### 1. Vue Project Initialization
Use `npm create vue@latest .` (note the `.` for current directory) with these options:
- Project name: Keep as-is (SnakeMath)
- TypeScript: Yes
- JSX: No
- Vue Router: Yes
- Pinia: No (not needed for MVP)
- Vitest: Yes
- End-to-End Testing: No
- ESLint: Yes
- Prettier: Yes

If prompted about existing files, preserve them (especially `archive/`, `README.md`, `CLAUDE.md`, `instructions/`).

### 2. Post-Initialization
After scaffolding:
1. Run `npm install` to install dependencies
2. Verify with `npm run dev` - should start without errors
3. Verify with `npm run build` - should complete successfully
4. Verify with `npm run type-check` - should pass

### 3. Preserve Existing Structure
Ensure these existing items are not overwritten:
- `archive/` - Previous implementation reference
- `instructions/` - Claude Code task files
- `CLAUDE.md` - Project conventions
- `README.md` - If it exists and has custom content

## Success Criteria
- [ ] `npm run dev` starts the development server without errors
- [ ] `npm run build` completes successfully
- [ ] `npm run type-check` passes
- [ ] Existing `archive/` folder is preserved
- [ ] Existing `instructions/` folder is preserved
- [ ] `CLAUDE.md` is preserved
- [ ] `vite.config.ts` exists (TypeScript, not JavaScript)
- [ ] `tsconfig.json` exists with proper Vue configuration

## Constraints
- Do not install additional dependencies yet (Tailwind comes in increment 1B)
- Keep the default Vue starter content for now (we'll replace it later)
- Do not modify or delete the `archive/` directory
- Do not modify or delete the `instructions/` directory

## Next Increment
After completion, proceed to `inc_1b.md` for Tailwind CSS setup.
