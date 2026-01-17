# Content Enhancement: Unit Circle (Detailed Planning)

## Voice and Framing to Keep

### "Mathematical DNA" Metaphor
**Source**: [basics.md, lines 24-26]
> "Think of trigonometric functions as the mathematical DNA of waves, rotations, and cycles! The unit circle is like a universal coordinate system where every angle tells a story through its x and y coordinates. It's the bridge between geometry and the rhythmic patterns that govern everything from sound waves to planetary motion."

**Why This Works**: Positions trig functions not as abstract formulas but as fundamental building blocks. The "universal coordinate system" and "every angle tells a story" framing gives learners a concrete mental model—like reading a map where each position has meaning. The "DNA" metaphor suggests these patterns recur everywhere, motivating exploration.

**Placement**: Opening hook in index and basics pages. Reference in applications when showing how the same patterns appear in graphics/audio/physics.

### Clock Face Metaphor for Walking the Circle
**Source**: [basics.md, lines 47-49]
> "Think of the unit circle like a clock face where every 'time' (angle) has a unique fingerprint given by its (x, y) coordinates. As you walk around this circle, the x-coordinate dances like a horizontal wave while the y-coordinate creates a vertical wave"

**Why This Works**: "Clock face" is universally familiar, making the circle relatable. "Unique fingerprint" suggests precision and identity. The "dancing waves" visualization connects static coordinates to dynamic oscillation—critical for understanding sine/cosine as wave functions.

**Placement**: Early in basics page when introducing coordinate interpretation. Reinforce in identities when showing how sin²+cos²=1 emerges from circle geometry.

### Promise of Applications
**Source**: [index.md, lines 3-4]
> "Understanding trigonometric functions through the unit circle and their applications in waves, rotations, and periodic phenomena"

**Source**: [basics.md, lines 87-92]
> "Trigonometric functions are essential for computer graphics, game development, signal processing, animation, physics simulations, and machine learning. They help you rotate objects, generate smooth animations, analyze periodic data, and model wave-like phenomena. Understanding these functions enables you to work with 2D/3D transformations, implement smooth interpolations, analyze audio signals, create realistic physics, and build algorithms that handle periodic or oscillatory behavior."

**Why This Works**: Explicitly lists concrete, motivating use cases (not just "useful in engineering"). The second passage uses action verbs ("rotate objects", "analyze audio") that describe what programmers actually do, not vague "applications." This establishes relevance immediately.

**Placement**: Index page quick-reference and prerequisites section. Basics page after initial definitions. Applications page introduction to fulfill the promise.

---

## Core Pillars by Page

### Index Page (Quick Navigation Hub)
**Current Strengths** [index.md, lines 1-110]:
- Clear learning path table (Fundamentals → Identities → Applications) with "Best For" column
- Structured quick navigation grid
- Prerequisites section sets entry expectations
- "Next Steps" pointers to advanced topics (Fourier, complex numbers)

**Keep**: Learning path table structure, prerequisite list, interactive features callout, next-steps roadmap.

**Enhance**: Add inline code references to specific exemplars (e.g., "See rotation matrices in action" → link to applications section).

### Basics Page (Foundation with Three Computation Modes)
**Current Strengths** [basics.md, lines 1-476]:
- Unit circle walk table showing 8 angles with cos/sin coordinates [lines ~51-68]
- Identity verification for sin²+cos²=1 at multiple angles [lines ~71-77]
- Three computation methods: builtin math library [lines ~106-143], NumPy vectorized [lines ~163-219], Taylor series approximation [lines ~236-322]
- Special angles table with exact values [lines ~334-386]
- Quadrant sign analysis [lines ~404-476]

**Keep**: All three computation approaches (shows multiple tools), special angles reference table, quadrant signs for different functions.

**Enhance**: Add "when to use which method" guidance—builtin for single values, NumPy for arrays, Taylor for educational/no-library contexts. Highlight performance tradeoffs explicitly.

### Identities Page (Code-Verified Relationships)
**Current Strengths** [identities.md, lines 1-530]:
- Geometric motivation for identities ("emerge from unit circle geometry") [lines 18-21]
- Pythagorean identity verification at multiple angles [lines ~36-61]
- Angle addition demonstration with 30°+45°=75° [lines ~63-91]
- Double angle formulas verified [lines ~93-118]
- Half angle formulas verified [lines ~180-235]
- Product-to-sum and sum-to-product identities with beat frequency application [lines ~320-420]

**Keep**: Code-backed verifications for every major identity, practical application notes (e.g., product-to-sum for signal mixing).

**Enhance**: Add "why this identity matters" notes—e.g., double angle formulas simplify calculus derivatives, product-to-sum enables signal decomposition.

### Applications Page (Graphics + Signal + Physics)
**Current Strengths** [applications.md, lines 1-955]:
- Computer graphics: rotation matrices, easing functions, parametric curves, sprite paths [lines ~17-275]
- Signal processing: waveform generation, AM/FM/PM modulation, Fourier analysis, digital filters [lines ~279-510]
- Physics oscillations [mentioned in structure]

**Keep**: Comprehensive graphics demo with 12 visualizations, signal processing with practical audio examples, filter implementations.

**Enhance**: Ensure physics section gets equal depth (pendulum, mass-spring system, wave equation). Add "Try-It" challenges linking back to theory.

---

## Reuse-Ready Exemplars (with Inline Code and Rationales)

### 1. Unit Circle Walk Table (Basics Concept Anchor)
**Source**: [basics.md, lines ~51-77]
```python
# Walking around the unit circle
angles = np.linspace(0, 2*math.pi, 8)  # 8 points around the circle

print("Unit Circle Journey:")
print(f"{'Angle (rad)':>12} {'Angle (deg)':>12} {'x (cos)':>10} {'y (sin)':>10}")
print("-" * 50)

for angle in angles:
    x_coord = math.cos(angle)  # x-coordinate
    y_coord = math.sin(angle)  # y-coordinate
    angle_deg = math.degrees(angle)
    
    print(f"{angle:12.3f} {angle_deg:12.1f} {x_coord:10.3f} {y_coord:10.3f}")

# The fundamental identity emerges from the unit circle!
print(f"\nFundamental identity: sin²(θ) + cos²(θ) = 1")
for angle in [math.pi/6, math.pi/4, math.pi/3]:
    identity_check = math.sin(angle)**2 + math.cos(angle)**2
    print(f"At θ = {angle:.3f}: {identity_check:.6f}")
```

