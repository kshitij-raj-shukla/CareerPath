import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, signup } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLogin) {
        await login(form.email, form.password);
      } else {
        await signup({ name: form.name, email: form.email, password: form.password });
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.detail || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 relative overflow-hidden z-10">
      <div className="absolute top-1/4 -left-32 w-72 h-72 bg-primary/5 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-72 h-72 bg-indigo-300/10 rounded-full blur-[120px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white/85 backdrop-blur-md border border-gray-200 rounded-2xl p-8 w-full max-w-md relative z-10 shadow-sm"
      >
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-linear-to-br from-primary to-primary-dark flex items-center justify-center">
              <span className="text-white text-2xl font-extrabold">C</span>
            </div>
            <span className="text-3xl font-extrabold text-gray-900">CareerAI</span>
          </div>
          <p className="text-sm font-medium text-gray-500">
            {isLogin ? 'Sign in to your account' : 'Create your account'}
          </p>
        </div>

        {/* Tabs */}
        <div className="flex mb-6 bg-gray-100 rounded-xl p-1">
          {['Sign In', 'Sign Up'].map((label, i) => {
            const active = i === 0 ? isLogin : !isLogin;
            return (
              <button
                key={label}
                onClick={() => { setIsLogin(i === 0); setError(''); }}
                className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all ${
                  active ? 'bg-white text-primary shadow-sm' : 'text-gray-400 hover:text-gray-600'
                }`}
              >
                {label}
              </button>
            );
          })}
        </div>

        <AnimatePresence mode="wait">
          <motion.form
            key={isLogin ? 'login' : 'signup'}
            initial={{ opacity: 0, x: isLogin ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: isLogin ? 20 : -20 }}
            transition={{ duration: 0.25 }}
            onSubmit={handleSubmit}
            className="space-y-4"
          >
            {!isLogin && (
              <div>
                <label className="block text-xs text-gray-500 mb-1">Name</label>
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required={!isLogin}
                  placeholder="Your name"
                  className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm text-gray-900
                    placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
                />
              </div>
            )}
            <div>
              <label className="block text-xs text-gray-500 mb-1">Email</label>
              <input
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                required
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm text-gray-900
                  placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Password</label>
              <input
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                required
                placeholder="••••••••"
                className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm text-gray-900
                  placeholder-gray-400 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-colors"
              />
            </div>

            {error && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="text-xs text-red-500 text-center">{error}</motion.p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-primary hover:bg-primary-dark text-white text-[15px] font-semibold
                active:scale-[0.98] transition-all duration-200 disabled:opacity-60 cursor-pointer"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Processing…
                </span>
              ) : isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </motion.form>
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
