// Section 09 — derived values, and why the state lives in App: src/matrix.js, Stats.jsx, App.jsx
import { test, expect } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { stats } from "../src/matrix.js";
import Stats from "../src/Stats.jsx";
import App from "../src/App.jsx";
import { deepFreeze, stat } from "./helpers.js";

test("stats of the starting matrix", () => {
  expect(stats(deepFreeze([[1, 2, 3], [4, 5, 6], [7, 8, 9]]))).toEqual({ sum: 45, average: 5, max: 9, nonZero: 9 });
});

test("stats counts zeros as cells, but not as non-zero", () => {
  expect(stats(deepFreeze([[0, 3], [2, 0]]))).toEqual({ sum: 5, average: 1.25, max: 3, nonZero: 2 });
});

test("stats works for any shape", () => {
  expect(stats(deepFreeze([[1, 0, 0, 7]]))).toEqual({ sum: 8, average: 2, max: 7, nonZero: 2 });
});

test("stats of an all-zero matrix, and of an empty one, is all zeros (not NaN, not -Infinity)", () => {
  expect(stats(deepFreeze([[0, 0], [0, 0]]))).toEqual({ sum: 0, average: 0, max: 0, nonZero: 0 });
  expect(stats(deepFreeze([]))).toEqual({ sum: 0, average: 0, max: 0, nonZero: 0 });
});

test("Stats shows a level-2 heading and the four numbers", () => {
  render(<Stats matrix={deepFreeze([[1, 2, 3], [4, 5, 6], [7, 8, 9]])} />);
  expect(screen.getByRole("heading", { level: 2, name: "Stats" })).toBeInTheDocument();
  expect([stat("Sum"), stat("Average"), stat("Max"), stat("Non-zero")]).toEqual(["45", "5.00", "9", "9"]);
});

test("Stats shows the average with exactly 2 decimals", () => {
  render(<Stats matrix={deepFreeze([[1, 0, 0]])} />);
  expect(stat("Average")).toBe("0.33");
});

test("App shows the stats NEXT TO the matrix, not inside it", () => {
  render(<App />);
  const table = screen.getByRole("table");
  const heading = screen.getByRole("heading", { level: 2, name: "Stats" });
  expect(table.contains(heading), "the stats are inside the matrix").toBe(false);
  expect(within(table).queryByText("Sum")).toBeNull();
  expect(stat("Sum")).toBe("45");
});

test("App: one click updates the cell AND the stats", async () => {
  render(<App />);
  await userEvent.setup().click(screen.getByRole("button", { name: "Row 3, column 3: 9" }));
  expect(screen.getByRole("button", { name: "Row 3, column 3: 10" })).toBeInTheDocument();
  expect([stat("Sum"), stat("Average"), stat("Max"), stat("Non-zero")]).toEqual(["46", "5.11", "10", "9"]);
});
