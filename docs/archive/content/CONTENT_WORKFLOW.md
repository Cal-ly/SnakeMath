# Content Analysis Workflow

This document describes the systematic workflow for analyzing existing educational content and creating planning documents to guide content enhancement for SnakeMath.

## Overview

The workflow extracts strong pedagogical elements from archived documentation and creates structured planning documents that identify:
- What works well and should be preserved
- Concrete examples ready for reuse
- New examples to add
- Content ordering and navigation improvements

## Workflow Steps

### Step 1: Identify Content Domain
Select a mathematical topic area with existing documentation in the archive folder:
```
/home/cally/Code/SnakeMath/archive/snake-math/docs/[topic]/
```

Typical structure includes 4-5 markdown files:
- `index.md` (overview)
- `basics.md` (fundamentals)
- Additional concept pages (operations, applications, etc.)

### Step 2: Read All Source Files
Read all markdown files for the topic completely, paying attention to:
- Opening hooks and metaphors
- Code examples with concrete, runnable demonstrations
- Pedagogical approaches (manual → library, visual + numerical)
- Real-world applications and contexts
- Navigation structure and prerequisites

### Step 3: Analyze Content
Extract key elements across these dimensions:

#### Voice and Tone
**Extract direct quotes** from source files that demonstrate effective voice:
- Opening hooks that make concepts relatable - **cite the exact text and line number**
- Metaphors and analogies that work - **quote them verbatim**
- Pedagogical stance (educational transparency, programmer-first, practical focus)
- What makes the content engaging vs. dry

**Example format**:
- **"Data's biography"** metaphor from index.md (line 24) - "tell you everything important about your dataset's personality: where it likes to hang out (central tendency)..."
- **"Restaurant review"** analogy from basics.md (line 35) - mean = average rating, std dev = how much opinions varied

#### Core Pillars
For each page, provide **detailed breakdown**:
- Main learning objectives with specific line references
- Key concepts introduced (note which sections, lines ~X-Y)
- Structure and flow with explicit ordering
- How it fits in the overall learning journey
- Notable teaching techniques (e.g., "manual → library → specialized" progression)

**Example format**:
### 2. basics.md (Fundamentals)
- **Opening hook**: "Arrows with purpose" + GPS directions analogy (line 24)
- **Core formulas** prominently displayed (lines 36-41): Addition, scalar multiplication, dot product, magnitude
- **Velocity/acceleration example** (lines 51-62): Instant 2D showcase with printed results
- **Manual implementation walkthrough** (lines 127-194): Full from-scratch code

#### Exemplars
Identify concrete code examples worth preserving **with inline code snippets**:
- Small, understandable datasets (restaurant ratings, player stats)
- Manual implementations showing calculation steps
- Library comparison/optimization demos
- Visual demonstrations (plots, charts)
- Real-world application scenarios

For each exemplar, provide:
- **Brief code snippet** (3-10 lines showing key concept)
- **Line reference** (e.g., lines ~51-62 or lines 127-194)
- **Why it works** - detailed pedagogical reasoning
- **Reuse contexts** - specific scenarios where applicable

**Example format**:
### 1. Restaurant Ratings Demo (basics.md, lines ~20-38)
```python
ratings = [8, 9, 7, 10, 8, 6, 9, 8, 7, 10, 9, 8, 5, 9, 8]
mean_rating = np.mean(ratings)
median_rating = np.median(ratings)
std_rating = np.std(ratings, ddof=1)
```
**Why it works**: Small, understandable dataset. Everyone knows restaurant reviews. Shows all basic measures in context. Concrete numbers you can verify by hand.
**Reuse**: Perfect introductory example for any descriptive stats lesson. Template for showing mean/median/std dev together.

#### Gap Analysis
Identify opportunities for new examples **with detailed specifications**:
- Missing contexts or domains (gaming, networking, personal finance)
- Additional code patterns (edge cases, pitfalls, gotchas)
- Enhanced visualizations
- Interactive elements
- Cross-topic connections

