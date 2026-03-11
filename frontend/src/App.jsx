import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';
import AuthPage from './pages/AuthPage';
import CareerPlanPage from './pages/CareerPlanPage';
import PredictPage from './pages/PredictPage';
import ProfilePage from './pages/ProfilePage';
import ProgressPage from './pages/ProgressPage';

export default function App() {
  const { user, loading } = useAuth();

  if (loading) return <div className="app"><p>Loading…</p></div>;

  return (
    <>
      <Navbar />
      <Routes>
        <Route
          path="/login"
          element={user ? <Navigate to="/" replace /> : <AuthPage />}
        />
        <Route path="/" element={<ProtectedRoute><ProgressPage /></ProtectedRoute>} />
        <Route path="/career-plan" element={<ProtectedRoute><CareerPlanPage /></ProtectedRoute>} />
        <Route path="/predict" element={<ProtectedRoute><PredictPage /></ProtectedRoute>} />
        <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
