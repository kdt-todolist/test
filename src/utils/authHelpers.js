// 토큰과 관련된 유틸리티 함수를 관리하는 파일
// authHelpers.js

// 토큰에서 만료 시간을 추출하는 함수
export const getTokenExpiration = (token) => {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000;
  };
  
  // 로컬 스토리지에서 토큰을 가져오는 함수
  export const getStoredToken = () => localStorage.getItem('accessToken');
  
  // 토큰을 로컬 스토리지에 저장하는 함수
  export const storeToken = (token) => localStorage.setItem('accessToken', token);
  
  // 로컬 스토리지에서 토큰을 삭제하는 함수
  export const clearStoredToken = () => localStorage.removeItem('accessToken');

  export const handleAuthError = (error) => {
    if (error.response?.status === 401) {
      const loginConfirm = window.confirm('로그인 시간이 만료되었습니다. 다시 로그인하시겠습니까?');
      if (loginConfirm) {
        window.location.href = '/login'; // 로그인 페이지로 리다이렉트
      }
      return false;
    }
    console.error('서버와의 통신 오류:', error);
    return true;
  };