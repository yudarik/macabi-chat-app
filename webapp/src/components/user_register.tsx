import React, { useState } from 'react';

export function UserRegister({ onRegister }) {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    confirmPassword: '',
  });

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrorMsg(''); // Reset error when user types
  };

  const handleRegister = (event) => {
    event.preventDefault();

    if (!formData.password || !formData.confirmPassword) {
        setErrorMsg('Password and Confirm Password are required');
        return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMsg('Password and Confirm Password does not match');
      return;
    }
    onRegister({ username: formData.username, password: formData.password }, (successMsg: string) => {
        setSuccessMsg(successMsg);
    }, (err) => {
        if (err) {
            setErrorMsg(err.message);
        } else {
            setFormData({
                username: '',
                password: '',
                confirmPassword: '',
            });
        }
    });
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Username:</label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={handleChange}
          className="w-full border rounded p-2 focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="w-full border rounded p-2 focus:outline-none focus:ring focus:border-blue-300"
        />
      </div>
        <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">Confirm password:</label>
        <input
          type="password"
          name="confirmPassword"
          value={formData.confirmPassword}
          onChange={handleChange}
          className="w-full border rounded p-2 focus:outline-none focus:ring focus:border-blue-300"
        />
        {errorMsg && <p className="text-red-500">{errorMsg}</p>}
        {successMsg && <p className="text-green-500">{successMsg}</p>}
      </div>
      <button onClick={handleRegister} className="bg-blue-500 text-white p-2 rounded">Register</button>
    </div>
  );
}