# Audit — React Lab 2

Audit of the final implementation on branch `lab/react-lab2`. The original first AI response was not preserved as a separate snapshot, so this audit distinguishes the observable test history and final code from anything that cannot now be verified.

## 0. What came back

| File | What's in it | Relevant lines |
| --- | --- | --- |
| `src/courses/CoursesView.jsx` | Pure `CoursesView` component; loading/error/empty/list rendering | 2–29 |
| `src/courses/useCourses.js` | `useCourses` hook; initial GET, status/error state, POST and sorted insertion | 3–59 |
| `src/courses/AddCourseForm.jsx` | `AddCourseForm`; controlled fields, submit state, server and field errors | 21–123 |
| `src/courses/CoursesPage.jsx` | Page composition; calls hook and passes props/callbacks | 5–18 |

- **Does it run?** Yes. The catalogue loaded. A valid course was added and appeared in sorted order. The invalid course-code response displayed the server's rule (“2–4 uppercase letters”); invalid credits also displayed a field-level error. The duplicate-code/409 path is covered by the automated tests. The browser checks for invalid code, invalid credits, and successful POST were performed manually.
- **Network:** the page performs one initial `GET /api/courses` (from the hook's single mount effect). Each add performs one `POST /api/courses`; it does not reload the list. In DevTools, the add request returned **201**, and its Request Method was confirmed as **POST**. No follow-up GET appeared after the add.
- **Tests before the page-integration fix:** the observed run was **58 passed, 4 failed**. All four failures were in `test/courses/CoursesPage.test.jsx`; the page was still a placeholder, so loading/list/add/duplicate/validation integration cases failed. After the page was composed, the complete suite was reported as **62 passed, 0 failed**. The user subsequently confirmed `npm test`, `npm run test:stretch`, and `npm run build` all passed.

The first generated response itself is not available as a preserved snapshot. Therefore the table above describes the final files, not an unsupported claim about the exact contents of an earlier AI response.

## 1. Part A — walk the allowed list

| Element | Where it is in the code | Right place? |
| --- | --- | --- |
| One View component that only renders | `CoursesView.jsx:2` | Yes. It receives props and renders states/list; no hooks or API calls. |
| Fetch + logic in a separate hook/module | `useCourses.js:3–59` | Yes. API access and course-list logic live in the custom hook. |
| `useState` for the course list | `useCourses.js:4` | Yes. The list belongs at the hook/page data level, not inside the view or form. |
| `useState` for form inputs | `AddCourseForm.jsx:22` | Yes. The form owns its controlled field values. |
| `useEffect` for initial fetch only, with cleanup | `useCourses.js:8–33` | Yes. Empty dependency array; cleanup sets `ignore` so a stale response is not applied. |
| Props down, callbacks up | `CoursesPage.jsx:6–18`; `AddCourseForm.jsx:21, 35–66` | Yes. Page passes `addCourse` as `onAdd`; form calls it and handles the result. |
| `.map` with stable key | `CoursesView.jsx:21–27` | Yes. Maps courses and uses `key={course.id}`. |
| Loading/error/empty states from one status | `useCourses.js:5–6, 17, 23`; `CoursesView.jsx:3–14` | Yes. `status` is `loading`, `ready`, or `error`; an empty ready list gets its own message. |

## 2. Part B — scan for “not yet”

| Not yet | Found? | What it does in this slice | Cut, or keep — and why |
| --- | --- | --- | --- |
| `useMemo` | No | Not used. | No action needed; nothing to memoize for this small list. |
| `useCallback` | No | Not used. | No action needed; not required by the contract. |
| `useReducer` | No | Not used. | No action needed; state is simple enough for `useState`. |
| `useRef` | No | Not used. | No action needed. |
| Context (`createContext`, `useContext`) | No | Not used. | No action needed; props are sufficient for this page. |
| Data-fetching library / axios / raw fetch instead of `apiFetch` | No in the feature | `useCourses.js` imports and calls `apiFetch`. The existing API client wraps `fetch`, as the contract explicitly allows. | Keep `apiFetch`; do not replace it with direct fetch or another library. |
| TypeScript | No | Feature files are JavaScript/JSX. | No action needed. |
| Anything else nobody taught you | No additional hook/library identified | The feature uses ordinary state, effects, async functions, array spread, `map`, and `sort`. | No extra abstraction needs to be kept. |

## 3. The rule — every hook and every component split

| Hook call or component | What earns it here? | Keep / cut / move |
| --- | --- | --- |
| `useCourses.js:4` — `useState([])` | Stores the course collection loaded from the API and updated after a successful add. | Keep in `useCourses`. |
| `useCourses.js:5` — `useState("loading")` | Drives the loading, ready, and error display states with one status value. | Keep in `useCourses`. |
| `useCourses.js:6` — `useState(null)` | Stores the initial-load error message shown by the view. | Keep in `useCourses`. |
| `useCourses.js:8` — `useEffect` | Performs the one initial GET when the hook mounts and ignores stale results after cleanup. | Keep in `useCourses`. |
| `useCourses.js:35` — `addCourse` | Posts the new course, inserts the returned course into a new sorted array, and lets errors propagate to the form. | Keep in `useCourses`. |
| `AddCourseForm.jsx:22` — `useState(INITIAL_VALUES)` | Holds the six controlled form values. | Keep in `AddCourseForm`. |
| `AddCourseForm.jsx:23` — `useState(false)` | Disables the submit button while the POST is pending. | Keep in `AddCourseForm`. |
| `AddCourseForm.jsx:24` — `useState(null)` | Holds the submission error message for the alert above the button. | Keep in `AddCourseForm`. |
| `AddCourseForm.jsx:25` — `useState({})` | Holds server-provided field errors so each can be rendered below its input. | Keep in `AddCourseForm`. |
| `CoursesPage.jsx:6` — `useCourses()` | Connects the data hook to the page and obtains the props/callback for the child components. | Keep in `CoursesPage`. |
| `CoursesView.jsx:2` — `CoursesView` | Renders loading, error, empty, or course-list content from props only. | Keep as the single presentational view. |
| `AddCourseForm.jsx:21` — `AddCourseForm` | Owns form interaction and reports the requested course upward through `onAdd`. | Keep separate from the data-fetching hook. |
| `CoursesPage.jsx:5` — `CoursesPage` | Composes the hook, view, and form without taking over their responsibilities. | Keep as the page component. |

## 4. Decisions — before any fix prompt

- **Cut:** no prohibited hooks, context, data-fetching library, direct feature-level `fetch`, or TypeScript was present in the final feature, so there was nothing from the “not yet” list to strip.
- **Move:** keep API work in `useCourses`, input/submission state in `AddCourseForm`, and rendering-only list states in `CoursesView`. No further move was needed in the final structure.
- **Add:** complete the `CoursesPage` composition so it actually renders the heading, view, and form and passes `addCourse` as `onAdd`. This resolved the four page integration test failures.
- **Other smells checked:** no reload after add; no `key={index}`; no browser-side validation replacing server validation; no swallowed API error in `addCourse` (it propagates to the form); no separate loading/error booleans in place of the single status field. The form converts credits/capacity to numbers and sends an empty description as `null`.

---

## 5. Strip check (section 14 of the doc)

No “not yet” items were found in the final feature, so no strip experiment was needed. Prompt 1's rules explicitly limited the feature to `useState` and `useEffect`, prohibited `useMemo`, `useCallback`, `useReducer`, `useRef`, and context, required JavaScript, and directed API access through the existing `apiFetch` client. The final code follows those restrictions.

## 6. Before / after

The exact untouched first AI output was not saved as a separate snapshot. “Before” below therefore means the observed intermediate state before the page-integration fix, not a claim that this was the first generated response.

| | Before page-integration fix (observed intermediate state) | Final implementation |
| --- | --- | --- |
| Files and components | View, data hook, and form existed; `CoursesPage` was still a placeholder/incomplete integration. | Four files: `CoursesView`, `useCourses`, `AddCourseForm`, and `CoursesPage`. |
| `useState` calls | Hook: 3; form: 4. | Hook: 3; form: 4. |
| `useEffect` calls | 1 initial-load effect in `useCourses`. | 1 initial-load effect in `useCourses`. |
| “Not yet” items | No prohibited item identified in the implementation reviewed. | None. |
| Requests: on load / per add | Intended initial GET / POST; integration tests failed while the page was incomplete. | One initial GET / one POST per add; no GET after POST. |
| `npm test` | 58 passed, 4 failed; all four failures in `CoursesPage.test.jsx`. | 62 passed, 0 failed. Stretch tests and production build also passed, as reported after the final run. |

## 7. Two sentences

- **One thing the AI got right that I might not have thought of:** keeping the data-fetching logic in a custom hook and making the view a pure component made the responsibilities easier to test separately.
- **One thing I will never accept from an AI without checking again:** I will not assume that a feature is integrated just because its individual components exist; I will run the full tests and verify the actual browser/network behaviour.
