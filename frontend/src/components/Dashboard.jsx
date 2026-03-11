import SkillRadarChart from './SkillRadarChart';

const WEEK_KEYS = ['week_1', 'week_2', 'week_3', 'week_4'];
const WEEK_LABELS = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

export default function Dashboard({ profile, result }) {
  const { career_readiness, confidence, roadmap, skill_analysis, career_recommendations } = result;
  const readyClass = career_readiness === 'Ready' ? 'ready' : career_readiness === 'Moderately Ready' ? 'moderate' : 'not-ready';

  return (
    <div className="results">
      {/* ── Score Banner ────────────────────────────────────── */}
      <div className="card">
        <h2>Prediction Result</h2>
        <div className="score-banner">
          <div className="metric">
            <span className={`value ${readyClass}`}>{career_readiness}</span>
            <span className="label">Career Readiness</span>
          </div>
          <div className="metric">
            <span className="value">{(confidence * 100).toFixed(1)}%</span>
            <span className="label">Confidence</span>
          </div>
          <div className="metric">
            <span className="value">{roadmap.readiness_level}</span>
            <span className="label">Readiness Level</span>
          </div>
        </div>
      </div>

      {/* ── Skill Radar Chart ──────────────────────────────── */}
      <div className="card">
        <h2>Skill Overview</h2>
        <SkillRadarChart profile={profile} />
      </div>

      {/* ── Skill Gap Analysis ─────────────────────────────── */}
      {skill_analysis && skill_analysis.weak_skills.length > 0 && (
        <div className="card">
          <h2>Skill Gap Analysis</h2>
          <p><strong>Priority:</strong> {skill_analysis.improvement_priority}</p>
          <ul className="weak-list">
            {skill_analysis.weak_skills.map((gap, i) => (
              <li key={i}>
                <strong>{gap.skill}</strong> ({gap.current_value}/{gap.threshold}) — {gap.priority} priority
                <br /><em>{gap.suggestion}</em>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Weak Skills ────────────────────────────────────── */}
      {roadmap.weak_skills.length > 0 && (
        <div className="card">
          <h2>Weak Skills</h2>
          <ul className="weak-list">
            {roadmap.weak_skills.map((skill, i) => (
              <li key={i}>{skill}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Recommended Topics ─────────────────────────────── */}
      {roadmap.recommended_topics.length > 0 && (
        <div className="card">
          <h2>Recommended Topics</h2>
          <ul className="weak-list">
            {roadmap.recommended_topics.map((topic, i) => (
              <li key={i}>{topic}</li>
            ))}
          </ul>
        </div>
      )}

      {/* ── 4-Week Improvement Plan ────────────────────────── */}
      <div className="card week-plan">
        <h2>4-Week Improvement Plan</h2>
        {WEEK_KEYS.map((key, i) => {
          const tasks = roadmap.improvement_plan[key];
          if (!tasks || tasks.length === 0) return null;
          return (
            <div key={key}>
              <h3>{WEEK_LABELS[i]}</h3>
              <ul>
                {tasks.map((task, j) => (
                  <li key={j}>{task}</li>
                ))}
              </ul>
            </div>
          );
        })}
        {roadmap.weak_skills.length === 0 && (
          <p>No improvement areas detected — you're on track!</p>
        )}
      </div>

      {/* ── Career Recommendations ─────────────────────────── */}
      {career_recommendations && career_recommendations.recommended_roles.length > 0 && (
        <div className="card">
          <h2>Career Recommendations</h2>
          <ul className="weak-list">
            {career_recommendations.recommended_roles.map((role, i) => (
              <li key={i}>
                <strong>{role}</strong>
                {career_recommendations.reasoning[i] && (
                  <> — <em>{career_recommendations.reasoning[i]}</em></>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
