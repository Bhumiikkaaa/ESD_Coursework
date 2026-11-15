// Pre-lab section 04 — src/search/SearchResults.jsx
import { describe, test, expect, vi, beforeAll, afterAll } from "vitest";
import { render, screen } from "@testing-library/react";
import { SearchResults } from "../../src/search/SearchResults.jsx";
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

const TWO = [course("CS101", "Programming Fundamentals"), course("DS101", "Introduction to Data Science")];

describe("SearchResults({ results, status }) — a view that only renders", () => {
  test('"idle" renders nothing at all', () => {
    const { container } = render(<SearchResults results={[]} status="idle" />);
    expect(container).toBeEmptyDOMElement();
  });

  test('"loading" says Searching…', () => {
    render(<SearchResults results={[]} status="loading" />);
    expect(screen.getByText(/^searching/i)).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  test('"error" says Search failed.', () => {
    render(<SearchResults results={[]} status="error" />);
    expect(screen.getByText(/^search failed/i)).toBeInTheDocument();
  });

  test('"ready" with no results says No courses match.', () => {
    render(<SearchResults results={[]} status="ready" />);
    expect(screen.getByText("No courses match.")).toBeInTheDocument();
    expect(screen.queryByRole("list")).not.toBeInTheDocument();
  });

  test('"ready" shows one list item per course: "CODE · Title"', () => {
    render(<SearchResults results={TWO} status="ready" />);
    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(items[0]).toHaveTextContent("CS101 · Programming Fundamentals");
    expect(items[1]).toHaveTextContent("DS101 · Introduction to Data Science");
  });

  test("every list item has a key (React prints no key warning)", () => {
    render(<SearchResults results={TWO} status="ready" />);
    expect(consoleErrors.join("\n")).not.toMatch(/unique "key"/);
  });

  test("it draws only from its props: it never fetches", () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    for (const status of ["idle", "loading", "error", "ready"]) {
      render(<SearchResults results={TWO} status={status} />);
    }
    expect(fetch).not.toHaveBeenCalled();
  });
});
