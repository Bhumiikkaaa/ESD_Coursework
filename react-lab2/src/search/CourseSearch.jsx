// Pre-lab section 06 — a controlled input, and the pieces put together.
//
// CourseSearch: a search box, and what it finds.
//   - A heading "Search the catalogue".
//   - <label>Search courses</label> and an <input type="search"> that is CONTROLLED:
//     its value comes from state (query), and onChange puts what was typed into that state.
//   - useCourseSearch(query) does the fetching; SearchResults shows the outcome.
// This component owns the query (nobody else needs it) and nothing else.
import { useState } from "react";
import { useCourseSearch } from "./useCourseSearch.js";
import { SearchResults } from "./SearchResults.jsx";

export function CourseSearch() {
  // Replace this line with the search box (pre-lab section 06).
  return <p className="todo">The course search goes here — pre-lab section 06.</p>;
}
