import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { getPrediction } from '../services/api';
import ProfileForm from '../components/ProfileForm';
import Dashboard from '../components/Dashboard';
import ProgressSection from '../components/ProgressSection';

export default function HomePage() {
  const { user } = useAuth();

  return (
    <div className="app">
      {user ? <LoggedInHome /> : <GuestHome />}
    </div>
  );
}

/* ── Logged-in view: show progress ──────────────────────────── */
function LoggedInHome() {
  return (
    <>
      <div className="home-welcome">
        <h1>Welcome Back!</h1>
        <p className="home-subtitle">Track your career progress and keep growing.</p>
      </div>
      <ProgressSection />
    </>
  );
}

/* ── Guest view: prediction box + login prompt for roadmap ──── */
function GuestHome() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [profile, setProfile] = useState(null);
  const [result, setResult] = useState(null);
  const [showLoginPrompt, setShowLoginPrompt] = useState(false);

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
    <>
      <div className="home-hero">
        <h1>Career Readiness Predictor</h1>
        <p className="home-subtitle">
          Enter your skills and experience below to get an instant career readiness prediction.
        </p>
      </div>

      <ProfileForm onSubmit={handlePredict} loading={loading} />

      {error && <div className="error">{error}</div>}

      {result && (
        <>
          <Dashboard profile={profile} result={result} />

          <div className="home-roadmap-cta">
            <div className="card">
              <h2>Want a Personalized Roadmap?</h2>
              <p>Sign in to get a detailed career plan, track your progress, and unlock your full roadmap.</p>
              <button
                className="cta-login-btn"
                onClick={() => setShowLoginPrompt(true)}
              >
                Get My Roadmap
              </button>
            </div>
          </div>
        </>
      )}

      {showLoginPrompt && (
        <div className="login-prompt-overlay" onClick={() => setShowLoginPrompt(false)}>
          <div className="login-prompt-modal" onClick={(e) => e.stopPropagation()}>
            <button className="login-prompt-close" onClick={() => setShowLoginPrompt(false)}>
              &times;
            </button>
            <h2>Sign In Required</h2>
            <p>Create an account or sign in to access your personalized career roadmap, track progress, and more.</p>
            <div className="login-prompt-actions">
              <button className="cta-login-btn" onClick={() => navigate('/login')}>
                Sign In / Sign Up
              </button>
              <button className="cta-secondary-btn" onClick={() => setShowLoginPrompt(false)}>
                Maybe Later
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
