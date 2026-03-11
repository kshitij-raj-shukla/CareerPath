import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '', current_stage: '', target_career: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  function handleChange(e) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        await signup({
          name: form.name,
          email: form.email,
          password: form.password,
          current_stage: form.current_stage || null,
          target_career: form.target_career || null,
        });
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1>Career Readiness</h1>
        <p className="auth-subtitle">{isLogin ? 'Sign in to your account' : 'Create a new account'}</p>

        {error && <div className="error">{error}</div>}

        <form onSubmit={handleSubmit} className="auth-form">
          {!isLogin && (
            <label>
              Full Name
              <input name="name" value={form.name} onChange={handleChange} required />
            </label>
          )}
          <label>
            Email
            <input name="email" type="email" value={form.email} onChange={handleChange} required />
          </label>
          <label>
            Password
            <input name="password" type="password" value={form.password} onChange={handleChange} required minLength={6} />
          </label>
          {!isLogin && (
            <>
              <label>
                Current Stage
                <input name="current_stage" value={form.current_stage} onChange={handleChange} placeholder="e.g. Undergraduate, Working Professional" />
              </label>
              <label>
                Target Career
                <input name="target_career" value={form.target_career} onChange={handleChange} placeholder="e.g. Software Engineer" />
              </label>
            </>
          )}
          <button type="submit" disabled={loading}>
            {loading ? 'Please wait…' : isLogin ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        <p className="auth-toggle">
          {isLogin ? "Don't have an account?" : 'Already have an account?'}{' '}
          <button type="button" onClick={() => { setIsLogin(!isLogin); setError(null); }}>
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
}
