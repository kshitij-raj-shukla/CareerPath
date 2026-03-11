import { useState } from 'react';
import { motion } from 'framer-motion';
import PredictionForm from '../components/PredictionForm';
import ResultsDashboard from '../components/ResultsDashboard';
import { getPrediction } from '../services/api';

export default function PredictPage() {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (profile) => {
    setError('');
    setLoading(true);
    try {
      const data = await getPrediction(profile);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Prediction failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '960px', margin: '0 auto', padding: '0 32px 64px' }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center" style={{ marginBottom: '48px' }}>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">AI Career Prediction</h1>
        <p className="text-base text-gray-500">Enter your skills to get an AI-powered readiness assessment.</p>
      </motion.div>

      <PredictionForm onSubmit={handleSubmit} loading={loading} />

      {error && (
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          className="mt-4 text-sm text-red-500 text-center">{error}</motion.p>
      )}

      {result && <ResultsDashboard result={result} />}
    </div>
  );
}
