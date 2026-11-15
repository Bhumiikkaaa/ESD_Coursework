// The mock course API — an in-memory implementation of the ESD course contract
// (openapi.yaml). It passes the same conformance suite your own backend must pass.
//
// You don't edit this folder. It exists so the React labs work before your own
// Spring Boot backend is ready. `npm run dev` serves it at /api on the same origin
// as the app, so there is no CORS to configure. Every restart starts fresh from seed.json.
//
// Mock-only extras, for practising with a bad network (not part of the contract):
//   ?delay=800  or  ?delay=random   answer slowly (random = 100–1500 ms)
//   ?fail=1                         answer 500
//   MOCK_DELAY=random npm run dev   slow down every request
import { createHash, randomUUID } from "node:crypto";
import { signJwt, verifyJwt, randomSecret } from "./jwt.js";
import { verifyGoogleIdToken } from "./google.js";
import SEED from "./seed.json" with { type: "json" };
const TOKEN_SECONDS = 3600;
const CREDIT_LIMIT = 24;
const REASONS = { 400: "Bad Request", 401: "Unauthorized", 403: "Forbidden", 404: "Not Found", 405: "Method Not Allowed", 409: "Conflict", 500: "Internal Server Error" };
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const CODE = /^[A-Z]{2,4}[0-9]{3}$/;
const MAX_ID = 9223372036854775807n;

class HttpError extends Error {
  constructor(status, message, fieldErrors = null, headers = {}) {
    super(message);
    this.status = status;
    this.fieldErrors = fieldErrors;
    this.headers = headers;
  }
}
const hash = (password) => createHash("sha256").update(password).digest("hex");
const isInt = (v) => typeof v === "number" && Number.isInteger(v);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

