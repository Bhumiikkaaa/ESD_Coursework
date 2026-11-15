# CONTRACT — React Lab 2: the Courses page (list + add)

This file is the leash. You don't type "build me a course page" into an AI chat — you paste
this, so the AI builds *this* feature, against *this* API, with *only* the tools you know.
The lab doc walks you through it: sections 11–14 of
https://esd-ta-sessions.vercel.app/react-lab2.html

**How to use it**

1. **Prompt 1:** copy the whole block below, from `You are helping me` down to
   `Keep explanations short.`, into a **new** AI chat. Don't add to it. Don't add §4.
2. Put what comes back into `src/courses/`, run it, and log the prompt in `PROMPTS.md`.
3. Audit it in `AUDIT.md` — **before** you ask the AI to change anything.
4. Then fix it. **§4 below is the shape the fix must end up with** — it's what `npm test`
   checks. You may paste §4 into a later prompt, together with *your* audit decisions.

---

## Prompt 1 — copy everything in this block

````text
You are helping me build one small feature in an existing React 19 + Vite app, in JavaScript.

## The feature: a Courses page — list + add

1. The page has a heading "Courses".
2. When the page first appears, load the course list once: GET /api/courses.
   - While waiting, show: Loading courses…
   - If it fails, show: Couldn't load courses: <the error's message>
   - If the list is empty, show: No courses yet.
   - Otherwise a <ul> with one <li> per course, showing two lines like these:
       CS101 · Programming Fundamentals
       4 credits · Computer Science · 34 seats left
     (code · title, then credits · department · seats: "Full" when seatsLeft is 0,
     "1 seat left" when it is 1)
3. Below the list, a form headed "Add a course". One <label> per field, with exactly these
   texts: "Code", "Title", "Department", "Credits", "Capacity", "Description".
   Credits and Capacity are number inputs; Description is a textarea and may be left empty.
   A submit button "Add course".
4. On submit, POST /api/courses with a CourseRequest. credits and capacity must be sent as
   numbers (input values are strings). description is null when left empty. The button is
   disabled until the server answers. No validation in the browser: send what was typed,
   and let the server decide.
5. On success (201): add the course from the response body to the list, keeping the list
   sorted by code. Do NOT reload the whole list. Clear the form.
6. On failure: keep what was typed. Show the error's message above the button. For a 400,
   also show each entry of fieldErrors directly under its own input.

## The API (from the project's openapi.yaml)

GET  /api/courses → 200: an array of Course, sorted by code
POST /api/courses, body: CourseRequest (admin only) →
     201: the created Course
     400: ApiError, message "Validation failed", fieldErrors { field name: reason }
     401 / 403: ApiError (not logged in / not an admin)
     409: ApiError, message "Course code already exists"

Course        { id, code, title, description (string or null), department, credits, capacity, seatsLeft }
CourseRequest { code, title, department, credits, capacity, description (optional, may be null) }
              code: 2–4 uppercase letters then 3 digits, e.g. "CS501"
              credits: whole number 1–6; capacity: whole number 1–500
ApiError      { timestamp, status, error, message, path, fieldErrors (object or null) }

## The API client — already written: use it, don't change it

src/api/client.js exports:
  apiFetch(path, { method = "GET", body } = {})  → resolves with the parsed JSON body
  ApiError  — apiFetch throws it for any non-2xx answer: error.status, error.message, error.fieldErrors
apiFetch handles the base URL, JSON, and the admin login token. Never call fetch directly;
never handle tokens. For example:
  const courses = await apiFetch("/api/courses");
  const created = await apiFetch("/api/courses", { method: "POST", body: courseRequest });

## Where it goes

All files go in src/courses/. The page component is CoursesPage, a named export from
src/courses/CoursesPage.jsx (src/App.jsx already renders it). Import the client as
"../api/client.js". Don't write App.jsx, main.jsx or any CSS: they exist.

## Rules

Use only useState and useEffect. Do not use useMemo, useCallback, useReducer, useRef, or
context. No TypeScript. Plain fetch, no data-fetching library. One View component that only
renders; put fetch and logic in a separate hook or module.
- "Plain fetch" here means apiFetch from src/api/client.js, which wraps fetch.
- No new packages: no axios, React Query, SWR, form or UI libraries. Plain JSX; a few
  className attributes are fine; no CSS file.
- Function components, named exports, .js / .jsx files.

Reply with each file in full, its path on the first line. Keep explanations short.
````

---

## §4 — The shape the tests check (for the fix, after your audit — not for prompt 1)

Four files in `src/courses/`, named exports, exactly these names and props. Nothing else is
needed, and anything else has to earn its place (`AUDIT.md`, "the rule").

### `src/courses/useCourses.js` — the hook: fetch and logic

```js
export function useCourses()  // → { courses, status, error, addCourse }
```

- `status` is one field: `"loading"` | `"ready"` | `"error"` — not `loading` / `error` booleans.
- `error` is the error's message (a string) when `status` is `"error"`, otherwise `null`.
- Loads `GET /api/courses` **once**, when the page appears: a `useEffect` with `[]`, whose
  cleanup sets an `ignore` flag so a stale answer is dropped.
- `addCourse(courseRequest)`: POSTs it with `apiFetch`; inserts the 201 body into `courses`,
  sorted by code, as a **new** array (no reload of the list); resolves with the created
  course. If `apiFetch` throws, `addCourse` throws the same `ApiError` — it doesn't catch
  it; the form shows it.

### `src/courses/CoursesView.jsx` — the View: only renders

```jsx
export function CoursesView({ courses, status, error })
```

- Renders only: no fetch, no `apiFetch`, no hooks, no state.
- `"loading"` → `Loading courses…` · `"error"` → `Couldn't load courses: <error>` ·
  no courses → `No courses yet.` · otherwise a `<ul>` with one `<li key={course.id}>` per
  course, **in the order it is given**, with the two lines from prompt 1, point 2.

### `src/courses/AddCourseForm.jsx` — the form: raises "add this course"

```jsx
export function AddCourseForm({ onAdd })
```

- Its own state: the six input values (controlled inputs, one `<label>` each: Code, Title,
  Department, Credits, Capacity, Description — a textarea), whether it is submitting, and
  the last error.
- On submit: `preventDefault()`, then
  `await onAdd({ code, title, department, credits: Number(…), capacity: Number(…), description })`
  with `description` = the text, or `null` when empty. The "Add course" button is disabled
  while waiting.
- Success → clear the form and the error. Failure → keep what was typed; show
  `error.message` above the button, and each `error.fieldErrors` entry directly under its
  own input (not inside the `<label>`).
- Errors a screen reader can find: an input with a `fieldErrors` entry has
  `aria-invalid="true"` and `aria-describedby` set to its message's `id`; the message
  above the button has `role="alert"`.
- Never calls `apiFetch` or `fetch` itself.

### `src/courses/CoursesPage.jsx` — puts them together

```jsx
export function CoursesPage()
```

- Calls `useCourses()`, and renders `<h1>Courses</h1>`,
  `<CoursesView courses={…} status={…} error={…} />` and `<AddCourseForm onAdd={addCourse} />`.
  Nothing else.
