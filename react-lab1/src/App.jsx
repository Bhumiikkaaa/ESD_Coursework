import { useEffect, useState } from "react";
import Header from "./Header.jsx";
import Matrix from "./Matrix.jsx";
import Stats from "./Stats.jsx";
import { START, incrementAt, zeros } from "./matrix.js";

export default function App() {
  const [matrix, setMatrix] = useState(START);
  const [step, setStep] = useState(1);

  function increment(row, col) {
    setMatrix((currentMatrix) =>
      incrementAt(currentMatrix, row, col, step)
    );
  }

  function reset() {
    setMatrix((currentMatrix) => zeros(currentMatrix));
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

      <div className="controls">
        <label>
          Step
          <input
            type="number"
            value={step}
            onChange={(event) =>
              setStep(Number(event.target.value))
            }
          />
        </label>

        <button onClick={reset}>Reset</button>
      </div>

      <div className="board">
        <Matrix matrix={matrix} onIncrement={increment} />
        <Stats matrix={matrix} />
      </div>
    </main>
  );
}
