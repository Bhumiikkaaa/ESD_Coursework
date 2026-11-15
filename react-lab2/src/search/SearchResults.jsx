// Presentational component: receives search results and status through props.
export function SearchResults({ results, status }) {
  if (status === "idle") {
    return null;
  }

  if (status === "loading") {
    return <p>Searching…</p>;
  }

  if (status === "error") {
    return <p>Search failed.</p>;
  }

  if (results.length === 0) {
    return <p>No courses match.</p>;
  }

  return (
    <ul>
      {results.map((course) => (
        <li key={course.id}>
          {course.code} · {course.title}
        </li>
      ))}
    </ul>
  );
}
