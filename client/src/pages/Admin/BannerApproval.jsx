import React, { useState, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { 
  CheckCircle, XCircle, Clock, Image as ImageIcon, 
  ArrowLeft, ExternalLink, ShieldCheck, User, Store
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const BannerApproval = () => {
  const navigate = useNavigate();
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBanners();
  }, []);

  const fetchBanners = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/banners/admin/pending", { 
        withCredentials: true 
      });
      setBanners(res.data.banners);
    } catch (err) {
      toast.error("Failed to load banner requests");
    } finally {
      setLoading(false);
    }
  };

  const handleAction = async (id, status) => {
    try {
      const res = await axios.put(`http://localhost:3000/api/banners/admin/review/${id}`, 
        { status }, 
        { withCredentials: true }
      );
      if (res.data.success) {
        toast.success(`Banner ${status === 'approved' ? 'Approved' : 'Rejected'}`);
        setBanners(prev => prev.filter(b => b._id !== id));
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Action failed");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] p-6 md:p-10 font-sans">
      {/* Header Area */}
      <div className="max-w-7xl mx-auto mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-3">
            <button
              onClick={() => navigate(-1)}
              className="group flex items-center gap-2 text-slate-400 hover:text-indigo-600 font-bold transition-all mb-2"
            >
              <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
              <span className="text-[10px] uppercase tracking-[0.2em]">Back to Admin Panel</span>
            </button>
            <h2 className="text-6xl font-black text-slate-900 tracking-tighter uppercase italic flex items-center gap-4">
              Queue <span className="text-indigo-600">Review</span>
              <ShieldCheck size={40} className="text-slate-200 hidden lg:block" />
            </h2>
            <p className="text-slate-500 font-medium text-lg">
              Authorized personnel only. Reviewing pending homepage assets.
            </p>
          </div>

          <div className="bg-white p-2 rounded-3xl border border-slate-200 shadow-sm flex items-center gap-2">
            <div className="px-6 py-3 bg-indigo-600 text-white rounded-2xl flex items-center gap-2">
               <Clock size={16} />
               <span className="text-[10px] font-black uppercase tracking-widest">{banners.length} Pending</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            <p className="font-black text-slate-400 uppercase tracking-widest text-xs italic">Syncing Database...</p>
          </div>
        ) : banners.length === 0 ? (
          <div className="bg-white rounded-[4rem] p-24 text-center border-2 border-dashed border-slate-200">
            <div className="bg-slate-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="text-emerald-400" size={40} />
            </div>
            <h3 className="text-3xl font-black text-slate-900 uppercase italic">Inbox Zero</h3>
            <p className="text-slate-400 font-medium max-w-sm mx-auto mt-2">
                All banner requests have been processed.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-10">
            {banners.map((banner) => (
              <div 
                key={banner._id}
                className="bg-white rounded-[3rem] border border-slate-100 shadow-xl shadow-slate-200/50 hover:shadow-2xl transition-all duration-500 overflow-hidden group"
              >
                <div className="flex flex-col lg:flex-row min-h-[400px]">
                  
                  {/* Image Section */}
                  <div className="lg:w-2/5 relative overflow-hidden bg-slate-900">
                    <img 
                      src={banner.image?.url} 
                      alt="Banner Preview" 
                      className="w-full h-full object-cover opacity-90 group-hover:scale-105 transition-all duration-1000"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 to-transparent"></div>
                    <div className="absolute bottom-6 left-6 flex flex-col gap-2">
                        <span className="bg-indigo-600 text-white px-4 py-1.5 rounded-xl text-[10px] font-black uppercase italic w-fit">
                            {banner.discountTag}
                        </span>
                        <h4 className="text-white text-2xl font-black uppercase italic tracking-tighter">
                            {banner.title}
                        </h4>
                    </div>
                  </div>

                  {/* Details Section */}
                  <div className="flex-1 p-10 lg:p-14 flex flex-col justify-between">
                    <div className="space-y-8">
                      <div className="flex justify-between items-start">
                        <div className="space-y-1">
                          <p className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Campaign Summary</p>
                          <p className="text-slate-600 font-medium text-xl leading-relaxed max-w-xl">
                            {banner.description || "No description provided."}
                          </p>
                        </div>
                        
                        {/* VENDOR INFO BOX */}
                        <div className="bg-slate-50 p-5 rounded-[2rem] border border-slate-100 flex items-center gap-4 shadow-inner">
                            <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-sm text-indigo-600">
                                {banner.vendor?.storeName ? <Store size={22} /> : <User size={22} />}
                            </div>
                            <div>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Requested By</p>
                                <h5 className="text-md font-black text-slate-800 uppercase italic leading-tight">
                                    {banner.vendor?.storeName || banner.vendor?.name || "Independent Vendor"}
                                </h5>
                                {banner.vendor?.storeName && (
                                  <p className="text-[10px] font-bold text-slate-400">
                                    Owner: {banner.vendor.name}
                                  </p>
                                )}
                            </div>
                        </div>
                      </div>

                      {/* SUBMISSION DATE SECTION */}
                      <div className="inline-block">
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Submission Date</p>
                        <p className="text-sm font-bold text-slate-600 bg-slate-50 px-4 py-2 rounded-xl border border-slate-100 w-fit">
                          {new Date(banner.createdAt).toLocaleDateString('en-US', { 
                            month: 'long', day: 'numeric', year: 'numeric' 
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-12 pt-8 border-t border-slate-50">
                      <a 
                        href={banner.image?.url} 
                        target="_blank" 
                        rel="noreferrer"
                        className="flex items-center gap-2 text-indigo-600 font-black text-[10px] uppercase tracking-widest hover:translate-x-1 transition-transform"
                      >
                        <ExternalLink size={16} /> Open Full Image
                      </a>

                      <div className="flex gap-4">
                        <button 
                          onClick={() => handleAction(banner._id, 'rejected')}
                          className="px-8 py-4 bg-white text-slate-400 hover:text-red-500 hover:bg-red-50 border border-slate-100 rounded-2xl transition-all font-black text-[10px] uppercase tracking-widest"
                        >
                          <XCircle size={18} className="inline mr-2" /> Reject
                        </button>
                        <button 
                          onClick={() => handleAction(banner._id, 'approved')}
                          className="px-10 py-4 bg-[#0C2135] text-white hover:bg-indigo-600 rounded-2xl shadow-xl transition-all font-black text-[10px] uppercase tracking-widest"
                        >
                          <CheckCircle size={18} className="inline mr-2" /> Approve
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BannerApproval;