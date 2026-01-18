# Phase XX: <PHASE TITLE>

**Theme**: *<One-line, memorable theme>*

**Goal**: <1–2 sentences describing the interactive widget(s), what the learner will be able to do, and the programmer framing.>

---

## Strategic Context

<Explain why this phase matters in the broader arc of SnakeMath (previous phases it builds on, next phases it unlocks).>

### Why This Matters (Programmer Framing)

| Concept | Programming Analogy | Why It Matters |
|--------|----------------------|----------------|
| <Concept A> | <Analogy A> | <Reason A> |
| <Concept B> | <Analogy B> | <Reason B> |
| <Concept C> | <Analogy C> | <Reason C> |

<Optional: 1–2 lines connecting to real-world use cases (A/B testing, monitoring, ML, etc.).>

---

## Confirmed Decisions

| ID | Decision | Rationale |
|----|----------|-----------|
| **D-XXX** | <Decision 1> | <Why this choice is best / trade-offs> |
| **D-XXX** | <Decision 2> | <Why> |
| **D-XXX** | <Decision 3> | <Why> |

Notes:
- Prefer decisions that constrain scope and reduce ambiguity (what’s included, what’s not, UX patterns, security constraints, etc.).
- If you expect a later revision, explicitly mark it as “tentative”.

---

## Scope

### In Scope
- **<PrimaryWidgetName> widget**: <what it teaches / demonstrates>
- **<Panel/Feature A>**: <what it does>
- **Math utilities**: <what must exist in `src/utils/math/...`>
- **Content page**: <route/view name, programmer framing>
- **E2E tests**: <high-level interactions + accessibility>

### Out of Scope (Future Enhancement)
- <Nice-to-have feature 1>
- <Nice-to-have feature 2>
- <Complex extension 3>

---

## Widget Design: <PrimaryWidgetName>

### Architecture

```
src/components/widgets/<PrimaryWidgetName>/
├── <PrimaryWidgetName>.vue           # Main orchestrator
├── <SubcomponentA>.vue               # <purpose>
├── <SubcomponentB>.vue               # <purpose>
├── <SubcomponentC>.vue               # <purpose>
└── index.ts
```

### Visual Layout

```
┌─────────────────────────────────────────────────────────────────┐
│  <Header: widget title / selectors>                              │
├─────────────────────────────────────────────────────────────────┤
│  <Controls / parameters / toggles>                               │
├─────────────────────────────────────────────────────────────────┤
│  <Primary visualization area (SVG/canvas/chart/grid)>            │
├─────────────────────────────────────────────────────────────────┤
│  <Results / stats / interpretation>                              │
├─────────────────────────────────────────────────────────────────┤
│  <Presets / quick scenarios>                                     │
└─────────────────────────────────────────────────────────────────┘
```

### Controls / Parameters

| Control | Meaning | Constraints | Default |
|---------|---------|-------------|---------|
| <Param A> | <Meaning> | <Constraint> | <Default> |
| <Param B> | <Meaning> | <Constraint> | <Default> |

Guidelines:
- Prefer sliders + numeric inputs with validation.
- Write constraints in math/logic terms (e.g. $0 < p < 1$, $n \ge 1$, $a < b$).
- Defaults should demonstrate the concept clearly.

### Presets

| Name | Setup | Parameters | Use Case |
|------|-------|------------|----------|
| <Preset 1> | <mode/distribution/dataset> | <key params> | <real-world scenario> |
| <Preset 2> | <...> | <...> | <...> |

### Optional: Demo / Mode Panel

<If this phase includes a special mode (e.g., “CLT Demo”, “Coverage Simulation”, “Outlier Impact”), outline it here.>

```
┌─────────────────────────────────────────────────────────────────┐
│  <Mode Panel Title>                                              │
│                                                                  │
│  <Key inputs>                                                    │
│  <Primary mini-visualization>                                    │
│                                                                  │
│  [Primary Action] [Reset] [Auto-run]                             │
└─────────────────────────────────────────────────────────────────┘
```

