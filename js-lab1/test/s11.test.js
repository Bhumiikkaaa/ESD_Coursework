import { test } from "node:test";
import assert from "node:assert/strict";
import * as cat from "../src/s11-catalog.js";
import { courses, deepFreeze } from "../support/helpers.js";

test("byDepartment is case-insensitive", () => {
  assert.equal(cat.byDepartment(courses, "electronics").length, 4);
  assert.equal(cat.byDepartment(courses, "Data Science & AI").length, 4);
  assert.equal(cat.byDepartment(courses, "Physics").length, 0);
});
test("openOnly drops the five full courses", () => {
  assert.equal(cat.openOnly(courses).length, 15);
});
test("searchCourses matches code or title, any case", () => {
  assert.deepEqual(cat.searchCourses(courses, "learning").map((c) => c.code), ["DS220", "DS330"]);
  assert.deepEqual(cat.searchCourses(courses, "ma3").map((c) => c.code), ["MA310"]);
});
test("searchCourses: blank query returns everything", () => {
  assert.equal(cat.searchCourses(courses, "   ").length, 20);
});
test("findByCode finds, or returns undefined", () => {
  assert.equal(cat.findByCode(courses, "cs402").id, 4);
  assert.equal(cat.findByCode(courses, "XX999"), undefined);
});
test("totalCredits sums", () => {
  assert.equal(cat.totalCredits(courses), 69);
  assert.equal(cat.totalCredits([]), 0);
});
test("countByDepartment builds an object", () => {
  assert.deepEqual(cat.countByDepartment(courses), {
    "Computer Science": 5, Electronics: 4, Mathematics: 4, "Data Science & AI": 4, Humanities: 3,
  });
});
test("departments: unique and sorted", () => {
  assert.deepEqual(cat.departments(courses), [
    "Computer Science", "Data Science & AI", "Electronics", "Humanities", "Mathematics",
  ]);
});
test("anyFull / allHaveSeats", () => {
  assert.equal(cat.anyFull(courses), true);
  assert.equal(cat.anyFull(cat.openOnly(courses)), false);
  assert.equal(cat.allHaveSeats(cat.openOnly(courses)), true);
  assert.equal(cat.allHaveSeats(cat.openOnly(courses), 5), false);
});
test("courseCards: one department, open only, sorted by code, as card views", () => {
  assert.deepEqual(cat.courseCards(courses, "Computer Science").map((c) => c.heading), [
    "CS101 · Programming Fundamentals",
    "CS305 · Database Systems",
    "CS402 · Enterprise Software Development",
    "CS501 · Distributed Systems",
  ]);
});