**Pedagogical Value**: Immediate hands-on exploration. Shows angle → coordinate mapping concretely. Identity verification as natural consequence (always ~1.0) builds trust. Simple loop structure accessible to beginners.

**Why It Works**: Combines table output (reference material) with identity check (conceptual insight). The "Journey" framing makes abstract math concrete. Seeing 1.000000 repeatedly reinforces the fundamental relationship.

**Placement**: Early in basics page, right after geometric definitions. Reference in identities page when proving sin²+cos²=1 algebraically.

---

### 2. Three Computation Modes with Performance Comparison
**Source**: [basics.md, lines ~106-322]

**a) Builtin Math Library** [lines ~106-143]
```python
def builtin_trigonometric_functions():
    """Use Python's built-in math library for trigonometric calculations"""
    
    # Performance test
    n_calculations = 1000000
    test_angle = math.pi / 4  # 45 degrees
    
    start_time = time.time()
    for _ in range(n_calculations):
        result = math.sin(test_angle)
    sin_time = time.time() - start_time
    
    print(f"sin() calculations: {sin_time:.4f} seconds")
    print(f"Rate: ~{n_calculations/sin_time:,.0f} calculations/second")
```

**b) NumPy Vectorized** [lines ~163-219]
```python
# Performance comparison
large_array = np.linspace(0, 2*np.pi, 1000000)

start_time = time.time()
numpy_result = np.sin(large_array)
numpy_time = time.time() - start_time

start_time = time.time()
loop_result = [math.sin(x) for x in large_array]
loop_time = time.time() - start_time

print(f"NumPy vectorized: {numpy_time:.4f} seconds")
print(f"Python loop: {loop_time:.4f} seconds")
print(f"Speedup: {loop_time/numpy_time:.1f}x faster")
```

**c) Taylor Series Approximation** [lines ~236-322]
```python
def sin_taylor(x, terms=10):
    """
    Calculate sin(x) using Taylor series:
    sin(x) = x - x³/3! + x⁵/5! - x⁷/7! + ...
    """
    # Normalize x to [-π, π] for better convergence
    while x > math.pi:
        x -= 2 * math.pi
    while x < -math.pi:
        x += 2 * math.pi
    
    result = 0
    for n in range(terms):
        power = 2 * n + 1
        sign = (-1) ** n
        term = sign * (x ** power) / factorial(power)
        result += term
    
    return result
```

**Pedagogical Value**: Shows multiple implementation strategies with clear tradeoffs. Builtin = fast, standard. NumPy = array operations, 10x+ speedup. Taylor = educational, shows underlying math, no dependencies.

**Why It Works**: Programmers care about performance—timing 1M calculations makes differences concrete. Taylor series demystifies trig functions (not magic, just a polynomial). The "when to use which" decision tree is immediately practical.

**Placement**: Basics page after initial definitions, before special angles. Reference in applications when discussing real-time graphics (speed matters) vs. educational tools (show the math).

---

### 3. Special Angles Reference Table
**Source**: [basics.md, lines ~334-386]
```python
def special_angles_demonstration():
    """Demonstrate special angles and their exact values"""
    
    special_angles = {
        "0°": (0, "0", "1", "0"),
        "30°": (math.pi/6, "1/2", "√3/2", "1/√3"),
        "45°": (math.pi/4, "√2/2", "√2/2", "1"),
        "60°": (math.pi/3, "√3/2", "1/2", "√3"),
        "90°": (math.pi/2, "1", "0", "undefined")
    }
    
    print(f"{'Angle':>6} {'Radians':>10} {'sin (exact)':>12} {'cos (exact)':>12} {'tan (exact)':>12}")
    print(f"{'':>6} {'':>10} {'sin (decimal)':>12} {'cos (decimal)':>12} {'tan (decimal)':>12}")
    
    for angle_name, (rad_val, sin_exact, cos_exact, tan_exact) in special_angles.items():
        sin_decimal = math.sin(rad_val)
        cos_decimal = math.cos(rad_val)
        # ... print both exact and decimal
    
    print("Memory Aids for Special Values:")
    print("  Pattern: Think of √0/2, √1/2, √2/2, √3/2, √4/2")
```

**Pedagogical Value**: Dual presentation (exact symbolic + decimal) builds fluency. Memory aid (√n/2 pattern) makes memorization easier. Shows when tan is undefined, reinforcing domain understanding.

**Why It Works**: High-frequency reference material—these angles appear constantly. Exact values enable by-hand verification. Decimal comparison validates the pattern. Memory aid reduces cognitive load.

**Placement**: Basics page after computation methods, before quadrant analysis. Reference in identities when verifying formulas at special angles.

---

### 4. Identity Verification Suite (Trust but Verify)
**Source**: [identities.md, lines ~36-118]
```python
def verify_pythagorean_identity():
    """Verify sin²(θ) + cos²(θ) = 1 geometrically"""
    
    test_angles = [0, math.pi/6, math.pi/4, math.pi/3, math.pi/2, 2*math.pi/3]
    
    print(f"{'Angle':>10} {'sin(θ)':>10} {'cos(θ)':>10} {'sin²+cos²':>12}")
    for theta in test_angles:
        sin_val = math.sin(theta)
        cos_val = math.cos(theta)
        identity_result = sin_val**2 + cos_val**2
        print(f"{theta:10.3f} {sin_val:10.3f} {cos_val:10.3f} {identity_result:12.6f}")
```

