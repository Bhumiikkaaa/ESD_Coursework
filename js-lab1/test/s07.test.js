import { test } from "node:test";
import assert from "node:assert/strict";
import { PlannerList } from "../src/s07-this.js";

test("add works when called on the object", () => {
  const list = new PlannerList("Asha");
  list.add(4);
  assert.deepEqual(list.ids, [4]);
});
test("add still works when passed as a callback (detached)", () => {
  const list = new PlannerList("Asha");
  [4, 10, 18].forEach(list.add);
  assert.deepEqual(list.ids, [4, 10, 18]);
});
test("add still works when stored in a variable first", () => {
  const list = new PlannerList("Ravi");
  const add = list.add;
  add(1);
  assert.equal(list.describe(), "Ravi has 1 course(s) planned");
});
test("two lists do not share ids", () => {
  const a = new PlannerList("A");
  const b = new PlannerList("B");
  [1, 2].forEach(a.add);
  assert.deepEqual(b.ids, []);
});