---

## Math Utilities

### `src/utils/math/<module>.ts`

<Describe the core API surface you’ll implement. Prefer TypeScript signatures.>

```ts
// ============== Types ==============

export type <DomainType> = '<option-a>' | '<option-b>' | '<option-c>';

export interface <ConfigType> {
  // ...
}

export interface <ResultType> {
  // ...
}

// ============== Core Functions ==============

export function <coreFunction>(...args: any[]): <ResultType>;

// ============== Supporting Utilities ==============

export function <utilityFunction>(...args: any[]): number;
```

### Test Coverage Target

- **Unit tests**: <e.g. 60+ / 80+ / 100+>
- Key scenarios:
  - Edge cases: <list>
  - Known values: <list>
  - Invariants: <monotonic, sums to 1, ranges, symmetry, etc.>
  - Performance constraints: <if relevant>

---

## Content Structure

### Page

- Route: `/<section>/<slug>`
- View: `<ViewName>.vue`

### Sections

1. **Introduction** (expanded)
   - <hook sentence>
   - <3 analogies block>

2. **Core Concept** (expanded)
   - <explain the idea>
   - <code snippet references>

3. **Widget: <PrimaryWidgetName>** (expanded)
   - Full interactive widget

4. **Deep Dives** (collapsed)
   - <topic A>
   - <topic B>

5. **Common Pitfalls** (collapsed)
   - <pitfall A>
   - <pitfall B>

6. **In Python** (collapsed)
   - <NumPy/SciPy/sklearn/stdlib mapping>

7. **Related Topics**
   - <Prereq> (foundation)
   - <Next topic> (uses this phase)

---

## Increments

<Break the phase into small, independently shippable chunks. Keep each increment tight, with clear success criteria.>

### Increment XXA: <Foundation / Math Utilities> (~<time>)

**Tasks**:
1. Create `src/utils/math/<module>.ts`
2. Implement <core math>
3. Implement <helper utilities>
4. Create `src/utils/math/<module>.test.ts` (<target test count>)

**Files**:
- `src/utils/math/<module>.ts` (new)
- `src/utils/math/<module>.test.ts` (new)
- `src/types/<domain>.ts` (new or extend)

**Success Criteria**:
- All tests pass
- Known values match reference results
- Edge cases handled

---

### Increment XXB: <Composable & State> (~<time>)

**Tasks**:
1. Create `src/composables/use<PrimaryWidgetName>.ts`
2. Implement state + validation
3. Implement URL sync (if needed)
4. Implement presets
5. Add composable tests

**Files**:
- `src/composables/use<PrimaryWidgetName>.ts` (new)
- `src/composables/use<PrimaryWidgetName>.test.ts` (new)

**Success Criteria**:
- State transitions preserve validity
- Constraints enforced
- Presets load correctly

---

### Increment XXC: <Widget Core> (~<time>)

**Tasks**:
1. Scaffold widget component structure
2. Build selector(s) and controls
3. Build visualization
4. Build results/interpretation panel
5. Wire up orchestrator

**Files**:
- `src/components/widgets/<PrimaryWidgetName>/*.vue` (new)

**Success Criteria**:
- Core interactions work end-to-end
- Responsive layout is acceptable
- Accessibility basics in place (labels, keyboard focus)

---

### Increment XXD: <Advanced Panels + E2E> (~<time>)

**Tasks**:
1. Implement <advanced panel A>
2. Implement <advanced panel B>
3. Add e2e tests for critical paths
4. Add accessibility audits

**Files**:
- `e2e/<category>/<widget>.spec.ts` (new)
- `e2e/accessibility/<page>.spec.ts` (extend)

**Success Criteria**:
- E2E tests cover main flows
- A11y checks pass for the page/widget

---

## Open Questions (Optional)

- <Question 1>
- <Question 2>

## Risks & Mitigations (Optional)

| Risk | Impact | Mitigation |
|------|--------|------------|
| <risk> | <impact> | <mitigation> |