**Source**: [identities.md, lines ~63-91]
```python
def demonstrate_angle_addition():
    """Demonstrate angle addition formulas"""
    A, B = math.pi/6, math.pi/4  # 30° and 45°
    
    # Direct calculation
    sin_sum_direct = math.sin(A + B)
    
    # Using addition formulas
    sin_A, cos_A = math.sin(A), math.cos(A)
    sin_B, cos_B = math.sin(B), math.cos(B)
    sin_sum_formula = sin_A * cos_B + cos_A * sin_B
    
    print(f"   sin(A + B):")
    print(f"     Direct: {sin_sum_direct:.6f}")
    print(f"     Formula: {sin_sum_formula:.6f}")
    print(f"     Difference: {abs(sin_sum_direct - sin_sum_formula):.2e}")
```

**Pedagogical Value**: "Trust but verify" approach—learn the formula, then prove it works. Difference calculation (often ~1e-16) shows floating-point precision, demystifying tiny errors. Multiple test angles build confidence.

**Why It Works**: Programmers value empirical validation. Side-by-side comparison makes relationships tangible. Error reporting teaches numerical awareness. Extensible pattern (same structure for each identity).

**Placement**: Identities page, one verification per major identity family. Cross-reference basics page identity check as motivation.

---

### 5. Product-to-Sum with Beat Frequency Application
**Source**: [identities.md, lines ~320-420]
```python
def practical_applications():
    """Show practical applications of these identities"""
    
    print("Signal Processing - Beat Frequencies:")
    print("When two similar frequencies interfere:")
    
    f1, f2 = 440, 442  # Hz (musical notes)
    t = 0.1  # seconds
    
    # Individual signals
    signal1 = math.sin(2 * math.pi * f1 * t)
    signal2 = math.sin(2 * math.pi * f2 * t)
    combined_direct = signal1 + signal2
    
    # Using sum-to-product identity
    avg_freq = (f1 + f2) / 2
    beat_freq = abs(f1 - f2) / 2
    combined_formula = 2 * math.cos(2 * math.pi * beat_freq * t) * math.sin(2 * math.pi * avg_freq * t)
    
    print(f"Combined signal (direct): {combined_direct:.6f}")
    print(f"Combined signal (identity): {combined_formula:.6f}")
    print(f"Beat frequency: {2 * beat_freq} Hz")
```

**Pedagogical Value**: Concrete application of abstract identity—explains why guitar strings go "wah-wah" when slightly out of tune. Formula decomposition reveals structure (beat = difference, carrier = average).

**Why It Works**: Moves identity from algebraic curiosity to practical tool. Audio example is universally relatable. Shows identity enables insight (extract beat frequency analytically).

**Placement**: Identities page after sum-to-product formulas. Reference in applications page signal processing section. Link to Fourier analysis as advanced topic.

---

### 6. 2D Rotation Matrices (Graphics Foundation)
**Source**: [applications.md, lines ~30-73]
```python
def rotation_matrices():
    """2D and 3D rotation using trigonometry"""
    
    # Define a simple shape (triangle)
    triangle = np.array([
        [1, 0],   # Right vertex
        [-0.5, 0.866],  # Top-left vertex  
        [-0.5, -0.866], # Bottom-left vertex
        [1, 0]    # Close the shape
    ]).T
    
    angles = np.linspace(0, 2*np.pi, 8)
    
    for angle in angles:
        # 2D rotation matrix
        R = np.array([
            [np.cos(angle), -np.sin(angle)],
            [np.sin(angle), np.cos(angle)]
        ])
        rotated = R @ triangle
```

**Pedagogical Value**: Minimal viable rotation demo—shows transformation without graphics library clutter. Triangle shape makes rotation visually obvious. 8 positions around circle demonstrate smooth animation.

**Why It Works**: Matrix multiplication (`@`) is concise and modern. Starting with 2D (before 3D) keeps focus on trig. Multiple angles show transformation continuity. Immediately useful for game dev, graphics.

**Placement**: Applications page graphics section, first demo. Cross-reference basics page where cos/sin are introduced as coordinates. Link to matrix multiplication in linear algebra section.

---

### 7. Easing Functions (Animation Quality)
**Source**: [applications.md, lines ~75-101]
```python
def smooth_animations():
    """Demonstrate smooth motion using trigonometric easing"""
    
    t = np.linspace(0, 4*np.pi, 200)
    
    # Different easing functions
    linear = t / (4*np.pi)
    ease_in = (1 - np.cos(linear * np.pi)) / 2
    ease_out = np.sin(linear * np.pi / 2)
    ease_in_out = (1 - np.cos(linear * np.pi)) / 2
    bounce = np.abs(np.sin(linear * 4 * np.pi)) * np.exp(-linear * 2)
    
    print("• Linear: Direct proportional motion")
    print("• Ease-in: Slow start, fast finish")
    print("• Ease-out: Fast start, slow finish") 
    print("• Ease-in-out: Smooth start and finish")
    print("• Bounce: Oscillating decay effect")
```

**Pedagogical Value**: Shows why linear motion looks robotic—easing creates natural feel. Five variants demonstrate flexibility. Formulas are short (1-2 lines each), easy to adapt. Visual descriptions aid understanding.

