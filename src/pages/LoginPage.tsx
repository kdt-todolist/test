import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function LoginPage() {
  const navigate = useNavigate();

  const handleLogin = () => {
    navigate('/tasks');
  };

  const handleSignup = () => {
    navigate('/signup');
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Login</h1>
      <input
        type="text"
        placeholder="Email"
        className="p-2 border mb-4 w-80"
      />
      <input
        type="password"
        placeholder="Password"
        className="p-2 border mb-4 w-80"
      />
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white p-2 mb-4 w-80"
      >
        로그인
      </button>
      <button
        onClick={handleSignup}
        className="text-blue-500"
      >
        회원가입
      </button>
    </div>
  );
}
