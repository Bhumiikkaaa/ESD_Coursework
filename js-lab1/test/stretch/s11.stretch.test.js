// Section 11 — stretch functions: sortedBy, plannerCourses, plannerCredits, canAdd
import { test } from "node:test";
import assert from "node:assert/strict";
import * as cat from "../../src/s11-catalog.js";
import { courses, deepFreeze } from "../../support/helpers.js";

test("sortedBy returns a sorted copy and leaves the input alone", () => {
  const sorted = cat.sortedBy(courses, "seatsLeft");
  assert.notEqual(sorted, courses);
  assert.equal(sorted.at(-1).code, "HS101");
  assert.equal(courses[0].code, "CS101");
});
test("plannerCourses maps ids to courses in planner order, skipping unknown", () => {
  const planner = deepFreeze([10, 999, 4]);
  assert.deepEqual(cat.plannerCourses(planner, courses).map((c) => c.code), ["MA101", "CS402"]);
});
test("plannerCredits", () => {
  assert.equal(cat.plannerCredits(deepFreeze([4, 10, 18]), courses), 10);
});
test("canAdd: open, not planned, within limit", () => {
  assert.equal(cat.canAdd(deepFreeze([4]), courses, 10), true);
});
test("canAdd: rejects full, duplicate, unknown and over-limit", () => {
  assert.equal(cat.canAdd(deepFreeze([]), courses, 2), false, "full course");
  assert.equal(cat.canAdd(deepFreeze([4]), courses, 4), false, "already planned");
  assert.equal(cat.canAdd(deepFreeze([]), courses, 999), false, "unknown id");
  const heavy = deepFreeze([1, 3, 4, 5, 10, 17]); // 24 credits
  assert.equal(cat.canAdd(heavy, courses, 18), false, "would exceed 24");
  assert.equal(cat.canAdd(heavy, courses, 18, 26), true, "custom limit");
});
