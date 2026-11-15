// IN-LAB TASK (AI closed). Do this in the lab, not at home.     Run:  npm run inlab
//
// Right-click a cell → its number goes DOWN by one. Never below 0.
//
//   1. src/matrix.js — decrementAt(matrix, row, col): like incrementAt, but one less.
//      A cell that is already 0 stays 0 — and then return the SAME matrix: nothing changed.
//   2. src/Cell.jsx — a right-click fires React's onContextMenu prop. Stop the browser's
//      menu from opening (event.preventDefault()), then call a new prop, onDecrement.
//   3. src/Matrix.jsx and src/App.jsx — the numbers live in App, so App writes
//      decrement(row, col) and passes it down; Matrix gives each Cell its own onDecrement.
//      Everything that worked before must still work (npm test).
//
// Stretch: each row of the matrix ends with that row's total, in
//   <td className="total" aria-label="Row 1 total">6</td>
import { describe, test, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { decrementAt } from "../src/matrix.js";
import App from "../src/App.jsx";
import { deepFreeze, numbersOnScreen, stat } from "../test/helpers.js";

const grid = () => deepFreeze([[1, 2, 3], [4, 0, 6], [7, 8, 9]]);

describe("decrementAt", () => {
  test("takes one off that cell only, in a new matrix; untouched rows stay the same arrays", () => {
    const before = grid();
    const after = decrementAt(before, 2, 0);
    expect(after).toEqual([[1, 2, 3], [4, 0, 6], [6, 8, 9]]);
    expect(after[2]).not.toBe(before[2]);
    expect(after[0]).toBe(before[0]);
    expect(after[1]).toBe(before[1]);
  });

  test("a 0 stays 0, and the SAME matrix comes back", () => {
    const before = grid();
    expect(decrementAt(before, 1, 1)).toBe(before);
  });
});

describe("right-click in the app", () => {
  test("right-click takes one off that cell, and the stats follow", () => {
    render(<App />);
    fireEvent.contextMenu(screen.getByRole("button", { name: "Row 2, column 2: 5" }));
    expect(numbersOnScreen()).toEqual([[1, 2, 3], [4, 4, 6], [7, 8, 9]]);
    expect(stat("Sum")).toBe("44");
  });

  test("the browser's own menu doesn't open (preventDefault)", () => {
    render(<App />);
    const notPrevented = fireEvent.contextMenu(screen.getByRole("button", { name: "Row 1, column 1: 1" }));
    expect(notPrevented, "call event.preventDefault() in the onContextMenu handler").toBe(false);
  });

  test("never below 0", () => {
    render(<App />);
    const one = screen.getByRole("button", { name: "Row 1, column 1: 1" });
    fireEvent.contextMenu(one);
    fireEvent.contextMenu(one);
    expect(one).toHaveAccessibleName("Row 1, column 1: 0");
    expect(stat("Non-zero")).toBe("8");
  });

  test("a left click still adds one", async () => {
    render(<App />);
    await userEvent.setup().click(screen.getByRole("button", { name: "Row 1, column 1: 1" }));
    expect(screen.getByRole("button", { name: "Row 1, column 1: 2" })).toBeInTheDocument();
  });
});

test("stretch: each row ends with its total, and it follows the clicks", async () => {
  render(<App />);
  expect(screen.getByRole("cell", { name: "Row 1 total" }).textContent).toBe("6");
  expect(screen.getByRole("cell", { name: "Row 3 total" }).textContent).toBe("24");
  await userEvent.setup().click(screen.getByRole("button", { name: "Row 1, column 3: 3" }));
  expect(screen.getByRole("cell", { name: "Row 1 total" }).textContent).toBe("7");
});
