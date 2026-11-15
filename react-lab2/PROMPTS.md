# Prompt log — React Lab 2

- **Name:** Bhumika Khoriya
- **Roll number:** MT2026018
- **AI tool and plan:** ChatGPT (Free plan).

**Accuracy note:** The exact text of the original follow-up messages was not preserved in the available chat record. I have recorded the prompt that is explicitly identified as unchanged, and described later requests as summaries rather than inventing verbatim prompts. If you have your original chat transcript, replace these summaries with the exact text before submission.

---

## Prompt 1 — generate

**Sent:**

```text
CONTRACT.md prompt 1, unchanged
```

**What came back:** The feature was developed in separate files: `CoursesView.jsx` (presentational list and states), `useCourses.js` (initial GET and add-course logic), `AddCourseForm.jsx` (controlled form and server errors), and `CoursesPage.jsx` (composition). The final implementation uses only `useState` and `useEffect`, uses the existing `apiFetch` client, and contains none of the prohibited “not yet” hooks/libraries. The exact contents of the first generated response were not retained as a separate snapshot, so this describes the final result rather than asserting what appeared in the first response.

**Did it run?** During integration, the observed test run was 58 passed and 4 failed; all four failures were in `test/courses/CoursesPage.test.jsx` because the page integration was incomplete. After the page was composed, the complete suite passed (62/62). The user also confirmed that `npm run test:stretch` and `npm run build` passed.

**What I did with it:** Kept the feature split into a rendering-only view, a data hook, a form, and a page. Reviewed the implementation against the contract and tests rather than treating the generated code as automatically correct.

---

## Follow-up work — page integration and verification

**Why I sent it:** The four failing page tests showed that the individual feature pieces were not enough: the page needed to call the hook and render the view and form with the correct props/callback.

**Sent (summary, not a verbatim transcript):**

```text
Complete the CoursesPage integration using useCourses, CoursesView, and AddCourseForm. Render the Courses heading, pass courses/status/error to the view, and pass addCourse to the form as onAdd. Preserve the existing implementation and work on the lab branch.
```

**What came back:** The page composition was completed. The resulting full test run passed all 62 tests.

**What I kept, and what I rejected:** Kept the small composition-only page. No unrelated feature or extra hook was added. The wording above is a summary of the work request, not a claim that it is the exact original prompt.

---

## Follow-up work — final audit and browser checks

**Why I sent it:** To verify the implementation against the contract, finish the required audit/prompt documentation, and check the API behaviour in the browser.

**Sent (summary, not a verbatim transcript):**

```text
Continue from the existing React Lab 2 project state. Inspect the current files and Git state before changing anything. Preserve completed work, use the existing API client, run the core tests, stretch tests and production build, and verify add/validation/network behaviour in the browser. Do not touch unrelated lab files.
```

**What came back:** A verification sequence was used. The user confirmed the code-field validation message (2–4 uppercase letters), the credits-field validation error, and a successful course creation. In Chrome DevTools Network, the `courses` request returned status 201 and its Request Method was confirmed as POST. The new course appeared in sorted order, and no GET followed the POST.

**What I kept, and what I rejected:** Kept the existing implementation after tests and manual checks passed. Did not introduce extra implementation changes just to make more commits. The text above is a summary, not a verbatim historical prompt.

---

## Afterwards

- **How many prompts did the whole feature take?** The exact count cannot be verified from the preserved transcript. Prompt 1 and the follow-up work categories above are recoverable; intermediate messages may have included terminal output and narrower review requests.
- **Which prompt would I write differently now, and how?** I would make the first request explicitly ask for a complete page integration and ask the AI to run/report the page-level tests after creating the individual components. I would also keep a copy of every follow-up prompt verbatim as I go.
- **One thing the rules in prompt 1 prevented (or failed to prevent):** They kept the implementation within the taught React tools and the existing `apiFetch` client. They did not by themselves guarantee that all four files were integrated into a working page; the page-level tests caught that gap.
