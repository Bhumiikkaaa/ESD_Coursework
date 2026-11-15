// Section 11 — the closing beat: the numbers come from /matrix.json (src/App.jsx)
import { test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import App from "../src/App.jsx";
import { numbersOnScreen, stat } from "./helpers.js";

const FROM_SERVER = [[0, 3, 1, 0], [2, 0, 5, 1], [4, 1, 0, 2], [0, 6, 2, 3]];

// A fake fetch that answers at once, like a server would, with a fresh copy each time.
function serverAnswers(data) {
  const fake = vi.fn(async () => ({ ok: true, status: 200, json: async () => structuredClone(data) }));
  vi.stubGlobal("fetch", fake);
  return fake;
}

test("App asks for /matrix.json", () => {
  const fetch = serverAnswers(FROM_SERVER);
  render(<App />);
  expect(fetch, "App never called fetch — is the useEffect there?").toHaveBeenCalled();
  expect(fetch.mock.calls[0][0]).toBe("/matrix.json");
});

test("until the answer arrives, the starting numbers stay on screen", () => {
  render(<App />); // test/setup.js: this fetch never answers
  expect(numbersOnScreen()).toEqual([[1, 2, 3], [4, 5, 6], [7, 8, 9]]);
});

test("when the answer arrives, the matrix AND the stats show the server's numbers", async () => {
  serverAnswers(FROM_SERVER);
  render(<App />);
  await screen.findByRole("button", { name: "Row 4, column 4: 3" });
  expect(numbersOnScreen()).toEqual(FROM_SERVER);
  expect([stat("Sum"), stat("Average"), stat("Max"), stat("Non-zero")]).toEqual(["30", "1.88", "6", "11"]);
});

test("clicks work on the loaded numbers, and fetch runs only once (the [] in useEffect)", async () => {
  const fetch = serverAnswers(FROM_SERVER);
  render(<App />);
  const cell = await screen.findByRole("button", { name: "Row 1, column 1: 0" });
  await userEvent.setup().click(cell);
  expect(cell).toHaveAccessibleName("Row 1, column 1: 1");
  expect(stat("Sum")).toBe("31");
  expect(fetch, "fetch ran again after a click — the effect needs [] as its second argument").toHaveBeenCalledTimes(1);
});
