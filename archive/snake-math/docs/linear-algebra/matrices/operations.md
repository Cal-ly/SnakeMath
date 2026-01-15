---
title: Matrix Operations & Systems
description: Master efficient matrix operations, NumPy techniques, sparse matrices, and solving linear systems
---

# Matrix Operations & Systems

Ready to go beyond basics? This section covers efficient matrix operations, solving linear systems, and optimization techniques that make matrix computations practical for real-world applications.

## Navigation
- [← Back to Matrix Index](index.md)
- [← Previous: Fundamentals](basics.md)
- [Next: Applications →](applications.md)

## Advanced Matrix Operations

### NumPy Operations for Performance

**Pros**: Highly optimized, vectorized operations, extensive functionality\
**Complexity**: O(n³) but with significant constant factor improvements

<CodeFold>

```python
def numpy_matrix_operations():
    """Demonstrate NumPy matrix operations with performance benefits"""
    import time
    
    # Create large matrices for performance comparison
    size = 1000
    np.random.seed(42)
    A = np.random.random((size, size))
    B = np.random.random((size, size))
    
    print(f"Matrix performance comparison ({size}×{size} matrices)")
    print("=" * 50)
    
    # Basic operations with timing
    start = time.time()
    C_add = A + B
    add_time = time.time() - start
    print(f"Addition time: {add_time:.4f} seconds")
    
    start = time.time()
    C_mult = A @ B
    mult_time = time.time() - start
    print(f"Multiplication time: {mult_time:.4f} seconds")
    
    start = time.time()
    A_transpose = A.T
    transpose_time = time.time() - start
    print(f"Transpose time: {transpose_time:.6f} seconds")
    
    # Advanced operations
    print(f"\nAdvanced operations:")
    
    # Determinant
    start = time.time()
    det_A = np.linalg.det(A)
    det_time = time.time() - start
    print(f"Determinant: {det_A:.2e} (time: {det_time:.4f}s)")
    
    # Eigenvalues
    start = time.time()
    eigenvalues = np.linalg.eigvals(A)
    eigen_time = time.time() - start
    print(f"Eigenvalues computed in {eigen_time:.4f}s")
    
    # Matrix inverse (for square matrices)
    if A.shape[0] == A.shape[1]:
        start = time.time()
        try:
            A_inv = np.linalg.inv(A)
            inv_time = time.time() - start
            print(f"Matrix inverse computed in {inv_time:.4f}s")
            
            # Verify A @ A_inv ≈ I
            identity_check = np.allclose(A @ A_inv, np.eye(A.shape[0]))
            print(f"A @ A⁻¹ ≈ I: {identity_check}")
        except np.linalg.LinAlgError:
            print("Matrix is singular (not invertible)")
    
    return A, B, C_mult

numpy_matrix_operations()
```

</CodeFold>

### Sparse Matrix Operations

**Pros**: Memory efficient for sparse data, specialized algorithms\
**Complexity**: Depends on sparsity, can be much better than O(n³)

<CodeFold>