For each new example proposal, include:
- **Concept**: What it teaches
- **Code**: Brief implementation description or pseudocode
- **Why**: Detailed rationale (relevance, engagement, fills gap)
- **Placement**: Specific page and section

**Example format**:
### 1. **System Log Analysis**
**Concept**: Real-time API response time monitoring
**Code**: Streaming stats on request latency, percentile-based SLA monitoring (p95, p99), anomaly detection when current value exceeds mean + 3σ
**Why**: Directly relevant to backend developers, DevOps engineers. Shows streaming stats in production context. Fills gap in real-time monitoring examples.
**Placement**: applications.md (could be Challenge 1 expansion or new "DevOps Monitoring" section)

### Step 4: Create Planning Document
Write structured notes to:
```
/home/cally/Code/SnakeMath/docs/content/CONTENT_[TOPIC].md
```

Use this standard structure:

```markdown
# Content Enhancement: [Topic Name] (Planning)

## Voice and Framing to Keep

### Opening Hook
- **"[Exact Quote]"** metaphor from [file].md (line X) - [Full quoted text explaining the metaphor]
- **"[Another Quote]"** from [file].md (line Y) - [Why this works]
- These work because [pedagogical reasoning]

### Pedagogical Stance
- **[Technique name]**: [Description with line reference]
- **[Another technique]**: [Description and why it's effective]
- **Consistent pattern**: [Cross-cutting approach used throughout]

## Core Pillars by Page

### 1. [page-name].md ([Page Type])
- **Opening hook**: [Specific hook used with line reference]
- **Core formulas/concepts**: [What's prominently displayed, lines X-Y]
- **Key examples**: [Main demonstrations with line ranges]
- **Structure**: [How content is organized]
- **Pedagogical approach**: [Teaching technique employed]

### 2. [next-page].md ([Page Type])
[Continue with same detailed breakdown...]

## Reuse-Ready Exemplars with Rationale

### 1. [Exemplar Name] ([file].md, lines ~X-Y)
```python
# Include 3-10 lines of actual code showing the key concept
code_example = "actual code from source"
result = process(code_example)
```
**Why it works**: [Detailed pedagogical reasoning - why is this effective for learning? What makes it concrete/relatable/memorable?]
**Reuse**: [Specific contexts where this can be used - be concrete about scenarios]

### 2. [Next Exemplar] ([file].md, lines ~X-Y)
[Either code snippet or detailed description of visualization/demo]
**Why it works**: [Pedagogical analysis]
**Reuse**: [Application contexts]

[Continue for 8-12 exemplars - aim for comprehensive coverage of strong content]

## New Examples to Add

### 1. **[Example Name]**
**Concept**: [What mathematical/programming concept it teaches]
**Code**: 
```python
# Brief implementation sketch or pseudocode
def example_function(params):
    # Show key algorithmic steps
    return result
```
[Or: Detailed description if code would be too long]
**Why**: [Detailed rationale - why is this valuable? What gap does it fill? Why would learners find it engaging/relevant?]
**Placement**: [Specific file].md ([specific section name])

### 2. **[Next Example]**
[Continue with same structure...]

[Continue for 3-5 new examples]

## Navigation and UX Notes

### Current Strengths
- **[Specific strength]**: [What works and why]
- **[Another strength]**: [Evidence from source files]
- **[Pattern that works]**: [How it helps learners]

### Recommended Enhancements
1. **[Enhancement name]**: [Specific description of what to add]
2. **[Another enhancement]**: [How it improves UX]
3. **[Cross-linking]**: [Specific links to add between sections]
[Number each for clear tracking]

### Content Flow Validation
Current flow: [Describe existing progression]

[Detailed analysis]:
1. **[Current page]**: [Purpose and effectiveness]
2. **[Next page]**: [How it builds on previous]
[Analyze the learning progression]

**Alternate flows to consider**:
- [Path 1]: [Description] - [Why this might work]
- [Path 2]: [Description] - [Target audience]

## Ordering for the Rewrite

### Page 1: [name].md ([Type]) - [Keep/Restructure/Major Changes]
**Order**:
1. [Section name]: [Brief description]
2. [Next section]: [Content and purpose]
3. [Continue with numbered list of all major sections]
[Full content outline showing logical flow]

**Changes**: 
- [Specific modification 1]
- [Specific modification 2]
- [Use bullets for clarity]

**Rationale**: [Detailed explanation of why this ordering works pedagogically. What learning progression does it support?]

### Page 2: [name].md ([Type]) - [Assessment]
**Proposed order**:
[Same detailed structure as above]

**Changes**:
[Specific modifications]

**Rationale**: [Why this organization is effective]

[Continue for all pages in the content domain]

### Cross-Page Additions

**Concept bridges**: [Transitional text to add between pages]
- End of [page].md: "[Exact transitional text...]" → [next-page].md
- End of [page].md: "[Another bridge...]" → [destination]

**Glossary**: [Popup definitions to add]
- [Term]: "[Definition]" (appears in [page], line X)
- [Term]: "[Definition]"

**Code comments**: [Enhancement strategy]
- [Explain principle]: Example: `# Use n-1 (Bessel's correction) to unbias sample variance estimate`
- [Pattern to follow]: [Describe commenting approach]

