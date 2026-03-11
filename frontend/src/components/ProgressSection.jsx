import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getProgress, toggleTask } from '../services/api';

function transformEntry(entry) {
  const phaseMap = new Map();
  for (const task of entry.tasks || []) {
    const phaseName = task.phase || 'General';
    if (!phaseMap.has(phaseName)) phaseMap.set(phaseName, []);
    phaseMap.get(phaseName).push({
      task_id: task.id,
      description: task.action,
      done: task.done,
    });
  }
  const phases = [];
  for (const [phase, tasks] of phaseMap) phases.push({ phase, tasks });
  return {
    plan_id: entry.id,
    career: entry.target_career || 'Career Plan',
    stage: entry.current_stage || '',
    phases,
  };
}

function PhaseBlock({ phase, planId, onToggle }) {
  const [open, setOpen] = useState(true);
  const total = phase.tasks.length;
  const done = phase.tasks.filter((t) => t.done).length;
  const pct = total ? Math.round((done / total) * 100) : 0;

  return (
    <div className="rounded-lg border border-gray-100 overflow-hidden mb-2">
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 transition-colors"
      >
        <span className="text-sm font-medium text-gray-800">{phase.phase}</span>
        <div className="flex items-center gap-3">
          <span className="text-xs text-gray-400">{done}/{total}</span>
          <div className="w-16 h-1.5 rounded-full bg-gray-100 overflow-hidden">
            <motion.div
              className="h-full rounded-full bg-linear-to-r from-indigo-500 to-purple-500"
              initial={{ width: 0 }}
              animate={{ width: `${pct}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
          <motion.span
            animate={{ rotate: open ? 180 : 0 }}
            className="text-gray-400 text-xs"
          >▾</motion.span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden"
          >
            <ul className="px-4 pb-4 space-y-2">
              {phase.tasks.map((task) => (
                <li key={task.task_id} className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={task.done}
                    onChange={() => onToggle(planId, task.task_id, !task.done)}
                    className="w-4 h-4 accent-indigo-500 rounded cursor-pointer"
                  />
                  <span className={`text-sm transition-colors ${task.done ? 'text-gray-400 line-through' : 'text-gray-700'}`}>
                    {task.description}
                  </span>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function PlanAccordion({ plan, onToggle }) {
  const [open, setOpen] = useState(true);
  const all = plan.phases.flatMap((p) => p.tasks);
  const doneCount = all.filter((t) => t.done).length;
  const pct = all.length ? Math.round((doneCount / all.length) * 100) : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/85 backdrop-blur-md border border-gray-200 rounded-xl shadow-sm overflow-hidden"
    >
      <button
        onClick={() => setOpen((p) => !p)}
        className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-gray-50 transition-colors"
      >
        <div>
          <h3 className="text-base font-semibold text-gray-900">{plan.career}</h3>
          <p className="text-xs text-gray-500 mt-0.5">{plan.stage} · {doneCount}/{all.length} tasks</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm font-bold text-primary">{pct}%</span>
          <motion.span animate={{ rotate: open ? 180 : 0 }} className="text-gray-400">▾</motion.span>
        </div>
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-6 space-y-3">
              <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
                <motion.div
                  className="h-full rounded-full bg-linear-to-r from-indigo-500 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${pct}%` }}
                  transition={{ duration: 0.6 }}
                />
              </div>
              {plan.phases.map((phase, i) => (
                <PhaseBlock key={i} phase={phase} planId={plan.plan_id} onToggle={onToggle} />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function ProgressSection() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchProgress = useCallback(async () => {
    try {
      setLoading(true);
      const data = await getProgress();
      const entries = data.entries ?? data.plans ?? [];
      setPlans(entries.map(transformEntry));
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to load progress');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProgress(); }, [fetchProgress]);

  const handleToggle = async (planId, taskId, done) => {
    setPlans((prev) =>
      prev.map((plan) =>
        plan.plan_id === planId
          ? {
              ...plan,
              phases: plan.phases.map((ph) => ({
                ...ph,
                tasks: ph.tasks.map((t) =>
                  t.task_id === taskId ? { ...t, done } : t
                ),
              })),
            }
          : plan
      )
    );
    try {
      await toggleTask(planId, taskId, done);
    } catch {
      fetchProgress();
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white/85 backdrop-blur-md border border-gray-200 rounded-xl p-6 text-center shadow-sm">
        <p className="text-red-500 text-sm">{error}</p>
        <button onClick={fetchProgress} className="mt-3 text-xs text-primary hover:underline">Retry</button>
      </div>
    );
  }

  if (!plans.length) {
    return (
      <motion.div
        className="bg-white/85 backdrop-blur-md border border-gray-200 rounded-xl p-12 text-center shadow-sm flex flex-col items-center justify-center min-h-80 mt-8"
        initial={{ opacity: 0, scale: 0.97 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.4 }}
      >
        <motion.div
          className="w-20 h-20 bg-linear-to-br from-primary to-purple-500 rounded-full flex items-center justify-center mb-6"
          animate={{ y: [-3, 3, -3] }}
          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="text-4xl">🚀</span>
        </motion.div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">Start your AI career journey</h3>
        <p className="text-sm text-gray-500 mb-8 max-w-md mx-auto leading-relaxed">
          Generate an AI-powered roadmap to discover the skills, projects, and steps you need to land your dream job.
        </p>
        <button
          onClick={() => window.location.href = '/career-plan'}
          className="px-6 py-3 rounded-lg font-semibold text-white bg-primary hover:bg-primary-dark transition-colors cursor-pointer"
        >
          Generate Career Plan
        </button>
      </motion.div>
    );
  }

  return (
    <div className="space-y-8">
      {plans.map((plan) => (
        <PlanAccordion key={plan.plan_id} plan={plan} onToggle={handleToggle} />
      ))}
    </div>
  );
}
