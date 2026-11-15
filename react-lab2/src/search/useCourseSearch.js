import { useEffect, useState } from "react";
import { apiFetch } from "../api/client.js";

export function useCourseSearch(query) {
  const trimmedQuery = query.trim();

  const [results, setResults] = useState([]);
  const [status, setStatus] = useState(
    trimmedQuery === "" ? "idle" : "loading"
  );

  useEffect(() => {
    let ignore = false;

    if (trimmedQuery === "") {
      setResults([]);
      setStatus("idle");

      return () => {
        ignore = true;
      };
    }

    async function searchCourses() {
      setStatus("loading");

      const params = new URLSearchParams({ q: trimmedQuery });

      try {
        const courses = await apiFetch(`/api/courses?${params.toString()}`);

        if (!ignore) {
          setResults(courses);
          setStatus("ready");
        }
      } catch {
        if (!ignore) {
          setResults([]);
          setStatus("error");
        }
      }
    }

    searchCourses();

    return () => {
      ignore = true;
    };
  }, [trimmedQuery]);

  return { results, status };
}
