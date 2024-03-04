/**
 * Calculates the probability mass function (PMF) for the binomial distribution.
 * @param x - The number of successes.
 * @param n - The total number of trials.
 * @param p - The success probability (0 <= p <= 1).
 * @returns The PMF value.
 */
export function binomialPmf(x: number, n: number, p: number): number {
  if (x < 0 || x > n) {
    return 0 // Outside the valid range
  }

  // Calculate the binomial coefficient
  const binomialCoefficient = (k: number) => {
    let result = 1
    for (let i = 1; i <= k; i++) {
      result *= (n - i + 1) / i
    }
    return result
  }

  // Calculate the PMF
  const pmf = binomialCoefficient(x) * Math.pow(p, x) * Math.pow(1 - p, n - x)
  return pmf
}

/**
 * Subtracts two matrices (2D arrays) element-wise.
 * Assumes that both matrices have the same dimensions.
 * @param matrixA - First matrix.
 * @param matrixB - Second matrix.
 * @returns The result of matrixA - matrixB.
 */
export function matrixSubtract(
  matrixA: number[][],
  matrixB: number[][]
): number[][] {
  if (
    matrixA.length !== matrixB.length ||
    matrixA[0].length !== matrixB[0].length
  ) {
    throw new Error("Matrices must have the same dimensions for subtraction.")
  }

  const numRows = matrixA.length
  const numCols = matrixA[0].length

  const result: number[][] = []

  for (let i = 0; i < numRows; i++) {
    const row: number[] = []
    for (let j = 0; j < numCols; j++) {
      row.push(matrixA[i][j] - matrixB[i][j])
    }
    result.push(row)
  }

  return result
}

/**
 * Calculates the inverse of a square matrix (2D array).
 * Assumes that the input matrix is square (same number of rows and columns).
 * @param matrix - The input matrix.
 * @returns The inverse of the matrix if it's not invertible.
 */
export function matrixInverse(matrix: number[][]): number[][] {
  const numRows = matrix.length
  const numCols = matrix[0].length

  if (numRows !== numCols) {
    throw new Error(
      "Input matrix must be square (same number of rows and columns)."
    )
  }

  // Create an identity matrix of the same size
  const identity: number[][] = Array.from({ length: numRows }, (_, i) =>
    Array.from({ length: numCols }, (_, j) => (i === j ? 1 : 0))
  )

  // Perform Gaussian elimination to find the inverse
  // (Assuming the matrix is invertible)
  for (let col = 0; col < numCols; col++) {
    // Find the pivot (non-zero element) in the current column
    let pivotRow = col
    while (pivotRow < numRows && matrix[pivotRow][col] === 0) {
      pivotRow++
    }

    if (pivotRow === numRows) {
      throw new Error("Matrix is not invertible.")
    }

    // Swap rows to make the pivot element non-zero
    ;[matrix[col], matrix[pivotRow]] = [matrix[pivotRow], matrix[col]]
    ;[identity[col], identity[pivotRow]] = [identity[pivotRow], identity[col]]

    // Scale the pivot row to make the pivot element 1
    const pivotValue = matrix[col][col]
    for (let j = col; j < numCols; j++) {
      matrix[col][j] /= pivotValue
      identity[col][j] /= pivotValue
    }

    // Eliminate other rows
    for (let i = 0; i < numRows; i++) {
      if (i !== col) {
        const factor = matrix[i][col]
        for (let j = col; j < numCols; j++) {
          matrix[i][j] -= factor * matrix[col][j]
          identity[i][j] -= factor * identity[col][j]
        }
      }
    }
  }

  return identity
}

/**
 * Calculates the dot product (element-wise multiplication) of two matrices.
 * Assumes that both matrices have the same dimensions.
 * @param matrixA - First matrix.
 * @param matrixB - Second matrix.
 * @returns The result of the dot product.
 */
export function matrixDot(
  matrixA: number[][],
  matrixB: number[][]
): number[][] {
  const rowsA = matrixA.length
  const colsA = matrixA[0].length
  const colsB = matrixB[0].length

  if (colsA !== matrixB.length) {
    throw new Error("Matrices must have compatible dimensions for dot product.")
  }

  const result: number[][] = []

  for (let i = 0; i < rowsA; i++) {
    result[i] = []
    for (let j = 0; j < colsB; j++) {
      let sum = 0
      for (let k = 0; k < colsA; k++) {
        sum += matrixA[i][k] * matrixB[k][j]
      }
      result[i][j] = sum
    }
  }

  return result
}
