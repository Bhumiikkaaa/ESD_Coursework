import { test } from "node:test";
import assert from "node:assert/strict";
import { toCardView, buildButtons } from "../src/s04-functions.js";
import { courses, byId } from "../support/helpers.js";

test("toCardView builds exactly the card fields", () => {
  assert.deepEqual(toCardView(byId(4)), {
    id: 4,
    heading: "CS402 · Enterprise Software Development",
    meta: "4 credits · Computer Science",
    isFull: false,
  });
});
test("toCardView marks a full course", () => {
  assert.equal(toCardView(byId(7)).isFull, true);
});
test("buildButtons does NOT call onAdd while building (pass, don't call)", () => {
  let calls = 0;
  buildButtons(courses.slice(0, 3), () => { calls += 1; });
  assert.equal(calls, 0, "onAdd was called while building — you called the function instead of passing one");
});
test("each onClick is a function", () => {
  const buttons = buildButtons(courses.slice(0, 3), () => {});
  for (const b of buttons) assert.equal(typeof b.onClick, "function");
});
test("clicking a button calls onAdd with THAT course's id", () => {
  const seen = [];
  const buttons = buildButtons(courses.slice(0, 3), (id) => seen.push(id));
  buttons[2].onClick();
  buttons[0].onClick();
  assert.deepEqual(seen, [3, 1]);
  assert.equal(buttons[1].label, "Add CS201");
});
