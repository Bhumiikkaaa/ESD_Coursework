// Section 07 and Section 08 — App owns state and handles cell clicks.

import { useState } from "react";
import Header from "./Header.jsx";
import Matrix from "./Matrix.jsx";
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
      <Matrix matrix={matrix} onIncrement={increment} />
    </main>
  );
}
