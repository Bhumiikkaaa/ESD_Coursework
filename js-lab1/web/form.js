// Sections 12–13 exercise: the "Add a course" form, built by hand with the DOM.
// Run it:  npm run web   → open http://localhost:5500/web/
// Finish src/s11-catalog.js (departments) and src/s13-forms.js first.
import { courses } from "../data/courses.js";
import { departments } from "../src/s11-catalog.js";
import { isComplete, toCourse } from "../src/s13-forms.js";

// Step 1 — select the elements you need (querySelector / querySelectorAll).
const form = document.querySelector("#add-course");
// TODO: fields — every input AND the select inside the form, as a real ARRAY
// TODO: submit — the submit button
// TODO: departmentSelect, list (#course-list), count (#count), status (#status)
const fields = Array.from(form.querySelectorAll("input, select")); // Every input AND the select inside the form
const submit = form.querySelector("button[type='submit']"); // The submit button
const departmentSelect = form.querySelector("select[name='department']"); // The department dropdown
const list = document.querySelector("#course-list"); // The course list
const count = document.querySelector("#count"); // The count element
const status = document.querySelector("#status"); // The status element

// A closure that hands out ids after the catalogue's last one (20).
const nextId = (() => {
  let last = 20;
  return () => ++last;
})();

// Step 2 — fill the department dropdown from the data.
// Hint: departments(courses).map((name) => new Option(name, name))
// TODO
departments(courses).forEach((name) => {
  departmentSelect.add(new Option(name, name));
});

// Step 3 — read every field into one object: { code, title, department, credits }.
// Hint: reduce over fields with a computed key [field.name].
function readForm() {
  // TODO
  return fields.reduce((values, field) => {
    values[field.name] = field.value;
    return values;
  }, {});
}

// Step 4 — enable the button only when the form is complete.
// Listen for "input" on the FORM (every field's event bubbles up to it).
// TODO
form.addEventListener("input", () => {
  submit.disabled = !isComplete(readForm());
});

// Step 5 — on "submit": stop the page reload, build the course with
// toCourse(values, nextId), append renderItem(course) to the list,
// update the count and status, reset the form, disable the button again.
// TODO
form.addEventListener("submit", (event) => {
  event.preventDefault(); // Stop the page reload
  const course = toCourse(readForm(), nextId); // Build the course
  list.append(renderItem(course)); // Append the course to the list
  count.textContent = list.children.length; // Update the count
  status.textContent = `Added ${course.code}.`; // Update the status
  form.reset(); // Reset the form
  submit.disabled = true; // Disable the button again
});

// Step 6 — one list item per course. Clicking the item toggles the
// "selected" class; clicking Remove removes it WITHOUT also selecting it.
function renderItem(course) {
  // TODO: create <li class="item"><span>CS610 · Compilers · 4 cr</span><button>Remove</button></li>
  // TODO: item click → toggle "selected"; remove click → remove the item (watch the bubbling!)
  const item = document.createElement("li");
  item.className = "item";
  item.innerHTML = `
    <span>${course.code} · ${course.title} · ${course.credits} cr</span>
    <button>Remove</button>
  `;

  // Toggle "selected" class on item click
  item.addEventListener("click", () => {
    item.classList.toggle("selected");
  });

  // Remove the item on button click (stop bubbling)
  item.querySelector("button").addEventListener("click", (event) => {
    event.stopPropagation();
    item.remove();
    count.textContent = list.children.length; // Update the count
  });

  return item;
}
