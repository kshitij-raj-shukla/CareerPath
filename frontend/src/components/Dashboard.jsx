import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import StatsCards from './StatsCards';
import ProgressBar from './ProgressBar';
import SkillRadarChart from './SkillRadarChart';
import RoadmapTimeline from './RoadmapTimeline';

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.45, delay, ease: 'easeOut' },
});

function Card({ children, className = '', delay = 0 }) {
  return (
    <motion.div
      {...fadeUp(delay)}
      className={`bg-white/85 backdrop-blur-md border border-gray-200 rounded-xl p-6 shadow-sm
                  hover:shadow-md hover:-translate-y-1 transition-all duration-200 ${className}`}
    >
      {children}
    </motion.div>
  );
}

export default function Dashboard() {
  const { user } = useAuth();
  const readinessScore = 72;
  const radarSkills = [85, 60, 45, 90, 75];

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '24px 40px 80px' }}>

      {/* Header */}
      <section style={{ marginBottom: '56px' }}>
        <motion.div className="flex items-center gap-4" {...fadeUp(0)}>
          <div className="w-11 h-11 shrink-0 rounded-full bg-linear-to-br from-primary to-primary-dark
                          flex items-center justify-center text-white text-base font-semibold">
            {(user?.name || 'U')[0].toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Welcome back, {user?.name?.split(' ')[0] || 'Explorer'}
            </h1>
            <p className="text-sm text-gray-500 mt-0.5">
              Your AI career journey is 28% away from the next milestone.
            </p>
          </div>
        </motion.div>
      </section>

      {/* Stats Cards */}
      <section style={{ marginBottom: '56px' }}>
        <StatsCards />
      </section>

      {/* Two-column grid */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-8" style={{ marginBottom: '56px' }}>
        <Card delay={0.1}>
          <h2 className="text-base font-semibold text-gray-900 mb-5">⚡ Career Readiness</h2>
          <ProgressBar
            value={readinessScore}
            label="Overall Compatibility"
            color="from-indigo-500 to-purple-500"
            size="lg"
          />
        </Card>

        <Card delay={0.2} className="flex flex-col justify-between">
          <div>
            <p className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">Top Match</p>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Machine Learning Engineer</h3>
            <p className="text-sm text-gray-500 leading-relaxed">
              Based on your strong foundation in Python and Data Structures.
            </p>
          </div>
          <button className="mt-6 w-full py-2.5 rounded-lg text-sm font-medium text-primary
                             border border-primary/20 bg-primary/5 hover:bg-primary/10 transition-colors">
            View Role Profile
          </button>
        </Card>
      </section>

      {/* Skill Radar */}
      <section style={{ marginBottom: '56px' }}>
        <Card delay={0.15}>
          <h2 className="text-base font-semibold text-gray-900 mb-4">🧠 Skill Analysis</h2>
          <div style={{ height: '420px', width: '100%' }}>
            <SkillRadarChart skills={radarSkills} />
          </div>
        </Card>
      </section>

      {/* Roadmap */}
      <section style={{ marginBottom: '56px' }}>
        <Card delay={0.25}>
          <h2 className="text-base font-semibold text-gray-900 mb-5">🚀 Learning Roadmap</h2>
          <RoadmapTimeline />
        </Card>
      </section>
    </div>
  );
}
