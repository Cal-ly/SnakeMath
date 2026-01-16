# SnakeMath Current State

## Intent
This document outlines the current state of the project for easy resumption after a pause.

---

## Current Status: Phase 5 Complete, Phase 6 Next

**Last Updated**: 2026-01-16

### Project Summary

SnakeMath is an educational mathematics website for programmers. Five phases of development have established:

| Phase | Focus | Key Deliverables | Status |
|-------|-------|------------------|--------|
| 1 | Foundation | Vite, Vue 3, TypeScript, Tailwind, Vitest | ✅ Complete |
| 2 | App Shell | Header, nav, breadcrumbs, theme toggle, footer | ✅ Complete |
| 3 | Content Components | MathBlock (KaTeX), CodeExample (Shiki), tabs, panels | ✅ Complete |
| 4 | Interactive Widgets | NumberTypeExplorer, visualizations, URL state | ✅ Complete |
| 5 | Algebra & Summation | SummationExplorer, bar chart, code parallel | ✅ Complete |
| **6** | **Basics Completion** | **E2E tests, Functions, Variables, Order of Ops** | 🎯 **Next** |

### What's Live

**Content Sections**:
- `/basics` - Number types, symbols, foundations
- `/algebra` - Summation notation (flagship demo)

**Interactive Widgets**:
- **NumberTypeExplorer**: Classify numbers, Venn diagram, number line
- **SummationExplorer**: Presets, bar chart animation, code parallel, formula comparison

**Supporting Infrastructure**:
- 105 passing tests
- URL state sync for shareable widget links
- KaTeX math rendering, Shiki syntax highlighting
- Responsive design, dark/light theme
- GitHub Pages deployment

---

## Quick Reference

### Key Commands
```bash
npm run dev          # Start dev server
npm run type-check   # TypeScript validation
npm run lint         # ESLint check
npm run test         # Run all tests
npm run build        # Production build
```

### Key Files
| Purpose | File |
|---------|------|
| Project guide | `CLAUDE.md` |
| Roadmap | `docs/ROADMAP.md` |
| Decisions | `docs/decisions.md` |
| Lessons learned | `docs/ll_li.md` |
| Routes | `src/router/index.ts` |
| Navigation data | `src/data/navigation.ts` |
| Type definitions | `src/types/index.ts` |

### Archived Documentation
Phase completion summaries are in `docs/archive/`:
- `PHASE_3_COMPLETE.md` - Content components
- `PHASE_4_COMPLETE.md` - Interactive widgets
- `PHASE_5_COMPLETE.md` - Algebra & summation

---

## How to Resume Development

1. **Read the roadmap**: `docs/ROADMAP.md` for Phase 6 details
2. **Check instructions**: `instructions/phase_6/` when created
3. **Start dev server**: `npm run dev`
4. **Verify before commits**:
   ```bash
   npm run type-check && npm run lint && npm run test && npm run build
   ```

---

## Known Build Notes

- **Chunk Size Warnings**: Shiki produces large language chunks (lazy-loaded, acceptable)
- **v-html Warnings**: ESLint warns about v-html in MathBlock/CodeExample (expected, trusted content)
