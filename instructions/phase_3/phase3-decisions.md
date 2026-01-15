# Phase 3 Decisions - Add to decisions.md

## Phase 3 Decisions

### D-021: KaTeX over MathJax
**Decision**: Use KaTeX for math rendering instead of MathJax.

**Rationale**:
- Smaller bundle (~200KB vs ~1MB)
- Faster rendering (important for reactive widgets)
- Sufficient feature set for educational content
- Better performance on mobile

**Trade-offs**:
- Slightly smaller feature set
- Some advanced LaTeX commands not supported

---

### D-022: Shiki for Syntax Highlighting
**Decision**: Use Shiki instead of Prism.js or highlight.js.

**Rationale**:
- VSCode-quality highlighting accuracy
- Used by VitePress (familiar ecosystem)
- Excellent theme support (GitHub light/dark)
- Better for Python code specifically

**Trade-offs**:
- Larger bundle than Prism.js
- Async loading required (not synchronous)
- Singleton pattern needed for efficiency

**Implementation**: `useHighlighter` composable manages singleton instance.

---

### D-023: CodeExample Feature Set
**Decision**: Include copy button, optional line numbers, title, and collapsible in MVP.

**Rationale**:
- Copy button is high utility (users copy code constantly)
- Line numbers help with references but add clutter
- Title/filename provides context
- Collapsible helps with long examples

**Default behavior**: Title shown, line numbers off, not collapsible.

---

### D-024: Responsive Hybrid Layout for SymbolTable
**Decision**: Use table layout on desktop (md+), card layout on mobile.

**Rationale**:
- Tables are dense and scannable on desktop
- Cards feel more native on mobile
- Avoids tiny text or excessive scrolling
- Progressive enhancement pattern

**Implementation**: CSS breakpoint at `md` (768px) switches layout.

---

### D-025: Copy Button Visual Feedback
**Decision**: Subtle icon change (copy → checkmark) with brief scale animation.

**Rationale**:
- Clear confirmation without being disruptive
- Icon change is universally understood
- Scale animation draws attention without flashiness
- Respects `prefers-reduced-motion`

**Duration**: 2 seconds before reverting to copy icon.

---

### D-026: TabGroup Hybrid API
**Decision**: Use props for tab labels, dynamic slots for content.

**Rationale**:
- Props give type-safe tab definitions and control order
- Slots provide maximum flexibility for content
- Cleaner than named slots (`#tab-arithmetic`)
- Works well with v-for for dynamic tabs

**API Example**:
```vue
<TabGroup :tabs="['A', 'B', 'C']">
  <template #A>Content A</template>
  <template #B>Content B</template>
  <template #C>Content C</template>
</TabGroup>
```

---

### D-027: Symbol Data Split by Category
**Decision**: Separate symbol data into category files rather than single file.

**Rationale**:
- More maintainable (edit arithmetic without touching calculus)
- Potential tree-shaking benefits
- Matches mental model of symbol categories
- Easier for contributors to add symbols

**Categories**: arithmetic, algebra, calculus, sets, logic, constants, greek, ml

---

### D-028: Defer MathBlock Copy LaTeX Feature
**Decision**: Do not include "copy LaTeX" feature in MathBlock for MVP.

**Rationale**:
- Adds complexity (UI for copy button in display mode)
- Primary use case is viewing, not copying
- Can be added later if users request it
- Focus on core functionality first

---

### D-029: ContentSection with Optional Collapsibility
**Decision**: ContentSection can be static or collapsible via prop.

**Rationale**:
- Not all sections need to collapse
- Collapsible useful for long/optional content
- Anchor links should work for both modes
- Reuses CollapsiblePanel component

**Implementation**: `collapsible` prop toggles behavior.

---

### D-030: Greek Letters as Separate Data Structure
**Decision**: Greek letters use `GreekLetter` type with uppercase/lowercase variants.

**Rationale**:
- Greek letters have predictable structure (both cases)
- CommonUses more relevant than programmingAnalogy
- Can be transformed to MathSymbol for table display
- Separate type is more accurate

**Conversion**: `greekAsSymbols` computed property for SymbolTable compatibility.