---

## Implementation Priority

**Phase 1 - High Impact, Low Effort**:
1. [Specific task] - [What file/section]
2. [Another task] - [Concrete action]
3. [Quick win] - [Why this is high-impact]
[List 4-6 items that give best ROI]

**Phase 2 - New Content**:
5. [Content creation task]
6. [Another new example]
7. [Substantial addition]
[Larger efforts that add significant value]

**Phase 3 - Polish**:
8. [UX enhancement]
9. [Navigation improvement]
10. [Supporting materials]
[Items that perfect the experience]

**Phase 4 - Expansion** (Optional):
12. [Advanced topics]
13. [Additional domains]
14. [Stretch goals]
[Nice-to-haves for comprehensive coverage]
```

### Step 5: Quality Check
Review the planning document for:
- **Completeness**: All source files analyzed
- **Specificity**: Concrete line references for exemplars
- **Actionability**: Clear guidance for content rewrite
- **Balance**: Preservation of good content + enhancement ideas
- **Consistency**: Same structure as previous planning docs

## Key Principles

### 1. Programmer-First Focus
Content should serve developers learning math concepts for practical application:
- Runnable code snippets
- Real-world programming contexts
- Performance considerations
- Common pitfalls in implementation

### 2. Educational Transparency
Show HOW and WHY, not just WHAT:
- Manual implementations before library calls
- Explain Bessel's correction, don't just use `ddof=1`
- Comment code for educational value, not just correctness
- Visualize + explain together

### 3. Concrete Before Abstract
Ground concepts in relatable examples:
- Restaurant ratings before population statistics
- GPS coordinates before vector spaces
- Spreadsheets before matrix algebra
- Use metaphors that connect to existing knowledge

### 4. Multiple Perspectives
Present concepts through different lenses:
- Visual (plots, charts, diagrams)
- Numerical (calculations, statistics)
- Conceptual (explanations, analogies)
- Applied (real-world use cases)

### 5. Progressive Complexity
Layer concepts from simple to advanced:
- Basic definitions → Implementation methods → Visualization → Applications
- 2D examples before 3D generalizations
- Small datasets before big data techniques
- Common cases before edge cases

## Example Completed Workflows

As of January 2026, completed planning documents include:

1. **CONTENT_MATRICES.md** - Linear algebra matrices
   - 4 source files analyzed (index, basics, operations, applications)
   - Preserved "spreadsheets with superpowers" hook
   - 10 exemplars identified (gradebook, manual Matrix class, NumPy timing, PCA/Markov)
   - 10 new examples proposed (blocked multiplication, 3D projection, SVD compression)

2. **CONTENT_VECTORS_2D.md** - 2D vectors with programming focus
   - 5 source files analyzed (index, basics, operations, advanced, applications)
   - Preserved "arrows with purpose / GPS directions" metaphor (index.md, line 24)
   - Emphasized 2D-first narrative with 3D as sidebars
   - 10 exemplars with inline code:
     - Velocity/acceleration demo (lines ~51-62): `velocity = np.array([3, 4])` showing addition, magnitude, normalization
     - Manual Vector class (operations.md, lines ~33-92): Full `__add__`, `__mul__`, `dot` implementation
     - Performance benchmark (lines ~108-151): 1M element timing showing 62.8x speedup
   - 10 new examples with code sketches:
     - Signed area/orientation test: `(b-a) × (c-a)` for clockwise detection
     - Steering behaviors: `seek()` function with magnitude clamping
     - Perpendicular vector utility: `perp(v) = [-v[1], v[0]]` for 2D normals

3. **CONTENT_UNITCIRCLE.md** - Unit circle and trigonometry
   - 4 source files analyzed (index, basics, identities, applications)
   - Preserved "mathematical DNA of waves" framing
   - 10 exemplars (unit circle walk, builtin/NumPy/Taylor comparison)
   - 10 new examples (angle normalization, phase shift, rotation pitfalls)

4. **CONTENT_DESCRIPTIVE_STATS.md** - Descriptive statistics
   - 5 source files analyzed (index, basics, methods, visualization, applications)
   - Preserved "data's biography" metaphor (index.md, line 24) and restaurant ratings example (basics.md, lines ~20-38)
   - 10 exemplars with inline code and detailed rationales:
     - Restaurant ratings: `ratings = [8, 9, 7, 10, ...]` showing mean/median/std dev together
     - Manual implementation (lines ~127-194): From-scratch statistics with Bessel's correction explained
     - Streaming statistics class (methods.md, lines ~240-370): Welford's algorithm with O(1) updates
     - 6-plot comparative analysis (visualization.md, lines ~150-280): Box, histogram, violin, mean±std, scatter, heatmap
   - 10 new examples with detailed specifications:
     - System log analysis: Streaming stats for API latency monitoring with p95/p99 tracking
     - Simpson's paradox demo: College admission rates with grouped bar charts showing reversal
     - Grading curve: Z-score calculator comparing curved vs absolute grading

## Tips for Effective Analysis

### Finding Strong Exemplars
Look for code that:
- **Teaches by doing**: Shows the calculation/algorithm step-by-step with comments explaining WHY
- **Stays concrete**: Small datasets you can follow by hand (15 ratings, 3 vectors, 10 samples)
- **Reveals patterns**: Visual output that makes concept obvious (parallelogram rule for addition, angle vs dot product curve)
- **Compares approaches**: Manual vs optimized, naive vs robust (with timing data)
- **Solves real problems**: Quality control, performance tuning, data analysis in recognizable contexts

**When you find a strong exemplar**:
1. Note the exact line range (use `~` for approximate: lines ~51-62)
2. Extract a meaningful code snippet (3-10 lines showing core concept)
3. Explain pedagogical effectiveness: What makes this example work for learning?
4. Identify reuse contexts: Where else could this pattern apply?

**Quality markers**:
- ✅ Small enough to understand quickly (< 50 lines)
- ✅ Runnable as-is or with minimal setup
- ✅ Produces visible output (printed results, plots)
- ✅ Uses concrete numbers (not abstract variables)
- ✅ Demonstrates one clear concept
- ✅ Includes verification steps (orthogonality checks, property tests)

### Identifying Gaps
Ask these questions systematically:

**Domain Coverage**:
- What contexts are missing? Consider: gaming, social media, e-commerce, health, transportation, finance, networking, DevOps
- Are there 2-3 examples per major application domain?
- Do examples span beginner to advanced difficulty?

**Common Pitfalls**:
- What mistakes do learners typically make? (Numerical precision, off-by-one, wrong formula)
- Are edge cases covered? (Empty data, zero vectors, singular matrices)
- Are gotchas explained? (Catastrophic cancellation, floating point comparison)

**Visualization Opportunities**:
- Which concepts are "better shown than told"? (Vector addition as parallelogram, distribution shapes, projection geometry)
- Are there interactive elements? (`<Component />` widgets)
- Do plots have clear titles, labels, and legends?

**Cross-Topic Connections**:
- How does this topic connect to others in SnakeMath?
- Are there natural bridges? (Vectors → matrices, statistics → probability, trig → complex numbers)
- Can examples be reused across topics with minor adaptations?

**Learner Struggles** (based on pedagogy research):
- What concepts are known to be difficult? (Dot product geometric meaning, statistical significance, eigenvalues)
- Are there multiple explanations? (Algebraic + geometric + visual)
- Do examples progress from intuitive to formal?

**When you identify a gap**:
1. **Specify the concept**: What exactly is missing?
2. **Sketch the code**: Pseudocode or brief implementation showing key steps
3. **Explain the value**: Why would this help learners? What gap does it fill?
4. **Propose placement**: Exact file and section (e.g., "operations.md, after dot product section")
5. **Note dependencies**: What prerequisites are needed?

### Writing Actionable Notes
Make guidance specific and detailed:

**Voice/Framing**:
- ✅ **GOOD**: "Preserve 'data's biography' metaphor from index.md (line 24): 'tell you everything important about your dataset's personality: where it likes to hang out (central tendency), how spread out it is (variability)...'"
- ❌ **VAGUE**: "Good metaphor in intro"

**Exemplars**:
- ✅ **GOOD**: "Preserve restaurant ratings example (lines 20-38) as opening hook in basics.md. The small dataset (15 ratings) makes mean/median/std dev calculations verifiable by hand. Shows all three measures in context with concrete interpretation."
- ❌ **VAGUE**: "Restaurant example is good"

**New Examples**:
- ✅ **GOOD**: "New example: System log analysis with streaming stats detecting API latency spikes. Use Welford's algorithm for O(1) updates. Flag anomalies when current latency exceeds mean + 3σ. Show percentile tracking (p95, p99) for SLA monitoring. Place in applications.md, new 'DevOps Monitoring' section after quality control."
- ❌ **VAGUE**: "Add system monitoring example"

**Code Snippets**:
- ✅ **GOOD**: Include actual code inline:
```python
def seek(position, target, max_speed):
    desired = target - position
    desired = desired / np.linalg.norm(desired) * max_speed
    return desired
