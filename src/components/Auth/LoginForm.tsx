import React from 'react';

export default function LoginForm() {
  return (
    <form className="space-y-4">
      <input type="email" placeholder="Email" className="border p-2 w-full" />
      <input type="password" placeholder="Password" className="border p-2 w-full" />
      <button type="submit" className="bg-blue-500 text-white p-2 w-full">
        Login
      </button>
    </form>
  );
}
