# Audit — React Lab 2

Part of what you submit. Fill in sections 0–4 **before** you ask the AI to change anything:
deciding what's wrong is your job, not the AI's. The sheet you audit against is "The Shape
of a Good React Slice" — section 08 of the lab doc.

Point at code as `file:line`, e.g. `CoursesPage.jsx:14`.

---

## 0. What came back

| File the AI gave you | What's in it (components, hooks) | Lines |
| --- | --- | --- |
|  |  |  |

- Does it run? List loads / valid add appears in order / duplicate code shows the 409
  message / bad input shows fieldErrors under the inputs:
- Requests in the Network tab — on page load: __ ; per add: __
- `npm test` before any fix: __ passed / __ failed. Which test files fail?

## 1. Part A — walk the allowed list

Is each element present, and in the right place?

| Element (the sheet, Part A) | Where it is in the AI's code (`file:line`, or "missing") | Right place? If not, where should it be? |
| --- | --- | --- |
| One View component that only renders |  |  |
| Fetch + logic in a separate hook or module |  |  |
| `useState` for the course list, at the right level |  |  |
| `useState` for the form's inputs, at the right level |  |  |
| `useEffect` — for the initial fetch only (with a cleanup) |  |  |
| Props down, callbacks up (the form raises "add this course") |  |  |
| `.map` to render the list, with a stable `key` |  |  |
| Loading / error / empty states, from one `status` |  |  |

## 2. Part B — scan for "not yet"

Search the files (VS Code: Ctrl/Cmd+Shift+F) for each one.

| Not yet | Found? (`file:line`) | What it does in *this* slice | Cut, or keep — and why |
| --- | --- | --- | --- |
| `useMemo` |  |  |  |
| `useCallback` |  |  |  |
| `useReducer` |  |  |  |
| `useRef` |  |  |  |
| Context (`createContext`, `useContext`) |  |  |  |
| A data-fetching library, or `axios`, or raw `fetch` instead of `apiFetch` |  |  |  |
| TypeScript (types, interfaces, `.ts`/`.tsx`) |  |  |  |
| Anything else nobody taught you (name it) |  |  |  |

## 3. The rule — every hook and every component split

One row for **each** `useState`, `useEffect` and custom hook call, and for **each**
component. Say what it does *in this slice*. "The AI added it" and "just in case" are not
answers — if you can't name its job, the decision is "cut".

| Hook call or component (`file:line`) | What earns it here? (one sentence) | Keep / cut / move (to where) |
| --- | --- | --- |
|  |  |  |

## 4. Decisions — before any fix prompt

- I will **cut**:
- I will **move** (from → to):
- I will **add** (missing from the AI's version):
- Other smells I found (state stored that could be computed, a reload after add, browser
  validation, `key={index}`, swallowed errors…):

---

## 5. Strip check (section 14 of the doc)

For each "not yet" item you removed — one at a time:

| Removed | `npm test` after | The app after (loads / adds / shows errors) |
| --- | --- | --- |
|  |  |  |

If the AI used none, say so here, and say which rule in prompt 1 you think prevented it.

## 6. Before / after

|  | Before (the AI's first version) | After (yours) |
| --- | --- | --- |
| Files and components |  |  |
| `useState` calls (and where) |  |  |
| `useEffect` calls |  |  |
| "Not yet" items |  |  |
| Requests: on load / per add |  |  |
| `npm test` |  |  |

## 7. Two sentences

- One thing the AI got right that you might not have thought of:
- One thing you will never accept from an AI without checking again:
