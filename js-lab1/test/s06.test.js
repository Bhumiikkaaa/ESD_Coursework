import { test } from "node:test";
import assert from "node:assert/strict";
import { createIdGenerator, makeCreditCheck, createBox } from "../src/s06-closures.js";

test("createIdGenerator counts up", () => {
  const next = createIdGenerator("ORD");
  assert.equal(next(), "ORD-1");
  assert.equal(next(), "ORD-2");
  assert.equal(next(), "ORD-3");
});
test("two generators do not share a count", () => {
  const a = createIdGenerator("A");
  const b = createIdGenerator("B");
  a(); a();
  assert.equal(b(), "B-1");
  assert.equal(a(), "A-3");
});
test("makeCreditCheck remembers its limit", () => {
  const within24 = makeCreditCheck(24);
  const within12 = makeCreditCheck(12);
  assert.equal(within24(20), true);
  assert.equal(within12(20), false);
  assert.equal(within12(12), true);
});
test("createBox returns [get, set]", () => {
  const box = createBox(0);
  assert.ok(Array.isArray(box));
  assert.equal(box.length, 2);
});
test("createBox: get reads, set replaces", () => {
  const [get, set] = createBox("draft");
  assert.equal(get(), "draft");
  set("final");
  assert.equal(get(), "final");
});
test("two boxes are independent", () => {
  const [getA, setA] = createBox(1);
  const [getB] = createBox(1);
  setA(99);
  assert.equal(getB(), 1);
  assert.equal(getA(), 99);
});
