import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function SignupPage() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8">Signup</h1>
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
        onClick={() => navigate('/')}
        className="bg-blue-500 text-white p-2 mb-4 w-80"
      >
        회원가입
      </button>
      <button
        onClick={() => navigate('/login')}
        className="text-blue-500"
      >
        로그인
      </button>
    </div>
  );
}