```python
from scipy import sparse
import matplotlib.pyplot as plt

def sparse_matrix_operations():
    """Demonstrate sparse matrix operations for efficiency"""
    
    print("Sparse Matrix Operations")
    print("=" * 30)
    
    # Create a large sparse matrix (mostly zeros)
    size = 5000
    density = 0.01  # 1% non-zero elements
    
    # Dense matrix would be inefficient
    print(f"Creating {size}×{size} matrix with {density*100}% density")
    
    # Create sparse matrix in COO (coordinate) format
    np.random.seed(42)
    row_indices = np.random.randint(0, size, int(size * size * density))
    col_indices = np.random.randint(0, size, int(size * size * density))
    data = np.random.random(len(row_indices))
    
    # Convert to CSR (Compressed Sparse Row) for efficient operations
    sparse_matrix = sparse.csr_matrix((data, (row_indices, col_indices)), 
                                     shape=(size, size))
    
    print(f"Non-zero elements: {sparse_matrix.nnz}")
    print(f"Sparsity: {(1 - sparse_matrix.nnz / (size**2)) * 100:.1f}%")
    
    # Memory comparison
    dense_memory = size * size * 8  # 8 bytes per float64
    sparse_memory = sparse_matrix.data.nbytes + sparse_matrix.indices.nbytes + sparse_matrix.indptr.nbytes
    
    print(f"\nMemory usage:")
    print(f"Dense matrix: {dense_memory / 1024**2:.1f} MB")
    print(f"Sparse matrix: {sparse_memory / 1024**2:.1f} MB")
    print(f"Memory savings: {(1 - sparse_memory/dense_memory) * 100:.1f}%")
    
    # Sparse matrix operations
    print(f"\nSparse operations:")
    
    # Sparse matrix-vector multiplication
    x = np.random.random(size)
    
    start = time.time()
    y_sparse = sparse_matrix @ x
    sparse_time = time.time() - start
    print(f"Sparse matrix-vector multiply: {sparse_time:.4f}s")
    
    # Create sparse identity for demonstration
    I_sparse = sparse.eye(size, format='csr')
    
    # Sparse matrix addition
    start = time.time()
    sum_sparse = sparse_matrix + 0.1 * I_sparse
    add_time = time.time() - start
    print(f"Sparse matrix addition: {add_time:.4f}s")
    
    return sparse_matrix

sparse_matrix_operations()
```

</CodeFold>

## Matrix Patterns and Properties

Standard matrix operations and patterns that appear frequently:

<CodeFold>

```python
def matrix_patterns_library():
    """Collection of common matrix operations and patterns"""
    
    # Identity matrices
    def create_identity(n):
        """Create n×n identity matrix"""
        return np.eye(n)
    
    # Matrix powers
    def matrix_power(A, n):
        """Compute A^n efficiently"""
        if n == 0:
            return np.eye(A.shape[0])
        elif n == 1:
            return A.copy()
        else:
            # Use repeated squaring for efficiency
            result = np.eye(A.shape[0])
            base = A.copy()
            while n > 0:
                if n % 2 == 1:
                    result = result @ base
                base = base @ base
                n //= 2
            return result
    
    # Matrix norms
    def matrix_norms(A):
        """Calculate different matrix norms"""
        return {
            'frobenius': np.linalg.norm(A, 'fro'),
            'spectral': np.linalg.norm(A, 2),
            'max': np.linalg.norm(A, np.inf),
            '1-norm': np.linalg.norm(A, 1)
        }
    
    # Condition number
    def condition_number(A):
        """Calculate condition number (numerical stability indicator)"""
        return np.linalg.cond(A)
    
    # Demonstrate patterns
    print("Matrix Patterns Library")
    print("=" * 25)
    
    # Test matrix
    A = np.array([[2, 1], [1, 3]])
    print("Test matrix A:")
    print(A)
    
    # Identity
    I = create_identity(2)
    print(f"\nIdentity matrix:")
    print(I)
    print(f"A @ I = A: {np.allclose(A @ I, A)}")
    
    # Matrix powers
    print(f"\nMatrix powers:")
    for n in [2, 3, 4]:
        An = matrix_power(A, n)
        print(f"A^{n}:")
        print(An)
    
    # Matrix norms
    norms = matrix_norms(A)
    print(f"\nMatrix norms:")
    for norm_name, value in norms.items():
        print(f"{norm_name}: {value:.4f}")
    
    # Condition number
    cond = condition_number(A)
    print(f"\nCondition number: {cond:.4f}")
    if cond < 100:
        print("Well-conditioned (numerically stable)")
    else:
        print("Ill-conditioned (may have numerical issues)")
    
    # Eigenvalues and eigenvectors
    eigenvals, eigenvecs = np.linalg.eig(A)
    print(f"\nEigenvalues: {eigenvals}")
    print(f"Eigenvectors:")
    print(eigenvecs)
    
    # Verify eigenvalue equation: Av = λv
    for i in range(len(eigenvals)):
        v = eigenvecs[:, i]
        Av = A @ v
        lambda_v = eigenvals[i] * v
        print(f"Eigenvalue {i+1} verification: {np.allclose(Av, lambda_v)}")
    
    return A, eigenvals, eigenvecs

matrix_patterns_library()
```

