import { motion } from 'framer-motion';

const steps = [
  { week: 'Week 1', title: 'Learn DSA basics', desc: 'Arrays, strings, linked lists', done: true },
  { week: 'Week 2', title: 'Build first project', desc: 'Full-stack CRUD application', done: true },
  { week: 'Week 3', title: 'Improve networking', desc: 'LinkedIn, meetups, referrals', done: false },
  { week: 'Week 4', title: 'Mock interviews', desc: 'Practice behavioral & technical', done: false },
];

export default function RoadmapTimeline() {
  return (
    <div className="space-y-4">
      {steps.map((step, i) => (
        <motion.div
          key={step.week}
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 * i, duration: 0.35 }}
          className="flex items-start gap-4 group"
        >
          {/* Circle indicator */}
          <div className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center mt-0.5
                          ${step.done
                            ? 'bg-emerald-500 text-white'
                            : 'border-2 border-gray-300 bg-white text-gray-400'
                          }`}>
            {step.done ? (
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
              </svg>
            ) : (
              <span className="text-xs font-semibold">{i + 1}</span>
            )}
          </div>

          {/* Content */}
          <div className="flex-1 pb-4 border-b border-gray-100 last:border-0">
            <p className={`text-xs font-semibold uppercase tracking-wider mb-0.5
                          ${step.done ? 'text-emerald-600' : 'text-primary'}`}>
              {step.week}
            </p>
            <p className={`text-sm font-medium ${step.done ? 'text-gray-400 line-through' : 'text-gray-900'}`}>
              {step.title}
            </p>
            <p className="text-xs text-gray-500 mt-0.5">{step.desc}</p>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
