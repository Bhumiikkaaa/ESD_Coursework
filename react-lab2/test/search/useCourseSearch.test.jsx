// Pre-lab section 05 — src/search/useCourseSearch.js
//
// renderHook(() => useCourseSearch("data")) runs the hook inside a tiny test component;
// result.current is what the hook returned on the latest render. rerender({ q }) renders
// again with a new query — exactly what typing in the search box does.
import { describe, test, expect } from "vitest";
import { renderHook, waitFor, act } from "@testing-library/react";
import { useCourseSearch } from "../../src/search/useCourseSearch.js";
import { stubFetch, requests, deferred, jsonResponse, apiErrorBody, course } from "../support/fetch.js";

const search = (initialQuery) =>
  renderHook(({ q }) => useCourseSearch(q), { initialProps: { q: initialQuery } });
const codes = (result) => result.current.results.map((c) => c.code);
// let every pending promise (and the re-render it causes) finish
const settle = () => act(() => new Promise((resolve) => setTimeout(resolve, 0)));

describe("useCourseSearch(query) — an effect that fetches", () => {
  test('a blank query is "idle" and sends no request', async () => {
    const fetch = stubFetch();
    const { result } = search("   ");
    await settle();
    expect(result.current).toEqual({ results: [], status: "idle" });
    expect(fetch).not.toHaveBeenCalled();
  });

  test('searches GET /api/courses?q=…: "loading", then "ready" with the results', async () => {
    const fetch = stubFetch();
    const { result } = search("data");
    expect(result.current.status).toBe("loading");
    await waitFor(() => expect(result.current.status).toBe("ready"));
    expect(codes(result)).toEqual(["CS201", "CS305", "DS101"]);
    expect(requests(fetch)).toEqual(["GET /api/courses?q=data"]);
  });

  test("trims the query and encodes it (URLSearchParams), so & can't break the URL", async () => {
    const fetch = stubFetch();
    search("  R&D lab ");
    await waitFor(() => expect(fetch).toHaveBeenCalled());
    const url = new URL(fetch.mock.calls[0][0], "http://localhost");
    expect(url.pathname).toBe("/api/courses");
    expect(url.searchParams.get("q")).toBe("R&D lab");
    expect([...url.searchParams.keys()]).toEqual(["q"]);
  });

  test("searches again when the query changes — and only then (the dependency array)", async () => {
    const fetch = stubFetch();
    const { result, rerender } = search("data");
    await waitFor(() => expect(result.current.status).toBe("ready"));

    rerender({ q: "data" }); // same query
    rerender({ q: " data " }); // same once trimmed
    await settle();
    expect(fetch).toHaveBeenCalledTimes(1);

    rerender({ q: "learn" });
    await waitFor(() => expect(codes(result)).toEqual(["DS220", "DS330"]));
    expect(fetch).toHaveBeenCalledTimes(2);
  });

  test("going back to a blank query is \"idle\" again, with no request", async () => {
    const fetch = stubFetch();
    const { result, rerender } = search("data");
    await waitFor(() => expect(result.current.status).toBe("ready"));
    rerender({ q: "" });
    await settle();
    expect(result.current).toEqual({ results: [], status: "idle" });
    expect(fetch).toHaveBeenCalledTimes(1);
  });

  test("only the latest query's answer reaches the screen (the ignore flag)", async () => {
    const fetch = stubFetch();
    const slow = deferred();
    const fast = deferred();
    fetch.mockReturnValueOnce(slow.promise).mockReturnValueOnce(fast.promise);

    const { result, rerender } = search("data"); // request 1: will answer LAST
    rerender({ q: "learn" }); // request 2: will answer first

    fast.resolve(jsonResponse(200, [course("DS220", "Machine Learning")]));
    await waitFor(() => expect(result.current.status).toBe("ready"));
    slow.resolve(jsonResponse(200, [course("CS201", "Data Structures")]));
    await settle();

    expect(codes(result)).toEqual(["DS220"]); // "learn" was asked for last, so "learn" wins
    expect(result.current.status).toBe("ready");
  });

  test('a request that fails is "error"', async () => {
    const fetch = stubFetch();
    fetch.mockRejectedValueOnce(new TypeError("Failed to fetch"));
    const { result } = search("data");
    await waitFor(() => expect(result.current.status).toBe("error"));
  });

  test('an HTTP error (500) is "error" too', async () => {
    const fetch = stubFetch();
    fetch.mockResolvedValueOnce(jsonResponse(500, apiErrorBody(500, "Unexpected server error")));
    const { result } = search("data");
    await waitFor(() => expect(result.current.status).toBe("error"));
  });
});