</CodeFold>

## Solving Linear Systems

Matrix equations of the form **Ax = b** appear constantly in real applications. Understanding different solution methods helps choose the right approach for your problem.

### Direct Solution Methods

<CodeFold>

```python
def solve_linear_systems():
    """Solve systems of linear equations using matrices"""
    
    print("Solving Linear Systems with Matrices")
    print("=" * 40)
    
    # System: 2x + y + z = 8
    #         x + 3y + 2z = 13  
    #         3x + y + 2z = 16
    
    # Coefficient matrix A
    A = np.array([[2, 1, 1],
                  [1, 3, 2],
                  [3, 1, 2]])
    
    # Constants vector b  
    b = np.array([8, 13, 16])
    
    print("System of equations:")
    print("2x + y + z = 8")
    print("x + 3y + 2z = 13")
    print("3x + y + 2z = 16")
    print()
    print("Matrix form: Ax = b")
    print("A =")
    print(A)
    print(f"b = {b}")
    
    # Method 1: Using matrix inverse
    print(f"\nMethod 1: Matrix Inverse")
    det_A = np.linalg.det(A)
    print(f"det(A) = {det_A:.3f}")
    
    if abs(det_A) > 1e-10:
        A_inv = np.linalg.inv(A)
        x_inverse = A_inv @ b
        print(f"x = A⁻¹b = {x_inverse}")
    else:
        print("Matrix is singular - no unique solution")
    
    # Method 2: Direct solve (more numerically stable)
    print(f"\nMethod 2: Direct solve (np.linalg.solve)")
    x_solve = np.linalg.solve(A, b)
    print(f"x = {x_solve}")
    
    # Method 3: LU decomposition
    print(f"\nMethod 3: LU Decomposition")
    from scipy.linalg import lu_solve, lu_factor
    
    lu, piv = lu_factor(A)
    x_lu = lu_solve((lu, piv), b)
    print(f"x = {x_lu}")
    
    # Verify solution
    print(f"\nVerification:")
    verification = A @ x_solve
    print(f"Ax = {verification}")
    print(f"b = {b}")
    print(f"Error: {np.linalg.norm(verification - b):.2e}")
    
    # Condition number (measures numerical stability)
    cond_num = np.linalg.cond(A)
    print(f"\nCondition number: {cond_num:.2f}")
    if cond_num < 100:
        print("Well-conditioned system (numerically stable)")
    elif cond_num < 10000:
        print("Moderately conditioned")
    else:
        print("Ill-conditioned (numerically unstable)")
    
    return A, b, x_solve

solve_linear_systems()
```

</CodeFold>

### Iterative Solution Methods

For large sparse systems, iterative methods can be more efficient:

<CodeFold>