export function createApi({ secret = process.env.MOCK_JWT_SECRET || randomSecret(), googleClientId = process.env.GOOGLE_CLIENT_ID } = {}) {
  let db;
  const reset = () => {
    const now = new Date().toISOString();
    db = { users: [], courses: [], enrollments: [], denied: new Set(), nextId: { user: 1, course: 1, enrollment: 1 } };
    for (const u of SEED.users) db.users.push({ id: db.nextId.user++, email: u.email, passwordHash: hash(u.password), fullName: u.fullName, role: u.role, createdAt: now });
    for (const c of SEED.courses) db.courses.push({ id: db.nextId.course++, ...c, description: c.description ?? null });
    for (const e of SEED.enrollments) {
      const user = db.users.find((u) => u.email === e.userEmail);
      const course = db.courses.find((c) => c.code === e.courseCode);
      db.enrollments.push({ id: db.nextId.enrollment++, userId: user.id, courseId: course.id, enrolledAt: now });
    }
  };
  reset();

  // ---- views -------------------------------------------------------------
  const enrolledCount = (courseId) => db.enrollments.filter((e) => e.courseId === courseId).length;
  const courseView = (c) => ({ id: c.id, code: c.code, title: c.title, description: c.description, department: c.department, credits: c.credits, capacity: c.capacity, seatsLeft: Math.max(0, c.capacity - enrolledCount(c.id)) });
  const userView = (u) => ({ id: u.id, email: u.email, fullName: u.fullName, role: u.role, createdAt: u.createdAt });
  const enrollmentView = (e) => ({ id: e.id, course: courseView(db.courses.find((c) => c.id === e.courseId)), enrolledAt: e.enrolledAt });
  const byCode = (a, b) => (a.code < b.code ? -1 : a.code > b.code ? 1 : 0);

  // ---- helpers -----------------------------------------------------------
  const issueToken = (user) => {
    const iat = Math.floor(Date.now() / 1000);
    const accessToken = signJwt({ sub: user.email, role: user.role, jti: randomUUID(), iat, exp: iat + TOKEN_SECONDS }, secret);
    return { accessToken, tokenType: "Bearer", expiresIn: TOKEN_SECONDS };
  };
  const authenticate = (req) => {
    const header = req.headers.authorization || "";
    const match = header.match(/^Bearer ([^\s]+)$/);
    const claims = match && verifyJwt(match[1], secret);
    if (!claims || db.denied.has(claims.jti)) throw new HttpError(401, "Authentication required");
    const user = db.users.find((u) => u.email === claims.sub);
    if (!user) throw new HttpError(401, "Authentication required");
    return { user, claims };
  };
  const requireAdmin = (user) => {
    if (user.role !== "ADMIN") throw new HttpError(403, "Access denied");
  };
  // A path id is any positive 64-bit integer (1 … 9223372036854775807). Ids that size never
  // exist here, so they're 404; zero, negatives, bigger numbers and non-numbers are 400.
  const pathId = (raw) => {
    if (!/^[0-9]{1,19}$/.test(raw) || BigInt(raw) < 1n || BigInt(raw) > MAX_ID) throw new HttpError(400, `Invalid id: ${raw}`);
    return Number(raw);
  };
  const validate = (errors) => {
    if (Object.keys(errors).length > 0) throw new HttpError(400, "Validation failed", errors);
  };
  const requireObject = (body) => {
    if (body === undefined) throw new HttpError(400, "Request body is missing");
    if (body === null || typeof body !== "object" || Array.isArray(body)) throw new HttpError(400, "Request body must be a JSON object");
    return body;
  };
  const str = (v) => (typeof v === "string" ? v : undefined);
  // Lengths in code points, as JSON Schema's minLength/maxLength count them ("😀" is 1, not 2).
  const len = (s) => [...s].length;
  // "Blank" and "trim" as Java's String.trim() and Spring's @NotBlank mean them: only the
  // characters U+0000–U+0020 count as space, so the mock and a Spring backend agree.
  const trim = (s) => s.replace(/^[\u0000-\u0020]+|[\u0000-\u0020]+$/g, "");
  const blank = (s) => trim(s) === "";

  function validateCourse(body) {
    const e = {};
    const code = str(body.code), title = str(body.title), department = str(body.department);
    if (code === undefined || !CODE.test(code)) e.code = "must be 2–4 uppercase letters followed by 3 digits";
    if (title === undefined || blank(title) || len(title) > 150) e.title = "must be 1–150 characters";
    if (body.description !== undefined && body.description !== null && (typeof body.description !== "string" || len(body.description) > 1000)) e.description = "must be at most 1000 characters";
    if (department === undefined || blank(department) || len(department) > 60) e.department = "must be 1–60 characters";
    if (!isInt(body.credits) || body.credits < 1 || body.credits > 6) e.credits = "must be a whole number from 1 to 6";
    if (!isInt(body.capacity) || body.capacity < 1 || body.capacity > 500) e.capacity = "must be a whole number from 1 to 500";
    validate(e);
    return { code, title: trim(title), description: body.description ?? null, department: trim(department), credits: body.credits, capacity: body.capacity };
  }
  const codeTaken = (code, exceptId) => db.courses.some((c) => c.id !== exceptId && c.code.toLowerCase() === code.toLowerCase());
  const findCourse = (id) => {
    const course = db.courses.find((c) => c.id === id);
    if (!course) throw new HttpError(404, `No course with id ${id}`);
    return course;
  };

  // ---- routes ------------------------------------------------------------
  // Each: [method, pattern, handler(ctx) → [status, body]].  ctx = { req, params, query, body }.
  // Protected routes read ctx.body only AFTER authenticate(), so a bad body without a
  // token is 401, not 400 (the contract says so).
  const routes = [
    ["POST", "/api/auth/signup", ({ body }) => {
      requireObject(body);
      const e = {};
      const email = str(body.email) === undefined ? undefined : trim(body.email).toLowerCase();
      if (!email || !EMAIL.test(email) || len(email) > 255) e.email = "must be a well-formed email address";
      if (str(body.password) === undefined || len(body.password) < 8 || len(body.password) > 64) e.password = "size must be between 8 and 64";
      if (str(body.fullName) === undefined || blank(body.fullName) || len(body.fullName) > 100) e.fullName = "must be 1–100 characters";
      validate(e);
      if (db.users.some((u) => u.email === email)) throw new HttpError(409, "Email already registered");
      const user = { id: db.nextId.user++, email, passwordHash: hash(body.password), fullName: trim(body.fullName), role: "STUDENT", createdAt: new Date().toISOString() };
      db.users.push(user);
      return [201, userView(user)];
    }],
    ["POST", "/api/auth/login", ({ body }) => {
      requireObject(body);
      const e = {};
      const email = str(body.email) === undefined ? undefined : trim(body.email).toLowerCase();
      if (!email || !EMAIL.test(email)) e.email = "must be a well-formed email address";
      if (str(body.password) === undefined || body.password.length < 1) e.password = "must not be blank";
      validate(e);
      const user = db.users.find((u) => u.email === email);
      if (!user || !user.passwordHash || user.passwordHash !== hash(body.password)) throw new HttpError(401, "Invalid email or password");
      return [200, issueToken(user)];
    }],
    ["POST", "/api/auth/google", async ({ body }) => {
      requireObject(body);
      if (str(body.idToken) === undefined || blank(body.idToken)) validate({ idToken: "must not be blank" });
      if (!googleClientId) throw new HttpError(401, "Google sign-in is not configured on this server (set GOOGLE_CLIENT_ID)");
      const claims = await verifyGoogleIdToken(body.idToken, googleClientId);
      if (!claims) throw new HttpError(401, "Invalid Google token");
      const email = claims.email.toLowerCase();
      let user = db.users.find((u) => u.email === email);
      if (!user) {
        user = { id: db.nextId.user++, email, passwordHash: null, fullName: claims.name || email, role: "STUDENT", createdAt: new Date().toISOString() };
        db.users.push(user);
      }
      return [200, issueToken(user)];
    }],
    ["POST", "/api/auth/logout", ({ req }) => {
      const { claims } = authenticate(req);
      db.denied.add(claims.jti);
      return [204, null];
    }],
    ["GET", "/api/users/me", ({ req }) => [200, userView(authenticate(req).user)]],
    ["GET", "/api/users/me/enrollments", ({ req }) => {
      const { user } = authenticate(req);
      const mine = db.enrollments.filter((e) => e.userId === user.id)
        .sort((a, b) => (a.enrolledAt < b.enrolledAt ? -1 : a.enrolledAt > b.enrolledAt ? 1 : a.id - b.id));
      return [200, mine.map(enrollmentView)];
    }],
    ["GET", "/api/courses", ({ query }) => {
      const department = query.get("department")?.trim().toLowerCase();
      const q = query.get("q")?.trim().toLowerCase();
      const list = db.courses
        .filter((c) => !department || c.department.toLowerCase() === department)
        .filter((c) => !q || [c.code, c.title].some((text) => text.toLowerCase().includes(q)))
        .map(courseView)
        .sort(byCode);
      return [200, list];
    }],
    ["POST", "/api/courses", (ctx) => {
      requireAdmin(authenticate(ctx.req).user);
      const data = validateCourse(requireObject(ctx.body));
      if (codeTaken(data.code)) throw new HttpError(409, "Course code already exists");
      const course = { id: db.nextId.course++, ...data };
      db.courses.push(course);
      return [201, courseView(course)];
    }],
    ["GET", "/api/courses/:id", ({ params }) => [200, courseView(findCourse(pathId(params.id)))]],
    ["PUT", "/api/courses/:id", (ctx) => {
      requireAdmin(authenticate(ctx.req).user);
      const id = pathId(ctx.params.id);
      const data = validateCourse(requireObject(ctx.body));
      const course = findCourse(id);
      if (codeTaken(data.code, id)) throw new HttpError(409, "Course code already exists");
      if (data.capacity < enrolledCount(id)) throw new HttpError(409, "Capacity is below current enrollments");
      Object.assign(course, data);
      return [200, courseView(course)];
    }],
    ["DELETE", "/api/courses/:id", ({ req, params }) => {
      requireAdmin(authenticate(req).user);
      const course = findCourse(pathId(params.id));
      db.enrollments = db.enrollments.filter((e) => e.courseId !== course.id);
      db.courses = db.courses.filter((c) => c.id !== course.id);
      return [204, null];
    }],
    ["POST", "/api/enrollments", (ctx) => {
      const { user } = authenticate(ctx.req);
      const body = requireObject(ctx.body);
      if (!isInt(body.courseId) || body.courseId < 1) validate({ courseId: "must be a positive whole number" });
      const course = findCourse(body.courseId);
      const mine = db.enrollments.filter((e) => e.userId === user.id);
      if (mine.some((e) => e.courseId === course.id)) throw new HttpError(409, "Already enrolled in this course");
      if (enrolledCount(course.id) >= course.capacity) throw new HttpError(409, "Course is full");
      const credits = mine.reduce((sum, e) => sum + db.courses.find((c) => c.id === e.courseId).credits, 0);
      if (credits + course.credits > CREDIT_LIMIT) throw new HttpError(409, `Credit limit of ${CREDIT_LIMIT} exceeded`);
      const enrollment = { id: db.nextId.enrollment++, userId: user.id, courseId: course.id, enrolledAt: new Date().toISOString() };
      db.enrollments.push(enrollment);
      return [201, enrollmentView(enrollment)];
    }],
    ["DELETE", "/api/enrollments/:id", ({ req, params }) => {
      const { user } = authenticate(req);
      const id = pathId(params.id);
      const enrollment = db.enrollments.find((e) => e.id === id);
      if (!enrollment) throw new HttpError(404, `No enrollment with id ${id}`);
      if (enrollment.userId !== user.id) throw new HttpError(403, "Access denied");
      db.enrollments = db.enrollments.filter((e) => e.id !== id);
      return [204, null];
    }],
  ];

  const compiled = routes.map(([method, pattern, handler]) => {
    const names = [];
    const regex = new RegExp("^" + pattern.replace(/:(\w+)/g, (_, n) => (names.push(n), "([^/]+)")) + "/?$");
    return { method, regex, names, handler };
  });

  function send(res, status, body, headers = {}) {
    res.statusCode = status;
    for (const [name, value] of Object.entries(headers)) res.setHeader(name, value);
    res.setHeader("Cache-Control", "no-store");
    if (body === null) return res.end();
    res.setHeader("Content-Type", "application/json; charset=utf-8");
    res.end(JSON.stringify(body));
  }
  const apiError = (status, message, path, fieldErrors = null) =>
    ({ timestamp: new Date().toISOString(), status, error: REASONS[status], message, path, fieldErrors });

  function readBody(req) {
    return new Promise((resolve, reject) => {
      let raw = "";
      req.setEncoding("utf8");
      req.on("data", (chunk) => (raw += chunk));
      req.on("end", () => resolve(raw));
      req.on("error", reject);
    });
  }

  // The request handler: (req, res) → handles anything under /api.
  async function handle(req, res) {
    const url = new URL(req.url, "http://localhost");
    let path = url.pathname;
    try {
      try { path = decodeURIComponent(url.pathname); } catch { throw new HttpError(400, "Malformed URL encoding"); }
      const wanted = url.searchParams.get("delay") ?? process.env.MOCK_DELAY;
      if (wanted) await sleep(wanted === "random" ? 100 + Math.random() * 1400 : Math.min(Number(wanted) || 0, 10000));
      if (url.searchParams.get("fail") === "1") throw new HttpError(500, "The mock API was told to fail (fail=1)");

      const onPath = compiled.filter((r) => r.regex.test(path));
      if (onPath.length === 0) throw new HttpError(404, `No such endpoint: ${path}`);
      const route = onPath.find((r) => r.method === req.method);
      if (!route) {
        const allow = [...new Set(onPath.map((r) => r.method))].join(", ");
        throw new HttpError(405, `${req.method} is not supported on ${path}`, null, { Allow: allow });
      }

      const values = path.match(route.regex).slice(1);
      const params = Object.fromEntries(route.names.map((n, i) => [n, values[i]]));
      let body;
      if (req.method === "POST" || req.method === "PUT") {
        const raw = await readBody(req);
        if (raw.trim() !== "") {
          try { body = JSON.parse(raw); } catch { body = Symbol.for("malformed"); }
        }
      }
      // Authentication is checked before the body, so parse errors surface only after it.
      const ctx = { req, params, query: url.searchParams };
      Object.defineProperty(ctx, "body", {
        get() {
          if (body === Symbol.for("malformed")) throw new HttpError(400, "Malformed JSON request");
          return body;
        },
      });
      const [status, payload] = await route.handler(ctx);
      send(res, status, payload);
    } catch (error) {
      if (error instanceof HttpError) return send(res, error.status, apiError(error.status, error.message, path, error.fieldErrors), error.headers);
      console.error("[mock api]", error);
      send(res, 500, apiError(500, "Unexpected server error", path));
    }
  }
  handle.reset = reset;
  return handle;
}
