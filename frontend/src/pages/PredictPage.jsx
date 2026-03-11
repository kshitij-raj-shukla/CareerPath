import { useState } from 'react';
import { getPrediction } from '../services/api';
import ProfileForm from '../components/ProfileForm';
import Dashboard from '../components/Dashboard';

export default function PredictPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [result, setResult] = useState(null);

  async function handlePredict(profileData) {
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const data = await getPrediction(profileData);
      setProfile(profileData);
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.detail || 'Failed to reach the prediction API');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <h1>Skill Prediction</h1>
      <ProfileForm onSubmit={handlePredict} loading={loading} />
      {error && <div className="error">{error}</div>}
      {result && <Dashboard profile={profile} result={result} />}
    </div>
  );
}
