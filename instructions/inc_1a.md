# Increment 1A: Project Initialization

## Context
SnakeMath is an educational mathematics website targeting programmers. It uses Vue 3 + TypeScript + Vite + Tailwind CSS. The project will be deployed to GitHub Pages.

## Task
Initialize the Vue 3 project with TypeScript in the current repository root.

## Requirements
1. Use `npm create vue@latest` with these options:
   - TypeScript: Yes
   - JSX: No
   - Vue Router: Yes
   - Pinia: No (not needed for MVP)
   - Vitest: Yes
   - End-to-End Testing: No
   - ESLint: Yes
   - Prettier: Yes

2. Since we're in an existing repo with possibly a README, initialize in-place (select current directory) or handle the existing files appropriately.

3. After scaffolding, verify the project runs with `npm run dev`.

## Success Criteria
- `npm run dev` starts the development server without errors
- `npm run build` completes successfully
- `npm run type-check` passes
- Project structure follows Vue 3 conventions

## Constraints
- Do not install additional dependencies yet (Tailwind comes in next increment)
- Keep the default Vue starter content for now (we'll replace it later)
- Ensure `vite.config.ts` is TypeScript, not JavaScript