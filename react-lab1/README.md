# ESD — React Lab 1: A number matrix, by hand

Pre-lab exercises for React Lab 1. The full walkthrough is the lab doc:
**https://esd-ta-sessions.vercel.app/react-lab1.html** — read it alongside this folder.

No AI for this lab. Type the code yourself.

## Setup (once)

```bash
cd esd-labs
git pull         # react-lab1 appears next to js-lab2
cd react-lab1
npm install      # new for React: downloads React, Vite and Vitest into node_modules/
npm test         # at first almost everything fails with "TODO"
```

Node.js 20.19 or newer (`node -v`).

## Core and stretch

**Core** is mandatory: it's what we go through in the lab, and `npm test` checks it.
**Stretch** is extra: `npm run test:stretch` checks it. Ask about either, any time.

```bash
npm run dev            # the app at http://localhost:5173 — leave it running, it reloads as you save
npm test               # core tests — get these to "Tests  36 passed (36)"
npm run test:stretch   # stretch tests
npm run test:watch     # re-runs the tests every time you save
npm run test:all       # everything, including the in-lab check (which fails until the lab)
```

## Work section by section (all core unless marked)

| Doc section | File you edit | Run just its tests |
| --- | --- | --- |
| 04 JSX, and a first component | `src/Header.jsx` | `npx vitest run test/s04.test.jsx` |
| 05 Components and props | `src/Cell.jsx` | `npx vitest run test/s05.test.jsx` |
| 06 Composition, lists and keys | `src/Matrix.jsx` | `npx vitest run test/s06.test.jsx` |
| 07 State lives in App | `src/App.jsx` | `npx vitest run test/s07.test.jsx` |
| 08 Events up, immutable updates | `src/matrix.js` (`incrementAt`), `src/Matrix.jsx`, `src/App.jsx` | `npx vitest run test/s08.test.jsx` |
| 09 Derived values: the stats | `src/matrix.js` (`stats`), `src/Stats.jsx`, `src/App.jsx` | `npx vitest run test/s09.test.jsx` |
| 10 The re-render payoff | nothing new — experiments in the browser | — |
| 11 Data from the server | `src/App.jsx` (`useEffect` + `fetch`) | `npx vitest run test/s11.test.jsx` |
| 12 — stretch: step, Reset, highlight the max | `src/matrix.js`, `src/App.jsx`, `src/Matrix.jsx`, `src/Cell.jsx` | `npm run test:stretch` |

Given, don't edit: `src/main.jsx`, `src/styles.css`, `index.html`,
`public/matrix.json`, `vite.config.js`, `test/`.

## Rules

- **Don't change the tests.** Fix your code until they pass.
- The tests **freeze** the matrices they give your functions.
  `Cannot assign to read only property` means your function changed its input.
- `inlab/` is for the lab session itself. Leave it until then (`npm run inlab`).

## Done means

`npm test` shows every test passed, and in the browser (`npm run dev`) the matrix
loads from `matrix.json`, a click adds one to that cell only, and the stats follow.
Stretch is a bonus.
