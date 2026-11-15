// The API client is GIVEN (src/api/client.js). These tests pass from the start; they're
// here so you can read what apiFetch promises, and so a broken edit to it is caught.
import { describe, test, expect } from "vitest";
import { apiFetch, ApiError } from "../src/api/client.js";
import { stubFetch, requests } from "./support/fetch.js";

const COMPILERS = { code: "CS350", title: "Compiler Design", department: "Computer Science", credits: 4, capacity: 40 };

describe("apiFetch — given", () => {
  test("a GET resolves with the parsed JSON body", async () => {
    const fetch = stubFetch();
    const courses = await apiFetch("/api/courses");
    expect(courses).toHaveLength(20);
    expect(courses[0]).toMatchObject({ code: "CS101", title: "Programming Fundamentals", seatsLeft: 34 });
    expect(requests(fetch)).toEqual(["GET /api/courses"]);
  });

  test("a POST sends JSON with the admin's token, and resolves with the 201 body", async () => {
    const fetch = stubFetch();
    const created = await apiFetch("/api/courses", { method: "POST", body: COMPILERS });
    expect(created).toMatchObject({ id: 21, ...COMPILERS, description: null, seatsLeft: 40 });
    const [, init] = fetch.mock.calls.find(([url, init]) => url === "/api/courses" && init?.method === "POST");
    expect(init.headers.Authorization).toMatch(/^Bearer \S+$/);
    expect(init.headers["Content-Type"]).toBe("application/json");
    expect(JSON.parse(init.body)).toEqual(COMPILERS);
  });

  test("it logs in once and reuses the token", async () => {
    const fetch = stubFetch();
    await apiFetch("/api/courses", { method: "POST", body: COMPILERS });
    await apiFetch("/api/courses", { method: "POST", body: { ...COMPILERS, code: "CS351" } });
    expect(requests(fetch).filter((r) => r === "POST /api/auth/login").length).toBeLessThanOrEqual(1);
  });

  test("a non-2xx answer throws an ApiError: status, message, fieldErrors", async () => {
    stubFetch();
    const invalid = await apiFetch("/api/courses", { method: "POST", body: { ...COMPILERS, code: "cs350", credits: 9 } }).catch((e) => e);
    expect(invalid).toBeInstanceOf(ApiError);
    expect(invalid).toBeInstanceOf(Error);
    expect(invalid.status).toBe(400);
    expect(invalid.message).toBe("Validation failed");
    expect(Object.keys(invalid.fieldErrors).sort()).toEqual(["code", "credits"]);

    const duplicate = await apiFetch("/api/courses", { method: "POST", body: { ...COMPILERS, code: "CS101" } }).catch((e) => e);
    expect(duplicate).toMatchObject({ status: 409, message: "Course code already exists", fieldErrors: null });
  });

  test("a 204 resolves with null", async () => {
    stubFetch();
    expect(await apiFetch("/api/courses/1", { method: "DELETE" })).toBeNull();
  });

  test("an error that isn't JSON still becomes an ApiError", async () => {
    const fetch = stubFetch();
    fetch.mockResolvedValueOnce(new Response("<!DOCTYPE html><p>Not found</p>", { status: 404 }));
    await expect(apiFetch("/api/nowhere")).rejects.toMatchObject({ status: 404, message: "HTTP 404" });
  });

  test("no response at all is fetch's own error, unchanged", async () => {
    const fetch = stubFetch();
    fetch.mockRejectedValueOnce(new TypeError("Failed to fetch"));
    await expect(apiFetch("/api/courses")).rejects.toThrow(new TypeError("Failed to fetch"));
  });
});
