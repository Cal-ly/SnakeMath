---
title: Unit Circle Applications
description: Real-world applications of the unit circle and trigonometric functions in computer graphics, signal processing, physics, and animation
---

# Unit Circle Applications

The unit circle and trigonometric functions find countless applications across multiple fields. From computer graphics to signal processing, from physics simulations to audio synthesis, these mathematical concepts form the foundation of many modern technologies.

## Navigation

- [← Back to Unit Circle Index](index.md)
- [Unit Circle Basics](basics.md)
- [Trigonometric Identities](identities.md)

---

## Application 1: Computer Graphics and Animation

<CodeFold>

```python
import numpy as np
import matplotlib.pyplot as plt
from matplotlib.animation import FuncAnimation
import math

def computer_graphics_demo():
    """Demonstrate applications in computer graphics and animation"""
    
    print("Computer Graphics and Animation Applications")
    print("=" * 45)
    
    def rotation_matrices():
        """2D and 3D rotation using trigonometry"""
        
        print("Rotation Matrices:")
        print("2D: [cos θ  -sin θ]")
        print("    [sin θ   cos θ]")
        
        # Define a simple shape (triangle)
        triangle = np.array([
            [1, 0],   # Right vertex
            [-0.5, 0.866],  # Top-left vertex  
            [-0.5, -0.866], # Bottom-left vertex
            [1, 0]    # Close the shape
        ]).T
        
        # Rotation angles
        angles = np.linspace(0, 2*np.pi, 8)
        
        print(f"\nRotating triangle through {len(angles)} positions")
        
        rotated_triangles = []
        for angle in angles:
            # 2D rotation matrix
            R = np.array([
                [np.cos(angle), -np.sin(angle)],
                [np.sin(angle), np.cos(angle)]
            ])
            
            # Apply rotation
            rotated = R @ triangle
            rotated_triangles.append(rotated)
        
        return angles, triangle, rotated_triangles
    
    def smooth_animations():
        """Demonstrate smooth motion using trigonometric easing"""
        
        print(f"\nSmooth Animation Easing:")
        
        # Time parameter
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
        
        return t, linear, ease_in, ease_out, ease_in_out, bounce
    
    def parametric_curves():
        """Create complex shapes using parametric equations"""
        
        print(f"\nParametric Curves:")
        
        t = np.linspace(0, 2*np.pi, 1000)
        
        # Various parametric shapes
        circle_x = np.cos(t)
        circle_y = np.sin(t)
        
        # Epicycloid (flower-like pattern)
        R, r = 3, 1  # Radii
        k = R / r    # Ratio
        epicycloid_x = (R + r) * np.cos(t) - r * np.cos((R + r) * t / r)
        epicycloid_y = (R + r) * np.sin(t) - r * np.sin((R + r) * t / r)
        
        # Lissajous curve (oscilloscope patterns)
        a, b = 3, 4  # Frequency ratios
        phase = np.pi / 4
        lissajous_x = np.sin(a * t)
        lissajous_y = np.sin(b * t + phase)
        
        # Rose curve
        n = 5  # Number of petals
        rose_r = np.cos(n * t)
        rose_x = rose_r * np.cos(t)
        rose_y = rose_r * np.sin(t)
        
        print(f"• Circle: Basic unit circle")
        print(f"• Epicycloid: Complex rolling circle pattern")
        print(f"• Lissajous: {a}:{b} frequency ratio with phase shift")
        print(f"• Rose: {n}-petal rose curve")
        
        return t, (circle_x, circle_y), (epicycloid_x, epicycloid_y), \
               (lissajous_x, lissajous_y), (rose_x, rose_y)
    
    def sprite_animation():
        """Simulate sprite movement with trigonometric paths"""
        
        print(f"\nSprite Animation Paths:")
        
        t = np.linspace(0, 4*np.pi, 200)
        
        # Different movement patterns
        # Circular orbit
        orbit_x = 3 * np.cos(t)
        orbit_y = 3 * np.sin(t)
        
        # Figure-8 pattern
        fig8_x = 2 * np.sin(t)
        fig8_y = np.sin(2 * t)
        
        # Spiral
        spiral_r = 0.5 * t
        spiral_x = spiral_r * np.cos(t)
        spiral_y = spiral_r * np.sin(t)
        
        # Pendulum motion
        pendulum_x = 2 * np.sin(t)
        pendulum_y = -2 * np.cos(t) + 2  # Offset to show hanging
        
        print("• Orbit: Circular motion around center")
        print("• Figure-8: Infinity pattern using 2:1 frequency ratio")
        print("• Spiral: Expanding circular motion")
        print("• Pendulum: Simple harmonic motion")
        
        return t, (orbit_x, orbit_y), (fig8_x, fig8_y), \
               (spiral_x, spiral_y), (pendulum_x, pendulum_y)
    
    # Execute all demonstrations
    angles, triangle, rotated_triangles = rotation_matrices()
    t_ease, linear, ease_in, ease_out, ease_in_out, bounce = smooth_animations()
    t_param, circle, epicycloid, lissajous, rose = parametric_curves()
    t_sprite, orbit, fig8, spiral, pendulum = sprite_animation()
    
    # Comprehensive visualization
    fig = plt.figure(figsize=(16, 12))
    
    # Rotation demonstration
    plt.subplot(3, 4, 1)
    colors = plt.cm.rainbow(np.linspace(0, 1, len(rotated_triangles)))
    for i, (rotated, color) in enumerate(zip(rotated_triangles, colors)):
        plt.plot(rotated[0], rotated[1], 'o-', color=color, 
                linewidth=2, alpha=0.7, label=f'{angles[i]:.1f} rad')
    plt.title('2D Rotation Matrices')
    plt.axis('equal')
    plt.grid(True, alpha=0.3)
    plt.legend(bbox_to_anchor=(1.05, 1), loc='upper left', fontsize=8)
    
    # Easing functions
    plt.subplot(3, 4, 2)
    plt.plot(t_ease, linear, 'k-', linewidth=2, label='Linear')
    plt.plot(t_ease, ease_in, 'r-', linewidth=2, label='Ease In')
    plt.plot(t_ease, ease_out, 'g-', linewidth=2, label='Ease Out')
    plt.plot(t_ease, ease_in_out, 'b-', linewidth=2, label='Ease In-Out')
    plt.plot(t_ease, bounce, 'm-', linewidth=2, label='Bounce')
    plt.title('Animation Easing Functions')
    plt.xlabel('Time')
    plt.ylabel('Progress')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    # Parametric curves
    plt.subplot(3, 4, 3)
    plt.plot(circle[0], circle[1], 'b-', linewidth=2, label='Circle')
    plt.title('Unit Circle')
    plt.axis('equal')
    plt.grid(True, alpha=0.3)
    
    plt.subplot(3, 4, 4)
    plt.plot(epicycloid[0], epicycloid[1], 'r-', linewidth=2)
    plt.title('Epicycloid')
    plt.axis('equal')
    plt.grid(True, alpha=0.3)
    
    plt.subplot(3, 4, 5)
    plt.plot(lissajous[0], lissajous[1], 'g-', linewidth=2)
    plt.title('Lissajous Curve (3:4)')
    plt.axis('equal')
    plt.grid(True, alpha=0.3)
    
    plt.subplot(3, 4, 6)
    plt.plot(rose[0], rose[1], 'm-', linewidth=2)
    plt.title('Rose Curve (5 petals)')
    plt.axis('equal')
    plt.grid(True, alpha=0.3)
    
    # Sprite animation paths
    plt.subplot(3, 4, 7)
    plt.plot(orbit[0], orbit[1], 'b-', linewidth=2)
    plt.title('Circular Orbit')
    plt.axis('equal')
    plt.grid(True, alpha=0.3)
    
    plt.subplot(3, 4, 8)
    plt.plot(fig8[0], fig8[1], 'r-', linewidth=2)
    plt.title('Figure-8 Pattern')
    plt.axis('equal')
    plt.grid(True, alpha=0.3)
    
    plt.subplot(3, 4, 9)
    plt.plot(spiral[0], spiral[1], 'g-', linewidth=2)
    plt.title('Spiral Motion')
    plt.axis('equal')
    plt.grid(True, alpha=0.3)
    
    plt.subplot(3, 4, 10)
    plt.plot(pendulum[0], pendulum[1], 'm-', linewidth=2)
    plt.title('Pendulum Motion')
    plt.axis('equal')
    plt.grid(True, alpha=0.3)
    
    # 3D rotation example
    ax = plt.subplot(3, 4, 11, projection='3d')
    
    # 3D point cloud (cube vertices)
    cube_points = np.array([
        [-1, -1, -1], [1, -1, -1], [1, 1, -1], [-1, 1, -1],
        [-1, -1, 1], [1, -1, 1], [1, 1, 1], [-1, 1, 1]
    ]).T
    
    # 3D rotation about z-axis
    angle_3d = np.pi / 4
    R_3d = np.array([
        [np.cos(angle_3d), -np.sin(angle_3d), 0],
        [np.sin(angle_3d), np.cos(angle_3d), 0],
        [0, 0, 1]
    ])
    
    rotated_cube = R_3d @ cube_points
    
    ax.scatter(cube_points[0], cube_points[1], cube_points[2], 
              c='blue', s=50, alpha=0.6, label='Original')
    ax.scatter(rotated_cube[0], rotated_cube[1], rotated_cube[2], 
              c='red', s=50, alpha=0.6, label='Rotated')
    ax.set_title('3D Rotation')
    ax.legend()
    
    # Frame interpolation visualization
    plt.subplot(3, 4, 12)
    frames = np.arange(0, 60)
    smooth_frames = np.sin(frames * np.pi / 60) ** 2  # Ease-in-out
    linear_frames = frames / 60
    
    plt.plot(frames, linear_frames, 'k-', linewidth=2, label='Linear')
    plt.plot(frames, smooth_frames, 'r-', linewidth=2, label='Smooth')
    plt.title('Frame Interpolation')
    plt.xlabel('Frame Number')
    plt.ylabel('Animation Progress')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.show()
    
    print(f"\nGraphics Applications Summary:")
    print(f"• Rotation matrices use cos/sin for smooth transformations")
    print(f"• Easing functions create natural, pleasing motion")
    print(f"• Parametric equations generate complex shapes and paths")
    print(f"• Trigonometry enables realistic physics-based animation")
    
    return angles, rotated_triangles, t_ease, linear, ease_in

computer_graphics_demo()
```

