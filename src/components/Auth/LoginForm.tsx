import React, { useState } from 'react';

interface LoginFormProps {
  onLogin: () => void;
  onSignupClick: () => void;
}

const LoginForm: React.FC<LoginFormProps> = ({ onLogin, onSignupClick }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    console.log('Login attempted with:', username, password);
    onLogin();
  };

  return (
    <div className="flex justify-center items-center h-1/2">
      <div className="bg-white p-8 w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">로그인</h2>
        <input
          type="text"
          placeholder="아이디"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-3 mb-4 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-3 mb-6 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        />
        <button
          onClick={handleLogin}
          className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-200"
        >
          로그인
        </button>
        <p className="mt-4 text-center text-gray-600">
          계정이 없으신가요?{' '}
          <span
            onClick={onSignupClick}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            회원가입
          </span>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
