// Section 15 — a smarter setState: updater functions and skipping unchanged values (Object.is)
import { test } from "node:test";
import assert from "node:assert/strict";
import { useState } from "../src/s15-state.js";

test("setState accepts an updater function", () => {
  const [getCount, setCount] = useState(0, () => {});
  setCount((c) => c + 1);
  setCount((c) => c + 1);
  setCount((c) => c + 1);
  assert.equal(getCount(), 3);
});
test("the same value does not call onChange", () => {
  let renders = 0;
  const [, setCount] = useState(2, () => { renders += 1; });
  setCount(2);
  setCount((c) => c);
  assert.equal(renders, 0);
});
test("a mutated array passed back is the SAME value — no render", () => {
  let renders = 0;
  const [getPlanner, setPlanner] = useState([4], () => { renders += 1; });
  const planner = getPlanner();
  planner.push(10);          // mutation: same array
  setPlanner(planner);
  assert.equal(renders, 0, "same reference → nothing changed, as far as setState can tell");
  setPlanner([...getPlanner(), 18]);
  assert.equal(renders, 1);
});
