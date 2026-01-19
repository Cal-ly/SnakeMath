# Content Enhancement: Matrices (Planning)

## Voice and Framing to Keep

### Opening Hook
- **"Spreadsheets with superpowers"** metaphor from index.md (line 9) - "Matrices are rectangular grids of numbers that represent everything from image pixels to complex transformations. Think of them as spreadsheets with mathematical superpowers!"
- **"Arrays of arrays with mathematical operations"** from index.md (line 9) - bridges programming mental model (arrays) with mathematical abstraction
- **"Recipe mixer"** analogy from basics.md (line 45) - "Think of matrix multiplication like a recipe mixer - each output ingredient combines multiple input ingredients in specific proportions"
- These work because they connect to familiar concepts (spreadsheets, recipes) while introducing mathematical power

### Pedagogical Stance
- **Educational transparency**: Manual Matrix class implementation (basics.md, lines ~78-140) shows HOW operations work before NumPy abstraction
- **Programmer-first framing**: "In programming terms, they're arrays of arrays" (index.md, line 9)
- **Performance-aware**: Timing comparisons and memory usage analysis (operations.md) ground optimization claims in numbers
- **Verification pattern**: "Trust but verify" checks throughout (orthogonality verification, reconstruction errors, condition numbers)

## Core Pillars by Page

### 1. index.md (Overview)
- **Learning path with experience badges**: 🟢 New to matrices → 🟡 Know basics, want efficiency → 🔴 Ready for applications (lines 51-54)
- **Quick start 5-minute primer** (lines 75-79): Clear action steps for impatient learners
- **Key formulas prominently displayed** (lines 56-68): Addition, multiplication, transpose with mathematical notation
- **Related concepts links**: Connects to vectors, linear equations, functions, summation notation
- **Prerequisites clearly stated**: Variables, arrays, basic arithmetic

### 2. basics.md (Fundamentals)
- **Opening hook**: Spreadsheets metaphor + arrays of arrays (line 9)
- **Gradebook example** (lines ~34-50): Instant practical demo with `@` operator
- **Manual Matrix class** (lines ~78-140): Complete from-scratch implementation with `__add__`, `__matmul__`, `transpose`
- **Scale-then-rotate visualization** (lines ~164-263): Transformation composition with matplotlib plots
- **Common matrix patterns**: Identity, zero, diagonal, symmetric, triangular (implied in operations section)

### 3. operations.md (Implementation)
- **Performance benchmark** (lines ~20-75): 1000×1000 timing comparison showing real numbers
- **Dense vs sparse contrast** (lines ~87-170): Memory savings and performance for sparse matrices
- **Linear systems solver trio** (lines ~250-350): Direct solve vs inverse vs LU decomposition
- **Conditioning checks** (lines ~215-245): Condition number as numerical stability indicator
- **Decomposition library**: LU, Cholesky, QR, SVD with reconstruction verification
- **Iterative solvers sidebar**: CG, GMRES, BiCGSTAB for large systems

### 4. applications.md (Real-World)
- **PCA with eigenvalues** (lines ~22-140): Correlated 2D data with principal components visualization
- **Markov chains** (lines ~155-220): Weather transitions and steady-state analysis
- **Graphics transformations**: Triangle transformations with homogeneous coordinates
- **Engineering systems**: Circuit node voltages, truss analysis with least squares
- **Linear regression**: Normal equations with residual analysis

## Reuse-Ready Exemplars with Rationale

### 1. Gradebook Demo (basics.md, lines ~34-50)
```python
student_scores = np.array([
    [85, 92, 78],  # Alice: Math, Science, English
    [90, 88, 95],  # Bob
    [76, 84, 89]   # Carol
])
subject_weights = np.array([[0.4], [0.3], [0.3]])  # Math 40%, Science 30%, English 30%
final_grades = student_scores @ subject_weights
```
**Why it works**: Instant practical application everyone understands. Shows `@` operator in one glance. Small enough to verify by hand. Clear input→output narrative.
**Reuse**: Perfect first runnable example after defining matrices. Template for showing matrix multiplication as weighted combination.