```
- ❌ **VAGUE**: "Show seeking behavior with normalization"

### Maintaining Consistency
Each planning document should:
- **Follow the same section structure**: Voice → Core Pillars → Exemplars → New Examples → Navigation → Ordering → Priority
- **Use similar level of detail**: 
  - Voice: 2-4 quoted hooks with line numbers
  - Core Pillars: Detailed breakdown of 4-6 pages
  - Exemplars: 8-12 with code snippets and line ranges
  - New Examples: 8-12 with concept/code/why/placement
- **Reference specific line numbers**: Use tilde for ranges (~51-62) when approximate
- **Include inline code**: Show actual snippets, not just descriptions
- **Balance preservation with innovation**: Roughly 50/50 split between reusing strong content and proposing new additions
- **Provide detailed rationales**: Every "why it works" should explain pedagogical effectiveness
- **Be implementation-ready**: Reader should be able to start content rewrite with clear guidance

## Using Planning Documents

These planning documents serve as blueprints for content rewrites. When implementing:

1. **Preserve identified voice elements** - Don't lose engaging hooks and metaphors
2. **Reuse exemplars as-is or adapted** - These are proven effective
3. **Implement new examples progressively** - Priority order suggested in doc
4. **Follow recommended page ordering** - Based on pedagogical flow analysis
5. **Add suggested UX enhancements** - Time estimates, progress indicators, etc.

The goal is content that is:
- **Engaging** (hooks, metaphors, relatable contexts)
- **Educational** (transparent, step-by-step, multiple perspectives)
- **Practical** (runnable code, real applications, performance-aware)
- **Navigable** (clear structure, good flow, helpful cross-links)

---

**Last Updated**: January 17, 2026  
**Completed Planning Docs**: 4 (Matrices, Vectors 2D, Unit Circle, Descriptive Statistics)
