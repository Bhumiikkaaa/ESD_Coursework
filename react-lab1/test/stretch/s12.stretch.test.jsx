// Section 12 (stretch) — a step input, a Reset button, and the biggest number highlighted.
import { describe, test, expect } from "vitest";
import { render, screen, fireEvent, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { incrementAt, zeros } from "../../src/matrix.js";
import Matrix from "../../src/Matrix.jsx";
import App from "../../src/App.jsx";
import { deepFreeze, numbersOnScreen, stat } from "../helpers.js";

describe("step", () => {
  test("incrementAt takes an optional step, 1 by default", () => {
    const m = deepFreeze([[1, 2], [3, 4]]);
    expect(incrementAt(m, 0, 1, 5)).toEqual([[1, 7], [3, 4]]);
    expect(incrementAt(m, 0, 1)).toEqual([[1, 3], [3, 4]]);
  });

  test('App has a number input labelled "Step", showing 1 at the start', () => {
    render(<App />);
    const input = screen.getByLabelText("Step");
    expect(input).toHaveAttribute("type", "number");
    expect(input).toHaveValue(1);
  });

  test("with Step at 5, a click adds 5", async () => {
    render(<App />);
    const input = screen.getByLabelText("Step");
    fireEvent.change(input, { target: { value: "5" } });
    expect(input, "the input should show the state's value (a controlled input)").toHaveValue(5);
    await userEvent.setup().click(screen.getByRole("button", { name: "Row 1, column 1: 1" }));
    expect(screen.getByRole("button", { name: "Row 1, column 1: 6" })).toBeInTheDocument();
    expect(stat("Sum")).toBe("50");
  });
});

describe("reset", () => {
  test("zeros keeps the shape, puts 0 everywhere, and never changes its input", () => {
    const m = deepFreeze([[1, 2, 3, 4], [5, 6, 7, 8]]);
    expect(zeros(m)).toEqual([[0, 0, 0, 0], [0, 0, 0, 0]]);
    expect(zeros(m)).not.toBe(m);
  });

  test("a Reset button, outside the matrix, sets every cell to 0 — and the stats follow", async () => {
    render(<App />);
    const reset = screen.getByRole("button", { name: "Reset" });
    expect(screen.getByRole("table").contains(reset)).toBe(false);
    await userEvent.setup().click(reset);
    expect(numbersOnScreen()).toEqual([[0, 0, 0], [0, 0, 0], [0, 0, 0]]);
    expect([stat("Sum"), stat("Average"), stat("Max"), stat("Non-zero")]).toEqual(["0", "0.00", "0", "0"]);
  });
});

describe("highlight the max", () => {
  const maxCells = () =>
    screen.getAllByRole("button").filter((b) => b.classList.contains("max")).map((b) => b.getAttribute("aria-label"));

  test('every cell holding the biggest number has className "cell max"', () => {
    render(<Matrix matrix={deepFreeze([[1, 9], [9, 2]])} onIncrement={() => {}} />);
    expect(maxCells()).toEqual(["Row 1, column 2: 9", "Row 2, column 1: 9"]);
    expect(within(screen.getByRole("table")).getByRole("button", { name: "Row 1, column 1: 1" })).toHaveClass("cell");
  });

  test("when every cell is 0, nothing is highlighted", () => {
    render(<Matrix matrix={deepFreeze([[0, 0], [0, 0]])} onIncrement={() => {}} />);
    expect(maxCells()).toEqual([]);
  });

  test("the highlight moves when another cell becomes the biggest", async () => {
    const user = userEvent.setup();
    render(<App />);
    expect(maxCells()).toEqual(["Row 3, column 3: 9"]);
    const eight = screen.getByRole("button", { name: "Row 3, column 2: 8" });
    await user.click(eight);
    await user.click(eight);
    expect(maxCells()).toEqual(["Row 3, column 2: 10"]);
  });
});
