import React, { useState } from 'react';

export function UserLogin({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    // You should perform validation here before calling onLogin
    onLogin({ username, password });
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Username:</label>
        <input
          type="text"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full border rounded p-2 focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border rounded p-2 focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>
      <button onClick={handleLogin} className="bg-blue-500 text-white p-2 rounded">Login</button>
    </div>
  );
}