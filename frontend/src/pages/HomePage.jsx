import { useAuth } from '../contexts/AuthContext';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import Dashboard from '../components/Dashboard';

export default function HomePage() {
  const { user } = useAuth();

  if (user) return <Dashboard />;

  return (
    <div>
      <HeroSection />
      <FeaturesSection />
    </div>
  );
}
