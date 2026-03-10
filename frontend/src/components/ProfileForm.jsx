import { useState } from 'react';

const FIELDS = [
  { name: 'gpa', label: 'GPA (5–10)', type: 'number', step: '0.1', min: 5, max: 10, initial: 7 },
  { name: 'internships', label: 'Internships (0–4)', type: 'number', step: '1', min: 0, max: 4, initial: 1 },
  { name: 'projects', label: 'Projects (0–6)', type: 'number', step: '1', min: 0, max: 6, initial: 2 },
  { name: 'certifications', label: 'Certifications (0–5)', type: 'number', step: '1', min: 0, max: 5, initial: 1 },
  { name: 'soft_skills_score', label: 'Soft Skills (1–10)', type: 'number', step: '0.1', min: 1, max: 10, initial: 5 },
  { name: 'networking_score', label: 'Networking (1–10)', type: 'number', step: '0.1', min: 1, max: 10, initial: 4 },
];

export default function ProfileForm({ onSubmit, loading }) {
  const [values, setValues] = useState(
    Object.fromEntries(FIELDS.map((f) => [f.name, f.initial]))
  );

  function handleChange(e) {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    onSubmit(values);
  }

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      {FIELDS.map((f) => (
        <label key={f.name}>
          {f.label}
          <input
            name={f.name}
            type={f.type}
            step={f.step}
            min={f.min}
            max={f.max}
            value={values[f.name]}
            onChange={handleChange}
          />
        </label>
      ))}
      <button type="submit" disabled={loading}>
        {loading ? 'Analysing…' : 'Predict Career Readiness'}
      </button>
    </form>
  );
}
