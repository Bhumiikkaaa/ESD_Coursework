# ESD — JS Lab 1: Fundamentals of JS for React

Pre-lab exercises for JS Lab 1. The full walkthrough is the lab doc:
**https://esd-ta-sessions.vercel.app/js-react.html** — read it alongside this folder.



## Setup (once)

```bash
cd esd-labs/js-lab1
node -v          # must print v20 or newer
npm test         # runs every test; at first almost all fail with "TODO"
```

There is nothing to `npm install`. The tests use Node's built-in test runner.

## Core and stretch

**Core** is mandatory: it's what we go through in the lab, and `npm test` checks it.
**Stretch** is extra: `npm run test:stretch` checks it. Ask about either, any time.

```bash
npm test               # core tests — get these to "fail 0"
npm run test:stretch   # stretch tests
npm run test:all       # both
```

## Work section by section (all core unless marked)

| Doc section | File you edit | Run just its tests |
| --- | --- | --- |
| 03 Expressions | `src/s03-expressions.js` | `node --test test/s03.test.js` |
| 04 Functions are values | `src/s04-functions.js` | `node --test test/s04.test.js` |
| 05 Higher-order functions | `src/s05-higher-order.js` | `node --test test/s05.test.js` |
| 06 Closures | `src/s06-closures.js` | `node --test test/s06.test.js` |
| 07 `this` | `src/s07-this.js` | `node --test test/s07.test.js` |
| 08 Destructuring | `src/s08-destructuring.js` | `node --test test/s08.test.js` |
| 10 Immutable updates | `src/s10-immutable.js` | `node --test test/s10.test.js` |
| 11 Array toolkit | `src/s11-catalog.js` | `node --test test/s11.test.js` |
| 11 — stretch: `sortedBy`, `plannerCourses`, `plannerCredits`, `canAdd` | `src/s11-catalog.js` | `node --test test/stretch/s11.stretch.test.js` |
| 13 Forms (pure part) | `src/s13-forms.js` | `node --test test/s13.test.js` |
| 12–13 The DOM | `web/form.js` | `npm run web` → open http://localhost:5500/web/ |
| 15 Build your own useState | `src/s15-state.js` | `node --test test/s15.test.js` |
| 15 A smarter `setState` | `src/s15-state.js` | `node --test test/s15-smarter.test.js` |
| 15 The counter, four stages | `web/counter.js` | `npm run web` → open http://localhost:5500/web/counter.html |

Try any snippet from the doc in a console with the data and all your functions loaded:

```bash
npm run repl
```

Predict-then-run sheets (write your prediction first, then run):

```bash
node predict/closures.js
node predict/this.js
node predict/references.js     # stretch (section 09)
node predict/modules/main.js   # stretch (section 14)
```

## Rules

- **Don't change the tests.** Fix your code until they pass.
- The tests **freeze** their inputs. If you see
  `TypeError: Cannot assign to read only property` or `Cannot add property`,
  your function changed its input. Return a new value instead.
- `inlab/` is for the lab session itself. Leave it until then.

## Done means

`npm test` ends with `fail 0`, the form page and the counter page work, and
you've written a prediction for every block in the core predict sheets
(`closures.js`, `this.js`). Stretch is a bonus.
