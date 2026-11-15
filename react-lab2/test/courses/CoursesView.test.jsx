// Lab day — src/courses/CoursesView.jsx (CONTRACT.md §4): the View, rendered from props alone.
import { describe, test, expect, vi, beforeAll, afterAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { CoursesView } from "../../src/courses/CoursesView.jsx";
import { course } from "../support/fetch.js";

// React warns about a missing key once per component, the first time it happens in this
// file — so every console.error in the file is recorded, not just one test's.
const consoleErrors = [];
const realConsoleError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    consoleErrors.push(args.join(" "));
    realConsoleError(...args);
  };
});
afterAll(() => {
  console.error = realConsoleError;
});

const CS101 = course("CS101", "Programming Fundamentals", { credits: 4, department: "Computer Science", seatsLeft: 34 });
const CS201 = course("CS201", "Data Structures", { credits: 4, department: "Computer Science", seatsLeft: 0 });
const DS101 = course("DS101", "Introduction to Data Science", { credits: 3, department: "Data Science & AI", seatsLeft: 6 });

describe("CoursesView({ courses, status, error }) — the View", () => {
  test('"loading" says Loading courses…', () => {
    render(<CoursesView courses={[]} status="loading" error={null} />);
    expect(screen.getByText(/^loading courses/i)).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  test('"error" says Couldn\'t load courses: and the message', () => {
    render(<CoursesView courses={[]} status="error" error="Unexpected server error" />);
    expect(screen.getByText(/^couldn.t load courses: unexpected server error$/i)).toBeInTheDocument();
  });

  test('"ready" with no courses says No courses yet.', () => {
    render(<CoursesView courses={[]} status="ready" error={null} />);
    expect(screen.getByText("No courses yet.")).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  test('one list item per course: "CODE · Title" and "N credits · Department · N seats left"', () => {
    render(<CoursesView courses={[CS101, DS101]} status="ready" error={null} />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("CS101 · Programming Fundamentals");
    expect(items[0]).toHaveTextContent("4 credits · Computer Science · 34 seats left");
    expect(items[1]).toHaveTextContent("DS101 · Introduction to Data Science");
    expect(items[1]).toHaveTextContent("3 credits · Data Science & AI · 6 seats left");
  });

  test('no seats left says "Full"; one says "1 seat left"', () => {
    const CS501 = course("CS501", "Distributed Systems", { credits: 4, department: "Computer Science", seatsLeft: 1 });
    render(<CoursesView courses={[CS201, CS501]} status="ready" error={null} />);
    const [full, one] = screen.getAllByRole("listitem");
    expect(full).toHaveTextContent("4 credits · Computer Science · Full");
    expect(full).not.toHaveTextContent("0 seats left");
    expect(one).toHaveTextContent("4 credits · Computer Science · 1 seat left");
  });

  test("it shows the courses in the order it is given (sorting is the hook's job)", () => {
    render(<CoursesView courses={Object.freeze([DS101, CS101])} status="ready" error={null} />);
    const items = screen.getAllByRole("listitem");
    expect(items[0]).toHaveTextContent("DS101");
    expect(items[1]).toHaveTextContent("CS101");
  });

  test("every list item has a key (React prints no key warning)", () => {
    render(<CoursesView courses={[CS101, CS201, DS101]} status="ready" error={null} />);
    expect(consoleErrors.join("\n")).not.toMatch(/unique "key"/);
  });

  test("it only renders: given everything it shows, it never fetches", () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    render(<CoursesView courses={[]} status="loading" error={null} />);
    render(<CoursesView courses={[]} status="error" error="Failed to fetch" />);
    render(<CoursesView courses={[]} status="ready" error={null} />);
    render(<CoursesView courses={[CS101, CS201]} status="ready" error={null} />);
    expect(fetch).not.toHaveBeenCalled();
  });
});