```python
def iterative_solvers():
    """Demonstrate iterative methods for large linear systems"""
    
    print("Iterative Linear System Solvers")
    print("=" * 35)
    
    # Create a large sparse system
    size = 1000
    np.random.seed(42)
    
    # Create a diagonally dominant matrix (ensures convergence)
    A = sparse.random(size, size, density=0.05, format='csr')
    A.setdiag(A.sum(axis=1).A1 + 1)  # Make diagonally dominant
    
    # Create random solution and compute b
    x_true = np.random.random(size)
    b = A @ x_true
    
    print(f"System size: {size}×{size}")
    print(f"Matrix density: {A.nnz / (size**2) * 100:.2f}%")
    
    # Iterative solvers
    from scipy.sparse.linalg import cg, gmres, bicgstab
    
    # Conjugate Gradient (for symmetric positive definite)
    start = time.time()
    x_cg, info_cg = cg(A.T @ A, A.T @ b, maxiter=1000, tol=1e-6)
    cg_time = time.time() - start
    cg_error = np.linalg.norm(x_cg - x_true)
    
    print(f"\nConjugate Gradient:")
    print(f"  Time: {cg_time:.4f}s")
    print(f"  Convergence: {'Success' if info_cg == 0 else 'Failed'}")
    print(f"  Error: {cg_error:.2e}")
    
    # GMRES (for general matrices)
    start = time.time()
    x_gmres, info_gmres = gmres(A, b, maxiter=1000, tol=1e-6)
    gmres_time = time.time() - start
    gmres_error = np.linalg.norm(x_gmres - x_true)
    
    print(f"\nGMRES:")
    print(f"  Time: {gmres_time:.4f}s")
    print(f"  Convergence: {'Success' if info_gmres == 0 else 'Failed'}")
    print(f"  Error: {gmres_error:.2e}")
    
    # BiCGSTAB (often faster for non-symmetric)
    start = time.time()
    x_bicg, info_bicg = bicgstab(A, b, maxiter=1000, tol=1e-6)
    bicg_time = time.time() - start
    bicg_error = np.linalg.norm(x_bicg - x_true)
    
    print(f"\nBiCGSTAB:")
    print(f"  Time: {bicg_time:.4f}s")
    print(f"  Convergence: {'Success' if info_bicg == 0 else 'Failed'}")
    print(f"  Error: {bicg_error:.2e}")
    
    # Compare with direct solve (if feasible)
    if size <= 2000:  # Direct solve only for smaller systems
        A_dense = A.toarray()
        start = time.time()
        x_direct = np.linalg.solve(A_dense, b)
        direct_time = time.time() - start
        direct_error = np.linalg.norm(x_direct - x_true)
        
        print(f"\nDirect solve (for comparison):")
        print(f"  Time: {direct_time:.4f}s")
        print(f"  Error: {direct_error:.2e}")
    
    return A, b, x_true

iterative_solvers()
```

</CodeFold>

## Matrix Decompositions

Decompositions break matrices into simpler components for efficient computation:

<CodeFold>

```python
def matrix_decompositions():
    """Demonstrate common matrix decompositions"""
    
    print("Matrix Decompositions")
    print("=" * 25)
    
    # Create test matrix
    np.random.seed(42)
    A = np.random.random((5, 5))
    A = A @ A.T  # Make symmetric positive definite
    
    print("Original matrix A:")
    print(A)
    
    # LU Decomposition
    from scipy.linalg import lu
    P, L, U = lu(A)
    
    print(f"\nLU Decomposition: A = PLU")
    print(f"P (permutation):")
    print(P)
    print(f"L (lower triangular):")
    print(L)
    print(f"U (upper triangular):")
    print(U)
    print(f"Reconstruction error: {np.linalg.norm(A - P @ L @ U):.2e}")
    
    # Cholesky Decomposition (for positive definite)
    try:
        from scipy.linalg import cholesky
        L_chol = cholesky(A, lower=True)
        
        print(f"\nCholesky Decomposition: A = LL^T")
        print(f"L:")
        print(L_chol)
        print(f"Reconstruction error: {np.linalg.norm(A - L_chol @ L_chol.T):.2e}")
    except np.linalg.LinAlgError:
        print("\nMatrix not positive definite - Cholesky decomposition failed")
    
    # QR Decomposition
    Q, R = np.linalg.qr(A)
    
    print(f"\nQR Decomposition: A = QR")
    print(f"Q (orthogonal):")
    print(Q)
    print(f"R (upper triangular):")
    print(R)
    print(f"Reconstruction error: {np.linalg.norm(A - Q @ R):.2e}")
    print(f"Q orthogonal check: {np.linalg.norm(Q @ Q.T - np.eye(A.shape[0])):.2e}")
    
    # SVD (Singular Value Decomposition)
    U_svd, s, Vt = np.linalg.svd(A)
    
    print(f"\nSVD: A = UΣV^T")
    print(f"U shape: {U_svd.shape}")
    print(f"Singular values: {s}")
    print(f"V^T shape: {Vt.shape}")
    
    # Reconstruct using SVD
    A_reconstructed = U_svd @ np.diag(s) @ Vt
    print(f"Reconstruction error: {np.linalg.norm(A - A_reconstructed):.2e}")
    
    return A, L, U, Q, R

matrix_decompositions()
```

