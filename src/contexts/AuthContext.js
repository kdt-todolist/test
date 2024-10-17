import React, { createContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getTokenExpiration, getStoredToken,
  storeToken, clearStoredToken } from '../utils/authHelpers';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(getStoredToken());
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(!!getStoredToken());
  const location = useLocation();
  const navigate = useNavigate();

  // 토큰이 URL에 있으면 로컬 스토리지에 저장하고 인증 상태 업데이트
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      storeToken(token);  // Helper 함수 사용
      setAccessToken(token);
      setIsAuthenticated(true);
      navigate('/');
    }
  }, [location, navigate]);

  // 토큰의 만료 시간 확인 및 자동 로그아웃 처리
  useEffect(() => {
    const token = getStoredToken();
    
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

  // 로그아웃 처리 함수
  const logout = () => {
    clearStoredToken();
    localStorage.removeItem('userTasks');  // 추가된 데이터 삭제
    setAccessToken(null);
    setUser(null);
    setIsAuthenticated(false);

    window.dispatchEvent(new Event('logout'));  // 로그아웃 이벤트 발생
    navigate('/login');
  };

  return (
    <AuthContext.Provider value={{ accessToken, user, setUser, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
