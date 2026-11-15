// Section 08 — events up, and an immutable 2-D update: src/matrix.js, Matrix.jsx, App.jsx
import { test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { incrementAt } from "../src/matrix.js";
import Matrix from "../src/Matrix.jsx";
import App from "../src/App.jsx";
import { deepFreeze, numbersOnScreen } from "./helpers.js";

const grid = () => deepFreeze([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);

test("incrementAt adds one to that cell, and to nothing else", () => {
  expect(incrementAt(grid(), 1, 2)).toEqual([[1, 2, 3], [4, 5, 7], [7, 8, 9]]);
  expect(incrementAt(grid(), 0, 0)).toEqual([[2, 2, 3], [4, 5, 6], [7, 8, 9]]);
});

test("incrementAt returns a NEW matrix and never changes its input (it is frozen)", () => {
  const before = grid();
  const after = incrementAt(before, 2, 1);
  expect(after).not.toBe(before);
  expect(before).toEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
});

test("only the changed row is new; the rows you didn't touch are the SAME arrays", () => {
  const before = grid();
  const after = incrementAt(before, 1, 0);
  expect(after[1], "the changed row must be a new array").not.toBe(before[1]);
  expect(after[0], "row 0 wasn't touched: keep the same array").toBe(before[0]);
  expect(after[2], "row 2 wasn't touched: keep the same array").toBe(before[2]);
});

test("incrementAt works for any shape", () => {
  expect(incrementAt(deepFreeze([[0, 0, 0, 0], [0, 0, 0, 0]]), 1, 3)).toEqual([[0, 0, 0, 0], [0, 0, 0, 1]]);
});

test("Matrix: clicking a cell calls onIncrement(row, col) with THAT cell's position", async () => {
  const onIncrement = vi.fn();
  render(<Matrix matrix={grid()} onIncrement={onIncrement} />);
  expect(onIncrement, "onIncrement ran while rendering").not.toHaveBeenCalled();
  await userEvent.setup().click(screen.getByRole("button", { name: "Row 2, column 3: 6" }));
  expect(onIncrement).toHaveBeenCalledTimes(1);
  expect(onIncrement).toHaveBeenCalledWith(1, 2);
});

test("App: clicking a cell adds one to it, and only to it", async () => {
  render(<App />);
  await userEvent.setup().click(screen.getByRole("button", { name: "Row 2, column 3: 6" }));
  expect(numbersOnScreen()).toEqual([[1, 2, 3], [4, 5, 7], [7, 8, 9]]);
});

test("App: every click counts", async () => {
  const user = userEvent.setup();
  render(<App />);
  const first = screen.getByRole("button", { name: "Row 1, column 1: 1" });
  await user.click(first);
  await user.click(first);
  await user.click(first);
  expect(first).toHaveAccessibleName("Row 1, column 1: 4");
});

test("App: the button you clicked is still the same element, and keeps the focus", async () => {
  render(<App />);
  const cell = screen.getByRole("button", { name: "Row 3, column 2: 8" });
  await userEvent.setup().click(cell);
  expect(cell, "the button was replaced by a new one — check your keys").toBeInTheDocument();
  expect(cell).toHaveFocus();
  expect(cell).toHaveAccessibleName("Row 3, column 2: 9");
});
