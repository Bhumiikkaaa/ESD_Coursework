// Run with:  npm run inlab
import { test } from "node:test";
import assert from "node:assert/strict";
import { addToSemester, moveCourse } from "./semester.js";
import { deepFreeze } from "../support/helpers.js";

const plan = deepFreeze({ student: "Asha", semesters: { "2026-odd": [4, 10], "2027-even": [18] } });

test("adds to the end of an existing semester", () => {
  const next = addToSemester(plan, "2026-odd", 12);
  assert.deepEqual(next.semesters["2026-odd"], [4, 10, 12]);
});
test("returns new objects along the changed path only", () => {
  const next = addToSemester(plan, "2026-odd", 12);
  assert.notEqual(next, plan);
  assert.notEqual(next.semesters, plan.semesters);
  assert.notEqual(next.semesters["2026-odd"], plan.semesters["2026-odd"]);
  assert.equal(next.semesters["2027-even"], plan.semesters["2027-even"], "untouched semester must be the SAME array");
  assert.equal(next.student, "Asha");
});
test("creates a missing semester", () => {
  const next = addToSemester(plan, "2027-odd", 3);
  assert.deepEqual(next.semesters["2027-odd"], [3]);
  assert.deepEqual(Object.keys(next.semesters).length, 3);
});
test("already planned → the SAME plan", () => {
  assert.equal(addToSemester(plan, "2027-even", 18), plan);
});
test("stretch: moveCourse moves an id between semesters", () => {
  const next = moveCourse(plan, "2026-odd", "2027-even", 10);
  assert.deepEqual(next.semesters["2026-odd"], [4]);
  assert.deepEqual(next.semesters["2027-even"], [18, 10]);
  assert.equal(moveCourse(plan, "2026-odd", "2027-even", 99), plan);
});
