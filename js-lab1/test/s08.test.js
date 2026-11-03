import { test } from "node:test";
import assert from "node:assert/strict";
import { describeCourse, updateField, withoutField, firstAndRest } from "../src/s08-destructuring.js";
import { byId, deepFreeze } from "../support/helpers.js";

test("describeCourse reads fields by destructuring", () => {
  assert.equal(describeCourse(byId(18)), "HS101: Technical Communication (2 cr)");
});
test("describeCourse defaults credits to 3", () => {
  assert.equal(describeCourse({ code: "XX100", title: "Draft" }), "XX100: Draft (3 cr)");
});
test("updateField returns a new object with the named field changed", () => {
  const form = deepFreeze({ code: "CS1", title: "", credits: "4" });
  const next = updateField(form, "title", "Compilers");
  assert.deepEqual(next, { code: "CS1", title: "Compilers", credits: "4" });
  assert.notEqual(next, form);
});
test("updateField works for any field name", () => {
  const form = deepFreeze({ a: "1", b: "2" });
  assert.deepEqual(updateField(form, "b", "9"), { a: "1", b: "9" });
});
test("withoutField removes one key and leaves the input alone", () => {
  const errors = deepFreeze({ code: "Required", title: "Too long" });
  assert.deepEqual(withoutField(errors, "code"), { title: "Too long" });
  assert.deepEqual(errors, { code: "Required", title: "Too long" });
});
test("firstAndRest returns a pair", () => {
  const [first, rest] = firstAndRest(deepFreeze([7, 8, 9]));
  assert.equal(first, 7);
  assert.deepEqual(rest, [8, 9]);
});
