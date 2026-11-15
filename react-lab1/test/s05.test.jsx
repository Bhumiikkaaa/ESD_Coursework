// Section 05 — components and props: src/Cell.jsx
import { test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Cell from "../src/Cell.jsx";

test("Cell is one button showing its value", () => {
  render(<Cell row={0} col={1} value={5} onClick={() => {}} />);
  expect(screen.getByRole("button").textContent).toBe("5");
});

test("its accessible name says where it is, counted from 1", () => {
  render(<Cell row={0} col={1} value={5} onClick={() => {}} />);
  expect(screen.getByRole("button", { name: "Row 1, column 2: 5" })).toBeInTheDocument();
});

test('it has className="cell"', () => {
  render(<Cell row={2} col={2} value={9} onClick={() => {}} />);
  expect(screen.getByRole("button")).toHaveClass("cell");
});

test("a 0 is shown as 0", () => {
  render(<Cell row={1} col={0} value={0} onClick={() => {}} />);
  expect(screen.getByRole("button", { name: "Row 2, column 1: 0" }).textContent).toBe("0");
});

test("rendering does not call onClick; one click calls it once", async () => {
  const onClick = vi.fn();
  render(<Cell row={2} col={0} value={7} onClick={onClick} />);
  expect(onClick, "onClick ran while rendering — pass the function, don't call it").not.toHaveBeenCalled();
  await userEvent.setup().click(screen.getByRole("button"));
  expect(onClick).toHaveBeenCalledTimes(1);
});
