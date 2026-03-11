import { motion } from 'framer-motion';

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
  }),
};

const card = 'bg-white/85 backdrop-blur-md border border-gray-200 rounded-xl p-6 shadow-sm';

export default function CareerPlanDashboard({ result }) {
  const {
    target_career, current_stage, current_role, is_custom_career,
    career_path, next_steps, skill_gaps, readiness, roadmap,
  } = result;

  return (
    <div className="space-y-10 mt-10">
      {/* Header Banner */}
      <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible" className={card}>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Career Plan</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-xl font-bold text-primary">{target_career}</p>
            <p className="text-xs text-gray-400 mt-1">Target{is_custom_career ? ' (Custom)' : ''}</p>
          </div>
          <div>
            <p className="text-xl font-bold text-gray-900">{current_stage}</p>
            <p className="text-xs text-gray-400 mt-1">Current Stage</p>
          </div>
          {current_role && (
            <div>
              <p className="text-xl font-bold text-emerald-600">{current_role}</p>
              <p className="text-xs text-gray-400 mt-1">Current Role</p>
            </div>
          )}
          {readiness && (
            <div>
              <p className={`text-xl font-bold ${readiness.career_readiness === 'Ready' ? 'text-emerald-600' : 'text-red-500'}`}>
                {readiness.career_readiness}
              </p>
              <p className="text-xs text-gray-400 mt-1">
                Readiness ({(readiness.confidence * 100).toFixed(0)}%)
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Summary */}
      {roadmap?.summary && (
        <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible" className={card}>
          <h3 className="text-base font-semibold text-gray-900 mb-3">Summary</h3>
          <p className="text-sm text-gray-500 leading-relaxed">{roadmap.summary}</p>
        </motion.div>
      )}

      {/* Career Path Timeline */}
      <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible" className={card}>
        <h3 className="text-base font-semibold text-gray-900 mb-6">Career Path</h3>
        <div className="relative pl-6 border-l-2 border-gray-200 space-y-6">
          {career_path.map((step, i) => {
            const dotColor = step.status === 'completed' ? 'bg-emerald-500' : step.status === 'current' ? 'bg-primary' : 'bg-gray-300';
            const ringColor = step.status === 'current' ? 'ring-primary/20' : 'ring-transparent';
            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.15 * i, duration: 0.4 }}
                className="relative"
              >
                <div className={`absolute -left-[1.85rem] top-1 w-3.5 h-3.5 rounded-full ${dotColor} ring-4 ${ringColor}`} />
                <div className="ml-2">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="text-sm font-semibold text-gray-900">{step.label}</h4>
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider
                      ${step.status === 'completed' ? 'bg-emerald-50 text-emerald-600' :
                        step.status === 'current' ? 'bg-indigo-50 text-primary' :
                        'bg-gray-100 text-gray-400'}`}>
                      {step.status}
                    </span>
                  </div>
                  <ul className="space-y-0.5">
                    {step.tasks.map((task, j) => (
                      <li key={j} className="text-xs text-gray-500 flex items-start gap-1.5">
                        <span className="text-gray-300 mt-0.5">›</span>{task}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Next Steps */}
      {next_steps.length > 0 && (
        <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible" className={card}>
          <h3 className="text-base font-semibold text-gray-900 mb-3">Immediate Next Steps</h3>
          <ul className="space-y-2">
            {next_steps.map((step, i) => (
              <li key={i} className={`text-sm flex items-start gap-2 ${
                step.startsWith('[Next Stage]') ? 'text-primary italic' : 'text-gray-500'
              }`}>
                <span className="text-primary mt-0.5">→</span>{step}
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Skill Gaps */}
      {skill_gaps.length > 0 && (
        <motion.div custom={4} variants={cardVariants} initial="hidden" animate="visible" className={card}>
          <h3 className="text-base font-semibold text-gray-900 mb-3">Skill Gaps</h3>
          <div className="space-y-3">
            {skill_gaps.map((gap, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${
                  gap.priority === 'high' ? 'bg-red-500' : gap.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />
                <div>
                  <p className="text-sm font-medium text-gray-900">{gap.skill}
                    <span className={`ml-2 text-xs ${
                      gap.priority === 'high' ? 'text-red-500' : gap.priority === 'medium' ? 'text-amber-500' : 'text-emerald-600'
                    }`}>({gap.priority})</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{gap.recommendation}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Phased Roadmap */}
      {roadmap?.phases && (
        <motion.div custom={5} variants={cardVariants} initial="hidden" animate="visible" className={card}>
          <h3 className="text-base font-semibold text-gray-900 mb-4">Personalised Roadmap</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {roadmap.phases.map((phase, i) => (
              <div key={i} className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                <h4 className="text-sm font-semibold text-primary mb-2">{phase.phase}</h4>
                <ul className="space-y-1">
                  {phase.actions.map((action, j) => (
                    <li key={j} className="text-xs text-gray-600 flex items-start gap-1.5">
                      <span className="text-primary mt-0.5">•</span>{action}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
