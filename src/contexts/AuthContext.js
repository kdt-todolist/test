import React, { createContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

// AuthContext 생성
export const AuthContext = createContext(null);

// 토큰 만료 시간 확인 함수 (JWT 토큰)
const getTokenExpiration = (token) => {
  const payload = JSON.parse(atob(token.split('.')[1]));
  return payload.exp * 1000; // 초 단위인 exp를 밀리초로 변환
};

// AuthProvider 컴포넌트
export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken')); // 로컬 스토리지에서 accessToken 가져옴
  const [user, setUser] = useState(null); // 사용자의 추가 정보를 담을 수 있음
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('accessToken')); // 초기 인증 상태
  const location = useLocation();
  const navigate = useNavigate();

  // URL에서 accessToken 추출 및 저장
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get('token');

    if (token) {
      localStorage.setItem('accessToken', token);
      setAccessToken(token);
      setIsAuthenticated(true);
      navigate('/'); // 로그인 후 리다이렉트
    }
  }, [location, navigate]);

  // accessToken이 유효한지 확인
  useEffect(() => {
    const token = localStorage.getItem('accessToken');
    
    if (token) {
      const expiration = getTokenExpiration(token);
      const now = Date.now();

      if (now >= expiration) {
        // 토큰 만료 시 로그아웃
        logout();
      } else {
        setAccessToken(token);
        setIsAuthenticated(true);
      }
    }
  }, []);

  // 로그아웃 함수
  const logout = () => {
    localStorage.removeItem('accessToken');
    setAccessToken(null);
    setUser(null);
    setIsAuthenticated(false);
    navigate('/login'); // 로그아웃 후 로그인 페이지로 이동
  };

  return (
    <AuthContext.Provider value={{ accessToken, user, isAuthenticated, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
