import { test } from "node:test";
import assert from "node:assert/strict";
import { seatLabel, descriptionOrDefault, plannerBadge } from "../src/s03-expressions.js";
import { byId } from "../support/helpers.js";

test("seatLabel: full course", () => {
  assert.equal(seatLabel(byId(2)), "Full");
});
test("seatLabel: exactly one seat is singular", () => {
  assert.equal(seatLabel(byId(5)), "1 seat left");
});
test("seatLabel: several seats", () => {
  assert.equal(seatLabel(byId(3)), "12 seats left");
});
test("descriptionOrDefault: null gets the default", () => {
  assert.equal(descriptionOrDefault(byId(8)), "No description yet.");
});
test("descriptionOrDefault: an empty string is a real value — keep it (?? not ||)", () => {
  assert.equal(descriptionOrDefault(byId(13)), "");
});
test("descriptionOrDefault: normal description passes through", () => {
  assert.equal(descriptionOrDefault(byId(1)), byId(1).description);
});
test("plannerBadge: zero gives null, not 0 (the && trap)", () => {
  assert.equal(plannerBadge(0), null);
});
test("plannerBadge: positive count", () => {
  assert.equal(plannerBadge(3), "3 in planner");
});
