// Section 03 — Values, truthiness and expressions

// "Full", "1 seat left", or "12 seats left".
export function seatLabel(course) {
  return course.seatsLeft === 0? "Full": course.seatsLeft === 1? "1 seat left": `${course.seatsLeft} seats left`;
}

// The course's description, or "No description yet." ONLY when it is
// null or undefined. An empty string "" is a real value and is kept.
export function descriptionOrDefault(course) {
  return course.description ?? "No description yet.";
}

// "3 in planner" for a positive count, and null (not 0, not "") for zero.
export function plannerBadge(count) {
  return count > 0 ? `${count} in planner` : null;
}