</CodeFold>

## Application 2: Signal Processing and Audio

<CodeFold>

```python
def signal_processing_demo():
    """Demonstrate trigonometric applications in signal processing"""
    
    print("Signal Processing and Audio Applications")
    print("=" * 42)
    
    def waveform_generation():
        """Generate basic audio waveforms using trigonometry"""
        
        print("Basic Waveform Generation:")
        
        # Parameters
        duration = 1.0  # seconds
        sample_rate = 44100  # Hz (CD quality)
        frequency = 440  # Hz (A4 note)
        
        # Time array
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
        
        print(f"• Fundamental frequency: {frequency} Hz")
        print(f"• Sample rate: {sample_rate} Hz")
        print(f"• Duration: {duration} seconds")
        print(f"• Total samples: {len(t)}")
        
        return t, sine_wave, square_wave, sawtooth_wave, triangle_wave, complex_wave
    
    def frequency_modulation():
        """Demonstrate frequency and amplitude modulation"""
        
        print(f"\nFrequency and Amplitude Modulation:")
        
        # Parameters
        duration = 2.0
        sample_rate = 8000  # Lower for demonstration
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
        
        # Phase Modulation (PM)
        phase_deviation = np.pi / 4
        pm_signal = np.cos(2 * np.pi * carrier_freq * t + 
                          phase_deviation * np.sin(2 * np.pi * modulation_freq * t))
        
        print(f"• Carrier frequency: {carrier_freq} Hz")
        print(f"• Modulation frequency: {modulation_freq} Hz")
        print(f"• AM modulation index: {modulation_index}")
        print(f"• FM frequency deviation: {freq_deviation} Hz")
        
        return t, carrier, modulator, am_signal, fm_signal, pm_signal
    
    def fourier_analysis():
        """Analyze signals using Fourier transform"""
        
        print(f"\nFourier Analysis:")
        
        # Create a complex signal with multiple frequencies
        duration = 1.0
        sample_rate = 1000
        t = np.linspace(0, duration, sample_rate, False)
        
        # Signal components
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
        
        # Magnitude spectrum (only positive frequencies)
        positive_freqs = frequencies[:len(frequencies)//2]
        magnitude = np.abs(fft_signal)[:len(frequencies)//2]
        
        # Phase spectrum
        phase = np.angle(fft_signal)[:len(frequencies)//2]
        
        print(f"• Signal components: {freq1}, {freq2}, {freq3} Hz")
        print(f"• Sample rate: {sample_rate} Hz")
        print(f"• Frequency resolution: {sample_rate/len(signal):.1f} Hz")
        print(f"• SNR (approximate): {20*np.log10(np.std(signal)/np.std(noise)):.1f} dB")
        
        return t, signal, noisy_signal, positive_freqs, magnitude, phase
    
    def digital_filters():
        """Implement digital filters using trigonometry"""
        
        print(f"\nDigital Filters:")
        
        # Parameters
        sample_rate = 1000
        duration = 2.0
        t = np.linspace(0, duration, int(sample_rate * duration), False)
        
        # Create test signal with multiple frequencies
        low_freq = 10   # Hz
        mid_freq = 50   # Hz  
        high_freq = 200 # Hz
        
        test_signal = (np.sin(2 * np.pi * low_freq * t) + 
                      np.sin(2 * np.pi * mid_freq * t) + 
                      np.sin(2 * np.pi * high_freq * t))
        
        # Simple Moving Average Filter (Low-pass)
        window_size = 21
        ma_filter = np.ones(window_size) / window_size
        ma_filtered = np.convolve(test_signal, ma_filter, mode='same')
        
        # Simple High-pass Filter (difference)
        hp_filtered = np.diff(test_signal, prepend=test_signal[0])
        
        # Band-pass filter using trigonometric window
        # Butterworth-like response using cosine
        cutoff_low = 30   # Hz
        cutoff_high = 100 # Hz
        
        bp_filtered = test_signal.copy()
        fft_signal = np.fft.fft(bp_filtered)
        freqs = np.fft.fftfreq(len(bp_filtered), 1/sample_rate)
        
        # Create frequency domain filter
        filter_response = np.zeros(len(freqs))
        for i, freq in enumerate(freqs):
            abs_freq = abs(freq)
            if cutoff_low <= abs_freq <= cutoff_high:
                # Cosine-tapered pass band
                center_freq = (cutoff_low + cutoff_high) / 2
                bandwidth = cutoff_high - cutoff_low
                normalized_freq = (abs_freq - center_freq) / (bandwidth / 2)
                filter_response[i] = 0.5 * (1 + np.cos(np.pi * abs(normalized_freq)))
        
        bp_filtered_fft = fft_signal * filter_response
        bp_filtered = np.real(np.fft.ifft(bp_filtered_fft))
        
        print(f"• Test frequencies: {low_freq}, {mid_freq}, {high_freq} Hz")
        print(f"• Moving average window: {window_size} samples")
        print(f"• Band-pass range: {cutoff_low}-{cutoff_high} Hz")
        
        return t, test_signal, ma_filtered, hp_filtered, bp_filtered, filter_response, freqs
    
    # Execute all demonstrations
    t_wave, sine, square, sawtooth, triangle, complex_wave = waveform_generation()
    t_mod, carrier, modulator, am, fm, pm = frequency_modulation()
    t_fft, signal, noisy_signal, freqs_fft, magnitude, phase = fourier_analysis()
    t_filt, test_sig, ma_filt, hp_filt, bp_filt, filt_resp, freqs_filt = digital_filters()
    
    # Comprehensive visualization
    fig = plt.figure(figsize=(16, 12))
    
    # Waveforms
    plt.subplot(4, 4, 1)
    plt.plot(t_wave[:1000], sine[:1000], 'b-', linewidth=2, label='Sine')
    plt.plot(t_wave[:1000], square[:1000], 'r-', linewidth=2, label='Square')
    plt.title('Basic Waveforms')
    plt.xlabel('Time (s)')
    plt.ylabel('Amplitude')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    plt.subplot(4, 4, 2)
    plt.plot(t_wave[:1000], sawtooth[:1000], 'g-', linewidth=2, label='Sawtooth')
    plt.plot(t_wave[:1000], triangle[:1000], 'm-', linewidth=2, label='Triangle')
    plt.title('More Waveforms')
    plt.xlabel('Time (s)')
    plt.ylabel('Amplitude')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    plt.subplot(4, 4, 3)
    plt.plot(t_wave[:1000], sine[:1000], 'b-', linewidth=1, alpha=0.7, label='Fundamental')
    plt.plot(t_wave[:1000], complex_wave[:1000], 'r-', linewidth=2, label='With Harmonics')
    plt.title('Harmonic Content')
    plt.xlabel('Time (s)')
    plt.ylabel('Amplitude')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    # Modulation
    plt.subplot(4, 4, 4)
    plt.plot(t_mod[:800], carrier[:800], 'b-', linewidth=1, alpha=0.7, label='Carrier')
    plt.plot(t_mod[:800], am[:800], 'r-', linewidth=2, label='AM Signal')
    plt.title('Amplitude Modulation')
    plt.xlabel('Time (s)')
    plt.ylabel('Amplitude')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    plt.subplot(4, 4, 5)
    plt.plot(t_mod[:800], carrier[:800], 'b-', linewidth=1, alpha=0.7, label='Carrier')
    plt.plot(t_mod[:800], fm[:800], 'g-', linewidth=2, label='FM Signal')
    plt.title('Frequency Modulation')
    plt.xlabel('Time (s)')
    plt.ylabel('Amplitude')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    plt.subplot(4, 4, 6)
    plt.plot(t_mod[:200], modulator[:200], 'k-', linewidth=2, label='Modulator')
    plt.plot(t_mod[:200], pm[:200], 'm-', linewidth=2, label='PM Signal')
    plt.title('Phase Modulation')
    plt.xlabel('Time (s)')
    plt.ylabel('Amplitude')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    # Fourier Analysis
    plt.subplot(4, 4, 7)
    plt.plot(t_fft[:200], signal[:200], 'b-', linewidth=2, label='Clean')
    plt.plot(t_fft[:200], noisy_signal[:200], 'r-', linewidth=1, alpha=0.7, label='Noisy')
    plt.title('Time Domain Signal')
    plt.xlabel('Time (s)')
    plt.ylabel('Amplitude')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    plt.subplot(4, 4, 8)
    plt.plot(freqs_fft, magnitude, 'b-', linewidth=2)
    plt.title('Frequency Spectrum')
    plt.xlabel('Frequency (Hz)')
    plt.ylabel('Magnitude')
    plt.grid(True, alpha=0.3)
    plt.xlim(0, 300)
    
    plt.subplot(4, 4, 9)
    plt.plot(freqs_fft, phase, 'g-', linewidth=2)
    plt.title('Phase Spectrum')
    plt.xlabel('Frequency (Hz)')
    plt.ylabel('Phase (radians)')
    plt.grid(True, alpha=0.3)
    plt.xlim(0, 300)
    
    # Digital Filters
    plt.subplot(4, 4, 10)
    plt.plot(t_filt[:400], test_sig[:400], 'k-', linewidth=2, label='Original')
    plt.plot(t_filt[:400], ma_filt[:400], 'r-', linewidth=2, label='Low-pass')
    plt.title('Moving Average Filter')
    plt.xlabel('Time (s)')
    plt.ylabel('Amplitude')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    plt.subplot(4, 4, 11)
    plt.plot(t_filt[:400], test_sig[:400], 'k-', linewidth=2, label='Original')
    plt.plot(t_filt[:400], hp_filt[:400], 'g-', linewidth=2, label='High-pass')
    plt.title('High-pass Filter')
    plt.xlabel('Time (s)')
    plt.ylabel('Amplitude')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    plt.subplot(4, 4, 12)
    plt.plot(t_filt[:400], test_sig[:400], 'k-', linewidth=2, label='Original')
    plt.plot(t_filt[:400], bp_filt[:400], 'b-', linewidth=2, label='Band-pass')
    plt.title('Band-pass Filter')
    plt.xlabel('Time (s)')
    plt.ylabel('Amplitude')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    plt.subplot(4, 4, 13)
    plt.plot(freqs_filt[:len(freqs_filt)//2], filt_resp[:len(freqs_filt)//2], 'b-', linewidth=2)
    plt.title('Filter Frequency Response')
    plt.xlabel('Frequency (Hz)')
    plt.ylabel('Magnitude')
    plt.grid(True, alpha=0.3)
    plt.xlim(0, 250)
    
    # Spectrograms simulation
    plt.subplot(4, 4, 14)
    # Create a chirp signal (frequency sweep)
    f_start, f_end = 10, 200
    chirp_t = np.linspace(0, 1, 1000)
    instantaneous_freq = f_start + (f_end - f_start) * chirp_t
    chirp_signal = np.sin(2 * np.pi * np.cumsum(instantaneous_freq) / 1000)
    
    plt.plot(chirp_t, chirp_signal, 'b-', linewidth=2)
    plt.title('Frequency Sweep (Chirp)')
    plt.xlabel('Time (s)')
    plt.ylabel('Amplitude')
    plt.grid(True, alpha=0.3)
    
    plt.subplot(4, 4, 15)
    plt.plot(chirp_t, instantaneous_freq, 'r-', linewidth=2)
    plt.title('Instantaneous Frequency')
    plt.xlabel('Time (s)')
    plt.ylabel('Frequency (Hz)')
    plt.grid(True, alpha=0.3)
    
    # Window functions
    plt.subplot(4, 4, 16)
    N = 100
    n = np.arange(N)
    
    # Common window functions
    rectangular = np.ones(N)
    hanning = 0.5 * (1 - np.cos(2 * np.pi * n / (N - 1)))
    hamming = 0.54 - 0.46 * np.cos(2 * np.pi * n / (N - 1))
    blackman = 0.42 - 0.5 * np.cos(2 * np.pi * n / (N - 1)) + 0.08 * np.cos(4 * np.pi * n / (N - 1))
    
    plt.plot(n, rectangular, 'k-', linewidth=2, label='Rectangular')
    plt.plot(n, hanning, 'r-', linewidth=2, label='Hanning')
    plt.plot(n, hamming, 'g-', linewidth=2, label='Hamming')
    plt.plot(n, blackman, 'b-', linewidth=2, label='Blackman')
    plt.title('Window Functions')
    plt.xlabel('Sample')
    plt.ylabel('Amplitude')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    plt.tight_layout()
    plt.show()
    
    print(f"\nSignal Processing Summary:")
    print(f"• Trigonometric functions generate all basic waveforms")
    print(f"• Modulation techniques enable efficient signal transmission")
    print(f"• Fourier analysis reveals frequency content of signals")
    print(f"• Digital filters use trigonometric principles for signal conditioning")
    
    return t_wave, sine, complex_wave, freqs_fft, magnitude

signal_processing_demo()
```

