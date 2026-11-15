import { useEffect, useState } from "react";
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

  useEffect(() => {
    async function loadMatrix() {
      const response = await fetch("/matrix.json");

      if (!response.ok) {
        throw new Error("Could not load matrix data");
      }

      const data = await response.json();
      setMatrix(data);
    }

    loadMatrix().catch(console.error);
  }, []);

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
