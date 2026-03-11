import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  function handleLogout() {
    logout();
    navigate('/login');
  }

  if (!user) return null;

  return (
    <nav className="navbar">
      <span className="navbar-brand">Career Readiness</span>
      <div className="navbar-links">
        <NavLink to="/" end>My Progress</NavLink>
        <NavLink to="/career-plan">Career Plan</NavLink>
        <NavLink to="/predict">Skill Prediction</NavLink>
        <NavLink to="/profile">Profile</NavLink>
      </div>
      <div className="navbar-user">
        <span>Hi, {user.name}</span>
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
}
