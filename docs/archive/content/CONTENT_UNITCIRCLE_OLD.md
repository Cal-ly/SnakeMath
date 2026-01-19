# Content Enhancement: Unit Circle (Planning)

## Voice and framing to keep
- Hook: keep the “mathematical DNA of waves/rotations” and “unit circle as universal coordinate system” framing from [archive/snake-math/docs/trigonometry/unit-circle/index.md](../../docs/content/archive/snake-math/docs/trigonometry/unit-circle/index.md); stay welcoming and visual-first.
- Tone: conversational, programmer-friendly, with explicit promises about what learners will be able to build (graphics, signal processing, animation, physics).

## Core pillars by page
- Index: reuse the learning-path table (Basics → Identities → Applications) and quick navigation grid; keep prerequisites and key concepts list for fast orientation.
- Basics: lean on the clock-face metaphor, sine/cosine as coordinates, the “walk around the unit circle” table, and the identity check from [archive/snake-math/docs/trigonometry/unit-circle/basics.md](../../docs/content/archive/snake-math/docs/trigonometry/unit-circle/basics.md). Keep the three computation modes (builtin, NumPy vectorized, Taylor) and the special-angles/quad analysis sections.
- Identities: keep the geometric-motivation narrative and stepwise verifications from [archive/snake-math/docs/trigonometry/unit-circle/identities.md](../../docs/content/archive/snake-math/docs/trigonometry/unit-circle/identities.md): Pythagorean, angle addition/double/half, product-to-sum, power reduction, with code-backed checks.
- Applications: preserve the big demos in [archive/snake-math/docs/trigonometry/unit-circle/applications.md](../../docs/content/archive/snake-math/docs/trigonometry/unit-circle/applications.md): graphics/animation (rotations, easing, parametric curves), signal processing (waveforms, modulation, FFT, filters), physics oscillations, plus the Try-It/Key Takeaways list.

## Reuse-ready exemplars (with quick rationale)
- Unit circle walk table (basics): immediate angle→(cos,sin) intuition; shows sin²+cos²≈1.
- Builtin vs NumPy vs Taylor (basics): computation pathways and performance/accuracy angles.
- Special angles table + quadrant sign analysis (basics): high-utility reference for programmers.
- Identity verifications (identities): code-backed proofs for Pythagorean, angle addition, double/half-angle; great for “trust but verify.”
- Product-to-sum / sum-to-product with practical application note (identities): bridges to signal mixing.
- Graphics demo (applications): rotation matrices, easing curves, parametric shapes, sprite paths, 3D rotation snippet—visual anchor.
- Signal processing demo (applications): waveform synthesis, AM/FM/PM, Fourier analysis, digital filters—shows real compute workflows.
- Physics oscillations (applications): SHM with position/velocity/acc; connects sin/cos to motion.

## New examples to add
- Angle normalization & wrap: small utility showing wrapping to [−π, π] and [0, 2π]; tie to animation/game loops.
- Polar-to-Cartesian and back: quick helper plus a “point rotates around origin” mini-snippet.
- Phase shift intuition: show sin(θ+φ) as horizontal shift; visualize with two curves and a slider note.
- Interpolation with trig: smoothstep vs `0.5-0.5*cos(πt)`; show easing without large code.
- Discrete rotation matrix pitfalls: floating error accumulation in iterative rotation; include renormalization step.
- Cheap approximations: note when Taylor or polynomial approx is good enough vs builtin; tiny error table for sin around 0.
- Sampling aliasing caution: sample a sine with too-low rate; show folded frequency (brief, code sketch).

## Navigation and UX notes
- Mirror back/next bars across basics/identities/applications; keep anchor text consistent.
- Keep CodeFold for runnable blocks; precede each with one-line intent and follow with “why it matters” blurbs (especially for performance/accuracy sections).
- Use 2D-first visuals; mark 3D rotations as optional/advanced callouts.

## Ordering for the rewrite
- Hook + learning path (index tone) with quick nav table and prerequisites.
- Basics: unit-circle walk → sin/cos as coords → identity check → computation methods (builtin/NumPy/Taylor) → special angles → quadrant signs → key takeaways.
- Identities: Pythagorean → angle addition/subtraction → double/half-angle → product-sum/sum-product → power reduction → practical notes (signal mixing, simplification).
- Applications: graphics/animation → signal processing → physics oscillations → (optional) 3D rotation snippet → Try-It challenges.
- Close with next-steps pointers (identities, applications, Fourier, complex/Euler) matching existing CTAs.