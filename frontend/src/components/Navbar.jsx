import { motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useState } from 'react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, 'change', (v) => setScrolled(v > 20));

  function handleLogout() {
    logout();
    navigate('/');
    setMobileOpen(false);
  }

  const linkClass = ({ isActive }) =>
    `px-3 py-1.5 rounded-lg text-sm font-medium transition-all duration-200 ${
      isActive
        ? 'bg-primary/10 text-primary'
        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
    }`;

  return (
    <motion.nav
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b ${
        scrolled
          ? 'bg-white/90 backdrop-blur-xl border-gray-200 shadow-sm'
          : 'bg-white/80 backdrop-blur-lg border-gray-100'
      }`}
      initial={{ y: -60 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <NavLink to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-lg bg-linear-to-br from-primary to-primary-dark flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <span className="text-lg font-bold text-gray-900 group-hover:text-primary transition-colors">
              Career AI
            </span>
          </NavLink>

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-4">
            <NavLink to="/" end className={linkClass}>Home</NavLink>
            {user && (
              <>
                <NavLink to="/progress" className={linkClass}>Dashboard</NavLink>
                <NavLink to="/career-plan" className={linkClass}>Career Plan</NavLink>
                <NavLink to="/predict" className={linkClass}>Predict</NavLink>
                <NavLink to="/profile" className={linkClass}>Profile</NavLink>
              </>
            )}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <span className="text-sm text-gray-500">
                  Hi, <span className="text-gray-900 font-medium">{user.name}</span>
                </span>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={handleLogout}
                  className="px-4 py-1.5 rounded-lg text-sm font-medium
                             border border-gray-200 text-gray-600
                             hover:bg-gray-50 hover:text-gray-900
                             transition-all cursor-pointer"
                >
                  Logout
                </motion.button>
              </>
            ) : (
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => navigate('/login')}
                className="px-5 py-1.5 rounded-lg text-sm font-semibold text-white
                           bg-primary hover:bg-primary-dark
                           transition-colors cursor-pointer"
              >
                Sign In
              </motion.button>
            )}
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 text-gray-500 hover:text-gray-900 transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              {mobileOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden flex flex-col gap-1 border-t border-gray-100 pt-3 pb-4"
          >
            <NavLink to="/" end className={(p) => `block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${p.isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`} onClick={() => setMobileOpen(false)}>Home</NavLink>
            {user && (
              <>
                <NavLink to="/progress" className={(p) => `block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${p.isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`} onClick={() => setMobileOpen(false)}>Dashboard</NavLink>
                <NavLink to="/career-plan" className={(p) => `block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${p.isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`} onClick={() => setMobileOpen(false)}>Career Plan</NavLink>
                <NavLink to="/predict" className={(p) => `block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${p.isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`} onClick={() => setMobileOpen(false)}>Predict</NavLink>
                <NavLink to="/profile" className={(p) => `block px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${p.isActive ? 'bg-primary/10 text-primary' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'}`} onClick={() => setMobileOpen(false)}>Profile</NavLink>
              </>
            )}
            <div className="border-t border-gray-100 mt-2 pt-2">
              {user ? (
                <button onClick={handleLogout} className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-50">Logout</button>
              ) : (
                <button onClick={() => { navigate('/login'); setMobileOpen(false); }}
                  className="block w-full text-left px-3 py-2.5 rounded-lg text-sm font-semibold text-primary hover:bg-primary/5">Sign In</button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
