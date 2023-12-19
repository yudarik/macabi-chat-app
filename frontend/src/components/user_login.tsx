import { useState } from "react";
import { UserFormData } from "../auth/auth_provider";

export function UserLogin(props: {
  onLogin: (
    { username, password }: UserFormData,
    onError: (err: { message: string }) => void,
  ) => void;
}) {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const { onLogin } = props;
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (target: HTMLInputElement) => {
    setFormData({ ...formData, [target.name]: target.value });
    setErrorMsg(""); // Reset error when user types
  };

  const handleLogin = () => {
    // You should perform validation here before calling onLogin
    onLogin(
      { username: formData.username, password: formData.password },
      (err: { message: string }) => {
        if (err) {
          setErrorMsg(err.message);
        } else {
          setFormData({
            username: "",
            password: "",
          });
        }
      },
    );
  };

  return (
    <div className="max-w-md mx-auto mt-8 p-4 bg-white rounded shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Login</h2>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Username:
        </label>
        <input
          type="text"
          name="username"
          value={formData.username}
          onChange={(e) => handleChange(e.target)}
          className="w-full border rounded p-2 focus:outline-none focus:ring focus:border-blue-300 bg-back-800"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 text-sm font-bold mb-2">
          Password:
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={(e) => handleChange(e.target)}
          className="w-full border rounded p-2 focus:outline-none focus:ring focus:border-blue-300 bg-back-800"
        />
        {errorMsg && <p className="text-red-500">{errorMsg}</p>}
      </div>
      <button
        onClick={handleLogin}
        className="bg-blue-500 text-white p-2 rounded"
      >
        Login
      </button>
    </div>
  );
}
