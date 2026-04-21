import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast"; 
import { 
  Eye, 
  EyeOff, 
  LogIn, 
  AlertCircle, 
  Loader2, 
  Sparkles, 
  KeyRound 
} from "lucide-react";

export default function Login({ setUser }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isPending, setIsPending] = useState(false);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    setEmail("");
    setPassword("");
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsPending(false);
    setLoading(true);

    try {
      const response = await axios.post(
        "http://localhost:3000/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        const userData = response.data.user;

        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        
        toast.success(`Welcome back, ${userData.userName || 'User'}!`);

        const role = userData.role?.toLowerCase(); 
        if (role === "admin") {
          navigate("/admin/dashboard", { replace: true });
        } else if (role === "vendor") {
          navigate("/vendor/dashboard", { replace: true });
        } else {
          navigate("/homepage", { replace: true });
        }
      }
    } catch (err) {
      const status = err.response?.status;
      const message = err.response?.data?.message || "";

      if (status === 403 || message.toLowerCase().includes("verify")) {
        setIsPending(true);
        const pendingMsg = "Your account is under administrative review.";
        setError(pendingMsg);
        toast.error(pendingMsg, { icon: '⏳' });
      } else {
        setIsPending(false);
        const errMsg = message || "Check your credentials and try again.";
        setError(errMsg);
        toast.error(errMsg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-12 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-200/[0.5] [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]"></div>
      <div className="absolute -top-40 -left-40 w-80 h-80 bg-indigo-100 rounded-full blur-[120px] opacity-70"></div>

      <div className="w-full max-w-[960px] flex flex-col md:flex-row bg-white rounded-[3rem] shadow-[0_40px_100px_-15px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden relative z-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        
        {/* LEFT SIDE: BRANDING */}
        <div className="relative flex-1 bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 p-12 lg:p-16 flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 bg-grain opacity-[0.03]"></div>
          
          <div className="relative z-10">
            <p className="text-xs font-black text-indigo-300 tracking-[0.3em] uppercase mb-4">Secure Entry Port</p>
          </div>

          <div className="relative z-10 text-center py-10">
            <div className="inline-flex relative mb-8 group">
              <div className="absolute -inset-6 bg-indigo-500 rounded-full blur-3xl opacity-20 group-hover:opacity-40 transition-opacity duration-1000"></div>
              <div className="relative p-6 bg-white rounded-[2.5rem] shadow-2xl group-hover:scale-105 transition-transform duration-500">
                <img src="/images/Logo.png" alt="Logo" className="w-20 h-auto" />
              </div>
            </div>
            <h1 className="text-5xl lg:text-6xl font-black text-white tracking-tighter">
              Foot<span className="text-indigo-400">Wear</span>
            </h1>
            <p className="text-indigo-200 text-lg mt-4 font-semibold flex items-center justify-center gap-2 tracking-wide italic">
              Step into the future <Sparkles size={18} className="text-amber-300 fill-amber-300" />
            </p>
          </div>

          <div className="relative z-10 text-center md:text-left mt-auto">
            <p className="text-indigo-300/70 text-sm font-medium">
              Access the exclusive community for footwear enthusiasts and professionals.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE: FORM */}
        <div className="flex-1 p-10 md:p-14 lg:p-16 bg-white">
          <div className="mb-12">
            <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight flex items-center gap-3 italic uppercase">
              <KeyRound className="text-indigo-600" size={30} /> Sign In
            </h2>
            <p className="text-slate-500 mt-3 font-medium">Enter your credentials to access your dashboard.</p>
          </div>

          {error && (
            <div className={`mb-8 flex items-center gap-3.5 p-5 border rounded-2xl animate-in zoom-in-95 duration-300 ${
              isPending 
                ? "bg-amber-50 border-amber-100 text-amber-800" 
                : "bg-red-50 border-red-100 text-red-700"
            }`}>
              <AlertCircle size={22} className="shrink-0" />
              <p className="text-sm font-bold leading-tight">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8" autoComplete="off">
            <div className="group space-y-2.5">
              <label className="block text-xs font-black text-slate-500 ml-3 tracking-[0.15em] uppercase group-focus-within:text-indigo-600 transition-colors">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="off" 
                className="w-full px-7 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-300 font-semibold text-slate-900"
              />
            </div>

            <div className="group space-y-2.5">
              <div className="flex justify-between items-center ml-3">
                <label className="text-xs font-black text-slate-500 tracking-[0.15em] uppercase group-focus-within:text-indigo-600 transition-colors">
                  Password
                </label>
                <Link to="/ForgotPassword" className="text-[10px] font-black text-indigo-600 hover:text-indigo-800 uppercase italic">
                  Forgot?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="new-password"
                  className="w-full px-7 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all duration-300 font-semibold text-slate-900 pr-16"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600 p-2"
                >
                  {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full relative group flex justify-center items-center py-5 px-8 text-[11px] font-black tracking-[0.2em] rounded-2xl text-white bg-slate-950 hover:bg-indigo-600 shadow-2xl active:scale-[0.98] transition-all duration-500 disabled:bg-slate-300 uppercase italic"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={22} />
              ) : (
                <div className="flex items-center gap-2.5">
                  <span>Sign In to Account</span>
                  <LogIn size={18} className="group-hover:translate-x-1.5 transition-transform" />
                </div>
              )}
            </button>
          </form>

          <div className="mt-16 pt-8 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-xs font-bold uppercase tracking-wide">
              New to the community?
              <Link to="/register" className="ml-2 font-black text-indigo-600 hover:text-indigo-800 border-b-2 border-transparent hover:border-indigo-600 transition-all pb-1 italic">
                Create Account
              </Link>
            </p>
          </div>
          
          <p className="text-center text-slate-400 text-[9px] mt-10 font-black tracking-[0.4em] uppercase opacity-60">
            &copy; 2026 FootWear Global &bull; Secure Entry Port
          </p>
        </div>
      </div>
    </div>
  );
}