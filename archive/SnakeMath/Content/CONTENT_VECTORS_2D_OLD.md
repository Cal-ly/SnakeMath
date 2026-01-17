# Content Enhancement: Vectors 2D (Planning)

## Voice and framing to keep
- Hook: keep the “arrows with purpose / GPS directions” metaphor from [archive/snake-math/docs/linear-algebra/vectors/index.md](../../docs/content/archive/snake-math/docs/linear-algebra/vectors/index.md); maintain welcoming, programmer-friendly promises about what learners will do next.
- Tone: conversational, concise, with quick “what you’ll learn” bullets and consistent navigation breadcrumbs.

## Core pillars by page
- Index: reuse the roadmap and the 🟢/🟡/🔴 learning-path cues; keep prerequisites and quick reference table for fast orientation.
- Basics: lean on relatable metaphors plus first-contact demos from [archive/snake-math/docs/linear-algebra/vectors/basics.md](../../docs/content/archive/snake-math/docs/linear-algebra/vectors/basics.md) (recipe analogy for dot product, velocity/accel example, vector representations, visualization grid, basic ops, real-world sampler).
- Operations: keep the three-tier implementation story from [archive/snake-math/docs/linear-algebra/vectors/operations.md](../../docs/content/archive/snake-math/docs/linear-algebra/vectors/operations.md) (manual class, NumPy speedup, specialized ops), the dot-product geometric walkthrough, projections/decomposition, and the loop-vs-NumPy timing contrast.
- Advanced: preserve the vector patterns library, cross-product deep-dive, rotation matrices, and vector fields overview from [archive/snake-math/docs/linear-algebra/vectors/advanced.md](../../docs/content/archive/snake-math/docs/linear-algebra/vectors/advanced.md); for a 2D track, frame 3D content as optional sidebars while keeping “trust but verify” checks (orthogonality, magnitude preservation).
- Applications: retain the domain mini-labs in [archive/snake-math/docs/linear-algebra/vectors/applications.md](../../docs/content/archive/snake-math/docs/linear-algebra/vectors/applications.md) (forces equilibrium, kinematics, work; 2D rotations; normals/lighting; camera frame; cosine similarity; k-means; PCA) as anchor stories.

## Reuse-ready exemplars (with quick rationale)
- Velocity/acceleration NumPy snippet (basics): instant, relatable 2D showcase of addition, magnitude, unit vector.
- Representation forms (component, polar, unit) with reconstruction (basics): shows multiple viewpoints succinctly.
- Visualization quad (basics): addition parallelogram, scalar multiples, unit vectors on unit circle, components grid—strong geometric intuition.
- Basic ops block (basics): addition/subtraction/scalar/magnitude/unit with printed properties; solid first runnable.
- Real-world sampler (basics): physics, camera view vector, navigation displacement, ML preferences—broad applicability.
- Manual vs NumPy vs specialized (operations): teaches abstraction/performance trade-offs; keep timing contrast.
- Dot-product explainer with angle sweep + projections (operations): clearest geometric intuition.
- Projections/decomposition with orthogonality check (operations): reinforces correctness of split.
- Cross-product deep-dive (advanced): keep as 3D normal sidebar; right-hand rule narration is clear.
- Vector fields intro (advanced): concise divergence/curl intuition; good “going further” teaser.
- Applications: force equilibrium triad, kinematics, work (physics); 2D rotation helper and normals for lighting (graphics); camera frame orthogonality check; cosine similarity + k-means + PCA flows (ML/data).

## New examples to add (2D-focused, programming-relatable)
- Signed area / orientation test: 2D cross-product scalar to detect clockwise vs counterclockwise; apply to polygon winding and point-in-triangle.
- Steering behaviors micro-demo: seek/flee/wander using 2D velocity vectors; show clamping magnitude for speed limits.
- Collision normal + reflection: compute 2D reflection `r = v - 2*(v·n)*n` for simple bounce; pair with a unit-normal helper.
- Perpendicular vector utility: quick `perp(v) = (-y, x)` for 2D edge normals, shading, and offsetting paths.
- Dot-product classification: use the sign of `dot(facing, to_target)` to check “in front/behind”; handy for FOV tests.
- Tiny performance pitfall: loop vs NumPy for a million 2D dot products to mirror the operations page, scoped to 2D arrays.
- Mini interpolation: `lerp(a, b, t)` between two 2D vectors for tweening; emphasize constant time and no trig.
- Noise-based vector field teaser: generate a small grid of 2D arrows from a deterministic function; optional animate note.

## Navigation and UX notes
- Mirror back/next navigation bars already present; keep anchor text consistent with the vector pages.
- Wrap runnable blocks in CodeFold and lead with one-sentence intent; follow with a short “why it matters.”
- Keep 2D-first narrative; park 3D-heavy pieces as optional callouts.

## Ordering for the rewrite
- Hook + quick-start checklist (index tone) with prerequisites and quick reference.
- Basics: metaphor → velocity/accel demo → representations → visualization quad → basic ops → real-world sampler → summary.
- Operations: manual vs NumPy vs specialized → performance vignette → dot-product intuition → projections/decomposition → signed-area/perp utilities → lerp/steering snippets → 2D performance pitfall.
- Advanced (as sidebars): cross product for normals, rotation matrices, vector fields teaser, optimization note; mark 3D content optional.
- Applications: physics (forces, kinematics, work) → graphics (2D rotation, normals, camera frame) → ML/data (cosine similarity, k-means, PCA) → add collision reflection and dot-based FOV check as extra 2D cases.
- Close with try-it challenges aligned to the above (2D physics sandbox, steering behaviors, cosine-sim recommender, k-means visualizer).

