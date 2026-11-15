// Section 09 — display derived statistics.

import { stats } from "./matrix.js";

export default function Stats({ matrix }) {
  const { sum, average, max, nonZero } = stats(matrix);

  return (
    <section className="stats">
      <h2>Stats</h2>

      <dl>
        <dt>Sum</dt>
        <dd>{sum}</dd>

        <dt>Average</dt>
        <dd>{average.toFixed(2)}</dd>

        <dt>Max</dt>
        <dd>{max}</dd>

        <dt>Non-zero</dt>
        <dd>{nonZero}</dd>
      </dl>
    </section>
  );
}
