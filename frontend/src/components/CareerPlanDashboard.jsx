export default function CareerPlanDashboard({ result }) {
  const {
    target_career,
    current_stage,
    current_role,
    is_custom_career,
    career_path,
    next_steps,
    skill_gaps,
    readiness,
    roadmap,
  } = result;

  return (
    <div className="results">
      {/* ── Header Banner ──────────────────────────────────── */}
      <div className="card">
        <h2>Career Plan</h2>
        <div className="score-banner">
          <div className="metric">
            <span className="value plan-career">{target_career}</span>
            <span className="label">
              Target Career{is_custom_career ? ' (Custom)' : ''}
            </span>
          </div>
          <div className="metric">
            <span className="value">{current_stage}</span>
            <span className="label">Current Stage</span>
          </div>
          {current_role && (
            <div className="metric">
              <span className="value current-role-value">{current_role}</span>
              <span className="label">Current Role</span>
            </div>
          )}
          {readiness && (
            <div className="metric">
              <span className={`value ${readiness.career_readiness === 'Ready' ? 'ready' : 'not-ready'}`}>
                {readiness.career_readiness}
              </span>
              <span className="label">
                Readiness ({(readiness.confidence * 100).toFixed(0)}%)
              </span>
            </div>
          )}
        </div>
      </div>

      {/* ── Roadmap Summary ────────────────────────────────── */}
      {roadmap?.summary && (
        <div className="card">
          <h2>Summary</h2>
          <p className="roadmap-summary">{roadmap.summary}</p>
        </div>
      )}

      {/* ── Career Path Timeline ───────────────────────────── */}
      <div className="card">
        <h2>Career Path</h2>
        <div className="timeline">
          {career_path.map((step, i) => (
            <div key={i} className={`timeline-step ${step.status}`}>
              <div className="timeline-marker" />
              <div className="timeline-content">
                <h3>{step.label}</h3>
                <span className={`stage-badge ${step.status}`}>{step.status}</span>
                <ul>
                  {step.tasks.map((task, j) => (
                    <li key={j}>{task}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Next Steps ─────────────────────────────────────── */}
      {next_steps.length > 0 && (
        <div className="card">
          <h2>Immediate Next Steps</h2>
          <ul className="weak-list">
            {next_steps.map((step, i) => (
              <li key={i} className={step.startsWith('[Next Stage]') ? 'next-stage-item' : ''}>
                {step}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Skill Gaps ─────────────────────────────────────── */}
      {skill_gaps.length > 0 && (
        <div className="card">
          <h2>Skill Gaps</h2>
          <ul className="weak-list">
            {skill_gaps.map((gap, i) => (
              <li key={i}>
                <strong className={`priority-${gap.priority}`}>{gap.skill}</strong>
                {' — '}<span className={`priority-${gap.priority}`}>{gap.priority}</span> priority
                <br />
                <em>{gap.recommendation}</em>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* ── Phased Roadmap ─────────────────────────────────── */}
      {roadmap?.phases && (
        <div className="card week-plan">
          <h2>Personalised Roadmap</h2>
          {roadmap.phases.map((phase, i) => (
            <div key={i}>
              <h3>{phase.phase}</h3>
              <ul>
                {phase.actions.map((action, j) => (
                  <li key={j}>{action}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
