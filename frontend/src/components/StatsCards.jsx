import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const cards = [
  {
    to: '/predict',
    title: 'AI Prediction',
    value: 'Analyze Skills',
    desc: 'Get your readiness score',
    icon: '🎯',
    gradient: 'from-indigo-500 to-purple-500',
  },
  {
    to: '/career-plan',
    title: 'Career Plan',
    value: 'Generate Roadmap',
    desc: 'AI-driven learning path',
    icon: '🗺️',
    gradient: 'from-emerald-500 to-teal-500',
  },
  {
    to: '/progress',
    title: 'Progress Tracker',
    value: 'View Status',
    desc: 'Continue your learning',
    icon: '📈',
    gradient: 'from-amber-500 to-orange-500',
  },
];

export default function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {cards.map((card, i) => (
        <motion.div
          key={card.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.08 * i, duration: 0.4 }}
        >
          <Link
            to={card.to}
            className="block h-full bg-white/85 backdrop-blur-md border border-gray-200
                       rounded-xl p-6 group transition-all duration-200
                       hover:shadow-md hover:-translate-y-1"
          >
            <div className={`w-10 h-10 rounded-lg bg-linear-to-br ${card.gradient}
                            flex items-center justify-center text-xl
                            group-hover:scale-105 transition-transform duration-200 mb-4`}>
              {card.icon}
            </div>
            <p className="text-xs font-medium uppercase tracking-wider text-gray-400 mb-1">
              {card.title}
            </p>
            <p className="text-lg font-semibold text-gray-900 mb-0.5">{card.value}</p>
            <p className="text-xs text-gray-500">{card.desc}</p>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
