import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../contexts/AuthContext';
import { getProfile } from '../services/api';

export default function ProfilePage() {
  const { user } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const data = await getProfile();
        setProfile(data);
      } catch {
        // profile may not exist yet
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  const info = profile || {};
  const fields = [
    { label: 'Name', value: user?.name || info.name },
    { label: 'Email', value: user?.email || info.email },
    { label: 'Python', value: info.python },
    { label: 'SQL', value: info.sql },
    { label: 'Excel', value: info.excel },
    { label: 'Communication', value: info.communication },
    { label: 'Problem Solving', value: info.problem_solving },
    { label: 'Creativity', value: info.creativity },
  ];

  return (
    <div style={{ maxWidth: '720px', margin: '0 auto', padding: '0 32px 64px' }}>
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center" style={{ marginBottom: '48px' }}>
        <h1 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-3">Your Profile</h1>
        <p className="text-base text-gray-500">Your account details and last submitted skills.</p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white/85 backdrop-blur-md border border-gray-200 rounded-xl p-8 shadow-sm"
      >
        {/* Avatar */}
        <div className="flex items-center gap-5 mb-8 pb-6 border-b border-gray-100">
          <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-primary-dark flex items-center justify-center text-white text-lg font-semibold">
            {(user?.name || 'U')[0].toUpperCase()}
          </div>
          <div>
            <p className="text-base font-semibold text-gray-900">{user?.name || 'User'}</p>
            <p className="text-xs text-gray-500">{user?.email}</p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {fields.filter(f => f.value !== undefined).map((f) => (
            <div key={f.label} className="p-4 rounded-lg bg-gray-50 border border-gray-100 text-center hover:border-primary/20 transition-colors">
              <p className="text-lg font-bold text-gray-900">{f.value ?? '—'}</p>
              <p className="text-[11px] text-gray-400 mt-1 uppercase tracking-wider font-medium">{f.label}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