### 2. Manual Matrix Class (basics.md, lines ~78-140)
```python
class Matrix:
    def __init__(self, data):
        self.data = data
        self.rows = len(data)
        self.cols = len(data[0]) if data else 0
    
    def __add__(self, other):
        # Element-wise addition with dimension checking
        result = []
        for i in range(self.rows):
            row = []
            for j in range(self.cols):
                row.append(self.data[i][j] + other.data[i][j])
            result.append(row)
        return Matrix(result)
    
    def __matmul__(self, other):
        # Row × column multiplication
        result = []
        for i in range(self.rows):
            row = []
            for j in range(other.cols):
                sum_val = sum(self.data[i][k] * other.data[k][j] for k in range(self.cols))
                row.append(sum_val)
            result.append(row)
        return Matrix(result)
```
**Why it works**: Educational transparency - shows exactly how operations work. Uses Python magic methods (`__add__`, `__matmul__`). Demonstrates dimension checking. Builds understanding before library abstraction.
**Reuse**: Teaching OOP + matrix concepts together. Foundation for understanding NumPy's optimizations. Can extend with more operations.

### 3. Scale-Then-Rotate Visualization (basics.md, lines ~164-263)
```python
# Scale by factor of 2 in x, 1.5 in y
scale_matrix = np.array([[2.0, 0.0], [0.0, 1.5]])
# Rotate by 45 degrees
rotation_matrix = np.array([[cos(π/4), -sin(π/4)], [sin(π/4), cos(π/4)]])
# Combined transformation
combined_matrix = scale_matrix @ rotation_matrix
```
Three-panel visualization: Original → Scaled → Rotated points
**Why it works**: Transformation composition narrative with visual proof. Shows matrix multiplication as function composition. Color-coded progression (blue → red → green). Verification that sequential = combined.
**Reuse**: Core graphics transformation demo. Template for any geometric operation visualization. Extends naturally to 3D.

### 4. Performance Benchmark (operations.md, lines ~20-75)
```python
size = 1000
A = np.random.random((size, size))
B = np.random.random((size, size))
# Timing results:
# Addition: 0.0042s
# Multiplication: 0.0157s
# Transpose: 0.000003s (view operation!)
# Determinant: 0.0234s
```
**Why it works**: Concrete numbers make performance real. Shows relative costs of operations. Highlights view vs copy (transpose). Grounds "NumPy is fast" claim in data.
**Reuse**: Motivates learning NumPy over manual loops. Justifies optimization efforts. Template for any performance comparison.

### 5. Sparse Matrix Memory Savings (operations.md, lines ~87-170)
```python
size = 5000
density = 0.01  # 1% non-zero
sparse_matrix = sparse.csr_matrix((data, (row_indices, col_indices)), shape=(size, size))
# Results:
# Dense: 200.0 MB
# Sparse: 2.4 MB
# Memory savings: 98.8%
```
**Why it works**: Dramatic memory savings (98.8%!) make the case. Real numbers for large matrices. Shows CSR format construction. Compares dense vs sparse operations.
**Reuse**: Essential for large-scale problems. Template for sparse matrix introduction. Justifies specialized algorithms.

### 6. Linear Systems Solver Trio (operations.md, lines ~250-350)
```python
# Method 1: Direct solve (preferred)
x = np.linalg.solve(A, b)
# Method 2: Matrix inverse (avoid!)
x = np.linalg.inv(A) @ b  # Less stable, slower
# Method 3: LU decomposition (when solving multiple times)
lu, piv = scipy.linalg.lu_factor(A)
x = scipy.linalg.lu_solve((lu, piv), b)
```
With condition number check: `cond = np.linalg.cond(A)`
**Why it works**: Teaches solver choice with clear guidance. Explains why inverse is problematic. Shows when LU amortizes cost. Includes stability check.
**Reuse**: Critical for numerical computing. Template for linear system solving. Prevents common anti-patterns.

