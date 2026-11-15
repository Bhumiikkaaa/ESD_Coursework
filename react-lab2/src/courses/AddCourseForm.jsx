import { useState } from "react";

const INITIAL_VALUES = {
  code: "",
  title: "",
  department: "",
  credits: "",
  capacity: "",
  description: "",
};

const FIELDS = [
  { name: "code", label: "Code", type: "text" },
  { name: "title", label: "Title", type: "text" },
  { name: "department", label: "Department", type: "text" },
  { name: "credits", label: "Credits", type: "number" },
  { name: "capacity", label: "Capacity", type: "number" },
  { name: "description", label: "Description", type: "textarea" },
];

export function AddCourseForm({ onAdd }) {
  const [values, setValues] = useState(INITIAL_VALUES);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;

    setValues((previousValues) => ({
      ...previousValues,
      [name]: value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();

    setError(null);
    setFieldErrors({});
    setSubmitting(true);

    const courseRequest = {
      code: values.code,
      title: values.title,
      department: values.department,
      credits: Number(values.credits),
      capacity: Number(values.capacity),
      description: values.description.trim() === ""
        ? null
        : values.description,
    };

    try {
      await onAdd(courseRequest);
      setValues({ ...INITIAL_VALUES });
    } catch (err) {
      setError(err.message);
      if (err.status === 400 && err.fieldErrors) {
        setFieldErrors(err.fieldErrors);
      }
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section>
      <h2>Add a course</h2>
      <form onSubmit={handleSubmit}>
      {FIELDS.map((field) => {
        const fieldError = fieldErrors[field.name];
        const errorId = `${field.name}-error`;

        return (
          <div key={field.name}>
            <label htmlFor={field.name}>{field.label}</label>

            {field.type === "textarea" ? (
              <textarea
                id={field.name}
                name={field.name}
                value={values[field.name]}
                onChange={handleChange}
                aria-invalid={fieldError ? "true" : undefined}
                aria-describedby={fieldError ? errorId : undefined}
              />
            ) : (
              <input
                id={field.name}
                name={field.name}
                type={field.type}
                value={values[field.name]}
                onChange={handleChange}
                aria-invalid={fieldError ? "true" : undefined}
                aria-describedby={fieldError ? errorId : undefined}
              />
            )}

            {fieldError && (
              <p id={errorId}>{fieldError}</p>
            )}
          </div>
        );
      })}

      {error && <p role="alert">{error}</p>}

      <button type="submit" disabled={submitting}>
        Add course
      </button>
      </form>
    </section>
  );
}
