# Phase 21 Implementation Handover: Integration (Integral Calculus)

**Purpose**: This document provides all necessary context to implement Phase 21. Start with Increment 21A and proceed sequentially through 21F.

---

## Quick Start

**Your task**: Implement the IntegrationExplorer widget and content page for `/calculus/integration`.

**Start with**: Increment 21A (Math Utilities & Types)

---

## Planning Documents

| Document | Purpose |
|----------|---------|
| [PHASE_21_PLAN.md](./PHASE_21_PLAN.md) | Master plan with decisions, scope, architecture |
| [INCREMENT_21A.md](./INCREMENT_21A.md) | Math utilities & types (start here) |
| [INCREMENT_21B.md](./INCREMENT_21B.md) | Composable & state management |
| [INCREMENT_21C.md](./INCREMENT_21C.md) | Widget core components |
| [INCREMENT_21D.md](./INCREMENT_21D.md) | Convergence animation |
| [INCREMENT_21E.md](./INCREMENT_21E.md) | Content page |
| [INCREMENT_21F.md](./INCREMENT_21F.md) | E2E tests & polish |

---

## Key Decisions Already Made

| ID | Decision |
|----|----------|
| D-120 | Widget name: `IntegrationExplorer` |
| D-121 | Single view with collapsible panels (not tabs) |
| D-122 | Preset-based functions only (no arbitrary input) |
| D-123 | Include Simpson's rule in core scope |
| D-124 | Signed area: blue positive, red negative |
| D-125 | Smooth n increment animation with easing |
| D-126 | Focus on geometric interpretation |
| D-127 | URL state sync for shareable configurations |

---

## Implementation Order

```
21A: Math Utilities ──► 21B: Composable ──► 21C: Widget Components
                                                      │
                                                      ▼
                        21F: E2E Tests ◄── 21E: Content Page ◄── 21D: Animation
```

**Each increment is self-contained with:**
- Complete code to implement
- File checklist
- Success criteria
- Testing instructions

---

## Reference Files (Patterns to Follow)

| Pattern | Reference File |
|---------|---------------|
| Math utilities | `src/utils/math/derivative.ts` |
| Composable | `src/composables/useDerivative.ts` |
| Widget structure | `src/components/widgets/DerivativeVisualizer/` |
| Content page | `src/views/calculus/DerivativesView.vue` |
| Types | `src/types/math.ts` |

---

## What You're Building

**IntegrationExplorer Widget:**
- Visualizes definite integrals as area under curves
- Shows Riemann sums (left, right, midpoint, trapezoidal, Simpson's)
- Animates convergence as n → ∞
- 8 preset functions with known antiderivatives

**Content Page (`/calculus/integration`):**
- Three-analogy block (everyday, programming, visual)
- Embedded IntegrationExplorer widget
- Riemann sum explanation with code examples
- Fundamental Theorem of Calculus section
- Python integration examples (scipy, numpy)

---

## Success Criteria

Phase 21 is complete when:

1. ✅ `npm run type-check` passes
2. ✅ `npm run lint` passes
3. ✅ `npm run test` passes (70+ integration tests)
4. ✅ `npm run build` succeeds
5. ✅ Widget renders at `/calculus/integration`
6. ✅ All 5 Riemann methods work
7. ✅ Convergence animation works
8. ✅ URL state sync works
9. ✅ E2E tests pass
10. ✅ Accessibility audit passes

---

## Lessons Learned to Apply

| ID | Lesson | Action |
|----|--------|--------|
| LL-015 | URL state sync requires debouncing | Use 300ms debounce |
| LL-068 | Computed properties need explicit returns | Add default cases to switches |
| LL-070 | Use HTML entities for `<` `>` in templates | Use `&lt;` `&gt;` |
| LI-011 | SVG for data visualizations | Use SVG for canvas |
| LI-024 | Preset-based widget pattern | Don't allow arbitrary input |

---

## Commands

```bash
# Development
npm run dev

# Verification (run before each commit)
npm run type-check && npm run lint && npm run test

# Full build
npm run build

# E2E tests (requires dev server running)
npm run test:e2e
```

---

## Getting Started

1. Read [INCREMENT_21A.md](./INCREMENT_21A.md)
2. Extend `src/types/math.ts` with integration types
3. Create `src/utils/math/integration.ts`
4. Create `src/utils/math/integration.test.ts`
5. Run `npm run test -- integration` to verify
6. Proceed to Increment 21B

---

**Ready to implement!** Start with Increment 21A.
