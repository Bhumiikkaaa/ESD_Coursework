// Section 08 — Destructuring, spread, rest, computed keys

// Destructure in the parameter list. credits defaults to 3 when missing.
export function describeCourse({ code, title, credits = 3 }) {
  return `${code}: ${title} (${credits} cr)`;
}

// Return a NEW form object with one field changed. The field name is in a
// variable, so you need a computed property key.
export function updateField(form, name, value) {
  return { ...form, [name]: value };
}

// Return a NEW object without one key. Use rest in a destructuring.
export function withoutField(obj, key) {
  const { [key]: _removed, ...rest } = obj;
  return rest;
}

// Why does useState return an array and not an object? Because array
// destructuring lets the caller pick the names. Return [first, rest].
export function firstAndRest(list) {
  const [first, ...rest] = list;
  return [first, rest];
}
