import React, { useState } from 'react';

interface SignupFormProps {
  onSignup: () => void;
  onLoginClick: () => void;
}

const SignupForm: React.FC<SignupFormProps> = ({ onSignup, onLoginClick }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = () => {
    console.log('회원가입 완료:', username);
    onSignup();
  };

  return (
    <div className="flex justify-center items-center h-1/2">
      <div className="bg-white p-8 w-80">
        <h2 className="text-2xl font-bold mb-6 text-center">회원가입</h2>
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
          onClick={handleSignup}
          className="w-full bg-green-500 text-white py-3 rounded-lg hover:bg-green-600 transition duration-200"
        >
          회원가입
        </button>
        <p className="mt-4 text-center text-gray-600">
          이미 계정이 있으신가요?{' '}
          <span
            onClick={onLoginClick}
            className="text-blue-500 hover:underline cursor-pointer"
          >
            로그인
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignupForm;
