export const START = [
  [1, 2, 3],
  [4, 5, 6],
  [7, 8, 9],
];

export function incrementAt(matrix, row, col, step = 1) {
  const updatedMatrix = [...matrix];

  updatedMatrix[row] = [...matrix[row]];
  updatedMatrix[row][col] += step;

  return updatedMatrix;
}

export function stats(matrix) {
  const values = matrix.flat();

  const sum = values.reduce(
    (total, value) => total + value,
    0
  );

  const average =
    values.length === 0 ? 0 : sum / values.length;

  const max =
    values.length === 0 ? 0 : Math.max(...values);

  const nonZero = values.filter(
    (value) => value !== 0
  ).length;

  return {
    sum,
    average,
    max,
    nonZero,
  };
}

export function zeros(matrix) {
  return matrix.map((row) =>
    row.map(() => 0)
  );
}

// In-lab task — leave unchanged.
export function decrementAt(matrix, row, col) {
  throw new Error("TODO");
}
