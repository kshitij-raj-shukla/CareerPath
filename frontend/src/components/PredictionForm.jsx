import { motion } from 'framer-motion';
import { useState } from 'react';

const FIELDS = [
  { name: 'gpa', label: 'GPA', type: 'number', step: '0.1', min: 0, max: 10, initial: 7, icon: '📊' },
  { name: 'internships', label: 'Internships', type: 'number', step: '1', min: 0, max: 10, initial: 1, icon: '💼' },
  { name: 'projects', label: 'Projects', type: 'number', step: '1', min: 0, max: 10, initial: 2, icon: '🚀' },
  { name: 'certifications', label: 'Certifications', type: 'number', step: '1', min: 0, max: 10, initial: 1, icon: '🏆' },
  { name: 'soft_skills_score', label: 'Soft Skills', type: 'number', step: '0.1', min: 1, max: 10, initial: 5, icon: '🤝' },
  { name: 'networking_score', label: 'Networking', type: 'number', step: '0.1', min: 1, max: 10, initial: 4, icon: '🌐' },
];

export default function PredictionForm({ onSubmit, loading }) {
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white/85 backdrop-blur-md border border-gray-200 rounded-xl p-8 max-w-2xl mx-auto shadow-sm"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-1 text-center">Analyze Your Skills</h2>
      <p className="text-gray-500 text-sm text-center mb-8">
        Enter your current metrics to get an AI-powered career readiness prediction.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {FIELDS.map((f, i) => (
            <motion.label
              key={f.name}
              initial={{ opacity: 0, x: i % 2 === 0 ? -12 : 12 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.35 }}
              className="flex flex-col gap-1.5"
            >
              <span className="text-sm font-medium text-gray-700 flex items-center gap-1.5">
                <span>{f.icon}</span> {f.label}
              </span>
              <input
                name={f.name}
                type={f.type}
                step={f.step}
                min={f.min}
                max={f.max}
                value={values[f.name]}
                onChange={handleChange}
                className="w-full px-4 py-2.5 rounded-lg
                           bg-white border border-gray-200
                           text-gray-900 placeholder-gray-400
                           focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20
                           transition-all duration-200"
              />
            </motion.label>
          ))}
        </div>

        <motion.button
          type="submit"
          disabled={loading}
          whileHover={{ scale: loading ? 1 : 1.01 }}
          whileTap={{ scale: loading ? 1 : 0.99 }}
          className="w-full py-3 rounded-lg font-semibold text-white
                     bg-primary hover:bg-primary-dark
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-colors duration-200 cursor-pointer"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analyzing…
            </span>
          ) : (
            'Predict Career Readiness'
          )}
        </motion.button>
      </form>
    </motion.div>
  );
}
