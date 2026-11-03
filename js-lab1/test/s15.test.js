import { test } from "node:test";
import assert from "node:assert/strict";
import { useState } from "../src/s15-state.js";

test("returns a pair of functions", () => {
  const pair = useState(0, () => {});
  assert.ok(Array.isArray(pair) && pair.length === 2);
  assert.equal(typeof pair[0], "function");
  assert.equal(typeof pair[1], "function");
});
test("getState returns the initial value", () => {
  const [getCount] = useState(5, () => {});
  assert.equal(getCount(), 5);
});
test("setState stores the value and calls onChange exactly once", () => {
  let renders = 0;
  const [getCount, setCount] = useState(0, () => { renders += 1; });
  setCount(3);
  assert.equal(getCount(), 3);
  assert.equal(renders, 1);
});
test("two states are independent", () => {
  const [getA, setA] = useState(1, () => {});
  const [getB] = useState(1, () => {});
  setA(9);
  assert.equal(getB(), 1);
  assert.equal(getA(), 9);
});