</CodeFold>

## Performance Optimization Tips

### Memory Layout and Cache Efficiency

<CodeFold>

```python
def optimization_techniques():
    """Demonstrate performance optimization techniques"""
    
    print("Matrix Performance Optimization")
    print("=" * 35)
    
    size = 2000
    
    # Memory layout: Row-major vs Column-major
    print("Memory Layout Comparison:")
    
    # Create matrices
    A = np.random.random((size, size))
    B = np.random.random((size, size))
    
    # Row-major access (C-style, NumPy default)
    start = time.time()
    C_row = np.zeros((size, size))
    for i in range(size):
        for j in range(size):
            C_row[i, j] = A[i, j] + B[i, j]
    row_time = time.time() - start
    
    # Column-major access (Fortran-style)
    start = time.time()
    C_col = np.zeros((size, size))
    for j in range(size):
        for i in range(size):
            C_col[i, j] = A[i, j] + B[i, j]
    col_time = time.time() - start
    
    # Vectorized operation
    start = time.time()
    C_vec = A + B
    vec_time = time.time() - start
    
    print(f"Row-major access: {row_time:.4f}s")
    print(f"Column-major access: {col_time:.4f}s")
    print(f"Vectorized operation: {vec_time:.6f}s")
    print(f"Vectorization speedup: {row_time/vec_time:.0f}x")
    
    # Block matrix multiplication
    print(f"\nBlock Matrix Multiplication:")
    
    def block_matrix_multiply(A, B, block_size=64):
        """Block matrix multiplication for better cache utilization"""
        n = A.shape[0]
        C = np.zeros((n, n))
        
        for i in range(0, n, block_size):
            for j in range(0, n, block_size):
                for k in range(0, n, block_size):
                    i_end = min(i + block_size, n)
                    j_end = min(j + block_size, n)
                    k_end = min(k + block_size, n)
                    
                    C[i:i_end, j:j_end] += A[i:i_end, k:k_end] @ B[k:k_end, j:j_end]
        
        return C
    
    # Compare block vs standard multiplication
    A_small = np.random.random((512, 512))
    B_small = np.random.random((512, 512))
    
    start = time.time()
    C_block = block_matrix_multiply(A_small, B_small)
    block_time = time.time() - start
    
    start = time.time()
    C_standard = A_small @ B_small
    standard_time = time.time() - start
    
    print(f"Block multiplication: {block_time:.4f}s")
    print(f"Standard multiplication: {standard_time:.4f}s")
    print(f"Results match: {np.allclose(C_block, C_standard)}")
    
    return A, B

optimization_techniques()
```

</CodeFold>

## Key Concepts Summary

Advanced matrix operations enable efficient computation:

- **NumPy Operations**: Vectorized, optimized implementations
- **Sparse Matrices**: Memory-efficient for data with many zeros
- **Linear Systems**: Multiple solution methods for different scenarios
- **Decompositions**: Break complex problems into simpler components
- **Performance**: Memory layout and blocking strategies matter

## Next Steps

Ready to see matrices in action? Continue to:

- **[Applications](applications.md)** - Real-world implementations in graphics, ML, and engineering
- **[Matrix Index](index.md)** - Overview of all matrix topics
- **[Linear Equations](../../algebra/linear-equations/)** - Related systems and solving techniques

Advanced matrix operations unlock the computational power needed for real applications!
