import { useState } from 'react';

const STAGES = [
  'Class 10',
  'Class 11-12',
  'Undergraduate',
  'Graduate',
  'Working Professional',
];

const KNOWN_STAGES = new Set(STAGES);

const SUGGESTED_CAREERS = [
  'IAS',
  'Software Engineer',
  'Data Scientist',
  'Doctor',
  'Product Manager',
];

const SKILL_FIELDS = [
  { name: 'gpa', label: 'GPA (0–10)', type: 'number', step: '0.1', min: 0, max: 10 },
  { name: 'internships', label: 'Internships (0–10)', type: 'number', step: '1', min: 0, max: 10 },
  { name: 'projects', label: 'Projects (0–10)', type: 'number', step: '1', min: 0, max: 10 },
  { name: 'certifications', label: 'Certifications (0–10)', type: 'number', step: '1', min: 0, max: 10 },
  { name: 'soft_skills_score', label: 'Soft Skills (1–10)', type: 'number', step: '0.1', min: 1, max: 10 },
  { name: 'networking_score', label: 'Networking (1–10)', type: 'number', step: '0.1', min: 1, max: 10 },
];

// Stages where skill metrics are relevant for ML prediction
const ML_ELIGIBLE_STAGES = new Set(['Undergraduate', 'Graduate', 'Working Professional']);

export default function CareerPlanForm({ onSubmit, loading }) {
  const [currentStage, setCurrentStage] = useState('Undergraduate');
  const [targetCareer, setTargetCareer] = useState('Software Engineer');
  const [showSkills, setShowSkills] = useState(true);
  const [skills, setSkills] = useState({
    gpa: 7,
    internships: 1,
    projects: 2,
    certifications: 1,
    soft_skills_score: 5,
    networking_score: 4,
  });

  // If the typed value isn't a known stage, treat user as a working professional
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
    const payload = {
      current_stage: resolvedStage,
      target_career: targetCareer.trim(),
    };
    // If user typed their job instead of picking a known stage, send it as current_role
    if (isCustomStage) {
      payload.current_role = currentStage.trim();
    }
    if (isMLEligible && showSkills) {
      payload.skills = skills;
    }
    onSubmit(payload);
  }

  return (
    <form className="profile-form" onSubmit={handleSubmit}>
      <label>
        Current Stage
        <input
          list="stage-suggestions"
          value={currentStage}
          onChange={handleStageChange}
          placeholder="Select a stage or type your current job"
          required
        />
        <datalist id="stage-suggestions">
          {STAGES.map((s) => (
            <option key={s} value={s} />
          ))}
        </datalist>
      </label>

      <label>
        Target Career
        <input
          list="career-suggestions"
          value={targetCareer}
          onChange={(e) => setTargetCareer(e.target.value)}
          placeholder="Type or select a career goal"
          required
        />
        <datalist id="career-suggestions">
          {SUGGESTED_CAREERS.map((c) => (
            <option key={c} value={c} />
          ))}
        </datalist>
      </label>

      {isMLEligible && (
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={showSkills}
            onChange={(e) => setShowSkills(e.target.checked)}
          />
          Include skill metrics for readiness prediction
        </label>
      )}

      {isMLEligible && showSkills && (
        <>
          {SKILL_FIELDS.map((f) => (
            <label key={f.name}>
              {f.label}
              <input
                name={f.name}
                type={f.type}
                step={f.step}
                min={f.min}
                max={f.max}
                value={skills[f.name]}
                onChange={handleSkillChange}
              />
            </label>
          ))}
        </>
      )}

      <button type="submit" disabled={loading}>
        {loading ? 'Generating Plan…' : 'Generate Career Plan'}
      </button>
    </form>
  );
}
