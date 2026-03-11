import { useState } from 'react';
import { motion } from 'framer-motion';
import CareerPlanForm from '../components/CareerPlanForm';
import CareerPlanDashboard from '../components/CareerPlanDashboard';
import { getCareerPlan } from '../services/api';

export default function CareerPlanPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (payload) => {
    setError('');
    setLoading(true);
    try {
      const data = await getCareerPlan(payload);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to generate career plan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 32px 64px' }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center" style={{ marginBottom: '48px' }}>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Career Plan Generator</h1>
        <p className="text-base text-gray-500">Get a personalised AI-driven roadmap for your target career.</p>
      </motion.div>

      <CareerPlanForm onSubmit={handleSubmit} loading={loading} />

      {error && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="mt-4 text-sm text-red-500 text-center">{error}</motion.p>
      )}

      {result && <CareerPlanDashboard result={result} />}
    </div>
  );
}
