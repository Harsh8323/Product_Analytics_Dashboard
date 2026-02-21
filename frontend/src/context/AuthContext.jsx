import { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode'; // install: npm install jwt-decode
import api from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { showToast } = useToast();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        // Check if token is expired
        if (decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
        } else {
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
          setUser({ id: decoded.id, username: decoded.username });
        }
      } catch (err) {
        localStorage.removeItem('token');
      }
    }
    setLoading(false);
  }, []);

  const login = async (username, password) => {
    try {
      const { data } = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      const decoded = jwtDecode(data.token);
      setUser({ id: decoded.id, username: decoded.username });
      showToast('Login successful', 'success');
      return true;
    } catch (err) {
      showToast(err.response?.data?.message || 'Login failed', 'error');
      return false;
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await api.post('/auth/register', userData);
      localStorage.setItem('token', data.token);
      api.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      const decoded = jwtDecode(data.token);
      setUser({ id: decoded.id, username: decoded.username });
      showToast('Registration successful', 'success');
      return true;
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration failed', 'error');
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    setUser(null);
    showToast('Logged out', 'info');
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};