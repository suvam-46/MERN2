import { useState } from "react";
import { Link } from "react-router-dom";


export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-8">
        {/* Logo Section */}
        <div className="flex flex-col items-center mb-6 animate-logo">
          <img
            src="/images/Logo.png"
            alt="Logo"
            className="w-28 h-auto mb-2 hover:scale-105 transition-transform duration-300"
          />
        </div>

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Sign in to your account
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
            />
          </div>

          {/* Forgot password */}
          <div className="flex justify-end">
            <Link
              to="/ForgotPassword"
              className="text-sm text-purple-600 hover:underline"
            >
              Forgot password?
            </Link>
          </div>

          {/* Button */}
          <button
            type="submit"
            className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
          >
            Login
          </button>
        </form>

        {/* Sign up */}
        <p className="text-center text-sm text-gray-600 mt-6">
          Don’t have an account?
          <Link
            to="/register"
            className="text-purple-600 font-medium hover:underline ml-1"
          >
            Sign up
          </Link>
        </p>
      </div>

      {/* Animation */}
      <style>
        {`
          @keyframes logoFade {
            0% { opacity: 0; transform: translateY(-20px) scale(0.9); }
            100% { opacity: 1; transform: translateY(0) scale(1); }
          }
          .animate-logo { animation: logoFade 0.8s ease-out forwards; }
        `}
      </style>
    </div>
  );
}