### 7. PCA with Eigenvalues (applications.md, lines ~22-140)
```python
# Generate correlated 2D data
x1 = np.random.normal(0, 2, n_samples)
x2 = 1.5 * x1 + np.random.normal(0, 1, n_samples)
# Covariance matrix eigendecomposition
cov_matrix = np.cov(X_centered.T)
eigenvalues, eigenvectors = np.linalg.eig(cov_matrix)
# Results:
# PC1 explains 78.3% of variance
# PC2 explains 21.7% of variance
```
Three-panel plot: Original data → With PC axes → Transformed to PC coordinates
**Why it works**: Concrete data generation shows correlation. Visual + numerical analysis. Explains variance interpretation. Shows decorrelation result.
**Reuse**: Foundational ML example. Demonstrates eigenvalue applications. Template for dimensionality reduction.

### 8. Markov Chain Weather Model (applications.md, lines ~155-220)
```python
P = np.array([[0.7, 0.2, 0.1],   # From Sunny
              [0.3, 0.4, 0.3],   # From Cloudy  
              [0.2, 0.3, 0.5]])  # From Rainy
# Matrix powers for multi-day prediction
P_7days = np.linalg.matrix_power(P, 7)
# Steady state: eigenvector with eigenvalue 1
```
**Why it works**: Intuitive weather context. Shows matrix powers as time evolution. Steady-state as eigenvector interpretation. Verifiable predictions.
**Reuse**: Classic Markov chain intro. Template for state transition analysis. Demonstrates practical eigenvalue use.

### 9. Homogeneous Coordinates Graphics (applications.md, implied)
```python
# 3×3 matrix for 2D transformations: translate, rotate, scale in one
transform = translation @ rotation @ scaling
# Apply to triangle vertices
transformed_vertices = (homogeneous_vertices @ transform.T)[:, :2]
```
**Why it works**: Unifies translation (affine) with linear ops. One matrix handles full pipeline. Essential graphics technique.
**Reuse**: 2D/3D graphics foundation. Game engine transformations. Computer vision preprocessing.

### 10. Linear Regression Normal Equations (applications.md, implied)
```python
# Solve (X^T X)β = X^T y
beta = np.linalg.solve(X.T @ X, X.T @ y)
# Or use least squares (more stable)
beta, residuals, rank, s = np.linalg.lstsq(X, y, rcond=None)
```
With residual analysis and confidence intervals
**Why it works**: Connects matrices to statistics/ML. Shows normal equations explicitly. Compares methods (solve vs lstsq). Demonstrates model evaluation.
**Reuse**: Core ML regression example. Template for least squares problems. Bridges linear algebra and statistics.

## New Examples to Add

### 1. **Blocked Matrix Multiplication**
**Concept**: Cache-friendly tiling for large matrices
**Code**:
```python
def blocked_matmul(A, B, block_size=64):
    n = A.shape[0]
    C = np.zeros((n, n))
    for i in range(0, n, block_size):
        for j in range(0, n, block_size):
            for k in range(0, n, block_size):
                # Block multiplication
                C[i:i+block_size, j:j+block_size] += \
                    A[i:i+block_size, k:k+block_size] @ \
                    B[k:k+block_size, j:j+block_size]
    return C
```
Show timing comparison vs naive triple loop on 1024×1024 matrices
**Why**: Teaches locality of reference and cache optimization. Shows why library implementations are fast. Practical for high-performance computing. Explains BLAS strategies.
**Placement**: operations.md, new "Optimization Techniques" section after performance benchmark

### 2. **Nearly Singular Cautionary Tale**
**Concept**: Numerical instability from ill-conditioned matrices
**Code**:
```python
# Nearly singular matrix
A = np.array([[1.0, 1.0], [1.0, 1.00001]])
b = np.array([2.0, 2.00001])
# Method 1: Direct solve
x_solve = np.linalg.solve(A, b)
# Method 2: Explicit inverse (problematic!)
A_inv = np.linalg.inv(A)
x_inv = A_inv @ b
# Compare errors
print(f"Condition number: {np.linalg.cond(A):.0f}")  # ~200,000
print(f"Solve error: {np.linalg.norm(A @ x_solve - b)}")
print(f"Inverse error: {np.linalg.norm(A @ x_inv - b)}")
```
**Why**: Critical numerical computing lesson. Shows why "never invert matrices" is advice. Demonstrates condition number utility. Prevents common beginner mistakes.
**Placement**: operations.md, "Solving Linear Systems" section, right before solver trio

