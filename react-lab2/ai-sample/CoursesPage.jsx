// A TYPICAL AI FIRST DRAFT — for auditing, not for copying.
//
// This is the kind of code an AI chat hands back for CONTRACT.md's feature when it is given
// the behaviour and the API but NO rules. It was put together for this lab from the habits
// AI chats show most often, so that every smell is in one place. And it works: drop it into
// src/courses/CoursesPage.jsx and the page loads, adds and shows errors. It even passes
// test/CoursesPage.test.jsx.
//
// Used in pre-lab section 09 (find the "not yet" hooks, strip them, see nothing break) and
// by the TA at the start of the lab (an audit, live). Don't build on it.
import React, { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { apiFetch } from "../api/client.js";

export function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [courseCount, setCourseCount] = useState(0);
  const [code, setCode] = useState("");
  const [title, setTitle] = useState("");
  const [department, setDepartment] = useState("");
  const [credits, setCredits] = useState("");
  const [capacity, setCapacity] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});
  const codeInputRef = useRef(null);

  // Fetch all courses from the API
  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch("/api/courses");
      setCourses(data);
      setCourseCount(data.length);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  // Keep the list sorted by course code
  const sortedCourses = useMemo(() => {
    return [...courses].sort((a, b) => a.code.localeCompare(b.code));
  }, [courses]);

  const handleSubmit = useCallback(
    async (e) => {
      e.preventDefault();
      setSubmitting(true);
      setFormError(null);
      setFieldErrors({});
      try {
        await apiFetch("/api/courses", {
          method: "POST",
          body: {
            code,
            title,
            department,
            credits: parseInt(credits),
            capacity: parseInt(capacity),
            description: description || null,
          },
        });
        // Reset the form
        setCode("");
        setTitle("");
        setDepartment("");
        setCredits("");
        setCapacity("");
        setDescription("");
        // Refresh the list so it includes the new course
        await fetchCourses();
        codeInputRef.current?.focus();
      } catch (err) {
        setFormError(err.message);
        setFieldErrors(err.fieldErrors || {});
      } finally {
        setSubmitting(false);
      }
    },
    [code, title, department, credits, capacity, description, fetchCourses]
  );

  return (
    <section className="courses-page">
      <h1>Courses</h1>
      <p>{courseCount} courses in the catalogue</p>

      {loading ? (
        <p>Loading courses…</p>
      ) : error ? (
        <p role="alert">Couldn't load courses: {error}</p>
      ) : sortedCourses.length === 0 ? (
        <p>No courses yet.</p>
      ) : (
        <ul className="courses">
          {sortedCourses.map((course, index) => (
            <li key={index}>
              <strong>
                {course.code} · {course.title}
              </strong>
              <span>
                {course.credits} credits · {course.department} ·{" "}
                {course.seatsLeft === 0
                  ? "Full"
                  : course.seatsLeft === 1
                    ? "1 seat left"
                    : `${course.seatsLeft} seats left`}
              </span>
            </li>
          ))}
        </ul>
      )}

      <form className="add-course" onSubmit={handleSubmit}>
        <h2>Add a course</h2>
        <div className="field">
          <label htmlFor="code">Code</label>
          <input id="code" ref={codeInputRef} value={code} onChange={(e) => setCode(e.target.value)} />
          {fieldErrors.code && <p className="field-error">{fieldErrors.code}</p>}
        </div>
        <div className="field">
          <label htmlFor="title">Title</label>
          <input id="title" value={title} onChange={(e) => setTitle(e.target.value)} />
          {fieldErrors.title && <p className="field-error">{fieldErrors.title}</p>}
        </div>
        <div className="field">
          <label htmlFor="department">Department</label>
          <input id="department" value={department} onChange={(e) => setDepartment(e.target.value)} />
          {fieldErrors.department && <p className="field-error">{fieldErrors.department}</p>}
        </div>
        <div className="field">
          <label htmlFor="credits">Credits</label>
          <input id="credits" type="number" value={credits} onChange={(e) => setCredits(e.target.value)} />
          {fieldErrors.credits && <p className="field-error">{fieldErrors.credits}</p>}
        </div>
        <div className="field">
          <label htmlFor="capacity">Capacity</label>
          <input id="capacity" type="number" value={capacity} onChange={(e) => setCapacity(e.target.value)} />
          {fieldErrors.capacity && <p className="field-error">{fieldErrors.capacity}</p>}
        </div>
        <div className="field">
          <label htmlFor="description">Description</label>
          <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} />
        </div>
        {formError && <p className="form-error">{formError}</p>}
        <button type="submit" disabled={submitting}>
          {submitting ? "Adding..." : "Add course"}
        </button>
      </form>
    </section>
  );
}