</CodeFold>

## Application 3: Physics Simulations and Oscillations

<CodeFold>

```python
def physics_simulations():
    """Model physical systems using trigonometric functions"""
    
    print("Physics Simulations with Trigonometry")
    print("=" * 45)
    
    def simple_harmonic_motion():
        """Model simple harmonic motion (springs, pendulums)"""
        
        print("Simple Harmonic Motion:")
        print("x(t) = A·cos(ωt + φ)")
        
        # Parameters
        amplitude = 2.0  # meters
        frequency = 0.5  # Hz
        omega = 2 * np.pi * frequency  # angular frequency
        phase = 0  # phase shift
        
        # Time array
        t = np.linspace(0, 4/frequency, 1000)  # 4 periods
        
        # Position, velocity, and acceleration
        position = amplitude * np.cos(omega * t + phase)
        velocity = -amplitude * omega * np.sin(omega * t + phase)
        acceleration = -amplitude * omega**2 * np.cos(omega * t + phase)
        
        print(f"• Amplitude: {amplitude} m")
        print(f"• Frequency: {frequency} Hz")
        print(f"• Period: {1/frequency} s")
        print(f"• Angular frequency: {omega:.3f} rad/s")
        
        return t, position, velocity, acceleration
    
    def damped_harmonic_motion():
        """Model damped harmonic motion with energy loss"""
        
        print(f"\nDamped Harmonic Motion:")
        print("x(t) = A·e^(-γt)·cos(ω't + φ)")
        
        # Parameters
        amplitude = 2.0
        omega0 = 3.0  # natural frequency
        gamma = 0.5   # damping coefficient
        omega_d = np.sqrt(omega0**2 - gamma**2)  # damped frequency
        
        t = np.linspace(0, 10, 1000)
        
        # Different damping regimes
        # Underdamped
        x_underdamped = amplitude * np.exp(-gamma * t) * np.cos(omega_d * t)
        
        # Critically damped
        gamma_critical = omega0
        x_critical = amplitude * (1 + gamma_critical * t) * np.exp(-gamma_critical * t)
        
        # Overdamped
        gamma_over = 2 * omega0
        r1 = -gamma_over + np.sqrt(gamma_over**2 - omega0**2)
        r2 = -gamma_over - np.sqrt(gamma_over**2 - omega0**2)
        x_overdamped = amplitude * (np.exp(r1 * t) + np.exp(r2 * t)) / 2
        
        return t, x_underdamped, x_critical, x_overdamped
    
    def wave_propagation():
        """Model wave propagation in space and time"""
        
        print(f"\nWave Propagation:")
        print("y(x,t) = A·sin(kx - ωt)")
        
        # Parameters
        amplitude = 1.0
        wavelength = 2.0  # meters
        k = 2 * np.pi / wavelength  # wave number
        frequency = 1.0  # Hz
        omega = 2 * np.pi * frequency
        wave_speed = omega / k  # v = ω/k
        
        print(f"• Wavelength: {wavelength} m")
        print(f"• Frequency: {frequency} Hz")
        print(f"• Wave speed: {wave_speed} m/s")
        
        # Spatial and temporal grids
        x = np.linspace(0, 10, 200)
        t_snapshots = np.linspace(0, 2, 5)
        
        # Wave at different times
        waves = []
        for t_val in t_snapshots:
            y = amplitude * np.sin(k * x - omega * t_val)
            waves.append(y)
        
        return x, t_snapshots, waves, wave_speed
    
    def coupled_oscillators():
        """Model coupled harmonic oscillators"""
        
        print(f"\nCoupled Oscillators:")
        print("Two masses connected by springs")
        
        # Parameters
        m1, m2 = 1.0, 1.0  # masses
        k1, k2, k_coupling = 1.0, 1.0, 0.5  # spring constants
        
        # Natural frequencies
        omega1 = np.sqrt(k1 / m1)
        omega2 = np.sqrt(k2 / m2)
        
        # Normal mode frequencies (for equal masses and springs)
        omega_plus = np.sqrt((k1 + k2 + 2*k_coupling) / m1)  # Symmetric mode
        omega_minus = np.sqrt((k1 + k2) / m1)  # Antisymmetric mode
        
        t = np.linspace(0, 20, 1000)
        
        # Initial conditions: mass 1 displaced, mass 2 at rest
        A1, A2 = 1.0, 0.0
        
        # Coupled motion (simplified for equal masses)
        x1 = (A1/2) * (np.cos(omega_minus * t) + np.cos(omega_plus * t))
        x2 = (A1/2) * (np.cos(omega_minus * t) - np.cos(omega_plus * t))
        
        print(f"• Natural frequency 1: {omega1:.3f} rad/s")
        print(f"• Natural frequency 2: {omega2:.3f} rad/s")
        print(f"• Normal mode frequencies: {omega_minus:.3f}, {omega_plus:.3f} rad/s")
        
        return t, x1, x2, omega_minus, omega_plus
    
    # Run all simulations
    t_shm, pos, vel, acc = simple_harmonic_motion()
    t_damp, x_under, x_crit, x_over = damped_harmonic_motion()
    x_wave, t_snaps, waves, v_wave = wave_propagation()
    t_coupled, x1_coupled, x2_coupled, omega_minus, omega_plus = coupled_oscillators()
    
    # Comprehensive visualization
    fig = plt.figure(figsize=(18, 12))
    
    # Simple harmonic motion
    plt.subplot(3, 3, 1)
    plt.plot(t_shm, pos, 'b-', linewidth=2, label='Position')
    plt.plot(t_shm, vel, 'r-', linewidth=2, label='Velocity')
    plt.plot(t_shm, acc, 'g-', linewidth=2, label='Acceleration')
    plt.title('Simple Harmonic Motion')
    plt.xlabel('Time (s)')
    plt.ylabel('Amplitude')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    # Phase space plot
    plt.subplot(3, 3, 2)
    plt.plot(pos, vel, 'purple', linewidth=2)
    plt.title('Phase Space (Position vs Velocity)')
    plt.xlabel('Position (m)')
    plt.ylabel('Velocity (m/s)')
    plt.grid(True, alpha=0.3)
    plt.axis('equal')
    
    # Damped harmonic motion
    plt.subplot(3, 3, 3)
    plt.plot(t_damp, x_under, 'b-', linewidth=2, label='Underdamped')
    plt.plot(t_damp, x_crit, 'r-', linewidth=2, label='Critical')
    plt.plot(t_damp, x_over, 'g-', linewidth=2, label='Overdamped')
    plt.title('Damped Harmonic Motion')
    plt.xlabel('Time (s)')
    plt.ylabel('Position (m)')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    # Wave propagation snapshots
    plt.subplot(3, 3, 4)
    colors = ['blue', 'green', 'red', 'orange', 'purple']
    for i, (t_val, wave) in enumerate(zip(t_snaps, waves)):
        plt.plot(x_wave, wave, color=colors[i], linewidth=2, 
                label=f't = {t_val:.1f} s')
    plt.title('Wave Propagation Snapshots')
    plt.xlabel('Position (m)')
    plt.ylabel('Amplitude')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    # Coupled oscillators
    plt.subplot(3, 3, 5)
    plt.plot(t_coupled, x1_coupled, 'b-', linewidth=2, label='Mass 1')
    plt.plot(t_coupled, x2_coupled, 'r-', linewidth=2, label='Mass 2')
    plt.title('Coupled Oscillators')
    plt.xlabel('Time (s)')
    plt.ylabel('Position (m)')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    # Energy in simple harmonic motion
    plt.subplot(3, 3, 6)
    # Assuming unit mass and spring constant for simplicity
    kinetic_energy = 0.5 * vel**2
    potential_energy = 0.5 * pos**2
    total_energy = kinetic_energy + potential_energy
    
    plt.plot(t_shm, kinetic_energy, 'r-', linewidth=2, label='Kinetic')
    plt.plot(t_shm, potential_energy, 'b-', linewidth=2, label='Potential')
    plt.plot(t_shm, total_energy, 'k-', linewidth=2, label='Total')
    plt.title('Energy in Simple Harmonic Motion')
    plt.xlabel('Time (s)')
    plt.ylabel('Energy (J)')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    # Frequency spectrum of damped oscillation
    plt.subplot(3, 3, 7)
    # Simple frequency analysis
    fft_under = np.fft.fft(x_under)
    freqs = np.fft.fftfreq(len(t_damp), t_damp[1] - t_damp[0])
    
    # Plot only positive frequencies
    positive_freqs = freqs[:len(freqs)//2]
    magnitude = np.abs(fft_under)[:len(freqs)//2]
    
    plt.plot(positive_freqs, magnitude, 'b-', linewidth=2)
    plt.title('Frequency Spectrum (Underdamped)')
    plt.xlabel('Frequency (Hz)')
    plt.ylabel('Magnitude')
    plt.grid(True, alpha=0.3)
    plt.xlim(0, 2)
    
    # Normal modes visualization
    plt.subplot(3, 3, 8)
    t_mode = np.linspace(0, 4*np.pi/omega_minus, 100)
    mode1 = np.cos(omega_minus * t_mode)  # Symmetric mode
    mode2 = np.cos(omega_plus * t_mode)   # Antisymmetric mode
    
    plt.plot(t_mode, mode1, 'b-', linewidth=2, label=f'Mode 1 ({omega_minus:.1f} rad/s)')
    plt.plot(t_mode, mode2, 'r-', linewidth=2, label=f'Mode 2 ({omega_plus:.1f} rad/s)')
    plt.title('Normal Modes of Coupled System')
    plt.xlabel('Time (s)')
    plt.ylabel('Amplitude')
    plt.legend()
    plt.grid(True, alpha=0.3)
    
    # 3D wave surface
    ax = plt.subplot(3, 3, 9, projection='3d')
    X_3d, T_3d = np.meshgrid(x_wave[:50], np.linspace(0, 2, 20))
    Z_3d = np.sin(2*np.pi*X_3d - 2*np.pi*T_3d)
    
    ax.plot_surface(X_3d, T_3d, Z_3d, cmap='viridis', alpha=0.7)
    ax.set_xlabel('Position (m)')
    ax.set_ylabel('Time (s)')
    ax.set_zlabel('Amplitude')
    ax.set_title('3D Wave Propagation')
    
    plt.tight_layout()
    plt.show()
    
    print(f"\nPhysics Insights:")
    print(f"• Simple harmonic motion: energy oscillates between kinetic and potential")
    print(f"• Damping reduces amplitude while preserving frequency (underdamped case)")
    print(f"• Wave speed relates frequency and wavelength: v = fλ")
    print(f"• Coupled systems have normal modes with characteristic frequencies")
    print(f"• Trigonometric functions model all oscillatory phenomena in physics")
    
    return t_shm, pos, vel, acc

physics_simulations()
```