### 3. **3D Graphics Pipeline Extension**
**Concept**: Perspective projection after transformations
**Code**:
```python
# Cube vertices in 3D
vertices = np.array([[x, y, z, 1] for x, y, z in itertools.product([-1,1], repeat=3)])
# Model-view-projection pipeline
model = scale @ rotate_y @ rotate_x
view = translate([0, 0, -5])  # Camera back 5 units
projection = perspective(fov=60, aspect=1, near=0.1, far=100)
MVP = projection @ view @ model
# Project to 2D
projected = (vertices @ MVP.T)
projected_2d = projected[:, :2] / projected[:, 3:4]  # Perspective divide
```
Plot wireframe cube before/after with connecting edges
**Why**: Extends 2D triangle example naturally to 3D. Shows complete graphics pipeline. Demonstrates homogeneous coordinates necessity (perspective divide). Connects to game/graphics engines.
**Placement**: applications.md, expand "Graphics Transformations" section or add "3D Graphics Pipeline"

### 4. **Sparse Matrix Win in Practice**
**Concept**: When sparse really matters for real problems
**Code**:
```python
def create_laplacian_matrix(n):
    # Laplacian for 2D grid (5-point stencil)
    # -4 on diagonal, 1 for neighbors
    diagonals = [-4*np.ones(n*n), np.ones(n*n-1), np.ones(n*n-1), 
                 np.ones(n*n-n), np.ones(n*n-n)]
    offsets = [0, 1, -1, n, -n]
    return sparse.diags(diagonals, offsets, shape=(n*n, n*n), format='csr')

n = 100  # 10,000×10,000 matrix
L = create_laplacian_matrix(n)
# Sparsity: 99.995%
# Memory: 0.8 MB vs 800 MB dense
# Matvec: 0.001s vs 0.8s dense (800x faster!)
```
**Why**: Real problem (Laplacian for PDEs). Dramatic speedup (800x). Shows practical sparse construction. Common in scientific computing.
**Placement**: operations.md, "Sparse Matrix Operations" section, concrete example after theory

### 5. **Mini SVD Image Compression**
**Concept**: Rank-k approximation for compression
**Code**:
```python
# Small grayscale image patch (32×32)
image = load_sample_image()  # Or generate checkerboard
U, s, Vt = np.linalg.svd(image, full_matrices=False)
# Reconstruct with different ranks
for rank in [5, 10, 20, 32]:
    image_approx = (U[:, :rank] * s[:rank]) @ Vt[:rank, :]
    error = np.linalg.norm(image - image_approx) / np.linalg.norm(image)
    storage = rank * (image.shape[0] + image.shape[1] + 1)
    original_storage = image.shape[0] * image.shape[1]
    print(f"Rank {rank}: {error:.1%} error, {storage/original_storage:.1%} storage")
```
Show 2×2 subplot comparing original, rank-5, rank-10, rank-20
**Why**: Visual compression demo is compelling. Shows trade-off curve (rank vs error vs storage). Connects SVD to practical application. Everyone understands image compression.
**Placement**: applications.md, add "Image Compression" section after PCA or create "SVD Applications" section

### 6. **Batch Linear Regressions**
**Concept**: Multi-output systems with stacked targets
**Code**:
```python
# Predict multiple outputs simultaneously
X = np.random.random((100, 3))  # 100 samples, 3 features
Y = np.random.random((100, 2))  # 2 target variables
# Solve all at once
Beta = np.linalg.lstsq(X, Y, rcond=None)[0]  # Shape: (3, 2)
# Each column of Beta solves X @ Beta[:, i] ≈ Y[:, i]
predictions = X @ Beta
```
Compare time: batch vs solving separately in loop
**Why**: Shows matrix methods handle multiple right-hand sides efficiently. Common in ML (multi-class, multi-task). Demonstrates broadcasting power.
**Placement**: applications.md, "Linear Regression" section, extend single-output example

