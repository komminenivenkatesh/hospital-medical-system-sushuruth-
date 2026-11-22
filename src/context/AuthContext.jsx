import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socket';

export const DEMO_USERS = {
  Patient: {
    _id: '65f000000000000000000001',
    name: 'Meera Sharma',
    email: 'meera@example.com',
    role: 'patient',
    plan: 'free',
    token: 'demo-token-patient',
  },
  Doctor: {
    _id: '65f000000000000000000002',
    name: 'Dr. Arvind Rao',
    email: 'arvind@example.com',
    role: 'doctor',
    token: 'demo-token-doctor',
  },
  Hospital: {
    _id: '65f000000000000000000003',
    name: 'Apollo Medical Administration',
    email: 'admin@apollohyderabad.com',
    role: 'hospital',
    token: 'demo-token-hospital',
  },
  Admin: {
    _id: '65f000000000000000000004',
    name: 'Admin User',
    email: 'admin@neurocare.com',
    role: 'admin',
    token: 'demo-token-admin',
  },
};

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('nc_token'));
  const [loading, setLoading] = useState(true);

  // On mount: verify existing token and load user
  useEffect(() => {
    const initAuth = async () => {
      const savedToken = localStorage.getItem('nc_token');
      if (!savedToken) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await authAPI.getMe();
        setUser(data);
        setToken(savedToken);
        localStorage.setItem('nc_user', JSON.stringify(data));
        connectSocket();
      } catch (err) {
        // If server is unreachable or token is demo mock, preserve cached session if available
        const savedUserStr = localStorage.getItem('nc_user');
        if (savedUserStr) {
          try {
            const cachedUser = JSON.parse(savedUserStr);
            if (cachedUser && cachedUser.role) {
              setUser(cachedUser);
              setToken(savedToken);
              setLoading(false);
              return;
            }
          } catch (e) {
            // malformed cache
          }
        }
        console.warn('Token expired or invalid, clearing auth');
        localStorage.removeItem('nc_token');
        localStorage.removeItem('nc_user');
        setUser(null);
        setToken(null);
      } finally {
        setLoading(false);
      }
    };
    initAuth();
  }, []);

  const login = useCallback(async (email, password) => {
    const { data } = await authAPI.login(email, password);
    localStorage.setItem('nc_token', data.token);
    localStorage.setItem('nc_user', JSON.stringify(data));
    setToken(data.token);
    setUser(data);
    connectSocket();
    return data;
  }, []);

  const loginDemo = useCallback(async (role) => {
    const demoCredentials = {
      Patient: { email: 'meera@example.com', password: 'password123' },
      Doctor: { email: 'arvind@example.com', password: 'password123' },
      Hospital: { email: 'admin@apollohyderabad.com', password: 'password123' },
      Admin: { email: 'admin@neurocare.com', password: 'password123' },
    };
    const creds = demoCredentials[role];

    // Try live backend login first
    try {
      if (creds) {
        const { data } = await authAPI.login(creds.email, creds.password);
        localStorage.setItem('nc_token', data.token);
        localStorage.setItem('nc_user', JSON.stringify(data));
        setToken(data.token);
        setUser(data);
        connectSocket();
        return data;
      }
    } catch (err) {
      console.warn('Backend demo login failed, activating resilient offline demo session for:', role, err);
    }

    // Resilient fallback for offline/development mode
    const fallbackUser = DEMO_USERS[role] || DEMO_USERS.Patient;
    localStorage.setItem('nc_token', fallbackUser.token);
    localStorage.setItem('nc_user', JSON.stringify(fallbackUser));
    setToken(fallbackUser.token);
    setUser(fallbackUser);
    return fallbackUser;
  }, []);

  const register = useCallback(async (userData) => {
    const { data } = await authAPI.register(userData);
    localStorage.setItem('nc_token', data.token);
    localStorage.setItem('nc_user', JSON.stringify(data));
    setToken(data.token);
    setUser(data);
    connectSocket();
    return data;
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem('nc_token');
    localStorage.removeItem('nc_user');
    setUser(null);
    setToken(null);
    disconnectSocket();
  }, []);

  const isAuthenticated = !!user && !!token;

  return (
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, loginDemo, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within <AuthProvider>');
  return ctx;
}

export default AuthContext;