</CodeFold>

## Try it Yourself

Ready to master trigonometric functions and the unit circle? Here are some hands-on challenges:

- **Interactive Unit Circle:** Build a dynamic unit circle explorer with angle input and real-time coordinate display.
- **Wave Synthesizer:** Create a digital audio synthesizer using trigonometric functions to generate different waveforms.
- **Animation Framework:** Develop a 2D animation system using trigonometric functions for smooth motion and easing.
- **Physics Simulator:** Build a spring-mass system simulator with real-time visualization of oscillations.
- **Signal Analyzer:** Implement a tool that analyzes periodic signals and identifies their frequency components.
- **Graphics Transformer:** Create a 2D graphics engine that performs rotations, scaling, and transformations using trigonometry.

## Key Takeaways

- The unit circle provides geometric intuition for trigonometric functions, connecting angles to coordinates.
- Trigonometric functions are periodic, making them perfect for modeling waves, rotations, and oscillations.
- sin and cos are fundamental - all other trigonometric functions can be expressed in terms of them.
- Trigonometric identities arise naturally from the geometric properties of the unit circle.
- These functions are essential for computer graphics, signal processing, physics simulations, and animation.
- Phase relationships between sin and cos enable complex transformations and smooth interpolations.
- Understanding both geometric and analytical perspectives deepens comprehension and application ability.

## Next Steps & Further Exploration

Ready to dive deeper into the trigonometric universe?

- Explore **Complex Numbers** and Euler's formula: \(e^{i\theta} = \cos\theta + i\sin\theta\) for advanced connections.
- Study **Fourier Series** to understand how any periodic function can be expressed as sums of sines and cosines.
- Learn **Differential Equations** to see how trigonometric functions naturally arise as solutions to oscillation problems.
- Investigate **Signal Processing** techniques that rely heavily on trigonometric transforms for analysis.
- Apply trigonometry to **3D Graphics** with quaternions and advanced rotation techniques.