### 7. **Condition Number Impact Demo**
**Concept**: How conditioning affects solution quality
**Code**:
```python
def demonstrate_conditioning():
    # Well-conditioned (cond ≈ 1)
    A_good = np.array([[2, 1], [1, 2]])
    # Ill-conditioned (cond ≈ 10^6)
    A_bad = np.array([[1, 1], [1, 1.000001]])
    
    for name, A in [("Well-conditioned", A_good), ("Ill-conditioned", A_bad)]:
        cond = np.linalg.cond(A)
        # Add small noise to b
        b = np.array([3, 3])
        b_noisy = b + 1e-6 * np.random.randn(2)
        x = np.linalg.solve(A, b)
        x_noisy = np.linalg.solve(A, b_noisy)
        sensitivity = np.linalg.norm(x - x_noisy) / np.linalg.norm(x)
        print(f"{name}: cond={cond:.1e}, sensitivity={sensitivity:.1e}")
```
**Why**: Makes abstract condition number concrete. Shows how noise amplifies. Explains when to worry about conditioning. Practical numerical analysis lesson.
**Placement**: operations.md, right after condition number introduction, before solver methods

### 8. **Iterative Solver Comparison**
**Concept**: CG vs GMRES vs BiCGSTAB for different matrix types
**Code**:
```python
# Symmetric positive definite: CG wins
A_spd = sparse.random(1000, 1000, density=0.01, format='csr')
A_spd = A_spd @ A_spd.T + sparse.eye(1000)  # Ensure SPD
# Non-symmetric: GMRES or BiCGSTAB
A_nonsym = sparse.random(1000, 1000, density=0.01, format='csr')
b = np.random.random(1000)

for name, A in [("SPD", A_spd), ("Non-symmetric", A_nonsym)]:
    # Try different solvers with timing
    # CG, GMRES, BiCGSTAB
    # Report: iterations, time, residual
```
**Why**: Teaches solver selection. Shows performance differences on real problems. Explains matrix structure importance.
**Placement**: operations.md, "Iterative Solvers" sidebar, expand with comparison table

### 9. **Eigenvalue Applications Sampler**
**Concept**: Quick tour of eigenvalue uses
**Code**: Three mini-examples in one code block:
```python
# 1. Stability analysis: largest |eigenvalue| < 1 → stable
# 2. Power iteration: find dominant eigenvector
# 3. PageRank: eigenvector of web graph adjacency matrix
```
Each 10-15 lines showing key calculation
**Why**: Shows eigenvalues aren't just theory. Multiple domains (control theory, numerics, web search). Motivates eigenvalue study.
**Placement**: applications.md, add "Eigenvalue Applications" section or expand existing eigenvalue coverage

### 10. **Matrix Factorization Zoo**
**Concept**: Quick reference for decompositions and when to use them
**Code**: Not full implementation, but usage pattern table:
```python
# LU: Solve Ax=b multiple times with different b
# Cholesky: SPD matrices (faster than LU)
# QR: Least squares, orthogonalization
# SVD: Pseudoinverse, rank, compression
# Eigendecomposition: Diagonalization, powers A^n
# Schur: Numerical stability for eigenvalues
```
Show 2-3 line usage example for each
**Why**: Overwhelming choice of decompositions needs guidance. Quick reference for practitioners. Shows specialization advantages.
**Placement**: operations.md, "Matrix Decompositions" section, create summary table at end

## Navigation and UX Notes

### Current Strengths
- **Experience-based pathways**: 🟢/🟡/🔴 badges guide learners to right entry point
- **Quick start section**: 5-minute primer for impatient learners (index.md, lines 75-79)
- **CodeFold wrappers**: Long examples collapsible to maintain scannability
- **Verification patterns**: "Trust but verify" checks throughout teach good practices
- **Prerequisites explicit**: Clear dependencies listed upfront

