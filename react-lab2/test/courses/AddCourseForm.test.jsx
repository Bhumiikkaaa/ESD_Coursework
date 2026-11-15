// Lab day — src/courses/AddCourseForm.jsx (CONTRACT.md §4): the form, tested with a fake onAdd.
// The form never talks to the API: it hands the course to onAdd, and shows what onAdd threw.
import { describe, test, expect, vi } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddCourseForm } from "../../src/courses/AddCourseForm.jsx";
import { ApiError } from "../../src/api/client.js";
import { deferred, course } from "../support/fetch.js";

const LABELS = ["Code", "Title", "Department", "Credits", "Capacity", "Description"];
const VALID = { Code: "CS350", Title: "Compiler Design", Department: "Computer Science", Credits: "4", Capacity: "40" };
const CODE_REASON = "must be 2–4 uppercase letters followed by 3 digits";
const CREDITS_REASON = "must be a whole number from 1 to 6";

function setup(onAdd = vi.fn().mockResolvedValue(course("CS350", "Compiler Design"))) {
  const user = userEvent.setup();
  render(<AddCourseForm onAdd={onAdd} />);
  return { user, onAdd };
}
async function fill(user, values) {
  for (const [label, value] of Object.entries(values)) await user.type(screen.getByLabelText(label), value);
}
const submit = (user) => user.click(screen.getByRole("button", { name: "Add course" }));
const valueOf = (label) => screen.getByLabelText(label).value;
// true if `a` comes before `b` in the page
const before = (a, b) => Boolean(a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING);

describe("AddCourseForm({ onAdd }) — the form", () => {
  test("a labelled input for every field (Description is a textarea), and an Add course button", () => {
    setup();
    for (const label of LABELS) expect(screen.getByLabelText(label)).toBeInTheDocument();
    expect(screen.getByLabelText("Description").tagName).toBe("TEXTAREA");
    expect(screen.getByRole("button", { name: "Add course" })).toBeEnabled();
  });

  test("the inputs show what you type (controlled)", async () => {
    const { user } = setup();
    await fill(user, { ...VALID, Description: "Lexing to codegen." });
    for (const [label, value] of Object.entries(VALID)) expect(valueOf(label)).toBe(value);
    expect(valueOf("Description")).toBe("Lexing to codegen.");
  });

  test("submitting calls onAdd once, with credits and capacity as numbers", async () => {
    const { user, onAdd } = setup();
    await fill(user, VALID);
    await submit(user);
    expect(onAdd).toHaveBeenCalledTimes(1);
    expect(onAdd.mock.calls[0][0]).toMatchObject({
      code: "CS350",
      title: "Compiler Design",
      department: "Computer Science",
      credits: 4,
      capacity: 40,
    });
  });

  test("an empty Description is sent as null; a filled one as its text", async () => {
    const { user, onAdd } = setup();
    await fill(user, VALID);
    await submit(user);
    expect(onAdd.mock.calls[0][0].description).toBeNull();

    await fill(user, { ...VALID, Code: "CS351", Description: "Lexing to codegen." });
    await submit(user);
    expect(onAdd.mock.calls[1][0].description).toBe("Lexing to codegen.");
  });

  test("on success the form is cleared", async () => {
    const { user } = setup();
    await fill(user, { ...VALID, Description: "Lexing to codegen." });
    await submit(user);
    await waitFor(() => expect(valueOf("Code")).toBe(""));
    for (const label of LABELS) expect(valueOf(label)).toBe("");
  });

  test("the button is disabled while onAdd is running, and enabled again after", async () => {
    const pending = deferred();
    const { user } = setup(vi.fn(() => pending.promise));
    await fill(user, VALID);
    await submit(user);
    // the form's only button — found without its text, in case it says "Adding…" meanwhile
    expect(screen.getByRole("button")).toBeDisabled();
    pending.resolve(course("CS350", "Compiler Design"));
    await waitFor(() => expect(screen.getByRole("button")).toBeEnabled());
  });

  test("on failure it shows the error's message, and keeps what was typed", async () => {
    const { user } = setup(vi.fn().mockRejectedValue(new ApiError(409, "Course code already exists")));
    await fill(user, VALID);
    await submit(user);
    expect(await screen.findByText("Course code already exists")).toBeInTheDocument();
    for (const [label, value] of Object.entries(VALID)) expect(valueOf(label)).toBe(value);
    expect(screen.getByRole("button", { name: "Add course" })).toBeEnabled();
  });

  test("a 400 also shows each fieldErrors entry right under its own input", async () => {
    const error = new ApiError(400, "Validation failed", { code: CODE_REASON, credits: CREDITS_REASON });
    const { user } = setup(vi.fn().mockRejectedValue(error));
    await fill(user, { ...VALID, Code: "cs350", Credits: "9" });
    await submit(user);

    expect(await screen.findByText("Validation failed")).toBeInTheDocument();
    const codeReason = screen.getByText(CODE_REASON);
    const creditsReason = screen.getByText(CREDITS_REASON);
    // between the Code input and the Title input…
    expect(before(screen.getByLabelText("Code"), codeReason)).toBe(true);
    expect(before(codeReason, screen.getByLabelText("Title"))).toBe(true);
    // …and between the Credits input and the Capacity input
    expect(before(screen.getByLabelText("Credits"), creditsReason)).toBe(true);
    expect(before(creditsReason, screen.getByLabelText("Capacity"))).toBe(true);
  });

  test("an error with no response (network down) shows its message too", async () => {
    const { user } = setup(vi.fn().mockRejectedValue(new TypeError("Failed to fetch")));
    await fill(user, VALID);
    await submit(user);
    expect(await screen.findByText("Failed to fetch")).toBeInTheDocument();
  });

  test("trying again clears the old error", async () => {
    const onAdd = vi
      .fn()
      .mockRejectedValueOnce(new ApiError(400, "Validation failed", { code: CODE_REASON }))
      .mockResolvedValueOnce(course("CS350", "Compiler Design"));
    const { user } = setup(onAdd);
    await fill(user, { ...VALID, Code: "cs350" });
    await submit(user);
    await screen.findByText(CODE_REASON);

    await user.clear(screen.getByLabelText("Code"));
    await user.type(screen.getByLabelText("Code"), "CS350");
    await submit(user);
    await waitFor(() => expect(screen.queryByText(CODE_REASON)).not.toBeInTheDocument());
    expect(screen.queryByText("Validation failed")).not.toBeInTheDocument();
  });

  test("the form never fetches: it raises the course up through onAdd", async () => {
    const fetch = vi.fn();
    vi.stubGlobal("fetch", fetch);
    const { user, onAdd } = setup();
    await fill(user, VALID);
    await submit(user);
    expect(onAdd).toHaveBeenCalled();
    expect(fetch).not.toHaveBeenCalled();
  });
});
