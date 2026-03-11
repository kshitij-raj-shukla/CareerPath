import { useState, useEffect } from 'react';
import { getProgress, toggleTask } from '../services/api';

function formatDuration(days) {
  if (days >= 365) {
    const y = Math.round(days / 365);
    return `~${y} year${y > 1 ? 's' : ''}`;
  }
  if (days >= 30) {
    const m = Math.round(days / 30);
    return `~${m} month${m > 1 ? 's' : ''}`;
  }
  return `~${days} day${days > 1 ? 's' : ''}`;
}

function GoalAccordion({ entry, isOpen, onToggleOpen, onTaskToggle }) {
  const tasks = entry.tasks || [];
  const doneCount = tasks.filter((t) => t.done).length;
  const totalCount = tasks.length;
  const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;
  const remainingDays = tasks.filter((t) => !t.done).reduce((s, t) => s + t.estimated_days, 0);

  // Group tasks by phase
  const phases = [];
  const phaseMap = {};
  for (const task of tasks) {
    if (!phaseMap[task.phase]) {
      phaseMap[task.phase] = [];
      phases.push(task.phase);
    }
    phaseMap[task.phase].push(task);
  }

  return (
    <div className={`goal-accordion${isOpen ? ' goal-open' : ''}`}>
      <button type="button" className="goal-header" onClick={onToggleOpen}>
        <div className="goal-header-left">
          <span className={`goal-arrow${isOpen ? ' goal-arrow-open' : ''}`}>&#9656;</span>
          <div>
            <span className="goal-title">{entry.target_career || 'Career Plan'}</span>
            <span className="goal-stage">
              {entry.current_stage}
              {entry.current_role ? ` · ${entry.current_role}` : ''}
            </span>
          </div>
        </div>
        <div className="goal-header-right">
          <div className="goal-mini-bar">
            <div className="goal-mini-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="goal-pct">{pct}%</span>
          <span className="goal-remaining">{formatDuration(remainingDays)} left</span>
        </div>
      </button>

      {isOpen && (
        <div className="goal-body">
          <div className="goal-stats-row">
            <span>{doneCount}/{totalCount} tasks done</span>
            <span>Remaining: <strong>{formatDuration(remainingDays)}</strong></span>
            <span className="progress-date-small">
              Created {new Date(entry.created_at).toLocaleDateString()}
            </span>
          </div>

          {entry.roadmap_summary && (
            <p className="progress-summary">{entry.roadmap_summary}</p>
          )}

          {phases.map((phase) => {
            const phaseTasks = phaseMap[phase];
            const phaseDone = phaseTasks.filter((t) => t.done).length;
            return (
              <div key={phase} className="progress-phase">
                <h3 className="progress-phase-title">
                  {phase}
                  <span className="phase-count">{phaseDone}/{phaseTasks.length}</span>
                </h3>
                <ul className="todo-list">
                  {phaseTasks.map((task) => (
                    <li key={task.id} className={`todo-item${task.done ? ' todo-done' : ''}`}>
                      <span className="todo-check-wrap">
                        <input
                          type="checkbox"
                          checked={task.done}
                          onChange={(e) => {
                            e.stopPropagation();
                            onTaskToggle(entry.id, task.id, !task.done);
                          }}
                        />
                      </span>
                      <span
                        className="todo-text"
                        onClick={() => onTaskToggle(entry.id, task.id, !task.done)}
                      >
                        {task.action}
                      </span>
                      <span className="todo-time">{formatDuration(task.estimated_days)}</span>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default function ProgressPage() {
  const [progress, setProgress] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openId, setOpenId] = useState(null);

  useEffect(() => {
    getProgress()
      .then((data) => {
        setProgress(data);
        // Auto-open the first goal
        if (data && data.entries && data.entries.length > 0) {
          setOpenId(data.entries[0].id);
        }
      })
      .catch((err) => setError(err.response?.data?.detail || 'Failed to load progress'))
      .finally(() => setLoading(false));
  }, []);

  function handleToggleOpen(id) {
    setOpenId((prev) => (prev === id ? null : id));
  }

  async function handleTaskToggle(planId, taskId, done) {
    // Optimistic update
    setProgress((prev) => {
      if (!prev) return prev;
      return {
        ...prev,
        entries: prev.entries.map((entry) =>
          entry.id === planId
            ? {
                ...entry,
                tasks: entry.tasks.map((t) =>
                  t.id === taskId ? { ...t, done } : t
                ),
              }
            : entry
        ),
      };
    });
    try {
      await toggleTask(planId, taskId, done);
    } catch {
      // Revert on failure
      setProgress((prev) => {
        if (!prev) return prev;
        return {
          ...prev,
          entries: prev.entries.map((entry) =>
            entry.id === planId
              ? {
                  ...entry,
                  tasks: entry.tasks.map((t) =>
                    t.id === taskId ? { ...t, done: !done } : t
                  ),
                }
              : entry
          ),
        };
      });
    }
  }

  if (loading) return <div className="app"><p>Loading progress…</p></div>;

  return (
    <div className="app">
      <h1>My Progress</h1>

      {error && <div className="error">{error}</div>}

      {progress && progress.count === 0 && (
        <div className="card">
          <p>No career plans yet. Go to <strong>Career Plan</strong> to create one!</p>
        </div>
      )}

      <div className="goals-list">
        {progress && progress.entries && progress.entries.map((entry) => (
          <GoalAccordion
            key={entry.id}
            entry={entry}
            isOpen={openId === entry.id}
            onToggleOpen={() => handleToggleOpen(entry.id)}
            onTaskToggle={handleTaskToggle}
          />
        ))}
      </div>
    </div>
  );
}
