// Stretch (pre-lab section 06) — src/search/useDebounced.js, and using it in CourseSearch.
import { describe, test, expect, vi, afterEach } from "vitest";
import { renderHook, render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useDebounced } from "../../src/search/useDebounced.js";
import { CourseSearch } from "../../src/search/CourseSearch.jsx";
import { stubFetch, requests } from "../support/fetch.js";

afterEach(() => vi.useRealTimers());

describe("useDebounced(value, ms)", () => {
  test("returns the first value straight away", () => {
    const { result } = renderHook(() => useDebounced("a", 250));
    expect(result.current).toBe("a");
  });

  test("changes only once the value has been still for ms milliseconds", () => {
    vi.useFakeTimers();
    const { result, rerender } = renderHook(({ value }) => useDebounced(value, 250), { initialProps: { value: "l" } });
    rerender({ value: "le" });
    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe("l"); // still typing
    rerender({ value: "lea" }); // the clock starts again
    act(() => vi.advanceTimersByTime(200));
    expect(result.current).toBe("l");
    act(() => vi.advanceTimersByTime(50)); // 250 ms since the last change
    expect(result.current).toBe("lea");
  });

  test("cancels its timer when the component goes away", () => {
    vi.useFakeTimers();
    const { rerender, unmount } = renderHook(({ value }) => useDebounced(value, 250), { initialProps: { value: "a" } });
    rerender({ value: "ab" });
    unmount();
    expect(vi.getTimerCount()).toBe(0);
  });
});

describe("CourseSearch, debounced", () => {
  test("typing a word quickly sends one request, for the whole word", async () => {
    const fetch = stubFetch();
    const user = userEvent.setup({ delay: null }); // type as fast as possible
    render(<CourseSearch />);
    await user.type(screen.getByLabelText("Search courses"), "learn");
    expect(await screen.findByText("DS220 · Machine Learning")).toBeInTheDocument();
    expect(requests(fetch)).toEqual(["GET /api/courses?q=learn"]);
  });
});
