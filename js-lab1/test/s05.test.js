import { test } from "node:test";
import assert from "node:assert/strict";
import { countWhere, byField, applyUpdate, applyAll } from "../src/s05-higher-order.js";
import { courses } from "../support/helpers.js";

test("countWhere counts matches", () => {
  assert.equal(countWhere(courses, (c) => c.seatsLeft === 0), 5);
  assert.equal(countWhere(courses, (c) => c.credits === 2), 3);
  assert.equal(countWhere([], () => true), 0);
});
test("byField returns a function", () => {
  assert.equal(typeof byField("code"), "function");
});
test("byField sorts numbers ascending", () => {
  const sorted = [...courses].sort(byField("seatsLeft")).map((c) => c.seatsLeft);
  assert.deepEqual(sorted.slice(0, 6), [0, 0, 0, 0, 0, 1]);
  assert.equal(sorted.at(-1), 88);
});
test("byField sorts strings ascending", () => {
  const titles = [...courses].sort(byField("title")).map((c) => c.title);
  assert.equal(titles[0], "Data Structures");
  assert.equal(titles.at(-1), "VLSI Design");
});
test("applyUpdate with a plain value replaces", () => {
  assert.equal(applyUpdate(3, 5), 5);
});
test("applyUpdate with a function calls it with the current value", () => {
  assert.equal(applyUpdate(3, (n) => n + 1), 4);
});
test("applyAll: three updater functions add three", () => {
  const inc = (n) => n + 1;
  assert.equal(applyAll(0, [inc, inc, inc]), 3);
});
test("applyAll: three values computed from a stale 0 only add one", () => {
  const count = 0;
  assert.equal(applyAll(count, [count + 1, count + 1, count + 1]), 1);
});
