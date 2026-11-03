// Test helpers. deepFreeze makes an object (and everything inside it)
// read-only, so any code that tries to change it THROWS instead of
// quietly passing. That is how these tests catch mutation.
import { courses as raw } from "../data/courses.js";

export function deepFreeze(value) {
  if (value && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const key of Object.keys(value)) deepFreeze(value[key]);
  }
  return value;
}

// A fresh, frozen copy of the catalogue for every test file.
export const courses = deepFreeze(structuredClone(raw));
export const byId = (id) => courses.find((c) => c.id === id);
