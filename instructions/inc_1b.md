# Increment 1B: Tailwind CSS Integration

## Context
Continuing from the initialized Vue 3 + TypeScript project. We need Tailwind CSS for styling with a custom configuration suitable for an educational math site.

## Task
Install and configure Tailwind CSS with PostCSS.

## Requirements
1. Install Tailwind CSS, PostCSS, and Autoprefixer as dev dependencies.

2. Initialize Tailwind with `npx tailwindcss init -p` to create both `tailwind.config.js` and `postcss.config.js`.

3. Configure `tailwind.config.js`:
   - Content paths should include `./index.html` and `./src/**/*.{vue,js,ts,jsx,tsx}`
   - Extend the theme with:
     - Custom colors for the brand (a "snake green" primary: emerald-600 as base)
     - Font family: Inter as primary sans-serif (we'll load via Google Fonts)
   - Enable dark mode with `class` strategy (not `media`)

4. Create the main CSS file at `src/assets/styles/main.css` with:
   - Tailwind directives (@tailwind base, components, utilities)
   - CSS custom properties for theme colors (both light and dark)
   - Base styles for the html/body elements
   - A `.dark` class scope for dark mode variables

5. Import this CSS file in `src/main.ts`.

6. Update `App.vue` to use a simple Tailwind class (e.g., a colored background) to verify the setup works.

## Success Criteria
- `npm run dev` shows Tailwind styles applied
- Dark mode classes work when `.dark` is added to the html element
- No PostCSS or build warnings
- `npm run build` still completes successfully

## Constraints
- Do not add component libraries (like Headless UI) yet
- Keep configuration minimal but extensible
- Use CSS custom properties for colors to support theming