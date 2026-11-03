// Section 06 — Scope and closures

// Each call returns a NEW generator with its own counter:
// const next = createIdGenerator("ORD"); next() → "ORD-1", next() → "ORD-2"
export function createIdGenerator(prefix) {
  throw new Error("TODO");
}

// A function factory: returns a check that "remembers" the limit.
export function makeCreditCheck(limit) {
  throw new Error("TODO");
}

// A value only a function can change.
// Returns [get, set]. The value lives in the closure; nothing else can reach it.
export function createBox(initial) {
  throw new Error("TODO");
}
