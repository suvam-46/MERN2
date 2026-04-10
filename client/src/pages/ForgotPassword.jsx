import React, { useState, useEffect } from "react"; // Added useEffect
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Mail, ShieldCheck, Lock, ArrowLeft, RefreshCw } from "lucide-react";

export default function ForgotPassword() {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false); // State for resend button
  const [timer, setTimer] = useState(0); // Timer state
  const navigate = useNavigate();

  // Handle Countdown Timer
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Step 1: Request OTP
  const handleEmailSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:3000/api/auth/forgot-password", { email });
      setStep(2);
      setTimer(60); // Start 60s cooldown after first send
    } catch (err) {
      setError(err.response?.data?.message || "User with this email not found.");
    } finally {
      setLoading(false);
    }
  };

  // NEW: Resend OTP Logic
  const handleResendOTP = async () => {
    if (timer > 0 || resending) return;
    setResending(true);
    setError("");
    try {
      await axios.post("http://localhost:3000/api/auth/forgot-password", { email });
      setTimer(60); // Reset timer
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  // Step 2: Verify OTP
  const handleOtpSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:3000/api/auth/verify-reset-otp", { email, otp: Number(otp) });
      setStep(3);
    } catch (err) {
      setError(err.response?.data?.message || "Invalid or expired OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Step 3: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await axios.post("http://localhost:3000/api/auth/reset-password", { 
        email, 
        newPassword,
        confirmPassword
      });
      alert("Password reset successfully! Please login.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-10 border border-gray-100 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-purple-600"></div>

        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
            {step === 1 && <Mail size={30} />}
            {step === 2 && <ShieldCheck size={30} />}
            {step === 3 && <Lock size={30} />}
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">
            {step === 1 && "Forgot Password"}
            {step === 2 && "Verification Code"}
            {step === 3 && "Reset Password"}
          </h2>
          <p className="mt-2 text-sm text-gray-500 text-center px-4">
            {step === 1 && "No worries! Enter your email and we'll send you an OTP code."}
            {step === 2 && `We've sent a 6-digit code to ${email}`}
            {step === 3 && "Enter your new password below to secure your account."}
          </p>
        </div>

        {error && (
          <div className="mb-6 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 text-xs font-medium rounded animate-shake">
            {error}
          </div>
        )}

        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2 ml-1">Email Address</label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-100 flex justify-center items-center"
            >
              {loading ? <RefreshCw className="animate-spin mr-2 h-5 w-5" /> : "Send OTP"}
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2 ml-1 text-center">Enter 6-Digit Code</label>
              <input
                type="text"
                required
                maxLength="6"
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
                placeholder="000000"
                className="w-full px-4 py-4 text-center text-2xl tracking-[0.5em] font-bold bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-100 flex justify-center items-center"
            >
              {loading ? <RefreshCw className="animate-spin mr-2 h-5 w-5" /> : "Verify Code"}
            </button>
            
            {/* RESEND OTP UI */}
            <div className="text-center pt-2">
              <p className="text-sm text-gray-500">
                Didn't receive the code?{" "}
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={timer > 0 || resending}
                  className={`font-bold transition-colors ${
                    timer > 0 || resending ? "text-gray-300 cursor-not-allowed" : "text-purple-600 hover:underline"
                  }`}
                >
                  {resending ? "Sending..." : timer > 0 ? `Resend in ${timer}s` : "Resend Now"}
                </button>
              </p>
            </div>

            <button 
              type="button" 
              onClick={() => setStep(1)}
              className="w-full text-sm text-gray-400 font-medium hover:text-purple-600 flex items-center justify-center gap-1 mt-4"
            >
              <ArrowLeft size={14} /> Change Email
            </button>
          </form>
        )}

        {step === 3 && (
          <form onSubmit={handleResetPassword} className="space-y-5">
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2 ml-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-gray-500 uppercase mb-2 ml-1">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-purple-600 text-white py-4 rounded-xl font-bold hover:bg-purple-700 transition-all shadow-lg shadow-purple-100 flex justify-center items-center"
            >
              {loading ? <RefreshCw className="animate-spin mr-2 h-5 w-5" /> : "Update Password"}
            </button>
          </form>
        )}

        <div className="mt-8 pt-6 border-t border-gray-50 text-center">
          <Link to="/login" className="text-sm font-bold text-purple-600 hover:text-purple-800 transition-colors">
            Return to Login
          </Link>
        </div>
      </div>
    </div>
  );
}