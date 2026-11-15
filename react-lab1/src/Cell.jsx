// Section 05 — one cell of the matrix.

export default function Cell({
  row,
  col,
  value,
  onClick,
  isMax = false,
}) {
  return (
    <button
      className={isMax ? "cell max" : "cell"}
      aria-label={`Row ${row + 1}, column ${col + 1}: ${value}`}
      onClick={onClick}
    >
      {value}
    </button>
  );
}
