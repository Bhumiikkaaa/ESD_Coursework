// The API client — GIVEN. Read it; don't edit it.
//
// The one place this app talks to the course API (openapi.yaml). Every other file calls
// apiFetch, so the base URL, JSON, the token and the error shape are handled here, once.
//
//   const courses = await apiFetch("/api/courses");                        // GET
//   const course  = await apiFetch("/api/courses", { method: "POST", body: courseRequest });
//
// - Resolves with the parsed JSON body (null for a 204, which has no body).
// - Any non-2xx status throws an ApiError built from the contract's error body:
//   error.status (409), error.message ("Course code already exists"), and
//   error.fieldErrors ({ code: "must be …" } for a 400 validation error, otherwise null).
// - No response at all (server down, wrong port) is fetch's own TypeError
//   ("Failed to fetch"); it is not caught here, so it reaches you unchanged.

// "" means "the same origin as the app": npm run dev serves the mock API at /api.
const BASE = import.meta.env.VITE_API_URL ?? "";

export class ApiError extends Error {
  constructor(status, message, fieldErrors = null) {
    super(message);
    this.name = "ApiError";
    this.status = status;           // the HTTP status, e.g. 400, 401, 403, 409
    this.fieldErrors = fieldErrors; // { field: "reason" } for a 400 validation error, else null
  }
}

export async function apiFetch(path, { method = "GET", body } = {}) {
  const headers = {};
  if (body !== undefined) headers["Content-Type"] = "application/json";
  if (method !== "GET") headers.Authorization = `Bearer ${await adminToken()}`;

  const res = await fetch(`${BASE}${path}`, {
    method,
    headers,
    body: body === undefined ? undefined : JSON.stringify(body),
  });
  if (!res.ok) {
    if (res.status === 401) token = null; // a stale token (the server restarted): log in again next time
    throw await toApiError(res);
  }
  return res.status === 204 ? null : res.json();
}

// Every error response has the same shape (ApiError in openapi.yaml). If the body isn't
// JSON — an HTML error page from a wrong URL, say — fall back to "HTTP 404".
async function toApiError(res) {
  let data = null;
  try {
    data = await res.json();
  } catch {
    // not JSON; keep data = null
  }
  return new ApiError(res.status, data?.message ?? `HTTP ${res.status}`, data?.fieldErrors ?? null);
}

// ---- A stand-in until React Lab 3 builds real login -----------------------------------
// Creating a course needs an ADMIN token (POST /api/courses is ADMIN-only in the contract),
// and logging in is React Lab 3's job. Until then this client logs in as the seeded admin
// the first time it needs a token, keeps the token in this module variable, and sends it
// on every request that isn't a GET. Real apps never hard-code a password like this.
const ADMIN = { email: "admin@esd.local", password: "admin12345" };
let token = null;

async function adminToken() {
  if (token) return token;
  const res = await fetch(`${BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(ADMIN),
  });
  if (!res.ok) throw await toApiError(res);
  token = (await res.json()).accessToken;
  return token;
}
