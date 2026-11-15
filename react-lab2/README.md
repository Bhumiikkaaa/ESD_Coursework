# ESD — React Lab 2: AI-assisted — restrict, then judge

Two parts. The **pre-lab** you do at home, by hand, with **no AI**: a course search, built
the right way, so you know what right looks like. In the **lab session AI is required**:
it generates a Courses page (list + add) against `CONTRACT.md`, and you audit and fix what
it hands back. The full walkthrough is the lab doc —
**https://esd-ta-sessions.vercel.app/react-lab2.html** — read it alongside this folder.

## Setup (once)

```bash
cd esd-labs
git pull          # react-lab2 appears next to the other labs
cd react-lab2
npm install
npm test          # the given client's tests pass; almost everything else fails until you build it
npm run dev       # the app + the mock course API → http://localhost:5173
```

Node.js 20.19 or newer.

## Core and stretch

**Core** is mandatory: it's what we go through in the lab, and `npm test` checks it.
**Stretch** is extra: `npm run test:stretch` checks it. Ask about either, any time.

```bash
npm test                     # core tests — get these all green
npm test -- test/search      # only the pre-lab tests (test/courses: the lab-day ones)
npm run test:stretch         # stretch tests
npm run dev                  # the app, with the mock API at /api
```

## Pre-lab — at home, by hand, no AI

| Doc section | File you write | Its tests |
| --- | --- | --- |
| 04 A view that only renders | `src/search/SearchResults.jsx` | `npm test -- search/SearchResults` |
| 05 Effects that fetch | `src/search/useCourseSearch.js` | `npm test -- search/useCourseSearch` |
| 06 Controlled inputs | `src/search/CourseSearch.jsx` | `npm test -- search/CourseSearch` |
| 06 — stretch: debounce | `src/search/useDebounced.js`, then `CourseSearch.jsx` | `npm run test:stretch` |
| 09 Strip the "not yet" hooks | a copy of `ai-sample/CoursesPage.jsx` | `npm test -- courses/CoursesPage` |

## Lab day — AI required

| File | What it's for |
| --- | --- |
| `CONTRACT.md` | Prompt 1 — what you paste into the AI — and §4, the shape the tests check |
| `PROMPTS.md` | Your prompt log. Fill it in as you go. **Submitted.** |
| `AUDIT.md` | Your audit. Fill it in before you ask the AI to fix anything. **Submitted.** |
| `src/courses/` | Where the AI's code goes, and where you fix it: `useCourses.js`, `CoursesView.jsx`, `AddCourseForm.jsx`, `CoursesPage.jsx` — their tests: `npm test -- test/courses` |
| `ai-sample/CoursesPage.jsx` | A typical AI first draft, for practising the audit. Not for building on. |

Given — read, don't edit: `src/api/client.js` (the API client), `src/App.jsx`,
`src/main.jsx`, `src/styles.css`, `mock/`, `test/`.

## The API

`npm run dev` serves the mock course API at `/api` on the same origin as the app. It
implements the course contract (`openapi.yaml`) and restarts fresh from `mock/seed.json`
every time. The two endpoints this lab uses:

```
GET  /api/courses[?q=…]   every course (or those whose code/title contains q), sorted by code
POST /api/courses          create one (ADMIN) → 201 | 400 + fieldErrors | 409 duplicate code
```

Mock-only extras: add `?delay=random` or `?fail=1` to a request, or start it with
`MOCK_DELAY=random npm run dev` (PowerShell: `$env:MOCK_DELAY="random"; npm run dev`).
`src/api/client.js` logs in as the seeded admin for you — a stand-in until React Lab 3
builds real login. Pointing the app at your own Spring Boot backend is React Lab 4.

## Rules

- **Don't change the tests.** Fix your code until they pass.
- Pre-lab: no AI. Lab: AI required — and every prompt goes in `PROMPTS.md`.
- You own what ships: for every hook and every component, be ready to say *what earns it
  here?*

## Done means

`npm test` fully green, `PROMPTS.md` and `AUDIT.md` filled in, and the app does what
`CONTRACT.md` says. Then zip the `react-lab2` folder without `node_modules` and `dist` and
submit it — section 17 of the doc has the steps. Stretch is a bonus.
Submit by the end of the day of the lab: the next lab starts from this one (its `npm run
carry` brings your code over), and this lab's solution may be handed out after the deadline,
so late submissions can't be accepted.
