// Plain JavaScript functions operating on the matrix.

// Starting matrix.
export const START = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

// Return a new matrix with one cell increased by one.
export function incrementAt(matrix, row, col) {
  const updatedMatrix = [...matrix];

  updatedMatrix[row] = [...matrix[row]];
  updatedMatrix[row][col] = updatedMatrix[row][col] + 1;

  return updatedMatrix;
}

// Section 09 — derived statistics.
export function stats(matrix) {
  throw new Error("TODO");
}

// Section 12 — stretch.
export function zeros(matrix) {
  throw new Error("TODO");
}

// In-lab task — leave unchanged.
export function decrementAt(matrix, row, col) {
  throw new Error("TODO");
}
