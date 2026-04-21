import React, { useState, useEffect, useRef } from "react";
import { 
  User, 
  Mail, 
  ShieldCheck, 
  Activity, 
  ArrowLeft, 
  LogOut, 
  Settings, 
  UserCheck, 
  Clock,
  Camera,
  Loader2
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const Profile = ({ user, setUser }) => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);
  const navigate = useNavigate();

  // Sync online status
  useEffect(() => {
    const handleStatus = () => setIsOnline(navigator.onLine);
    window.addEventListener("online", handleStatus);
    window.addEventListener("offline", handleStatus);
    return () => {
      window.removeEventListener("online", handleStatus);
      window.removeEventListener("offline", handleStatus);
    };
  }, []);

  // --- IMAGE UPLOAD LOGIC ---
  const handleImageClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Image must be less than 2MB");
    }

    const formData = new FormData();
    formData.append("avatar", file);

    const uploadToast = toast.loading("Uploading to Cloudinary...");
    setUploading(true);

    try {
      const response = await axios.put(
        "http://localhost:3000/api/customer/update-avatar", 
        formData,
        { 
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true 
        }
      );

      if (response.status === 200) {
        const updatedUser = response.data.user;
        setUser(updatedUser);
        localStorage.setItem("user", JSON.stringify(updatedUser));
        toast.success("Profile picture updated!", { id: uploadToast });
      }
    } catch (err) {
      console.error("Upload error:", err);
      toast.error(err.response?.data?.message || "Failed to upload image", { id: uploadToast });
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = async () => {
    toast.dismiss(); 
    const logoutToast = toast.loading("Processing logout...");
    try {
      await axios.get("http://localhost:3000/api/auth/logout", { withCredentials: true });
      localStorage.removeItem("user");
      setUser(null);
      toast.success("Logged out successfully", { id: logoutToast });
      navigate("/login");
    } catch (err) {
      localStorage.removeItem("user");
      setUser(null);
      toast.error("Session ended", { id: logoutToast });
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-20 px-4 relative overflow-hidden">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleFileChange} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-indigo-100 rounded-full blur-[120px] opacity-50 -z-10"></div>
      <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-purple-100 rounded-full blur-[100px] opacity-50 -z-10"></div>

      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Link
            to="/homepage"
            className="flex items-center gap-2 text-slate-400 hover:text-indigo-600 transition-all font-black text-[10px] uppercase tracking-[0.2em] group"
          >
            <div className="p-2 bg-white rounded-lg shadow-sm group-hover:shadow-md transition-all">
              <ArrowLeft size={14} />
            </div>
            Back to Shop
          </Link>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-red-500 hover:text-white hover:bg-red-500 px-4 py-2 rounded-xl transition-all font-black text-[10px] uppercase tracking-widest border border-red-100 bg-white"
          >
            <LogOut size={14} /> Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* LEFT COLUMN */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white/60 text-center">
              <div className="relative inline-block mb-6 group cursor-pointer" onClick={handleImageClick}>
                <div className="w-32 h-32 bg-gradient-to-tr from-slate-900 to-indigo-900 rounded-[2.5rem] p-1 shadow-2xl rotate-3 transition-transform group-hover:rotate-0 overflow-hidden">
                  <div className="w-full h-full bg-slate-950 rounded-[2.2rem] flex items-center justify-center text-white text-5xl font-black -rotate-3 group-hover:rotate-0 transition-transform italic border border-white/10 overflow-hidden relative">
                    {uploading ? (
                      <Loader2 className="animate-spin text-indigo-400" size={32} />
                    ) : user?.avatar?.url ? (
                      <img 
                        src={user.avatar.url} 
                        alt="Profile" 
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-white">{user?.userName?.charAt(0).toUpperCase() || "U"}</span>
                    )}
                    
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                      <Camera className="text-white" size={24} />
                    </div>
                  </div>
                </div>
                <div className={`absolute -bottom-1 -right-1 w-8 h-8 rounded-full border-4 border-white shadow-lg ${isOnline ? "bg-green-500" : "bg-slate-300"}`}></div>
              </div>

              <h2 className="text-2xl font-black text-slate-900 tracking-tighter truncate uppercase italic">
                {user?.userName || "Guest User"}
              </h2>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-indigo-50 text-indigo-600 rounded-full text-[10px] font-black uppercase tracking-widest mt-2">
                <UserCheck size={10} /> {user?.role || "Customer"}
              </div>
            </div>

            <div className="bg-slate-950 rounded-[2.5rem] p-8 text-white shadow-2xl relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <ShieldCheck size={80} />
              </div>
              <p className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] mb-2">Security Score</p>
              <h3 className="text-3xl font-black italic tracking-tighter mb-4 uppercase">Verified Account</h3>
              <button className="w-full py-3 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-[10px] font-bold uppercase tracking-widest transition-all border border-white/10">
                Manage Keys
              </button>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 backdrop-blur-md rounded-[2.5rem] p-10 shadow-[0_20px_50px_rgba(0,0,0,0.05)] border border-white">
              <div className="flex items-center justify-between mb-10">
                <div>
                  <h1 className="text-3xl font-black text-slate-950 tracking-tighter uppercase italic">
                    Account <span className="text-indigo-600">Overview</span>
                  </h1>
                  <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-1">Identity Information</p>
                </div>
                <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl cursor-pointer hover:bg-indigo-100 transition-colors">
                  <Settings size={24} />
                </div>
              </div>

              <div className="grid gap-4">
                <InfoRow 
                  icon={<User className="text-indigo-600" />} 
                  label="Full Name" 
                  value={user?.userName || "Not Available"} 
                />
                <InfoRow 
                  icon={<Mail className="text-indigo-600" />} 
                  label="Email Address" 
                  value={user?.userEmail || "Not Logged In"} 
                />
                <InfoRow 
                  icon={<Activity className={isOnline ? "text-green-500" : "text-slate-400"} />} 
                  label="Real-time Status" 
                  value={isOnline ? "Active Session" : "Offline"} 
                />
                <InfoRow 
                  icon={<Clock className="text-indigo-600" />} 
                  label="Account Status" 
                  value={user?.isEmailVerified ? "Verified" : "Pending Verification"} 
                />
              </div>

              <div className="mt-10 grid grid-cols-2 gap-4">
                <button 
                  onClick={handleImageClick}
                  disabled={uploading}
                  className="py-4 bg-indigo-600 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-200 disabled:opacity-50"
                >
                  {uploading ? "Uploading..." : "Change Avatar"}
                </button>
                
                {/* LINK TO ORDER HISTORY */}
                <Link 
                  to="/orders/me" 
                  className="py-4 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-slate-800 transition-all shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
                >
                  <Clock size={14} /> Order History
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const InfoRow = ({ icon, label, value }) => (
  <div className="flex items-center gap-5 p-6 bg-slate-50/50 rounded-3xl border border-slate-100 hover:border-indigo-100 transition-all group">
    <div className="p-3 bg-white rounded-xl shadow-sm group-hover:scale-110 transition-transform">
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div>
      <p className="text-[9px] uppercase font-black text-slate-400 tracking-[0.2em] mb-0.5">{label}</p>
      <p className="font-bold text-slate-900">{value}</p>
    </div>
  </div>
);

export default Profile;