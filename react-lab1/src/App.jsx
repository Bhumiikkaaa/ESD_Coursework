// Section 07 — App owns the matrix state.

import { useState } from "react";
import Header from "./Header.jsx";
import Matrix from "./Matrix.jsx";
import { START } from "./matrix.js";

export default function App() {
  const [matrix, setMatrix] = useState(START);

  return (
    <main className="app">
      <Header />
      <Matrix matrix={matrix} />
    </main>
  );
}
