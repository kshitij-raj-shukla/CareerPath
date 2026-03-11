import { Routes, Route, Navigate } from 'react-router-dom';
import { Suspense, lazy } from 'react';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

const ParticleField = lazy(() => import('./components/ParticleField'));

import AuthPage from './pages/AuthPage';
import HomePage from './pages/HomePage';
import CareerPlanPage from './pages/CareerPlanPage';
import PredictPage from './pages/PredictPage';
import ProfilePage from './pages/ProfilePage';
import ProgressPage from './pages/ProgressPage';

export default function App() {
  const { user, loading } = useAuth();

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );

  return (
    <>
      {/* Global 3D Background */}
      <Suspense fallback={null}>
        <ParticleField />
      </Suspense>

      <Navbar />
      <main className="relative z-10 w-full overflow-x-hidden" style={{ paddingTop: '96px', paddingBottom: '64px' }}>
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <AuthPage />}
        />
        <Route path="/" element={<HomePage />} />
        <Route path="/progress" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
        <Route path="/career-plan" element={<ProtectedRoute><CareerPlanPage /></ProtectedRoute>} />
        <Route path="/predict" element={<ProtectedRoute><PredictPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      </main>
    </>
  );
}
