import { motion } from 'framer-motion';

const FEATURES = [
  {
    icon: '📊',
    title: 'AI Readiness Score',
    desc: 'Get an ML-powered career readiness prediction based on your skills and experience.',
    color: 'from-indigo-500 to-indigo-400',
  },
  {
    icon: '🗺️',
    title: 'Personalized Roadmap',
    desc: 'Receive a step-by-step career roadmap tailored to your goals and current stage.',
    color: 'from-emerald-500 to-teal-400',
  },
  {
    icon: '📈',
    title: 'Skill Gap Analysis',
    desc: 'Identify weak areas and get targeted suggestions for rapid improvement.',
    color: 'from-amber-500 to-orange-400',
  },
  {
    icon: '✅',
    title: 'Progress Tracking',
    desc: 'Track tasks, monitor milestones, and visualize your career journey over time.',
    color: 'from-purple-500 to-violet-400',
  },
];

const cardVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.4, ease: 'easeOut' },
  }),
};

export default function FeaturesSection() {
  return (
    <section id="features" className="py-20 px-6 relative">
      <div className="max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Everything you need to <span className="gradient-text">accelerate your career</span>
          </h2>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Our AI analyzes your profile and delivers actionable insights to help you bridge
            skill gaps and land your dream role.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              custom={i}
              variants={cardVariants}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: '-60px' }}
              className="bg-white/85 backdrop-blur-md border border-gray-200 rounded-xl p-6 shadow-sm
                         hover:shadow-md hover:-translate-y-1 transition-all duration-200 group cursor-default"
            >
              <div className={`w-12 h-12 rounded-xl bg-linear-to-br ${f.color} flex items-center justify-center mb-4`}>
                <span className="text-2xl">{f.icon}</span>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{f.title}</h3>
              <p className="text-sm text-gray-500 leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