### Recommended Enhancements
1. **Complexity badges**: Add O(n²), O(n³) notes to operations for algorithmic awareness
2. **Time estimates**: "⏱️ 8 min read" on each page for planning
3. **Memory usage indicators**: 💾 symbols showing when memory matters (sparse, large dense)
4. **Numerical stability warnings**: ⚠️ flags on inverse, ill-conditioned examples
5. **Cross-references**: Link "eigenvalues" mention in basics.md forward to PCA in applications.md
6. **Interactive sliders**: PCA variance slider, transformation matrix controls
7. **Downloadable notebooks**: Jupyter versions of each page
8. **"Why this matters" boxes**: After each major operation, brief real-world relevance note

### Content Flow Validation
Current flow is strong:
1. **Index**: Orientation, prerequisites, learning path
2. **Basics**: What matrices are, manual implementation, basic patterns
3. **Operations**: Efficient methods, sparse, systems, decompositions
4. **Applications**: PCA, Markov, graphics, engineering, ML

**Enhancement**: Add "Common Pitfalls" section to operations.md covering:
- Never invert if you can solve
- Check condition numbers
- Use appropriate decomposition
- Sparse vs dense decision tree

**Alternate flow option**: Applications-first path for motivation-driven learners:
- Index → Applications (preview real uses) → Basics (foundation) → Operations (techniques) → Applications (full depth)

## Ordering for the Rewrite

### Page 1: index.md (Overview) - ✅ Keep structure, enhance badges
**Order**:
1. Opening hook ("spreadsheets with superpowers")
2. What You'll Learn (4-section breakdown with descriptions)
3. Prerequisites (explicit list with links)
4. Related Concepts (connections to other SnakeMath topics)
5. Learning Path (🟢🟡🔴 experience-based pathways)
6. Key Mathematical Concepts (formulas prominently displayed)
7. Quick Start (5-minute primer)
8. Navigation (next: basics)

**Changes**:
- Add time estimates to each section description
- Include complexity notes (O(n³) for multiplication, etc.)
- Expand "Why matrices matter" with one concrete code snippet

**Rationale**: Entry page needs to orient all learner types. Experience badges help self-selection. Quick formulas provide reference.

### Page 2: basics.md (Fundamentals) - Minor reordering
**Proposed order**:
1. **Opening**: Spreadsheets/arrays hook
2. **Understanding matrices**: Definition, notation
3. **Core formulas**: Prominently displayed
4. **Gradebook example**: Instant @ operator demo (lines ~34-50)
5. **Manual Matrix class**: From-scratch implementation (lines ~78-140)
6. **Why matrix multiplication works**: Row-times-column explanation
7. **Scale-then-rotate visualization**: Transformation composition (lines ~164-263)
8. **Common matrix patterns**: Identity, zero, diagonal, symmetric, triangular
9. **Interactive exploration**: `<MatrixTransformations />` component
10. **Navigation**

**Changes**:
- Move gradebook immediately after formulas (motivation before deep dive)
- Add "Why multiplication works" explainer before scale-rotate (builds intuition)
- Expand matrix patterns with quick reference table

**Rationale**: Hook → formula → immediate example → understanding → patterns. Gets to runnable code fast while building foundation.

### Page 3: operations.md (Implementation) - Add sections
**Proposed order**:
1. **Overview**: Three approaches (manual, NumPy, specialized)
2. **Performance benchmark**: 1000×1000 timing (lines ~20-75)
3. **NumPy operations**: Efficient implementation patterns
4. **Sparse matrices**: Memory and performance for large sparse systems (lines ~87-170)
5. **[NEW] Blocked multiplication**: Cache-friendly optimization
6. **Matrix decompositions**: LU, Cholesky, QR, SVD with reconstruction
7. **Solving linear systems**:
   - **[NEW] Nearly singular warning**: Conditioning matters
   - **[NEW] Condition number impact**: Sensitivity to noise
   - **Solver trio**: solve vs inverse vs LU (lines ~250-350)
8. **[NEW] Sparse win in practice**: Laplacian example
9. **[NEW] Iterative solvers comparison**: CG, GMRES, BiCGSTAB
10. **[NEW] Common pitfalls**: Summary of numerical computing gotchas
11. **Navigation**

**Changes**:
- Group optimization techniques together (blocked mult, sparse)
- Expand linear systems with conditioning focus
- Add practical sparse example
- Create "pitfalls" summary section at end

