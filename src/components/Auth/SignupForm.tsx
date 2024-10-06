import React from 'react';

export default function SignupForm() {
  return (
    <form className="space-y-4">
      <input type="text" placeholder="Name" className="border p-2 w-full" />
      <input type="email" placeholder="Email" className="border p-2 w-full" />
      <input type="password" placeholder="Password" className="border p-2 w-full" />
      <button type="submit" className="bg-blue-500 text-white p-2 w-full">
        Signup
      </button>
    </form>
  );
}
