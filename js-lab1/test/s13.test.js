import { test } from "node:test";
import assert from "node:assert/strict";
import { isComplete, toCourse } from "../src/s13-forms.js";
import { deepFreeze } from "../support/helpers.js";

const good = deepFreeze({ code: "cs610", title: " Compilers ", department: "Computer Science", credits: "4" });

test("isComplete: all filled, credits 1–6", () => {
  assert.equal(isComplete(good), true);
});
test("isComplete: a blank or whitespace field fails", () => {
  assert.equal(isComplete({ ...good, title: "   " }), false);
  assert.equal(isComplete({ ...good, department: "" }), false);
});
test("isComplete: credits must be a whole number 1–6", () => {
  assert.equal(isComplete({ ...good, credits: "0" }), false);
  assert.equal(isComplete({ ...good, credits: "7" }), false);
  assert.equal(isComplete({ ...good, credits: "2.5" }), false);
  assert.equal(isComplete({ ...good, credits: "abc" }), false);
});
test("toCourse cleans the values and uses nextId", () => {
  let n = 20;
  const course = toCourse(good, () => ++n);
  assert.deepEqual(course, {
    id: 21, code: "CS610", title: "Compilers", description: null,
    department: "Computer Science", credits: 4, capacity: 60, seatsLeft: 60,
  });
});
