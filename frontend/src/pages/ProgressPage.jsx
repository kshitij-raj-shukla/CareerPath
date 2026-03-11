import { motion } from 'framer-motion';
import ProgressSection from '../components/ProgressSection';

export default function ProgressPage() {
  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 32px 64px' }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center" style={{ marginBottom: '48px' }}>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Progress Tracker</h1>
        <p className="text-base text-gray-500">Check off tasks as you complete them to track your career journey.</p>
      </motion.div>
      <ProgressSection />
    </div>
  );
}
