import { test } from "node:test";
import assert from "node:assert/strict";
import { addToPlanner, removeFromPlanner, updateCourse, takeSeat } from "../src/s10-immutable.js";
import { courses, byId, deepFreeze } from "../support/helpers.js";

test("addToPlanner returns a new array with the id at the end", () => {
  const planner = deepFreeze([4, 10]);
  const next = addToPlanner(planner, 18);
  assert.deepEqual(next, [4, 10, 18]);
  assert.notEqual(next, planner);
});
test("addToPlanner: already there → the SAME array (nothing changed)", () => {
  const planner = deepFreeze([4, 10]);
  assert.equal(addToPlanner(planner, 10), planner);
});
test("removeFromPlanner removes the id", () => {
  const planner = deepFreeze([4, 10, 18]);
  assert.deepEqual(removeFromPlanner(planner, 10), [4, 18]);
});
test("removeFromPlanner: not there → the SAME array", () => {
  const planner = deepFreeze([4]);
  assert.equal(removeFromPlanner(planner, 99), planner);
});
test("updateCourse returns a new object with the changes", () => {
  const next = updateCourse(byId(1), { title: "Programming I", credits: 3 });
  assert.equal(next.title, "Programming I");
  assert.equal(next.credits, 3);
  assert.equal(next.code, "CS101");
  assert.notEqual(next, byId(1));
  assert.equal(byId(1).title, "Programming Fundamentals");
});
test("takeSeat decrements only the matching course", () => {
  const next = takeSeat(courses, 5);
  assert.equal(next.find((c) => c.id === 5).seatsLeft, 0);
  assert.equal(byId(5).seatsLeft, 1, "the original course changed — you mutated it");
});
test("takeSeat keeps untouched courses as the SAME objects", () => {
  const next = takeSeat(courses, 5);
  assert.notEqual(next, courses);
  assert.equal(next[0], courses[0]);
  assert.notEqual(next[4], courses[4]);
});
test("takeSeat on a full or unknown course returns the SAME list", () => {
  assert.equal(takeSeat(courses, 2), courses);
  assert.equal(takeSeat(courses, 999), courses);
});
