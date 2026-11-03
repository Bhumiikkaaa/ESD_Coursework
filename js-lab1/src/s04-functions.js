// Section 04 — Functions are values

// Turn a course into exactly what a card on screen needs:
//   { id, heading: "CS402 · Enterprise Software Development",
//     meta: "4 credits · Computer Science", isFull: false }
// Write it as an ARROW function with an implicit return of an object.
export const toCardView = (course) => {
  throw new Error("TODO");
};

// One button per course. Each button's onClick must be a FUNCTION that,
// when called later, calls onAdd with that course's id.
// Building the buttons must not call onAdd at all.
//
// This version has a bug. Run the tests, read the failure, fix it.
export function buildButtons(courses, onAdd) {
  return courses.map((course) => ({
    label: `Add ${course.code}`,
    onClick: onAdd(course.id),
  }));
}
