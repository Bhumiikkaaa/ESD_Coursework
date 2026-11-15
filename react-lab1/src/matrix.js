// Plain JavaScript functions operating on the matrix.

export const START = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

export function incrementAt(matrix, row, col) {
  const updatedMatrix = [...matrix];

  updatedMatrix[row] = [...matrix[row]];
  updatedMatrix[row][col] = updatedMatrix[row][col] + 1;

  return updatedMatrix;
}

// Calculate statistics from the current matrix.
export function stats(matrix) {
  const values = matrix.flat();

  const sum = values.reduce((total, value) => total + value, 0);

  const average =
    values.length === 0 ? 0 : sum / values.length;

  const max =
    values.length === 0 ? 0 : Math.max(...values);

  const nonZero = values.filter((value) => value !== 0).length;

  return {
    sum,
    average,
    max,
    nonZero,
  };
}

// Section 12 — stretch.
export function zeros(matrix) {
  throw new Error("TODO");
}

// In-lab task — leave unchanged.
export function decrementAt(matrix, row, col) {
  throw new Error("TODO");
}
