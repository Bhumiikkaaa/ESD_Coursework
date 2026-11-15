import Cell from "./Cell.jsx";

export default function Matrix({ matrix, onIncrement }) {
  const values = matrix.flat();

  const max =
    values.length === 0 ? 0 : Math.max(...values);

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
                  isMax={max !== 0 && value === max}
                  onClick={() =>
                    onIncrement(rowIndex, colIndex)
                  }
                />
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
