import { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, signup as apiSignup, getProfile } from '../services/api';

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);

  // On mount, if a token exists try to load the user profile
  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }
    getProfile()
      .then(setUser)
      .catch(() => {
        // Token invalid / expired – clear it
        localStorage.removeItem('token');
        setToken(null);
      })
      .finally(() => setLoading(false));
  }, [token]);

  async function login(email, password) {
    const data = await apiLogin(email, password);
    localStorage.setItem('token', data.access_token);
    setToken(data.access_token);
    const profile = await getProfile();
    setUser(profile);
    return profile;
  }

  async function signup(payload) {
    await apiSignup(payload);
    // Auto-login after signup
    return login(payload.email, payload.password);
  }

  function logout() {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
  }

  const value = { user, token, loading, login, signup, logout };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
