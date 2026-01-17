# Content Enhancement: Matrices 2D (Planning)

## Voice and framing to keep
- Hook: reuse the “spreadsheets with superpowers” metaphor from [archive/snake-math/docs/linear-algebra/matrices/index.md](../../docs/content/archive/snake-math/docs/linear-algebra/matrices/index.md) and keep the quick-start checklist and experience badges (new / efficiency / applications) as the entry scaffold.
- Tone: conversational, welcoming, with concrete promises about what learners will do next; preserve the short “What you’ll learn” bullets.

## Core pillars by page
- Index: Keep the roadmap and prerequisites; surface the 🟢/🟡/🔴 pathing in the opening section of this plan to guide ordering and depth.
- Fundamentals: Lean on relatable metaphors and first-contact examples from [archive/snake-math/docs/linear-algebra/matrices/basics.md](../../docs/content/archive/snake-math/docs/linear-algebra/matrices/basics.md) (recipe-mixer multiplication, gradebook `@` demo, manual Matrix class, scale→rotate storyboard).
- Operations: Keep the “why libraries matter” performance vignette, dense vs sparse contrast, and the solve-linear-systems trio (inverse vs solve vs LU) from [archive/snake-math/docs/linear-algebra/matrices/operations.md](../../docs/content/archive/snake-math/docs/linear-algebra/matrices/operations.md). Retain conditioning checks and decomposition reconstructions as “trust your results” habits.
- Applications: Preserve the domain mini-labs from [archive/snake-math/docs/linear-algebra/matrices/applications.md](../../docs/content/archive/snake-math/docs/linear-algebra/matrices/applications.md) (PCA, Markov weather, triangle transforms, circuits/truss, linear regression) as the anchor stories.

## Reuse-ready exemplars (with quick rationale)
- Gradebook `@` demo (basics): shows `@` in a single glance; keep as first runnable.
- Manual Matrix class (basics): good “under the hood” transparency; keep but tighten comments to essentials.
- Scale then rotate points (basics): clear composition narrative with visuals; keep plots.
- Common matrix patterns (basics): identity/zero/diagonal/symmetric/triangular mini library; reuse as a compact cheat sheet.
- NumPy timing + dense vs sparse memory (operations): grounds performance claims in numbers; keep table-style outputs.
- Linear systems trio + conditioning (operations): teaches solver choice; keep verification check.
- Iterative solvers setup (operations): diagonally dominant scaffold plus CG/GMRES/BiCGSTAB; keep as scalability sidebar.
- Decompositions with reconstruction checks (operations): LU/Cholesky/QR/SVD verifying errors; keep as “trust but verify.”
- PCA correlated 2D (applications): eigen story with explained variance and principal axes plot; keep as the lead eigen example.
- Markov weather chain (applications): intuitive state evolution + steady-state check; keep as “matrix powers tell the future.”
- Homogeneous triangle transforms (applications): translate/rotate/scale in one pipeline; keep as geometry anchor.
- Circuit node voltages + truss least-squares (applications): concrete engineering systems; keep both for physical intuition.
- Linear regression normal equation + residuals (applications): ties matrices to model metrics and uncertainty; keep.

## New examples to add
- Blocked multiplication intuition: small 4x4 split-into-blocks example to show cache-friendly tiling; contrast naive vs block-ordered computation in pseudocode.
- Nearly singular cautionary tale: 2x2 matrix with determinant near zero; show np.linalg.solve vs explicit inverse producing large error; link to condition number and why pivoting matters.
- Simple 3D graphics extension: add a perspective projection step after translate/rotate/scale, plotting a cube wireframe before/after projection to bridge 2D triangle to 3D pipeline.
- Sparse win in practice: create a 10k-size 0.1% density Laplacian-like matrix and compare memory/time for matvec vs dense; pair with a tiny snippet on csr_matrix construction.
- Mini SVD compression: take a small grayscale image patch (e.g., 32x32), show rank-5 vs rank-20 reconstruction error and storage saved; connect to the “why SVD” story.
- Batch linear regressions: stack multiple targets (Y with two columns) and solve with one np.linalg.lstsq call to introduce multi-output systems.
- Interactive slider idea: plan a PCA slider for number of components and variance retained, mirroring the explained-variance narrative.

## Navigation and UX notes
- Mirror the back/next navigation bars already present; ensure CONTENT_MATRICES.md surfaces the same sequence and uses consistent anchor text.
- Keep CodeFold wrappers for runnable blocks to avoid wall-of-code; place concise lead-in sentences before each snippet.
- Maintain short “why it matters” blurbs after performance and decomposition sections to reinforce judgment, not just mechanics.

## Ordering for the rewrite
- Open with the hook + quick-start checklist (index tone).
- Fundamentals: metaphors → gradebook example → manual Matrix → composition storyboard → patterns cheat sheet.
- Operations: performance vignette → dense vs sparse → solver trio + conditioning → iterative sidebar → decompositions with checks → optimization tips (blocked multiplication).
- Applications: PCA → Markov → graphics 2D→3D → engineering (circuits/truss) → ML regression → SVD compression → network/sparse add-on.
- Close with navigation links and “try it” challenge list (e.g., PCA toolkit, recommendation SVD, 3D engine) aligned with existing CTA style.