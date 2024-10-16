import React from 'react';
import { FaGoogle } from "react-icons/fa";
import Button from "../Common/Button";

function LoginFrom(props) {
  return (
    <div className="grid gap-5">
      <h3 className="text-center text-2xl font-bold">소셜 로그인</h3>
      <Button
        size="lg"
        color="gray"
        border="pill"
      >
        <FaGoogle style={{ width: '28px', height: '28px', marginRight: '10px' }}/>
        구글 로그인
      </Button>
    </div>
  );
}

export default LoginFrom;