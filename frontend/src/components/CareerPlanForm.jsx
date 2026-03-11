import { motion } from 'framer-motion';
import { useState } from 'react';

const STAGES = ['Class 10', 'Class 11-12', 'Undergraduate', 'Graduate', 'Working Professional'];
const KNOWN_STAGES = new Set(STAGES);
const SUGGESTED_CAREERS = ['IAS', 'Software Engineer', 'Data Scientist', 'Doctor', 'Product Manager'];
const SKILL_FIELDS = [
  { name: 'gpa', label: 'GPA (0–10)', type: 'number', step: '0.1', min: 0, max: 10 },
  { name: 'internships', label: 'Internships (0–10)', type: 'number', step: '1', min: 0, max: 10 },
  { name: 'projects', label: 'Projects (0–10)', type: 'number', step: '1', min: 0, max: 10 },
  { name: 'certifications', label: 'Certifications (0–10)', type: 'number', step: '1', min: 0, max: 10 },
  { name: 'soft_skills_score', label: 'Soft Skills (1–10)', type: 'number', step: '0.1', min: 1, max: 10 },
  { name: 'networking_score', label: 'Networking (1–10)', type: 'number', step: '0.1', min: 1, max: 10 },
];
const ML_ELIGIBLE_STAGES = new Set(['Undergraduate', 'Graduate', 'Working Professional']);

export default function CareerPlanForm({ onSubmit, loading }) {
  const [currentStage, setCurrentStage] = useState('Undergraduate');
  const [targetCareer, setTargetCareer] = useState('Software Engineer');
  const [showSkills, setShowSkills] = useState(true);
  const [skills, setSkills] = useState({
    gpa: 7, internships: 1, projects: 2, certifications: 1,
    soft_skills_score: 5, networking_score: 4,
  });

  const resolvedStage = KNOWN_STAGES.has(currentStage) ? currentStage : 'Working Professional';
  const isMLEligible = ML_ELIGIBLE_STAGES.has(resolvedStage);
  const isCustomStage = !KNOWN_STAGES.has(currentStage) && currentStage.trim() !== '';

  function handleStageChange(e) {
    const stage = e.target.value;
    setCurrentStage(stage);
    const resolved = KNOWN_STAGES.has(stage) ? stage : 'Working Professional';
    setShowSkills(ML_ELIGIBLE_STAGES.has(resolved));
  }

  function handleSkillChange(e) {
    const { name, value } = e.target;
    setSkills((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    const payload = { current_stage: resolvedStage, target_career: targetCareer.trim() };
    if (isCustomStage) payload.current_role = currentStage.trim();
    if (isMLEligible && showSkills) payload.skills = skills;
    onSubmit(payload);
  }

  const inputClass = `w-full px-4 py-2.5 rounded-lg bg-white border border-gray-200
    text-gray-900 placeholder-gray-400
    focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/20
    transition-all duration-200`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5 }}
      className="bg-white/85 backdrop-blur-md border border-gray-200 rounded-xl p-8 max-w-2xl mx-auto shadow-sm"
    >
      <h2 className="text-xl font-semibold text-gray-900 mb-1 text-center">Career Plan Generator</h2>
      <p className="text-gray-500 text-sm text-center mb-8">
        Describe your current stage and career goal for a personalized plan.
      </p>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-700">Current Stage</span>
            <input
              list="stage-suggestions"
              value={currentStage}
              onChange={handleStageChange}
              placeholder="Select or type your current stage"
              required
              className={inputClass}
            />
            <datalist id="stage-suggestions">
              {STAGES.map((s) => <option key={s} value={s} />)}
            </datalist>
          </label>

          <label className="flex flex-col gap-1.5">
            <span className="text-sm font-medium text-gray-700">Target Career</span>
            <input
              list="career-suggestions"
              value={targetCareer}
              onChange={(e) => setTargetCareer(e.target.value)}
              placeholder="Type or select a career goal"
              required
              className={inputClass}
            />
            <datalist id="career-suggestions">
              {SUGGESTED_CAREERS.map((c) => <option key={c} value={c} />)}
            </datalist>
          </label>
        </div>

        {isMLEligible && (
          <label className="flex items-center gap-2.5 cursor-pointer">
            <input
              type="checkbox"
              checked={showSkills}
              onChange={(e) => setShowSkills(e.target.checked)}
              className="w-4 h-4 rounded border-gray-300 text-primary accent-primary"
            />
            <span className="text-sm text-gray-600">Include skill metrics for readiness prediction</span>
          </label>
        )}

        {isMLEligible && showSkills && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {SKILL_FIELDS.map((f) => (
              <label key={f.name} className="flex flex-col gap-1.5">
                <span className="text-sm font-medium text-gray-700">{f.label}</span>
                <input
                  name={f.name}
                  type={f.type}
                  step={f.step}
                  min={f.min}
                  max={f.max}
                  value={skills[f.name]}
                  onChange={handleSkillChange}
                  className={inputClass}
                />
              </label>
            ))}
          </div>
        )}

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
          {loading ? 'Generating Plan…' : 'Generate Career Plan'}
        </motion.button>
      </form>
    </motion.div>
  );
}
