// Lab day (section 13) — field errors a screen reader can find. (CONTRACT.md §4)
// An input with an error says so (aria-invalid) and points at its message (aria-describedby),
// so a screen reader reads "Code, invalid entry, must be 2–4 uppercase letters…".
import { describe, test, expect, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { AddCourseForm } from "../../src/courses/AddCourseForm.jsx";
import { ApiError } from "../../src/api/client.js";

const CODE_REASON = "must be 2–4 uppercase letters followed by 3 digits";

describe("AddCourseForm — accessible field errors", () => {
  test("a field with an error is aria-invalid, and described by its message", async () => {
    const user = userEvent.setup();
    const onAdd = vi.fn().mockRejectedValue(new ApiError(400, "Validation failed", { code: CODE_REASON }));
    render(<AddCourseForm onAdd={onAdd} />);
    await user.type(screen.getByLabelText("Code"), "cs350");
    await user.click(screen.getByRole("button", { name: "Add course" }));
    await screen.findByText(CODE_REASON);

    const code = screen.getByLabelText("Code");
    expect(code).toHaveAttribute("aria-invalid", "true");
    expect(code).toHaveAccessibleDescription(CODE_REASON);
    expect(screen.getByLabelText("Title")).not.toHaveAttribute("aria-invalid", "true");
  });

  test("the form-level message is announced (role alert)", async () => {
    const user = userEvent.setup();
    render(<AddCourseForm onAdd={vi.fn().mockRejectedValue(new ApiError(409, "Course code already exists"))} />);
    await user.click(screen.getByRole("button", { name: "Add course" }));
    expect(await screen.findByRole("alert")).toHaveTextContent("Course code already exists");
  });
});
