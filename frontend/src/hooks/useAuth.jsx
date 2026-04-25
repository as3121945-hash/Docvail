import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../utils/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const res = await api.get('/auth/me');
          setUser(res.data);
        } catch (err) {
          console.error(err);
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    fetchUser();
  }, []);

  const login = async (identifier, password) => {
    const res = await api.post('/auth/login', { identifier, password });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
  };

  const register = async (name, email, phone, password, role) => {
    const res = await api.post('/auth/register', { name, email, phone, password, role });
    // If registration requires OTP, we don't log them in yet.
    if (res.data.requireOTP) {
      return res.data;
    }
    // Fallback if OTP is disabled
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const verifyOtp = async (identifier, otp) => {
    const res = await api.post('/auth/verify-otp', { identifier, otp });
    localStorage.setItem('token', res.data.token);
    setUser(res.data.user);
    return res.data;
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, verifyOtp, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
