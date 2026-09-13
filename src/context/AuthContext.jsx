import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authAPI } from '../services/api';
import { connectSocket, disconnectSocket } from '../services/socket';

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
        connectSocket();
      } catch (err) {
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
    <AuthContext.Provider value={{ user, token, loading, isAuthenticated, login, register, logout }}>
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
