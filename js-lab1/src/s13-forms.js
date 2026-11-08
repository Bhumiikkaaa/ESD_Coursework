// Section 13 — the pure half of the form exercise (the DOM half is in web/)

// values: { code, title, department, credits } — all strings, as read from inputs.
// Complete when every field has non-blank text and credits is a whole number 1–6.
export function isComplete(values) {
  const { code, title, department, credits } = values;
  if (!code?.trim() || !title?.trim() || !department?.trim()) return false;
  const n = Number(credits);
  return Number.isInteger(n) && n >= 1 && n <= 6;
}

// Turn form values into a course object (the shape the API uses), with a
// fresh id from nextId. Trims text, upper-cases the code, numbers the credits.
// Call nextId() for the id; description is null; capacity and seatsLeft are both 60.
export function toCourse(values, nextId) {
  return {
    id: nextId(),
    code: values.code.trim().toUpperCase(),
    title: values.title.trim(),
    description: null,
    department: values.department.trim(),
    credits: Number(values.credits),
    capacity: 60,
    seatsLeft: 60,
  };
}
