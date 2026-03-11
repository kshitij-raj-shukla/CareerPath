import { motion } from 'framer-motion';
import SkillRadarChart from './SkillRadarChart';
import ProgressBar from './ProgressBar';

const WEEK_KEYS = ['week_1', 'week_2', 'week_3', 'week_4'];
const WEEK_LABELS = ['Week 1', 'Week 2', 'Week 3', 'Week 4'];

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1, y: 0,
    transition: { delay: i * 0.1, duration: 0.4, ease: 'easeOut' },
  }),
};

const card = 'bg-white/85 backdrop-blur-md border border-gray-200 rounded-xl p-6 shadow-sm';

export default function ResultsDashboard({ profile, result }) {
  const { career_readiness, confidence, roadmap, skill_analysis, career_recommendations } = result;
  const isReady = career_readiness === 'Ready';
  const confidencePct = (confidence * 100).toFixed(1);

  return (
    <div className="space-y-10 mt-10">
      {/* Score Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <motion.div custom={0} variants={cardVariants} initial="hidden" animate="visible" className={`${card} text-center`}>
          <p className="text-sm text-gray-500 mb-1">Career Readiness</p>
          <p className={`text-2xl font-bold ${isReady ? 'text-emerald-600' : 'text-red-500'}`}>{career_readiness}</p>
        </motion.div>
        <motion.div custom={1} variants={cardVariants} initial="hidden" animate="visible" className={`${card} text-center`}>
          <p className="text-sm text-gray-500 mb-2">Confidence</p>
          <ProgressBar value={parseFloat(confidencePct)} color={isReady ? 'from-emerald-500 to-teal-500' : 'from-red-500 to-orange-400'} size="md" />
        </motion.div>
        <motion.div custom={2} variants={cardVariants} initial="hidden" animate="visible" className={`${card} text-center`}>
          <p className="text-sm text-gray-500 mb-1">Readiness Level</p>
          <p className="text-2xl font-bold text-primary">{roadmap.readiness_level}</p>
        </motion.div>
      </div>

      {/* Radar Chart */}
      <motion.div custom={3} variants={cardVariants} initial="hidden" animate="visible" className={card}>
        <h3 className="text-base font-semibold text-gray-900 mb-4">Skill Overview</h3>
        <div className="h-80">
          <SkillRadarChart profile={profile} />
        </div>
      </motion.div>

      {/* Skill Gap Analysis */}
      {skill_analysis && skill_analysis.weak_skills.length > 0 && (
        <motion.div custom={4} variants={cardVariants} initial="hidden" animate="visible" className={card}>
          <h3 className="text-base font-semibold text-gray-900 mb-4">Skill Gap Analysis</h3>
          <p className="text-sm text-gray-500 mb-3">
            Priority: <span className="text-amber-600 font-semibold">{skill_analysis.improvement_priority}</span>
          </p>
          <div className="space-y-3">
            {skill_analysis.weak_skills.map((gap, i) => (
              <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 border border-gray-100">
                <div className={`w-2 h-2 mt-2 rounded-full shrink-0 ${
                  gap.priority === 'high' ? 'bg-red-500' : gap.priority === 'medium' ? 'bg-amber-500' : 'bg-emerald-500'
                }`} />
                <div>
                  <p className="text-sm font-medium text-gray-900">
                    {gap.skill} <span className="text-gray-400">({gap.current_value}/{gap.threshold})</span>
                  </p>
                  <p className="text-xs text-gray-500 mt-0.5">{gap.suggestion}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      )}

      {/* Weak Skills & Topics */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {roadmap.weak_skills.length > 0 && (
          <motion.div custom={5} variants={cardVariants} initial="hidden" animate="visible" className={card}>
            <h3 className="text-base font-semibold text-gray-900 mb-3">Weak Skills</h3>
            <div className="flex flex-wrap gap-2">
              {roadmap.weak_skills.map((skill, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-red-50 text-red-600 border border-red-100">{skill}</span>
              ))}
            </div>
          </motion.div>
        )}
        {roadmap.recommended_topics.length > 0 && (
          <motion.div custom={6} variants={cardVariants} initial="hidden" animate="visible" className={card}>
            <h3 className="text-base font-semibold text-gray-900 mb-3">Recommended Topics</h3>
            <div className="flex flex-wrap gap-2">
              {roadmap.recommended_topics.map((topic, i) => (
                <span key={i} className="px-3 py-1 rounded-full text-xs font-medium bg-indigo-50 text-primary border border-indigo-100">{topic}</span>
              ))}
            </div>
          </motion.div>
        )}
      </div>

      {/* 4-Week Improvement Plan */}
      <motion.div custom={7} variants={cardVariants} initial="hidden" animate="visible" className={card}>
        <h3 className="text-base font-semibold text-gray-900 mb-4">4-Week Improvement Plan</h3>
        {roadmap.weak_skills.length === 0 ? (
          <p className="text-gray-500 text-sm">No improvement areas detected — you're on track!</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {WEEK_KEYS.map((key, i) => {
              const tasks = roadmap.improvement_plan[key];
              if (!tasks || tasks.length === 0) return null;
              return (
                <div key={key} className="p-4 rounded-lg bg-gray-50 border border-gray-100">
                  <h4 className="text-sm font-semibold text-primary mb-2">{WEEK_LABELS[i]}</h4>
                  <ul className="space-y-1">
                    {tasks.map((task, j) => (
                      <li key={j} className="text-xs text-gray-600 flex items-start gap-2">
                        <span className="text-primary mt-0.5">•</span>{task}
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </motion.div>

      {/* Career Recommendations */}
      {career_recommendations && career_recommendations.recommended_roles.length > 0 && (
        <motion.div custom={8} variants={cardVariants} initial="hidden" animate="visible" className={card}>
          <h3 className="text-base font-semibold text-gray-900 mb-4">Career Recommendations</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {career_recommendations.recommended_roles.map((role, i) => (
              <div key={i} className="p-4 rounded-lg bg-indigo-50/50 border border-indigo-100 hover:border-primary/30 transition-colors">
                <h4 className="text-sm font-semibold text-gray-900">{role}</h4>
                {career_recommendations.reasoning[i] && (
                  <p className="text-xs text-gray-500 mt-1">{career_recommendations.reasoning[i]}</p>
                )}
              </div>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}
