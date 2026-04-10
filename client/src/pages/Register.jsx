import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { 
  Eye, EyeOff, UserPlus, AlertCircle, Loader2, Sparkles, 
  UserCircle, Store, ArrowRight, Image as ImageIcon, MapPin, Phone
} from "lucide-react";

export default function Register() {
  // Basic Info
  const [userName, setUserName] = useState("");
  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("customer");
  
  // Vendor Specific Info
  const [storeName, setStoreName] = useState("");
  const [businessAddress, setBusinessAddress] = useState("");
  const [storeImage, setStoreImage] = useState(null);

  // UI State
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (password !== confirmPassword) {
      setMessage("Passwords do not match");
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append("userName", userName);
    formData.append("userEmail", email);
    formData.append("userPhoneNumber", phoneNumber);
    formData.append("userPassword", password);
    formData.append("role", role);

    if (role === "vendor") {
      formData.append("storeName", storeName);
      formData.append("businessAddress", businessAddress);
      if (storeImage) formData.append("storeImage", storeImage);
    }

    try {
      await axios.post("http://localhost:3000/api/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/verify-email", { state: { email: email } });
    } catch (error) {
      setMessage(error.response?.data?.message || "Registration failed. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100 px-4 py-8 relative overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full bg-grid-slate-200/[0.5] [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))]"></div>
      <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-purple-100 rounded-full blur-[120px] opacity-70"></div>

      {/* Main Split Card */}
      <div className="w-full max-w-[1100px] flex flex-col md:flex-row bg-white rounded-[3rem] shadow-[0_40px_100px_-15px_rgba(0,0,0,0.1)] border border-slate-100 overflow-hidden relative z-10 animate-in fade-in slide-in-from-bottom-6 duration-1000">
        
        {/* --- LEFT SIDE: BRAND --- */}
        <div className="relative flex-[0.8] bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 p-12 flex flex-col justify-between overflow-hidden">
          <div className="absolute inset-0 bg-grain opacity-[0.03]"></div>

          <div className="relative z-10">
            <p className="text-xs font-black text-indigo-300 tracking-[0.3em] uppercase mb-4">Account Creation</p>
          </div>

          <div className="relative z-10 text-center animate-float py-8">
            <div className="inline-flex relative mb-6 group">
              <div className="absolute -inset-6 bg-indigo-500 rounded-full blur-3xl opacity-20 transition-opacity duration-1000"></div>
              <div className="relative p-5 bg-white rounded-[2rem] shadow-2xl border border-white/10">
                <img src="/images/Logo.png" alt="Logo" className="w-16 h-auto" />
              </div>
            </div>
            
            <h1 className="text-4xl lg:text-5xl font-black text-white tracking-tighter">
              Foot<span className="text-indigo-400">Wear</span>
            </h1>
            <p className="text-indigo-200 text-base mt-4 font-semibold flex items-center justify-center gap-2">
              Step into the future <Sparkles size={16} className="text-amber-300 fill-amber-300" />
            </p>
          </div>

          <div className="relative z-10 mt-auto">
            <div className="space-y-4">
               <div className="flex items-center gap-3 text-indigo-200/80">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-indigo-400"><UserPlus size={16}/></div>
                  <p className="text-sm font-medium">Personalized shopping experience</p>
               </div>
               <div className="flex items-center gap-3 text-indigo-200/80">
                  <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-indigo-400"><Store size={16}/></div>
                  <p className="text-sm font-medium">Vendor tools for business growth</p>
               </div>
            </div>
          </div>
        </div>

        {/* --- RIGHT SIDE: FORM --- */}
        <div className="flex-[1.2] p-8 md:p-12 lg:p-14 bg-white overflow-y-auto max-h-[90vh] md:max-h-[unset]">
          
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold text-slate-950 tracking-tight">Create Account</h2>
            <p className="text-slate-500 mt-2 font-medium">Join our global network today.</p>
          </div>

          {/* Role Toggle */}
          <div className="flex gap-2 p-1.5 bg-slate-100 rounded-2xl mb-8">
            <button
              type="button"
              onClick={() => setRole("customer")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                role === "customer" ? "bg-white text-indigo-600 shadow-md" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <UserCircle size={18} /> Customer
            </button>
            <button
              type="button"
              onClick={() => setRole("vendor")}
              className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-black uppercase tracking-wider transition-all duration-300 ${
                role === "vendor" ? "bg-white text-indigo-600 shadow-md" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              <Store size={18} /> Vendor
            </button>
          </div>

          {message && (
            <div className="mb-6 flex items-center gap-3 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-700 animate-in zoom-in-95">
              <AlertCircle size={20} className="shrink-0" />
              <p className="text-sm font-bold">{message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6" autoComplete="off">
            {/* Honeypot fields to prevent password managers from targeting the visible fields */}
            <input type="text" name="prevent_autofill" style={{ display: 'none' }} tabIndex="-1" />
            <input type="password" name="password_fake" style={{ display: 'none' }} tabIndex="-1" />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Name */}
              <div className="group space-y-2">
                <label className="text-[10px] font-black text-slate-400 ml-2 tracking-widest uppercase group-focus-within:text-indigo-600 transition-colors">Full Name</label>
                <input
                  type="text" required value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  autoComplete="off"
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all font-semibold"
                  placeholder=""
                />
              </div>

              {/* Email */}
              <div className="group space-y-2">
                <label className="text-[10px] font-black text-slate-400 ml-2 tracking-widest uppercase group-focus-within:text-indigo-600 transition-colors">Email</label>
                <input
                  type="email" required value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="new-password" 
                  className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all font-semibold"
                  placeholder=""
                />
              </div>
            </div>

            {/* Phone Number */}
            <div className="group space-y-2">
              <label className="text-[10px] font-black text-slate-400 ml-2 tracking-widest uppercase group-focus-within:text-indigo-600 transition-colors flex items-center gap-2">
                <Phone size={12}/> Phone Number
              </label>
              <input
                type="text" required value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                autoComplete="off"
                className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all font-semibold"
                placeholder=""
              />
            </div>

            {/* Vendor Extra Fields */}
            {role === "vendor" && (
              <div className="space-y-6 p-6 bg-indigo-50/50 border border-indigo-100 rounded-[2rem] animate-in fade-in slide-in-from-top-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-indigo-600 ml-2 tracking-widest uppercase flex items-center gap-2"><Store size={12}/> Store Name</label>
                    <input
                      type="text" required value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      autoComplete="off"
                      className="w-full px-5 py-3 bg-white border border-indigo-200 rounded-xl focus:border-indigo-500 outline-none font-semibold text-slate-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-indigo-600 ml-2 tracking-widest uppercase flex items-center gap-2"><MapPin size={12}/> Address</label>
                    <input
                      type="text" required value={businessAddress}
                      onChange={(e) => setBusinessAddress(e.target.value)}
                      autoComplete="off"
                      className="w-full px-5 py-3 bg-white border border-indigo-200 rounded-xl focus:border-indigo-500 outline-none font-semibold text-slate-900"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-indigo-600 ml-2 tracking-widest uppercase flex items-center gap-2"><ImageIcon size={12}/> Store Branding</label>
                  <input 
                    type="file" accept="image/*"
                    onChange={(e) => setStoreImage(e.target.files[0])} 
                    className="w-full text-xs text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-xs file:font-black file:bg-indigo-600 file:text-white hover:file:bg-indigo-700 transition-all cursor-pointer"
                  />
                </div>
              </div>
            )}

            {/* Passwords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="group space-y-2">
                <label className="text-[10px] font-black text-slate-400 ml-2 tracking-widest uppercase group-focus-within:text-indigo-600 transition-colors">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"} required value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all font-semibold pr-12"
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600">
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="group space-y-2">
                <label className="text-[10px] font-black text-slate-400 ml-2 tracking-widest uppercase group-focus-within:text-indigo-600 transition-colors">Confirm</label>
                <div className="relative">
                  <input
                    type={showConfirmPassword ? "text" : "password"} required value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    autoComplete="new-password"
                    className="w-full px-5 py-3.5 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 focus:bg-white outline-none transition-all font-semibold pr-12"
                  />
                  <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-indigo-600">
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full group animate-shine relative flex justify-center items-center py-5 px-8 text-xs font-black tracking-[0.2em] rounded-2xl text-white bg-slate-950 hover:bg-indigo-600 shadow-2xl shadow-indigo-100 active:scale-[0.98] transition-all duration-500 disabled:bg-slate-300 overflow-hidden"
            >
              {loading ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <div className="flex items-center gap-2">
                  <span>CREATE {role.toUpperCase()} ACCOUNT</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1.5 transition-transform duration-300" />
                </div>
              )}
            </button>
          </form>

          <div className="mt-10 pt-6 border-t border-slate-100 text-center">
            <p className="text-slate-500 text-sm font-semibold">
              Already have an account?
              <Link to="/login" className="ml-2 font-black text-indigo-600 hover:text-indigo-800 uppercase tracking-tighter transition-colors">Sign In</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}