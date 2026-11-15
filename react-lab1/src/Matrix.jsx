// Section 06 — compose the matrix from rows and cells.

import Cell from "./Cell.jsx";

export default function Matrix({ matrix, onIncrement }) {
  return (
    <table className="matrix">
      <tbody>
        {matrix.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((value, colIndex) => (
              <td key={colIndex}>
                <Cell
                  row={rowIndex}
                  col={colIndex}
                  value={value}
                  onClick={() => onIncrement(rowIndex, colIndex)}
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
