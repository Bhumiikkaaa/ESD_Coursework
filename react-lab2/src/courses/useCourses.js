import { useEffect, useState } from "react";
import { apiFetch } from "../api/client.js";

export function useCourses() {
  const [courses, setCourses] = useState([]);
  const [status, setStatus] = useState("loading");
  const [error, setError] = useState(null);

  useEffect(() => {
    let ignore = false;

    async function loadCourses() {
      try {
        const data = await apiFetch("/api/courses");

        if (!ignore) {
          setCourses(data);
          setStatus("ready");
        }
      } catch (err) {
        if (!ignore) {
          setError(err.message);
          setStatus("error");
        }
      }
    }

    loadCourses();

    return () => {
      ignore = true;
    };
  }, []);

  async function addCourse(courseRequest) {
    const created = await apiFetch("/api/courses", {
      method: "POST",
      body: courseRequest,
    });

    setCourses((previousCourses) =>
      [...previousCourses, created].sort((a, b) =>
        a.code.localeCompare(b.code)
      )
    );

    return created;
  }

  return {
    courses,
    status,
    error,
    addCourse,
  };
}
