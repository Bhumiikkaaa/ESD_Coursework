// Section 07 — state lives in App: src/App.jsx
import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../src/App.jsx";
import { numbersOnScreen } from "./helpers.js";

test("App shows the Header", () => {
  render(<App />);
  expect(screen.getByRole("heading", { level: 1, name: "Number matrix" })).toBeInTheDocument();
});

test("App shows the starting numbers in a Matrix", () => {
  render(<App />);
  expect(screen.getByRole("table")).toHaveClass("matrix");
  expect(numbersOnScreen()).toEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
});
