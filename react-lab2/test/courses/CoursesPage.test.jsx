// Lab day — src/courses/CoursesPage.jsx (CONTRACT.md §4): the whole slice, against the mock API.
// This is the screen as a user sees it. An AI's one-big-component version can pass this file
// and still fail the other three: "it works" and "it's a good slice" are different tests.
import { describe, test, expect } from "vitest";
import { render, screen, within, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { CoursesPage } from "../../src/courses/CoursesPage.jsx";
import { stubFetch } from "../support/fetch.js";

const COMPILERS = { Code: "CS350", Title: "Compiler Design", Department: "Computer Science", Credits: "4", Capacity: "40" };

async function courseList() {
  const list = await screen.findByRole("list");
  await waitFor(() => expect(within(list).getAllByRole("listitem")).toHaveLength(20));
  return list;
}
async function openPage() {
  const user = userEvent.setup();
  render(<CoursesPage />);
  return { user, list: await courseList() };
}
async function addCourse(user, values) {
  for (const [label, value] of Object.entries(values)) {
    await user.clear(screen.getByLabelText(label));
    await user.type(screen.getByLabelText(label), value);
  }
  await user.click(screen.getByRole("button", { name: "Add course" }));
}
const listedCodes = (list) => within(list).getAllByRole("listitem").map((li) => li.textContent.match(/[A-Z]{2,4}\d{3}/)[0]);

describe("CoursesPage — list + add, end to end", () => {
  test('a "Courses" heading, "Loading courses…", then the 20 seeded courses', async () => {
    stubFetch();
    render(<CoursesPage />);
    expect(screen.getByRole("heading", { name: "Courses" })).toBeInTheDocument();
    expect(screen.getByText(/^loading courses/i)).toBeInTheDocument();
    const list = await courseList();
    expect(listedCodes(list).slice(0, 3)).toEqual(["CS101", "CS201", "CS305"]);
    expect(screen.getByText("CS201 · Data Structures").closest("li")).toHaveTextContent("Full");
  });

  test("adding a valid course: it appears in code order, and the form clears", async () => {
    stubFetch();
    const { user, list } = await openPage();
    await addCourse(user, COMPILERS);

    expect(await screen.findByText("CS350 · Compiler Design")).toBeInTheDocument();
    expect(listedCodes(list)).toHaveLength(21);
    expect(listedCodes(list).slice(0, 5)).toEqual(["CS101", "CS201", "CS305", "CS350", "CS402"]);
    await waitFor(() => expect(screen.getByLabelText("Code")).toHaveValue(""));
  });

  test("a duplicate code shows the 409 message, and nothing is added", async () => {
    stubFetch();
    const { user, list } = await openPage();
    await addCourse(user, { ...COMPILERS, Code: "CS501", Title: "Distributed Systems" });

    expect(await screen.findByText("Course code already exists")).toBeInTheDocument();
    expect(listedCodes(list)).toHaveLength(20);
    expect(screen.getByLabelText("Code")).toHaveValue("CS501");
  });

  test('invalid input shows "Validation failed" and the reason for each bad field', async () => {
    stubFetch();
    const { user, list } = await openPage();
    await addCourse(user, { ...COMPILERS, Code: "cs350", Credits: "9" });

    expect(await screen.findByText("Validation failed")).toBeInTheDocument();
    expect(screen.getByText(/uppercase letters followed by 3 digits/)).toBeInTheDocument();
    expect(screen.getByText(/whole number from 1 to 6/)).toBeInTheDocument();
    expect(listedCodes(list)).toHaveLength(20);
  });
});
