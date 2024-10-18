import React from 'react';
import { FaGoogle } from "react-icons/fa";
import Button from "../Common/Button";

function LoginFrom(props) {
  const { placeholder } = props;
  const handleGoogleLogin = () => {
    // 구글 OAuth 요청을 백엔드로 보냄
    window.location.href = 'http://localhost:1009/auth/google';
  };

  return (
    <div className="grid gap-5">
      <h3 className="text-center text-2xl font-bold">소셜 로그인</h3>
      <h2>{placeholder}</h2>
      <Button
        size="lg"
        color="gray"
        border="pill"
        onClick={handleGoogleLogin} // 버튼 클릭 시 구글 로그인 요청
      >      
        <FaGoogle style={{ width: '28px', height: '28px', marginRight: '10px' }}/>
        구글 로그인
      </Button>
    </div>
  );
}

export default LoginFrom;