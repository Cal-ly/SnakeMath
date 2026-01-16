# Phase 4 Decisions - Add to decisions.md

## Phase 4 Decisions

### D-031: NumberInput Validation Feedback
**Decision**: Show validation feedback inline below the input field.

**Rationale**:
- Clearest for educational context
- Users see errors immediately without hovering
- Consistent with form best practices
- Works well on mobile

**Alternative rejected**: Tooltips (less visible, hover-dependent).

---

### D-032: NumberTypeExplorer Responsive Layout
**Decision**: Two-column layout on desktop (input left, results right), stacked on mobile.

**Rationale**:
- Maximizes screen usage on desktop
- Natural reading flow on mobile
- Results visible alongside input for comparison
- Standard responsive pattern

**Breakpoint**: `lg` (1024px) for side-by-side layout.

---

### D-033: Set Visualization with Checklist + Optional Venn
**Decision**: Show set membership as a checklist always, with toggleable Venn diagram.

**Rationale**:
- Checklist is immediately scannable
- Venn diagram adds visual learning
- User choice respects different learning styles
- Keeps default view clean

**Default state**: Both visualizations visible initially.

---

### D-034: Number Line Auto-Zoom with Bounds
**Decision**: Auto-zoom to fit the entered number, clamped to reasonable bounds.

**Rationale**:
- Values like 1000 need different scale than values like 5
- Auto-zoom provides appropriate context
- Bounds prevent extreme zoom levels
- Tick marks adjust to scale

**Default range**: -10 to 10 when value fits.

---

### D-035: URL State via Query Parameters
**Decision**: Sync widget state to URL using query params (`?n=42`).

**Rationale**:
- Standard, widely understood format
- Works with Vue Router
- Easy to copy and share
- Doesn't affect routing
- URI-encoding handles special characters

**Implementation**: 
- Debounced updates (300ms) to prevent history spam
- Uses `router.replace` to avoid back-button issues
- Encodes special characters (e.g., `3+4i` → `3%2B4i`)

---

### D-036: useUrlState Composable Design
**Decision**: Create a reusable composable for bi-directional URL state sync.

**Rationale**:
- Reusable for future widgets
- Encapsulates complexity (encoding, debouncing, sync)
- Follows Vue composition API patterns
- Testable in isolation

**Features**:
- Debounced URL updates
- Browser back/forward support
- URI encoding/decoding
- Default value handling

---

### D-037: Toggleable Visualizations
**Decision**: Allow users to show/hide number line and Venn diagram independently.

**Rationale**:
- Different users prefer different visual aids
- Reduces clutter for those who don't need visuals
- Respects user preference
- Keeps interface flexible

**Default**: Both visible initially.

---

### D-038: Content Migration Strategy
**Decision**: Adapt archive content rather than copy directly.

**Rationale**:
- New tech stack requires different component structure
- Tone and style should be consistent with new design
- Opportunity to improve and update content
- Avoids technical debt from old patterns

**Archive sources**:
- `archive/snake-math/docs/` for content
- `archive/snake-math-vue/src/components/` for patterns

---

### D-039: Example Numbers Data Structure
**Decision**: Create dedicated `exampleNumbers.ts` with categorized examples.

**Rationale**:
- Reusable across components
- Categorized for different use cases
- Includes descriptions for tooltips
- Easy to extend

**Categories**: natural, integer, rational, irrational, complex, special.

---

### D-040: SetMembershipDisplay as Separate Component
**Decision**: Extract set membership display into its own component.

**Rationale**:
- Single responsibility (just displays membership)
- Reusable in other contexts
- Cleaner NumberTypeExplorer code
- Easier to style independently

**Props**: Array of sets with `isMember` boolean.

---

### D-041: NumberProperties Panel
**Decision**: Show additional number properties (sign, parity, primality) in a dedicated panel.

**Rationale**:
- Educational value in showing properties
- Leverages existing `getNumberProperties` utility
- Helps users understand number characteristics
- Grid layout keeps it scannable

**Properties shown**: type, sign, integer status, even/odd, prime, absolute value, complex parts.

---

### D-042: Venn Diagram as Nested Circles
**Decision**: Visualize set hierarchy with nested, offset circles.

**Rationale**:
- Classic mathematical representation
- Clearly shows containment relationship
- Color coding aids recognition
- SVG allows clean scaling

**Design**: Circles offset to left to show labels in "outer ring" of each set.

---

### D-043: Number Line Tick Mark Algorithm
**Decision**: Calculate "nice" tick intervals dynamically based on range.

**Rationale**:
- Fixed ticks don't work for all scales
- Nice numbers (1, 2, 5, 10 multiples) are easier to read
- Algorithm adapts to any zoom level
- Professional appearance

**Nice numbers**: 1, 2, 5, and powers of 10.
