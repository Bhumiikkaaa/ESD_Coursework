// Helpers for the tests. Not a test file itself. You don't need to edit it — but read it
// once: it explains where the tests' "server" comes from.
//
// Every test that needs the API replaces the browser's fetch with a stub:
//
//   const fetch = stubFetch();      // vi.stubGlobal("fetch", …), backed by the mock API
//
// The stub runs the REAL mock API — the same code `npm run dev` serves at /api (mock/api.js),
// fresh from seed.json each time — inside the test, with no network. So the tests talk to
// exactly what your browser talks to: 20 seeded courses, real validation (400 + fieldErrors),
// real 409s, a real admin login.
//
// Because it's a vi.fn(), a test can also:
//   - check what was requested:      requests(fetch)  → ["GET /api/courses", …]
//   - make one call answer differently: fetch.mockResolvedValueOnce(jsonResponse(500, …))
//   - make one call fail with no response: fetch.mockRejectedValueOnce(new TypeError("Failed to fetch"))
//   - hold a response back, to test what the screen shows while waiting: deferred() below.
import { vi } from "vitest";
import { Readable } from "node:stream";
import { createApi } from "../../mock/api.js";

// A fixed secret, so a token the client cached in one test is still valid in the next.
const SECRET = "react-lab2-tests";

export function stubFetch() {
  const api = createApi({ secret: SECRET });
  const fetch = vi.fn((url, init = {}) => callMockApi(api, String(url), init));
  vi.stubGlobal("fetch", fetch); // test/setup.js puts the real fetch back after each test
  return fetch;
}

// Hands one request to the mock API's (req, res) handler, and turns its answer into a
// real Response object — the thing fetch resolves with in the browser.
async function callMockApi(api, url, init) {
  const req = Readable.from(init.body === undefined ? [] : [init.body], { objectMode: false });
  req.url = url;
  req.method = init.method ?? "GET";
  req.headers = Object.fromEntries(Object.entries(init.headers ?? {}).map(([k, v]) => [k.toLowerCase(), v]));
  const answer = await new Promise((resolve) => {
    const res = {
      statusCode: 200,
      headers: {},
      setHeader(name, value) { this.headers[name] = value; },
      end(body) { resolve({ status: this.statusCode, headers: this.headers, body: body ?? null }); },
    };
    api(req, res);
  });
  return new Response(answer.body, { status: answer.status, headers: answer.headers });
}

// "GET /api/courses", "POST /api/courses", … — one string per call the stub received.
export const requests = (fetch) => fetch.mock.calls.map(([url, init = {}]) => `${init.method ?? "GET"} ${url}`);

// A Response with a JSON body, for answering one call by hand.
export const jsonResponse = (status, body) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json" } });

// The contract's ApiError body (openapi.yaml → components.schemas.ApiError).
export const apiErrorBody = (status, message, fieldErrors = null) => ({
  timestamp: "2026-01-15T09:30:00Z",
  status,
  error: { 400: "Bad Request", 409: "Conflict", 500: "Internal Server Error" }[status] ?? "Error",
  message,
  path: "/api/courses",
  fieldErrors,
});

// A promise you settle yourself: const d = deferred(); … d.resolve(value) when YOU decide.
export function deferred() {
  let resolve, reject;
  const promise = new Promise((res, rej) => {
    resolve = res;
    reject = rej;
  });
  return { promise, resolve, reject };
}

// A course as the API returns it, for tests that don't need the server at all.
let nextId = 100;
export const course = (code, title, extra = {}) => ({
  id: nextId++,
  code,
  title,
  description: null,
  department: "Computer Science",
  credits: 4,
  capacity: 30,
  seatsLeft: 30,
  ...extra,
});
