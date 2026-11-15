// Section 04 — JSX, and a first component: src/Header.jsx
import { test, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Header from "../src/Header.jsx";

test("Header shows the title as a level-1 heading", () => {
  render(<Header />);
  expect(screen.getByRole("heading", { level: 1, name: "Number matrix" })).toBeInTheDocument();
});

test('Header shows the hint in a <p className="hint">', () => {
  render(<Header />);
  const hint = screen.getByText("Click a cell to add one.");
  expect(hint.tagName).toBe("P");
  expect(hint).toHaveClass("hint");
});

test("Header returns the two elements side by side, with no wrapper — a fragment", () => {
  const { container } = render(<Header />);
  const tags = [...container.children].map((el) => el.tagName);
  expect(tags, "expected <h1> and <p> directly, not wrapped in a <div>").toEqual(["H1", "P"]);
});
