// Section 05 — one cell of the matrix.

export default function Cell({ row, col, value, onClick }) {
  return (
    <button
      className="cell"
      aria-label={`Row ${row + 1}, column ${col + 1}: ${value}`}
      onClick={onClick}
    >
      {value}
    </button>
  );
}
