import { useState } from 'react';
import { getCareerPlan } from '../services/api';
import CareerPlanForm from '../components/CareerPlanForm';
import CareerPlanDashboard from '../components/CareerPlanDashboard';

export default function CareerPlanPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [result, setResult] = useState(null);

  async function handleCareerPlan(userProfile) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await getCareerPlan(userProfile);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to reach the career plan API');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <h1>Career Plan</h1>
      <CareerPlanForm onSubmit={handleCareerPlan} loading={loading} />
      {error && <div className="error">{error}</div>}
      {result && <CareerPlanDashboard result={result} />}
    </div>
  );
}
