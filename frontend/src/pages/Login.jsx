import { useState } from "react";
import { useNavigate } from "react-router";
import api from "../api/axios";
import { GoogleLogin } from "@react-oauth/google";

export default function Login() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate(); // Hook to navigate programmatically to other routes

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api({
        method: "post",
        url: "/auth/login",
        data: form,
      });
      setMessage(response.data.message);
      localStorage.setItem("token", response.data.token); // Store token in localStorage
      localStorage.setItem("userId", response.data.user.id); // Store userId in localStorage
      setTimeout(() => {
        navigate("/home"); // Redirect to the home after successful login
      }, 1000);
    } catch (error) {
      setMessage(
        error.response?.data?.message || "An error occurred during login",
      );
    }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const response = await api({
        method: "POST",
        url: "/auth/google",
        data: {
          token: credentialResponse.credential,
        },
      });
      localStorage.setItem("token", response.data.token);
      localStorage.setItem(
        "userId",
        response.data.user.id || response.data.user._id,
      );

      navigate("/home");
    } catch (error) {
      setMessage(error.response?.data?.message || "Google login failed");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded shadow">
        <h2 className="text-2xl font-bold text-center">
          Login to Your Account
        </h2>
        {message && <p className="text-red-500 text-center">{message}</p>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Password
            </label>
            <input
              type="password"
              name="password"
              value={form.password}
              onChange={handleChange}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            Login
          </button>
        </form>
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-gray-300"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-gray-500">
              Or continue with
            </span>
          </div>
        </div>

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={handleGoogleSuccess}
            onError={() => setMessage("Google Login Failed")}
          />
        </div>
      </div>
    </div>
  );
}
