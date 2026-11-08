// Section 11 — The array toolkit for UIs
import { toCardView } from "./s04-functions.js";
import { byField } from "./s05-higher-order.js";

// Courses in one department. Case-insensitive.
export function byDepartment(courses, department) {
  return courses.filter(
    (c) => c.department.toLowerCase() === department.toLowerCase()
  );
}

// Courses that still have seats.
export function openOnly(courses) {
  return courses.filter((c) => c.seatsLeft > 0);
}

// Case-insensitive match on code OR title. A blank query returns everything.
export function searchCourses(courses, query) {
  const q = query.trim().toLowerCase();
  if (!q) return courses;
  return courses.filter(
    (c) =>
      c.code.toLowerCase().includes(q) || c.title.toLowerCase().includes(q)
  );
}

// The course with this code (case-insensitive), or undefined.
export function findByCode(courses, code) {
  return courses.find((c) => c.code.toLowerCase() === code.toLowerCase());
}

// Sum of credits.
export function totalCredits(courses) {
  return courses.reduce((sum, c) => sum + c.credits, 0);
}

// { "Computer Science": 5, "Electronics": 4, ... }
export function countByDepartment(courses) {
  return courses.reduce((acc, c) => {
    acc[c.department] = (acc[c.department] ?? 0) + 1;
    return acc;
  }, {});
}

// Unique department names, sorted A→Z.
export function departments(courses) {
  return [...new Set(courses.map((c) => c.department))].sort();
}

// A sorted COPY. The input must not change. Reuse byField from section 05.
export function sortedBy(courses, field) {
  return [...courses].sort(byField(field));
}

// Is at least one course full?
export function anyFull(courses) {
  return courses.some((c) => c.seatsLeft === 0);
}

// Does every course have at least `n` seats?
export function allHaveSeats(courses, n = 1) {
  return courses.every((c) => c.seatsLeft >= n);
}

// The cards a department page shows: that department, open courses only,
// sorted by code, turned into card views. One chain.
export function courseCards(courses, department) {
  return byDepartment(courses, department)
    .filter((c) => c.seatsLeft > 0)
    .sort(byField("code"))
    .map(toCardView);
}

// Planner ids → the course objects, in planner order. Unknown ids are skipped.
export function plannerCourses(planner, courses) {
  return planner
    .map((id) => courses.find((c) => c.id === id))
    .filter(Boolean);
}

// Total credits of the planned courses.
export function plannerCredits(planner, courses) {
  return totalCredits(plannerCourses(planner, courses));
}

// Can this course be added? It must exist, have a seat, not already be in
// the planner, and keep the total within the limit (24 by default).
export function canAdd(planner, courses, courseId, limit = 24) {
  const course = courses.find((c) => c.id === courseId);
  if (!course) return false;
  if (course.seatsLeft === 0) return false;
  if (planner.includes(courseId)) return false;
  if (plannerCredits(planner, courses) + course.credits > limit) return false;
  return true;
}
