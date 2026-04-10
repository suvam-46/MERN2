import React, { useState, useEffect } from 'react'; // Added useEffect for timer
import axios from 'axios';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, RefreshCw } from "lucide-react";

const VerifyEmail = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false); // New state for resending
  const [timer, setTimer] = useState(0); // Optional: countdown timer
  
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  // Optional: Timer logic to prevent spamming
  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await axios.post("http://localhost:3000/api/auth/verifyEmail", {
        email,
        otp: Number(otp)
      });

      if (response.status === 200) {
        alert("Email verified successfully! Please login.");
        navigate("/login");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // --- NEW RESEND LOGIC ---
  const handleResendOTP = async () => {
    if (resending || timer > 0) return;
    
    setResending(true);
    setError('');

    try {
      // Replace this URL with your actual backend resend endpoint
      await axios.post("http://localhost:3000/api/auth/resendOTP", { email });
      
      alert("A new OTP has been sent to your email.");
      setTimer(60); // Set a 60-second cooldown
    } catch (err) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-10 rounded-3xl shadow-xl border border-gray-100 text-center">
        
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center mb-4 shadow-sm">
            <ShieldCheck size={32} />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-900 tracking-tight">Verify Email</h2>
          <p className="mt-3 text-sm text-gray-500 px-4">
            We've sent a verification code to <br />
            <span className="font-semibold text-gray-800">{email || "your email"}</span>
          </p>
        </div>

        <form onSubmit={handleVerify} className="mt-8 space-y-6" autoComplete="none">
          <input type="hidden" name="otp-field" />
          
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-500 uppercase tracking-wider ml-1 text-left mb-2">
              Verification Code
            </label>
            <input
              type="text"
              required
              maxLength="6"
              autoComplete="one-time-code"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              className="block w-full px-4 py-4 text-center text-2xl tracking-[0.5em] font-bold bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-purple-500 focus:bg-white outline-none transition-all"
              placeholder="000000"
            />
          </div>

          {error && (
            <div className="bg-red-50 border-l-4 border-red-400 p-3 rounded-md">
              <p className="text-xs text-red-700 font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-4">
            <button
              type="submit"
              disabled={loading}
              className={`w-full flex justify-center items-center py-4 px-4 text-sm font-bold rounded-2xl text-white transition-all duration-200 ${
                loading ? "bg-purple-400 cursor-not-allowed" : "bg-purple-600 hover:bg-purple-700 shadow-lg shadow-purple-100"
              }`}
            >
              {loading ? <RefreshCw className="animate-spin mr-2 h-4 w-4" /> : "Verify Account"}
            </button>

            <div className="text-sm">
              <p className="text-gray-500">
                Didn't receive the code?{' '}
                <button 
                  type="button" 
                  onClick={handleResendOTP}
                  disabled={resending || timer > 0}
                  className={`font-bold transition-colors ${
                    resending || timer > 0 ? "text-gray-400 cursor-not-allowed" : "text-purple-600 hover:underline"
                  }`}
                >
                  {resending ? "Sending..." : timer > 0 ? `Resend in ${timer}s` : "Resend Code"}
                </button>
              </p>
            </div>
          </div>
        </form>

        <div className="pt-4">
          <Link to="/login" className="text-sm font-medium text-gray-400 hover:text-purple-600">
            Back to Sign In
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;