**Why It Works**: Directly applicable to UI/game animation. Reveals hidden use of trig (most don't know easing uses cos/sin). Bounce formula combines trig + exponential, showing composition. Side-by-side comparison makes differences clear.

**Placement**: Applications page graphics section, after rotations. Reference in basics when introducing oscillatory behavior. Link to parametric curves as next step in complexity.

---

### 8. Waveform Generation (Audio Synthesis)
**Source**: [applications.md, lines ~290-330]
```python
def waveform_generation():
    """Generate basic audio waveforms using trigonometry"""
    
    duration = 1.0  # seconds
    sample_rate = 44100  # Hz (CD quality)
    frequency = 440  # Hz (A4 note)
    
    t = np.linspace(0, duration, int(sample_rate * duration), False)
    
    # Basic waveforms
    sine_wave = np.sin(2 * np.pi * frequency * t)
    square_wave = np.sign(sine_wave)
    sawtooth_wave = 2 * (t * frequency - np.floor(t * frequency + 0.5))
    triangle_wave = 2 * np.abs(sawtooth_wave) - 1
    
    # Harmonics for rich sounds
    harmonic1 = 0.5 * np.sin(2 * np.pi * 2 * frequency * t)  # 2nd harmonic
    harmonic2 = 0.25 * np.sin(2 * np.pi * 3 * frequency * t)  # 3rd harmonic
    complex_wave = sine_wave + harmonic1 + harmonic2
```

**Pedagogical Value**: Real-world scale (44.1kHz, A440 note) shows practical parameters. Four basic waveforms demonstrate variety. Harmonic addition shows Fourier principle (complex sounds = simple sines).

**Why It Works**: Audio is tangible—can play/hear results. Sample rate + duration → array size calculation teaches digital audio basics. Harmonic coefficients (0.5, 0.25) show amplitude decay pattern. Extensible to synthesizer projects.

**Placement**: Applications page signal processing section, first demo. Cross-reference identities page product-to-sum for frequency mixing. Link to Fourier analysis for decomposition.

---

### 9. Amplitude/Frequency Modulation (Radio/Synth Techniques)
**Source**: [applications.md, lines ~350-381]
```python
def frequency_modulation():
    """Demonstrate frequency and amplitude modulation"""
    
    carrier_freq = 1000  # Hz
    modulation_freq = 5  # Hz
    t = np.linspace(0, duration, int(sample_rate * duration), False)
    
    # Amplitude Modulation (AM)
    modulation_index = 0.5
    carrier = np.cos(2 * np.pi * carrier_freq * t)
    modulator = np.cos(2 * np.pi * modulation_freq * t)
    am_signal = carrier * (1 + modulation_index * modulator)
    
    # Frequency Modulation (FM)
    freq_deviation = 100  # Hz
    fm_signal = np.cos(2 * np.pi * carrier_freq * t + 
                      (freq_deviation / modulation_freq) * np.sin(2 * np.pi * modulation_freq * t))
```

**Pedagogical Value**: Shows two foundational modulation types (AM radio, FM synthesis). Carrier/modulator separation makes structure clear. Modulation index and frequency deviation are labeled parameters, aiding experimentation.

**Why It Works**: Connects to familiar tech (AM/FM radio). Formulas reveal mechanism—AM multiplies amplitude, FM varies phase. Side-by-side comparison highlights differences. Directly applicable to audio effects/synthesis.

**Placement**: Applications page signal processing section, after waveforms. Reference identities page when explaining phase relationships. Note historical context (radio) to show enduring relevance.

---

### 10. Fourier Transform (Frequency Domain Analysis)
**Source**: [applications.md, lines ~383-418]
```python
def fourier_analysis():
    """Analyze signals using Fourier transform"""
    
    # Create a complex signal with multiple frequencies
    freq1, freq2, freq3 = 50, 120, 200  # Hz
    signal = (np.sin(2 * np.pi * freq1 * t) + 
             0.5 * np.sin(2 * np.pi * freq2 * t) + 
             0.25 * np.sin(2 * np.pi * freq3 * t))
    
    # Add some noise
    noise = 0.1 * np.random.normal(0, 1, len(signal))
    noisy_signal = signal + noise
    
    # Fourier Transform
    fft_signal = np.fft.fft(noisy_signal)
    frequencies = np.fft.fftfreq(len(signal), 1/sample_rate)
    magnitude = np.abs(fft_signal)[:len(frequencies)//2]
    
    print(f"• Signal components: {freq1}, {freq2}, {freq3} Hz")
    print(f"• Frequency resolution: {sample_rate/len(signal):.1f} Hz")
```

**Pedagogical Value**: Shows FFT extracting frequency components from mixed signal. Noise addition demonstrates robustness. Magnitude spectrum reveals hidden structure (three peaks at exact input frequencies).

**Why It Works**: FFT is fundamental to audio/signal processing—this is the entry point. Synthetic signal (known components) validates the transform (you get out what you put in). Frequency resolution calculation teaches sampling theory.

**Placement**: Applications page signal processing section, after modulation. Note this uses identities (Euler's formula, product-to-sum) behind the scenes. Link to advanced Fourier series topic.

---

## New Examples to Add

### 1. Angle Normalization and Wrapping
**Concept**: Wrap arbitrary angles to standard ranges (0–2π or -π–π) for consistent calculations.

**Code Sketch**:
```python
def normalize_angle(angle, range_type='positive'):
    """Wrap angle to [0, 2π] or [-π, π]"""
    if range_type == 'positive':
        # [0, 2π]
        return angle % (2 * math.pi)
    else:
        # [-π, π]
        wrapped = angle % (2 * math.pi)
        if wrapped > math.pi:
            wrapped -= 2 * math.pi
        return wrapped

# Example: rotation accumulation
total_rotation = 25.7  # rad (multiple loops)
normalized = normalize_angle(total_rotation, 'positive')
print(f"Normalized: {normalized:.3f} rad = {math.degrees(normalized):.1f}°")
```

**Why It Helps**: Game loops accumulate rotation indefinitely—normalization prevents overflow. Also clarifies angle equivalence (370° = 10°). Common source of bugs when not handled.

**Placement**: Basics page after quadrant analysis, or applications page graphics section. Note connection to modular arithmetic.

---

### 2. Polar ↔ Cartesian Conversion
**Concept**: Convert between (r, θ) and (x, y) representations using cos/sin.

**Code Sketch**:
```python
def polar_to_cartesian(r, theta):
    """Convert polar (r, θ) to Cartesian (x, y)"""
    x = r * math.cos(theta)
    y = r * math.sin(theta)
    return x, y

def cartesian_to_polar(x, y):
    """Convert Cartesian (x, y) to polar (r, θ)"""
    r = math.sqrt(x**2 + y**2)
    theta = math.atan2(y, x)  # atan2 handles quadrants correctly
    return r, theta

# Example: point rotating around origin
r, initial_angle = 5, math.pi/4
rotation_step = math.pi/6

for step in range(8):
    angle = initial_angle + step * rotation_step
    x, y = polar_to_cartesian(r, angle)
    print(f"Step {step}: angle={math.degrees(angle):.1f}°, pos=({x:.2f}, {y:.2f})")
```

**Why It Helps**: Polar form simplifies rotation (just add to θ), Cartesian is needed for rendering. Highlights atan2 over atan (quadrant-aware). Fundamental for game AI, physics.

**Placement**: Basics page after special angles, or applications page graphics section. Link to complex numbers (polar form of a+bi).

---

### 3. Phase Shift Visualization
**Concept**: Show sin(θ + φ) as horizontal translation of sine wave.

**Code Sketch**:
```python
def demonstrate_phase_shift():
    """Visualize phase shift as horizontal translation"""
    t = np.linspace(0, 4*np.pi, 500)
    
    phases = [0, math.pi/4, math.pi/2, 3*math.pi/4, math.pi]
    
    for phase in phases:
        shifted_sin = np.sin(t + phase)
        # Plot each curve
        print(f"Phase φ = {math.degrees(phase):.0f}° shifts wave by {phase/(2*math.pi):.3f} cycles")
    
    # Note: positive phase shifts LEFT (counterintuitive!)
    # sin(θ + π/2) = cos(θ) demonstrates the relationship
```

**Why It Helps**: Phase shift is conceptually tricky (positive shift moves left). Visualization makes it concrete. Connection to cos/sin relationship (90° shift) is key insight. Critical for signal processing.

**Placement**: Identities page near angle addition formulas, or applications page signal processing. Cross-reference sin(θ+π/2)=cos(θ) identity.

---

### 4. Smooth Interpolation (Beyond Linear)
**Concept**: Use trigonometric smoothstep for better easing than linear interpolation.

**Code Sketch**:
```python
def smooth_interpolation(t):
    """Cosine-based smoothstep: smoother than linear, simpler than cubic"""
    # t goes from 0 to 1
    return 0.5 - 0.5 * math.cos(math.pi * t)

# Compare with linear
t_values = np.linspace(0, 1, 11)
print(f"{'t':>5} {'Linear':>8} {'Smooth':>8}")
for t in t_values:
    linear = t
    smooth = smooth_interpolation(t)
    print(f"{t:5.2f} {linear:8.3f} {smooth:8.3f}")

# Use case: camera movement, UI transitions
start_pos, end_pos = 0, 100
for t in np.linspace(0, 1, 10):
    camera_pos = start_pos + smooth_interpolation(t) * (end_pos - start_pos)
```

**Why It Helps**: One-liner alternative to complex easing libraries. Cosine provides smooth acceleration/deceleration. Often called "smoothstep" in graphics. Easy to implement, significant quality improvement.

**Placement**: Applications page graphics/animation section, near easing functions demo. Compare with linear to show difference.

---

### 5. Iterative Rotation Error Accumulation (Pitfall Warning)
**Concept**: Repeatedly applying rotation matrix causes numerical drift; renormalization fixes it.

**Code Sketch**:
```python
def demonstrate_rotation_drift():
    """Show floating-point error accumulation in iterative rotation"""
    
    # Start with unit vector
    v = np.array([1.0, 0.0])
    angle_step = math.pi / 180  # 1 degree
    
    # Rotation matrix
    R = np.array([[math.cos(angle_step), -math.sin(angle_step)],
                  [math.sin(angle_step), math.cos(angle_step)]])
    
    magnitudes = []
    for i in range(360):
        v = R @ v  # Apply rotation
        magnitudes.append(np.linalg.norm(v))
    
    print(f"After 360 rotations (full circle):")
    print(f"  Final magnitude: {np.linalg.norm(v):.10f} (should be 1.0)")
    print(f"  Drift: {abs(1.0 - np.linalg.norm(v)):.2e}")
    
    # Fix: renormalize periodically
    v = np.array([1.0, 0.0])
    for i in range(360):
        v = R @ v
        if i % 10 == 0:  # Renormalize every 10 steps
            v = v / np.linalg.norm(v)
    print(f"\nWith renormalization every 10 steps:")
    print(f"  Final magnitude: {np.linalg.norm(v):.10f}")
```

**Why It Helps**: Common bug in game engines—objects slowly "drift" or "grow" after many rotations. Shows problem concretely (magnitude ≠ 1.0 after 360 steps). Provides practical fix (periodic renormalization).

**Placement**: Applications page graphics section, after rotation matrices. Cautionary note with "Try-It" challenge to observe drift. Link to numerical analysis topic.

---

### 6. Fast Approximations for Real-Time Applications
**Concept**: When performance critical, polynomial approximations can replace library trig functions.

**Code Sketch**:
```python
def fast_sin_approx(x):
    """Fast sine approximation for x in [-π, π]
    Error < 0.001 across range, ~3x faster than math.sin
    Bhaskara I's approximation (7th century!)
    """
    # Normalize to [-π, π]
    while x > math.pi:
        x -= 2 * math.pi
    while x < -math.pi:
        x += 2 * math.pi
    
    # Bhaskara formula: sin(x) ≈ 16x(π - x) / (5π² - 4x(π - x))
    if 0 <= x <= math.pi:
        return (16 * x * (math.pi - x)) / (5 * math.pi**2 - 4 * x * (math.pi - x))
    else:
        return -fast_sin_approx(-x)

# Error analysis
test_angles = np.linspace(-math.pi, math.pi, 100)
errors = [abs(math.sin(x) - fast_sin_approx(x)) for x in test_angles]
print(f"Max error: {max(errors):.6f}")
print(f"Avg error: {np.mean(errors):.6f}")
```

**Why It Helps**: Real-time graphics/games need speed—this trades accuracy for performance. Historical note (Bhaskara I, 7th century!) shows enduring importance. Error bounds let programmer decide tradeoff.

**Placement**: Basics page after Taylor series (compare approaches), or applications page when discussing performance. Include timing comparison.

---

### 7. Sampling and Aliasing (Digital Signal Caution)
**Concept**: Sampling a sine wave below Nyquist rate causes frequency folding (aliasing).

**Code Sketch**:
```python
def demonstrate_aliasing():
    """Show what happens when sampling rate is too low"""
    
    # High-frequency signal
    true_freq = 800  # Hz
    duration = 0.01  # 10 ms
    
    # Good sampling (above Nyquist)
    good_rate = 8000  # 10x signal frequency
    t_good = np.linspace(0, duration, int(good_rate * duration), False)
    signal_good = np.sin(2 * math.pi * true_freq * t_good)
    
    # Bad sampling (below Nyquist)
    bad_rate = 1000  # 1.25x signal frequency (BELOW 2x)
    t_bad = np.linspace(0, duration, int(bad_rate * duration), False)
    signal_bad = np.sin(2 * math.pi * true_freq * t_bad)
    
    # Aliased frequency
    aliased_freq = bad_rate - true_freq
    print(f"True frequency: {true_freq} Hz")
    print(f"Bad sampling rate: {bad_rate} Hz (Nyquist: {2*true_freq} Hz)")
    print(f"Aliased frequency: {aliased_freq} Hz (WRONG!)")
    print(f"Nyquist rule: Sample rate must be > 2 × signal frequency")
```

**Why It Helps**: Aliasing is subtle bug—signal looks fine but has wrong frequency. Explains why 44.1kHz for audio (human hearing ~20kHz × 2 + margin). Critical for audio/signal processing.

**Placement**: Applications page signal processing section, after Fourier analysis. Link to digital filter design (anti-aliasing filters).

---

### 8. Steering Behaviors (Game AI Basic)
**Concept**: Use trig to calculate steering angle toward target.

**Code Sketch**:
```python
def steering_angle(current_x, current_y, current_angle, target_x, target_y):
    """Calculate steering angle to reach target"""
    
    # Vector to target
    dx = target_x - current_x
    dy = target_y - current_y
    
    # Desired angle (atan2 handles quadrants)
    desired_angle = math.atan2(dy, dx)
    
    # Angle difference (shortest rotation)
    angle_diff = desired_angle - current_angle
    
    # Normalize to [-π, π]
    while angle_diff > math.pi:
        angle_diff -= 2 * math.pi
    while angle_diff < -math.pi:
        angle_diff += 2 * math.pi
    
    return angle_diff

# Example: AI ship turning toward player
ship_x, ship_y, ship_angle = 0, 0, 0
player_x, player_y = 10, 10

turn_angle = steering_angle(ship_x, ship_y, ship_angle, player_x, player_y)
print(f"Turn {math.degrees(turn_angle):.1f}° to face player")
```

**Why It Helps**: Fundamental game AI pattern—NPCs turning to face targets. atan2 is key tool (vs atan). Angle normalization ensures shortest rotation (don't spin 270° when 90° works).

**Placement**: Applications page graphics section, or new game AI subsection. Cross-reference polar conversion and angle normalization examples.

---

### 9. Field-of-View Detection (Vision Cone)
**Concept**: Check if target is within FOV cone using dot product and angle.

**Code Sketch**:
```python
def in_field_of_view(observer_x, observer_y, observer_angle, target_x, target_y, fov_degrees):
    """Check if target is in observer's field of view"""
    
    # Vector to target
    dx = target_x - observer_x
    dy = target_y - observer_y
    distance = math.sqrt(dx**2 + dy**2)
    
    if distance == 0:
        return True  # At same position
    
    # Angle to target
    angle_to_target = math.atan2(dy, dx)
    
    # Angle difference
    angle_diff = abs(angle_to_target - observer_angle)
    
    # Normalize to [0, π]
    if angle_diff > math.pi:
        angle_diff = 2*math.pi - angle_diff
    
    # Check if within FOV cone
    fov_radians = math.radians(fov_degrees) / 2
    return angle_diff <= fov_radians

# Example: Guard detecting player
guard_x, guard_y, guard_angle = 0, 0, math.pi/4  # Facing northeast
player_x, player_y = 5, 4
fov = 90  # degrees

if in_field_of_view(guard_x, guard_y, guard_angle, player_x, player_y, fov):
    print("Player spotted!")
```

**Why It Helps**: Essential for stealth games, AI awareness systems. Combines angle calculation with geometric test. FOV parameter makes it configurable. Alternative: dot product approach (teach both).

**Placement**: Applications page graphics/game AI section. Link to dot product in vectors section. Show both atan2 and dot product methods.

---

### 10. Lerp with Ease (Smooth Parameter Transitions)
**Concept**: Interpolate between values with trigonometric easing for smooth parameter changes.

**Code Sketch**:
```python
def lerp_with_ease(start, end, t, ease_type='linear'):
    """Interpolate between start and end with easing"""
    
    if ease_type == 'linear':
        eased_t = t
    elif ease_type == 'ease_in':
        eased_t = 1 - math.cos(t * math.pi / 2)
    elif ease_type == 'ease_out':
        eased_t = math.sin(t * math.pi / 2)
    elif ease_type == 'ease_in_out':
        eased_t = 0.5 - 0.5 * math.cos(t * math.pi)
    else:
        eased_t = t
    
    return start + eased_t * (end - start)

# Example: Smooth zoom transition
zoom_start = 1.0
zoom_end = 3.0
frames = 60

print("Frame-by-frame zoom (ease_in_out):")
for frame in range(0, frames+1, 10):
    t = frame / frames
    zoom = lerp_with_ease(zoom_start, zoom_end, t, 'ease_in_out')
    print(f"Frame {frame:2d}: zoom = {zoom:.3f}x")
```

**Why It Helps**: Combines interpolation + easing in single function. Reusable for any parameter (zoom, volume, opacity, etc.). Ease type parameter makes it flexible. Cleaner than inline math in animation code.

**Placement**: Applications page graphics/animation section, near easing functions. Show use cases: camera zoom, volume fade, UI transitions.

---

## Navigation and UX Enhancements

### Bidirectional Page Links
- Add "Previous/Next" navigation bars at top and bottom of each page
- Basics → Identities → Applications flow
- Include "Back to Index" link on all pages

### Code Block Improvements
- Precede each CodeFold with one-line intent: "**Goal**: Rotate a triangle through 8 positions around the unit circle"
- Follow each block with "**Why It Matters**": Brief application note or conceptual insight
- Add line-by-line comments for complex formulas (e.g., rotation matrix entries)

### Progressive Complexity Markers
- Label sections: 🟢 Beginner, 🟡 Intermediate, 🔴 Advanced
- Mark 3D rotations, Taylor series, and Fourier as 🟡 or 🔴
- Ensure 2D examples dominate basics/early sections

### Interactive Component Hooks
- `<UnitCircleExplorer />` with angle slider and live coordinate display
- `<WaveformVisualizer />` showing sin/cos/tan curves with phase shift controls
- `<RotationDemo />` for live 2D rotation with angle input
- `<EasingComparison />` side-by-side animation of linear vs eased motion

### Try-It Challenges (End of Applications Page)
1. **Graphics**: Implement a sprite that orbits a point with adjustable speed
2. **Signal**: Generate a 3-tone chord (major triad: 1, 5/4, 3/2 frequency ratios)
3. **Physics**: Model a damped oscillator (mass-spring with friction)
4. **Identity Challenge**: Derive half-angle formulas from angle addition formulas
5. **Optimization**: Compare performance of builtin vs fast approximation in real-time loop

---

## Ordering for the Rewrite

### Index Page
1. Hook with "mathematical DNA" metaphor and universal coordinate system framing
2. Learning path table (Fundamentals → Identities → Applications) with "Best For" guidance
3. Quick navigation grid linking to subsections
4. Key concepts covered list (preview what's inside)
5. Prerequisites section (coordinate systems, basic functions, programming)
6. Next steps pointers (Fourier, complex numbers, advanced graphics)

### Basics Page
1. **Introduction**: Clock face metaphor, geometric definitions (sin=y, cos=x, tan=y/x)
2. **Unit Circle Walk**: Table of 8 angles with coordinates, identity verification (sin²+cos²=1)
3. **Why Trig for Programmers**: Applications promise (graphics, games, audio, physics)
4. **Interactive Explorer**: `<UnitCircleExplorer />` component placeholder
5. **Computation Methods**:
   - Builtin math library (fast, standard)
   - NumPy vectorized (arrays, 10x speedup)
   - Taylor series (educational, no dependencies)
   - Performance comparison and "when to use which" guidance
6. **Special Angles**: Reference table with exact values (30°, 45°, 60°) and memory aids (√n/2 pattern)
7. **Quadrant Analysis**: Sign rules for sin/cos/tan across four quadrants
8. **Angle Normalization**: Wrapping to [0, 2π] or [-π, π] for consistent calculations
9. **Polar ↔ Cartesian**: Conversion utilities with rotation example
10. **Key Takeaways**: Summary list of core concepts

### Identities Page
1. **Introduction**: Identities as "universal keys" emerging from unit circle geometry
2. **Pythagorean Identities**: Verification at multiple angles, geometric proof sketch
3. **Angle Addition/Subtraction**: Formula + code verification, example with 30°+45°=75°
4. **Double Angle Formulas**: Sin(2θ) and cos(2θ) with table of verifications
5. **Half Angle Formulas**: Derivation from double angle, sign considerations by quadrant
6. **Product-to-Sum / Sum-to-Product**: Formulas with beat frequency application (audio interference)
7. **Power Reduction**: For integration, signal processing (reduce sin² to linear terms)
8. **Phase Shift Intuition**: Sin(θ+φ) as horizontal translation, connection to cos/sin relationship
9. **Practical Notes**: When/why identities matter (simplification, calculus, signal decomposition)
10. **Comprehensive Verification**: Full identity suite with numerical checks

### Applications Page
1. **Introduction**: Promise fulfillment—see theory in action across three domains
2. **Computer Graphics and Animation**:
   - 2D rotation matrices with triangle demo
   - Easing functions (linear, ease-in/out, bounce)
   - Parametric curves (circle, epicycloid, Lissajous, rose)
   - Sprite animation paths (orbit, figure-8, spiral, pendulum)
   - 3D rotation snippet (z-axis rotation for cube) [marked 🟡]
   - Iterative rotation drift warning + renormalization fix
   - Steering behaviors for game AI
   - Field-of-view detection (vision cone)
   - Smooth interpolation (lerp with ease)
3. **Signal Processing and Audio**:
   - Waveform generation (sine, square, sawtooth, triangle) with harmonics
   - AM/FM/PM modulation with carrier/modulator structure
   - Fourier analysis (FFT extracting frequency components)
   - Digital filters (moving average, high-pass, band-pass with cosine taper)
   - Sampling and aliasing demonstration (Nyquist rule)
   - Beat frequency detection using sum-to-product identity
4. **Physics Simulations**:
   - Simple harmonic motion (mass-spring) with position/velocity/acceleration
   - Pendulum oscillations (small-angle approximation)
   - Damped oscillations (friction/air resistance)
   - Wave equation basics (sin propagation)
5. **Try-It Challenges**: Five hands-on projects linking back to basics/identities
6. **Key Takeaways**: Summary of how trig enables each application domain

---

## Implementation Priority

### Phase 1: Core Content (Basics + Identities)
**Files**: `basics.md`, `identities.md`

1. **Basics page rewrite**:
   - Keep: Unit circle walk table, identity check, three computation methods, special angles, quadrant analysis
   - Add: Angle normalization example, polar conversion, "when to use which method" guidance
   - Enhance: More inline comments, "Why It Matters" notes after CodeFolds, progressive complexity markers

2. **Identities page rewrite**:
   - Keep: All identity verifications (Pythagorean, angle addition, double/half, product-sum)
   - Add: Phase shift visualization, practical application notes (why each identity matters)
   - Enhance: Geometric proof sketches (not just code), cross-references to applications

**Priority**: HIGH—these are foundation pages. Basics must be bulletproof before applications make sense.

---

### Phase 2: Applications (Graphics Focus)
**Files**: `applications.md` (graphics section)

3. **Graphics and Animation section**:
   - Keep: Rotation matrices, easing functions, parametric curves, sprite paths
   - Add: Iterative rotation drift demo, steering behaviors, FOV detection, smooth lerp
   - Enhance: 12-panel visualization (keep), mark 3D as advanced, add "Try-It" challenge

**Priority**: HIGH—most visually engaging content, motivates learning basics/identities.

---

### Phase 3: Applications (Signal Processing)
**Files**: `applications.md` (signal section)

4. **Signal Processing and Audio section**:
   - Keep: Waveform generation, AM/FM/PM, Fourier analysis, digital filters
   - Add: Sampling/aliasing demo, fast approximations comparison, beat frequency extraction
   - Enhance: Link back to product-to-sum identity, note Euler's formula connection

**Priority**: MEDIUM—technical but highly practical for audio/data work.

---

### Phase 4: Applications (Physics) + Polish
**Files**: `applications.md` (physics section), `index.md`, navigation

5. **Physics Simulations section**:
   - Add: SHM (mass-spring) with full position/velocity/acceleration, pendulum demo, damped oscillations, wave equation sketch
   - Enhance: Visual diagrams (force/displacement), link to differential equations topic

6. **Index page polish**:
   - Refine: Learning path table, quick navigation grid, prerequisites list, next-steps pointers
   - Add: Visual teasers (thumbnail graphics from applications?)

7. **Navigation and UX**:
   - Add: Bidirectional links (prev/next bars), back-to-index on all pages
   - Implement: Interactive component placeholders (`<UnitCircleExplorer />`, etc.)
   - Test: Progressive complexity markers (🟢🟡🔴) and "Try-It" challenges

**Priority**: MEDIUM—physics rounds out applications, polish improves discoverability.

---

### Phase 5: Advanced Topics and Cross-Links
**Files**: New advanced pages, cross-references throughout

8. **Optional advanced content** (if scope permits):
   - Complex numbers and Euler's formula (e^(iθ) = cos(θ) + i·sin(θ))
   - Fourier series and transforms (deeper dive)
   - 3D rotations (quaternions, gimbal lock)
   - Inverse trig functions (arcsin, arccos, arctan, atan2)

9. **Cross-linking pass**:
   - Link basics ↔ identities (identity verification uses basics concepts)
   - Link identities ↔ applications (product-to-sum in beat frequencies)
   - Link applications ↔ advanced topics (Fourier, complex numbers)

**Priority**: LOW—nice-to-have, but core 4 phases deliver complete unit circle coverage.

---

## Success Metrics

### Content Quality
- ✅ Every major identity has code verification (trust but verify)
- ✅ Every application has runnable example (no pseudocode)
- ✅ Every CodeFold has clear intent + "Why It Matters" note
- ✅ At least 3 new examples added (normalization, polar conversion, lerp, etc.)
- ✅ Progressive complexity markers (🟢🟡🔴) guide learners

### Pedagogical Coherence
- ✅ Basics → Identities → Applications flow is clear
- ✅ Cross-references connect related concepts (e.g., product-to-sum in beat frequencies)
- ✅ Metaphors (clock face, DNA, universal coordinate system) carry through all pages
- ✅ Promises (graphics, audio, physics) are fulfilled with concrete examples

### Programmer Focus
- ✅ Performance comparisons (builtin vs NumPy vs Taylor)
- ✅ Real-world parameters (44.1kHz audio, A440 note, 1000×1000 rotation)
- ✅ Common pitfalls (rotation drift, aliasing, angle wrapping)
- ✅ When-to-use guidance (NumPy for arrays, fast approx for real-time)
- ✅ Extensible patterns (identity verification suite, easing function library)

---

## Notes for Implementation

### Preserve from Archive
- Unit circle walk table structure (clean, readable output)
- Three computation methods (shows tool diversity)
- 12-panel visualization in applications (comprehensive, professional)
- Product-to-sum beat frequency demo (perfect identity application)
- Special angles memory aid (√n/2 pattern)

### Improve from Archive
- Add more inline comments in complex formulas (rotation matrix, FM signal)
- Provide "when to use which" decision trees (choosing computation method)
- Mark advanced content (3D rotations, Fourier) explicitly
- Add cautionary examples (rotation drift, aliasing)
- Strengthen cross-references between pages

### New Content to Develop
- Angle normalization utility (common pattern)
- Polar ↔ Cartesian conversion (fundamental skill)
- Steering behaviors (game AI essential)
- FOV detection (vision cone geometry)
- Smooth lerp (reusable animation helper)
- Fast approximations (performance-critical contexts)
- Sampling/aliasing demo (digital signal caution)

### Interactive Components
- `<UnitCircleExplorer />`: Angle slider, live coordinates, sin²+cos²=1 display
- `<WaveformVisualizer />`: Sin/cos/tan curves with phase shift, frequency controls
- `<RotationDemo />`: Drag-to-rotate shape, display angle and matrix values
- `<EasingComparison />`: Side-by-side linear vs eased animation

---

## Final Workflow Checklist

- [ ] Phase 1: Rewrite basics.md (unit circle, computation methods, special angles, new examples)
- [ ] Phase 1: Rewrite identities.md (verifications, phase shift, practical notes)
- [ ] Phase 2: Rewrite applications.md graphics section (rotation, easing, steering, FOV)
- [ ] Phase 3: Rewrite applications.md signal section (waveforms, modulation, Fourier, aliasing)
- [ ] Phase 4: Write applications.md physics section (SHM, pendulum, damped, waves)
- [ ] Phase 4: Polish index.md (learning path, navigation, next steps)
- [ ] Phase 4: Add navigation bars and UX markers (prev/next, complexity 🟢🟡🔴)
- [ ] Phase 5 (optional): Advanced topics (complex numbers, deeper Fourier, 3D rotations)
- [ ] Phase 5 (optional): Cross-linking pass (ensure all pages reference each other correctly)
- [ ] Final QA: Run all code blocks, verify output formatting, check links
