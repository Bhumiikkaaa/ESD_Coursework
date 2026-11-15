import { useState } from "react";
import { useCourseSearch } from "./useCourseSearch.js";
import { SearchResults } from "./SearchResults.jsx";
import { useDebounced } from "./useDebounced.js";

export function CourseSearch() {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounced(query, 250);
  const { results, status } = useCourseSearch(debouncedQuery);

  return (
    <section>
      <h2>Search the catalogue</h2>

      <label htmlFor="course-search">Search courses</label>
      <input
        id="course-search"
        type="search"
        value={query}
        onChange={(event) => setQuery(event.target.value)}
      />

      <SearchResults results={results} status={status} />
    </section>
  );
}
