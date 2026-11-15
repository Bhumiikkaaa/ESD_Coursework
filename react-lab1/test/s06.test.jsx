// Section 06 — composition, lists and keys: src/Matrix.jsx
import { test, expect, vi } from "vitest";
import { format } from "node:util";
import { render, screen, within } from "@testing-library/react";
import Matrix from "../src/Matrix.jsx";
import { deepFreeze, numbersOnScreen } from "./helpers.js";

// Keep this test first: React prints each kind of warning only once per test file.
test("Matrix renders without a single React warning (keys, <tbody>)", () => {
  const error = vi.spyOn(console, "error").mockImplementation(() => {});
  render(<Matrix matrix={deepFreeze([[1, 2, 3], [4, 5, 6]])} onIncrement={() => {}} />);
  const warnings = error.mock.calls.map((args) => format(...args).split("\n")[0]);
  expect(warnings).toEqual([]);
});

test('a <table className="matrix"> with a <tbody>', () => {
  const { container } = render(<Matrix matrix={deepFreeze([[1, 2]])} onIncrement={() => {}} />);
  expect(screen.getByRole("table")).toHaveClass("matrix");
  expect(container.querySelector("table > tbody > tr")).not.toBeNull();
});

test("one row per inner array, one Cell per number, in order", () => {
  render(<Matrix matrix={deepFreeze([[1, 2, 3], [4, 5, 6]])} onIncrement={() => {}} />);
  expect(numbersOnScreen()).toEqual([[1, 2, 3], [4, 5, 6]]);
});

test("each Cell gets its own row and column", () => {
  render(<Matrix matrix={deepFreeze([[1, 2, 3], [4, 5, 6]])} onIncrement={() => {}} />);
  const second = screen.getAllByRole("row")[1];
  const names = within(second).getAllByRole("button").map((b) => b.getAttribute("aria-label"));
  expect(names).toEqual(["Row 2, column 1: 4", "Row 2, column 2: 5", "Row 2, column 3: 6"]);
});

test("it draws whatever size it is given — nothing assumes 3", () => {
  const four = deepFreeze([[1, 2, 3, 4], [5, 6, 7, 8], [9, 10, 11, 12], [13, 14, 15, 16]]);
  const { unmount } = render(<Matrix matrix={four} onIncrement={() => {}} />);
  expect(numbersOnScreen()).toEqual(four);
  unmount();
  render(<Matrix matrix={deepFreeze([[42]])} onIncrement={() => {}} />);
  expect(numbersOnScreen()).toEqual([[42]]);
});

test("an empty matrix draws an empty table, without crashing", () => {
  render(<Matrix matrix={deepFreeze([])} onIncrement={() => {}} />);
  expect(screen.getByRole("table")).toBeInTheDocument();
  expect(screen.queryAllByRole("button")).toHaveLength(0);
});
