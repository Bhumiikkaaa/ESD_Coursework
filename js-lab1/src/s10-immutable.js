// Section 10 — Immutable updates (the planner)
// A planner is an array of course ids, e.g. [4, 10, 18].
// Every function returns a NEW value and never changes its input.

// Add an id. If it is already there, return the SAME array (nothing changed).
export function addToPlanner(planner, courseId) {
  throw new Error("TODO");
}

// Remove an id. If it is not there, return the SAME array.
export function removeFromPlanner(planner, courseId) {
  throw new Error("TODO");
}

// Return a new course object with some fields changed.
export function updateCourse(course, changes) {
  throw new Error("TODO");
}

// Return a new list where the matching course has one fewer seat.
// Untouched courses must be the SAME objects as before.
// If the course is full or not found, return the SAME list.
export function takeSeat(courses, courseId) {
  throw new Error("TODO");
}
