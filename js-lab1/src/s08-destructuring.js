// Section 08 — Destructuring, spread, rest, computed keys

// Destructure in the parameter list. credits defaults to 3 when missing.
export function describeCourse({ code, title, credits = 3 }) {
  throw new Error("TODO");
}

// Return a NEW form object with one field changed. The field name is in a
// variable, so you need a computed property key.
export function updateField(form, name, value) {
  throw new Error("TODO");
}

// Return a NEW object without one key. Use rest in a destructuring.
export function withoutField(obj, key) {
  throw new Error("TODO");
}

// Why does useState return an array and not an object? Because array
// destructuring lets the caller pick the names. Return [first, rest].
export function firstAndRest(list) {
  throw new Error("TODO");
}
