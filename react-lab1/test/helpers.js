// Test helpers — not tests themselves.
import { screen, within } from "@testing-library/react";

// deepFreeze makes an array (and every array inside it) read-only, so code that tries
// to change it THROWS instead of quietly passing. Same as in the JS labs.
export function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const key of Object.keys(value)) deepFreeze(value[key]);
  }
  return value;
}

// The numbers on screen, row by row, read from the cells' buttons: [[1, 2, 3], …]
export function numbersOnScreen() {
  return screen.getAllByRole("row").map((row) =>
    within(row).getAllByRole("button").map((button) => Number(button.textContent))
  );
}

// The value next to a label in the stats: stat("Sum") → "45"
export function stat(label) {
  const term = screen.getByText(label, { selector: "dt" });
  return term.nextElementSibling?.textContent;
}
