import { useState } from "react";

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1 = email, 2 = OTP
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    // Simple email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email.");
      return;
    }
    setError("");
    console.log("Email submitted:", email);
    // Move to OTP step
    setStep(2);
  };

  const handleOtpSubmit = (e) => {
    e.preventDefault();
    if (otp.length !== 6) {
      setError("OTP must be 6 digits.");
      return;
    }
    setError("");
    console.log("OTP entered:", otp);
    // Here you can handle OTP verification logic
    alert("OTP Verified! You can now reset your password.");
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
          {step === 1 ? "Forgot Password" : "Enter OTP"}
        </h2>

        {step === 1 && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Enter your email
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

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Submit
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleOtpSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Enter the 6-digit OTP sent to your email
              </label>
              <input
                type="text"
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value)}
                placeholder="123456"
                maxLength={6}
                className="mt-1 w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}

            <button
              type="submit"
              className="w-full bg-purple-600 text-white py-2 rounded-lg font-semibold hover:bg-purple-700 transition"
            >
              Verify OTP
            </button>

            <p
              className="text-sm text-gray-600 mt-4 text-center cursor-pointer hover:underline"
              onClick={() => setStep(1)}
            >
              Back to Email
            </p>
          </form>
        )}
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
