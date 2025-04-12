// src/AuthContext.js
import React, { createContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // 🧠 Load user from localStorage on app start
  useEffect(() => {
    const storedUser = localStorage.getItem('mmt_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ Accept username and role as separate values
  const login = ({ username, role }) => {
    const userInfo = { username, role };
    setUser(userInfo);
    localStorage.setItem('mmt_user', JSON.stringify(userInfo)); // save to localStorage
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('mmt_user'); // clear localStorage on logout
    localStorage.removeItem('username');
    navigate('/');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
