import React, { useState, useEffect } from "react";
import { 
  Store, MapPin, Phone, Mail, ArrowLeft, Loader2, Calendar, Info, ShieldCheck, BadgeCheck, User, AlertCircle
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";

const VendorProfile = () => {
  const [fetching, setFetching] = useState(true);
  const [vendor, setVendor] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        // 1. Ensure this URL matches your backend route exactly
        const { data } = await axios.get("http://localhost:3000/api/vendor/profile", {
          withCredentials: true 
        });

        // 2. Based on your controller, data might be nested in 'vendor' or just 'data'
        // If your backend returns { success: true, vendor: {...} }, use data.vendor
        setVendor(data.vendor || data); 
      } catch (error) {
        const errorMessage = error.response?.data?.message || "Server connection failed";
        toast.error(errorMessage);
        console.error("Profile Fetch Error:", error);
      } finally {
        setFetching(false);
      }
    };
    fetchProfile();
  }, []);

  // --- 1. LOADING STATE ---
  if (fetching) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="animate-spin text-indigo-600" size={40} />
          <p className="text-slate-500 font-bold animate-pulse uppercase tracking-widest text-[10px]">
            Loading Vendor Profile...
          </p>
        </div>
      </div>
    );
  }

  // --- 2. ERROR / EMPTY STATE ---
  // If fetching is done but vendor is still null, show a friendly error
  if (!vendor) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC] px-6">
        <div className="text-center space-y-6 max-w-md">
          <div className="inline-flex p-6 bg-red-50 text-red-500 rounded-[2rem]">
            <AlertCircle size={48} />
          </div>
          <h2 className="text-2xl font-black text-slate-900 tracking-tighter uppercase italic">
            Profile <span className="text-red-500">Not Found</span>
          </h2>
          <p className="text-slate-500 text-sm font-medium">
            We couldn't retrieve your vendor records. Please ensure you are logged in as a vendor.
          </p>
          <Link to="/vendor/dashboard" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-950 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-indigo-600 transition-all shadow-xl">
            <ArrowLeft size={16} /> Back to Dashboard
          </Link>
        </div>
      </div>
    );
  }

  // --- 3. SUCCESS STATE ---
  return (
    <div className="min-h-screen bg-[#F8FAFC] p-4 md:p-8 font-sans">
      {/* Top Navigation */}
      <div className="max-w-5xl mx-auto mb-4 flex items-center justify-between px-2">
        <Link to="/vendor/dashboard" className="flex items-center gap-2 text-slate-900 font-bold hover:text-indigo-600 transition-all group">
          <div className="p-2 bg-white rounded-xl shadow-sm group-hover:shadow-md transition-all">
            <ArrowLeft size={18} />
          </div>
          <span className="text-xs uppercase tracking-widest font-black">Dashboard</span>
        </Link>
        
        <div className={`flex items-center gap-2 px-4 py-2 rounded-full border shadow-sm ${vendor.isVerified ? 'bg-emerald-50 border-emerald-100' : 'bg-amber-50 border-amber-100'}`}>
          <BadgeCheck size={16} className={vendor.isVerified ? 'text-emerald-600' : 'text-amber-600'} />
          <span className={`text-[9px] font-black uppercase tracking-widest ${vendor.isVerified ? 'text-emerald-600' : 'text-amber-600'}`}>
            {vendor.isVerified ? 'Verified Vendor' : 'Verification Pending'}
          </span>
        </div>
      </div>

      <div className="max-w-5xl mx-auto bg-white rounded-[3rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
        {/* Header Banner */}
        <div className="h-40 md:h-56 bg-gradient-to-br from-slate-900 via-[#0C2135] to-indigo-950 relative">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        </div>

        <div className="relative px-6 md:px-12 pb-12">
          {/* Profile Header */}
          <div className="relative -mt-24 mb-12 flex flex-col md:flex-row items-end gap-8">
            <div className="w-40 h-40 md:w-48 md:h-48 bg-white rounded-[3rem] p-2 shadow-2xl border-8 border-white overflow-hidden flex items-center justify-center">
              {vendor.shopLogo?.url ? (
                <img src={vendor.shopLogo.url} alt="Logo" className="w-full h-full object-cover rounded-[2.5rem]" />
              ) : (
                <div className="w-full h-full bg-slate-50 flex items-center justify-center rounded-[2.5rem]">
                  <Store size={50} className="text-slate-200" />
                </div>
              )}
            </div>
            <div className="pb-4">
              <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tighter uppercase italic">
                {vendor.shopName}
              </h1>
              <p className="text-indigo-600 font-black flex items-center gap-2 text-[10px] mt-2 uppercase tracking-[0.3em]">
                <User size={14} className="text-indigo-400" /> Managed by {vendor.userName}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
            <div className="lg:col-span-2 space-y-12">
              <section className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 bg-indigo-50 rounded-xl text-indigo-600 shadow-sm">
                    <Info size={18} />
                  </div>
                  <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em]">Store Profile</h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <DetailCard icon={<Mail />} label="Email" value={vendor.email} />
                  <DetailCard icon={<Phone />} label="Phone" value={vendor.phone || "Not Provided"} />
                  <DetailCard icon={<MapPin />} label="Address" value={vendor.address} fullWidth />
                </div>
              </section>
            </div>

            {/* Sidebar Stats */}
            <div className="space-y-6">
              <div className="p-8 bg-slate-950 rounded-[2.5rem] text-white space-y-8 shadow-2xl relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 text-white/5 group-hover:scale-110 transition-transform">
                    <ShieldCheck size={120} />
                </div>
                <h3 className="text-[10px] font-black text-indigo-400 uppercase tracking-[0.3em] relative z-10">Security & Meta</h3>
                <div className="space-y-6 relative z-10">
                  <MetaItem icon={<Calendar />} label="Member Since" value={vendor.joinedAt ? new Date(vendor.joinedAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : "N/A"} />
                  <MetaItem icon={<ShieldCheck />} label="Role" value={`${vendor.role} Verified`} color="text-emerald-400" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- HELPER COMPONENTS ---

const DetailCard = ({ icon, label, value, fullWidth = false }) => (
  <div className={`p-6 bg-slate-50/50 border border-slate-100 rounded-3xl flex items-center gap-5 group hover:bg-white hover:shadow-xl transition-all ${fullWidth ? 'md:col-span-2' : ''}`}>
    <div className="p-3 bg-white rounded-2xl text-slate-400 shadow-sm group-hover:text-indigo-600 transition-colors">
      {React.cloneElement(icon, { size: 20 })}
    </div>
    <div>
      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">{label}</p>
      <p className="font-bold text-slate-900 text-sm">{value}</p>
    </div>
  </div>
);

const MetaItem = ({ icon, label, value, color = "text-white" }) => (
  <div className="flex items-start gap-4">
    <div className="mt-1 text-indigo-400">{React.cloneElement(icon, { size: 18 })}</div>
    <div>
      <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest">{label}</p>
      <p className={`font-bold text-sm ${color}`}>{value}</p>
    </div>
  </div>
);

export default VendorProfile;