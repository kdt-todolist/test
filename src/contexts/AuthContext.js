import React, { createContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

export const AuthContext = createContext(null);

const getTokenExpiration = (token) => {
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.exp * 1000;
};

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken'));
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('accessToken', token);
      setAccessToken(token);
      setIsAuthenticated(true);
      navigate('/');
    }
  }, [location, navigate]);

  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      const expiration = getTokenExpiration(token);
      const now = Date.now();

      if (now >= expiration) {
        logout();
      } else {
        setAccessToken(token);
        setIsAuthenticated(true);
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('userTasks');
    setAccessToken(null);
    setUser(null);
    setIsAuthenticated(false);
    
    window.dispatchEvent(new Event('logout')); // 로그아웃 이벤트 발생
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ accessToken, user, setUser, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