**Rationale**: Performance → methods → systems → advanced. Conditioning warnings prevent errors. Pitfalls section reinforces best practices.

### Page 4: applications.md (Real-World) - Expand domains
**Proposed order**:
1. **Introduction**: Matrices power modern technology
2. **Data Science & ML**:
   - **PCA with eigenvalues** (lines ~22-140): Dimensionality reduction
   - **[NEW] SVD image compression**: Rank-k approximation
   - **Linear regression**: Normal equations and least squares
   - **[NEW] Batch regressions**: Multi-output systems
3. **Predictive Modeling**:
   - **Markov chains** (lines ~155-220): State transitions
   - **[NEW] PageRank preview**: Web graph eigenvalue
4. **Computer Graphics**:
   - **2D transformations**: Homogeneous coordinates pipeline
   - **[NEW] 3D graphics extension**: Perspective projection
5. **Engineering Systems**:
   - **Circuit analysis**: Node voltages
   - **Truss analysis**: Least squares fitting
6. **[NEW] Eigenvalue applications sampler**: Stability, power iteration, PageRank
7. **Interactive challenges**:
   - PCA dimensionality toolkit
   - SVD image compressor
   - 3D transformation visualizer
   - Markov chain simulator
8. **Key takeaways**: Bullet summary
9. **Next steps**: Links to advanced LA, numerical methods, ML
10. **Navigation**

**Changes**:
- Group by domain (data science, prediction, graphics, engineering)
- Add SVD and 3D graphics expansions
- Create eigenvalue applications section
- Expand challenges to match new content

**Rationale**: Domain-based organization helps learners find relevant applications. Multiple examples per domain build depth.

### Cross-Page Additions

**Concept bridges**:
- End of basics.md: "Now that you understand what matrices are and how they work, let's explore EFFICIENT operations and solving real systems..." → operations.md
- End of operations.md: "With computational techniques mastered, you're ready to apply matrices to REAL-WORLD problems..." → applications.md

**Glossary popups**:
- **Transpose**: "Flip rows and columns: (A^T)_ij = A_ji"
- **Determinant**: "Scalar indicating invertibility and volume scaling"
- **Condition number**: "Ratio of largest/smallest singular value; measures numerical stability"
- **Sparsity**: "Fraction of zero elements; exploited for efficiency"

**Code comments enhancement**:
- Explain WHY: `# Use solve() not inv() - more stable and faster`
- Reference formulas: `# Normal equations: (X^T X)β = X^T y`
- Note complexity: `# O(n³) operation - consider iterative for large n`

---

## Implementation Priority

**Phase 1 - High Impact, Low Effort**:
1. Add nearly singular warning to operations.md (solver section) - Critical numerical computing lesson
2. Create blocked multiplication example in operations.md - Shows optimization strategy
3. Add time estimates and complexity badges to all pages - Helps planning and algorithmic awareness
4. Enhance gradebook example comments - Make first example crystal clear
5. Add "Common Pitfalls" summary section to operations.md - Reinforces best practices

**Phase 2 - New Content**:
6. Write 3D graphics pipeline extension (applications.md) - Natural extension of 2D example
7. Create SVD image compression demo (applications.md) - Visual and compelling
8. Add condition number impact example (operations.md) - Makes abstract concept concrete
9. Write sparse Laplacian example (operations.md) - Shows practical sparse usage
10. Add batch linear regression (applications.md) - Demonstrates multi-output systems

**Phase 3 - Polish**:
11. Create downloadable Jupyter notebooks for each page
12. Add interactive PCA variance slider
13. Implement transformation matrix control widget
14. Create cross-references between pages (link eigenvalue mentions forward)
15. Add "Why this matters" boxes after major operations

**Phase 4 - Expansion**:
16. Write eigenvalue applications sampler (applications.md)
17. Add iterative solver comparison (operations.md)
18. Create matrix factorization zoo reference table (operations.md)
19. Expand matrix patterns library with more examples (basics.md)
20. Add video walkthroughs for complex visualizations (PCA, transformations)
