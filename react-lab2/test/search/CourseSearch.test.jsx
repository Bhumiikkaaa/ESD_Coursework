// Pre-lab section 06 — src/search/CourseSearch.jsx (uses your SearchResults and useCourseSearch)
import { describe, test, expect } from "vitest";
import { render, screen, act } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CourseSearch } from "../../src/search/CourseSearch.jsx";
import { stubFetch } from "../support/fetch.js";

describe("CourseSearch — a controlled search box", () => {
  test('a heading "Search the catalogue" and a box labelled "Search courses"', () => {
    stubFetch();
    render(<CourseSearch />);
    expect(screen.getByRole("heading", { name: "Search the catalogue" })).toBeInTheDocument();
    expect(screen.getByLabelText("Search courses")).toBeInTheDocument();
  });

  test("the box shows what you type", async () => {
    stubFetch();
    const user = userEvent.setup();
    render(<CourseSearch />);
    const box = screen.getByLabelText("Search courses");
    await user.type(box, "learn");
    expect(box).toHaveValue("learn");
  });

  test("nothing typed: no request, no results", async () => {
    const fetch = stubFetch();
    render(<CourseSearch />);
    await act(() => new Promise((resolve) => setTimeout(resolve, 0)));
    expect(fetch).not.toHaveBeenCalled();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  test("typing a query shows the matching courses from the API", async () => {
    stubFetch();
    const user = userEvent.setup();
    render(<CourseSearch />);
    await user.type(screen.getByLabelText("Search courses"), "learn");
    expect(await screen.findByText("DS220 · Machine Learning")).toBeInTheDocument();
    expect(screen.getByText("DS330 · Deep Learning")).toBeInTheDocument();
    expect(screen.getAllByRole("listitem")).toHaveLength(2);
  });

  test("a query nothing matches says No courses match.", async () => {
    stubFetch();
    const user = userEvent.setup();
    render(<CourseSearch />);
    await user.type(screen.getByLabelText("Search courses"), "zzz");
    expect(await screen.findByText("No courses match.")).toBeInTheDocument();
  });
});
