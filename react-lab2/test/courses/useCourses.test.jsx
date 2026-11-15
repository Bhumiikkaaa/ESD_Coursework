// Lab day — src/courses/useCourses.js (CONTRACT.md §4): the hook, tested on its own.
//
// renderHook runs the hook inside a tiny test component; result.current is what it returned
// on the latest render. The "server" is the real mock API (test/support/fetch.js).
import { describe, test, expect } from "vitest";
import { StrictMode } from "react";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useCourses } from "../../src/courses/useCourses.js";
import { ApiError } from "../../src/api/client.js";
import { stubFetch, requests, deferred, jsonResponse, apiErrorBody, course } from "../support/fetch.js";

const COMPILERS = { code: "CS350", title: "Compiler Design", department: "Computer Science", credits: 4, capacity: 40, description: null };
const codes = (result) => result.current.courses.map((c) => c.code);
const settle = () => act(() => new Promise((resolve) => setTimeout(resolve, 0)));

async function loaded() {
  const hook = renderHook(() => useCourses());
  await waitFor(() => expect(hook.result.current.status).toBe("ready"));
  return hook;
}

describe("useCourses() — loading the list", () => {
  test('starts "loading", then "ready" with the 20 courses from GET /api/courses', async () => {
    const fetch = stubFetch();
    const { result } = renderHook(() => useCourses());
    expect(result.current.status).toBe("loading");
    expect(result.current.courses).toEqual([]);
    expect(result.current.error).toBeNull();
    expect(typeof result.current.addCourse).toBe("function");

    await waitFor(() => expect(result.current.status).toBe("ready"));
    expect(result.current.courses).toHaveLength(20);
    expect(codes(result)[0]).toBe("CS101");
    expect(result.current.error).toBeNull();
    expect(requests(fetch)).toEqual(["GET /api/courses"]);
  });

  test("loads once — re-rendering doesn't fetch again (the dependency array)", async () => {
    const fetch = stubFetch();
    const { rerender } = await loaded();
    rerender();
    rerender();
    await settle();
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test('an HTTP error: status "error", and error is the message', async () => {
    const fetch = stubFetch();
    fetch.mockResolvedValueOnce(jsonResponse(500, apiErrorBody(500, "Unexpected server error")));
    const { result } = renderHook(() => useCourses());
    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.error).toBe("Unexpected server error");
    expect(result.current.courses).toEqual([]);
  });

  test('no response at all: status "error" with fetch\'s message', async () => {
    const fetch = stubFetch();
    fetch.mockRejectedValueOnce(new TypeError("Failed to fetch"));
    const { result } = renderHook(() => useCourses());
    await waitFor(() => expect(result.current.status).toBe("error"));
    expect(result.current.error).toBe("Failed to fetch");
  });

  test("StrictMode runs the effect twice: only the second run's answer counts (cleanup)", async () => {
    const fetch = stubFetch();
    const first = deferred();
    const second = deferred();
    fetch.mockReturnValueOnce(first.promise).mockReturnValueOnce(second.promise);
    const { result } = renderHook(() => useCourses(), { wrapper: StrictMode });
    expect(fetch).toHaveBeenCalledTimes(2);

    second.resolve(jsonResponse(200, [course("MA101", "Linear Algebra")]));
    await waitFor(() => expect(result.current.status).toBe("ready"));
    first.resolve(jsonResponse(200, [course("XX999", "Stale answer")]));
    await settle();
    expect(codes(result)).toEqual(["MA101"]);
  });
});

describe("useCourses() — addCourse(courseRequest)", () => {
  test("POSTs it, resolves with the created course, and inserts it in code order", async () => {
    stubFetch();
    const { result } = await loaded();

    let created;
    await act(async () => {
      created = await result.current.addCourse(COMPILERS);
    });

    expect(created).toMatchObject({ id: 21, code: "CS350", title: "Compiler Design", seatsLeft: 40 });
    expect(result.current.courses).toHaveLength(21);
    expect(codes(result).slice(0, 5)).toEqual(["CS101", "CS201", "CS305", "CS350", "CS402"]);
    expect(result.current.courses).toContainEqual(created);
  });

  test("a new array, never a changed one (immutable update)", async () => {
    stubFetch();
    const { result } = await loaded();
    const before = result.current.courses;
    await act(() => result.current.addCourse(COMPILERS));
    expect(result.current.courses).not.toBe(before);
    expect(before).toHaveLength(20);
  });

  test("it uses the 201 body — it does NOT reload the whole list", async () => {
    const fetch = stubFetch();
    const { result } = await loaded();
    await act(() => result.current.addCourse(COMPILERS));
    const sent = requests(fetch);
    expect(sent).toContain("POST /api/courses");
    expect(sent.filter((r) => r === "GET /api/courses")).toHaveLength(1);
  });

  test("a 409 rejects with the ApiError, and the list stays as it was", async () => {
    stubFetch();
    const { result } = await loaded();
    let thrown;
    await act(async () => {
      thrown = await result.current.addCourse({ ...COMPILERS, code: "CS101" }).catch((e) => e);
    });
    expect(thrown).toBeInstanceOf(ApiError);
    expect(thrown).toMatchObject({ status: 409, message: "Course code already exists" });
    expect(result.current.courses).toHaveLength(20);
    expect(result.current.status).toBe("ready");
  });

  test("a 400 rejects with the ApiError, fieldErrors included", async () => {
    stubFetch();
    const { result } = await loaded();
    let thrown;
    await act(async () => {
      thrown = await result.current.addCourse({ ...COMPILERS, code: "cs350", credits: 9 }).catch((e) => e);
    });
    expect(thrown).toBeInstanceOf(ApiError);
    expect(thrown.status).toBe(400);
    expect(Object.keys(thrown.fieldErrors).sort()).toEqual(["code", "credits"]);
    expect(result.current.courses).toHaveLength(20);
  });
});
