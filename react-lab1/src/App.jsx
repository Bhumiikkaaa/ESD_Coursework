// Section 07, 08 and 09 — App owns the matrix state.

import { useState } from "react";
import Header from "./Header.jsx";
import Matrix from "./Matrix.jsx";
import Stats from "./Stats.jsx";
import { START, incrementAt } from "./matrix.js";

export default function App() {
  const [matrix, setMatrix] = useState(START);

  function increment(row, col) {
    setMatrix((currentMatrix) =>
      incrementAt(currentMatrix, row, col)
    );
  }

  return (
    <main className="app">
      <Header />

      <div className="board">
        <Matrix matrix={matrix} onIncrement={increment} />
        <Stats matrix={matrix} />
      </div>
    </main>
  );
}
