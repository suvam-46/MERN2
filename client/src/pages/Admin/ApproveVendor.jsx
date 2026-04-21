import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast'; // 1. Added Toast Import
import { 
  CheckCircle, ArrowLeft, Clock, ExternalLink, FileText, 
  Mail, MapPin, ShieldAlert, Search, ChevronRight,
  UserCheck, Building2, Globe, Loader2
} from 'lucide-react';

const ApproveVendor = () => {
  const navigate = useNavigate();
  const [selectedVendor, setSelectedVendor] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [pendingVendors, setPendingVendors] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Pending Vendors on component mount
  useEffect(() => {
    fetchVendors();
  }, []);

  const fetchVendors = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('http://localhost:3000/api/vendor/admin/pending-vendors', {
        withCredentials: true 
      });
      if (data.success) {
        setPendingVendors(data.vendors);
      }
    } catch (error) {
      console.error("Error fetching vendors:", error);
      toast.error("Failed to sync with merchant queue");
    } finally {
      setLoading(false);
    }
  };

  // 2. Handle Approval/Rejection
  const handleAction = async (id, action) => {
    const isApproving = action === 'approved';
    const loadingToast = toast.loading(isApproving ? "Authorizing merchant..." : "Declining application...");

    try {
      const url = `http://localhost:3000/api/vendor/admin/${isApproving ? 'verify-vendor' : 'reject-vendor'}/${id}`;
      
      const response = await axios({
        method: isApproving ? 'put' : 'delete',
        url: url,
        withCredentials: true
      });

      if (response.data.success) {
        // Remove from UI list immediately
        setPendingVendors(prev => prev.filter(v => v._id !== id));
        setSelectedVendor(null);
        
        // Success Toast
        toast.success(response.data.message || "Action completed successfully", { id: loadingToast });
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Operation failed", { id: loadingToast });
    }
  };

  const filteredVendors = pendingVendors.filter(v => 
    v.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.storeName?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-[calc(100vh-80px)] bg-[#F8FAFC] overflow-hidden">
      {/* 2. Added Toaster Component for rendering notifications */}
      <Toaster position="top-right" reverseOrder={false} />

      {/* 1. LEFT SIDEBAR: LIST */}
      <div className="w-full md:w-80 lg:w-96 bg-white border-r border-slate-200 flex flex-col">
        <div className="p-6 border-b border-slate-100 bg-white sticky top-0 z-10">
          <button 
            onClick={() => navigate('/admin/dashboard')}
            className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-indigo-600 transition-colors mb-6 group"
          >
            <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" /> 
            Back to Overview
          </button>
          
          <h2 className="text-xl font-black italic tracking-tighter uppercase text-slate-900 mb-4">Merchant Queue</h2>
          
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
            <input 
              type="text" 
              placeholder="Search applications..." 
              className="w-full pl-9 pr-4 py-2.5 bg-slate-50 border border-slate-100 rounded-xl text-[11px] font-bold outline-none focus:ring-2 focus:ring-indigo-500/10 transition-all"
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
          {loading ? (
            <div className="flex flex-col items-center justify-center p-12 gap-2">
              <Loader2 className="animate-spin text-indigo-600" size={24} />
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Loading Queue...</p>
            </div>
          ) : filteredVendors.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <CheckCircle className="text-emerald-500" size={24} />
              </div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">No Pending Tasks</p>
            </div>
          ) : (
            filteredVendors.map((vendor) => (
              <button 
                key={vendor._id}
                onClick={() => setSelectedVendor(vendor)}
                className={`w-full p-6 flex items-start gap-4 transition-all text-left group
                  ${selectedVendor?._id === vendor._id ? 'bg-indigo-50/40' : 'hover:bg-slate-50/80'}`}
              >
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black text-sm italic transition-colors
                  ${selectedVendor?._id === vendor._id ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-400'}`}>
                  {vendor.userName.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="font-black text-slate-900 text-xs uppercase truncate leading-none mb-1">{vendor.storeName || vendor.userName}</p>
                    <ChevronRight size={14} className={selectedVendor?._id === vendor._id ? 'text-indigo-600' : 'text-slate-300'} />
                  </div>
                  <p className="text-[9px] font-bold text-slate-400 tracking-wider uppercase">{vendor.userEmail}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* 2. RIGHT SIDEBAR: DETAILS */}
      <div className="flex-1 overflow-y-auto">
        {selectedVendor ? (
          <div className="max-w-5xl mx-auto p-8 lg:p-12 animate-in fade-in duration-500">
            
            <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-12">
              <div className="flex items-center gap-6">
                <div className="w-20 h-20 bg-slate-950 text-white rounded-3xl flex items-center justify-center text-3xl font-black italic shadow-2xl shadow-slate-900/20">
                  {selectedVendor.userName.charAt(0)}
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <h1 className="text-4xl font-black text-slate-950 italic tracking-tighter uppercase">{selectedVendor.storeName}</h1>
                    <span className="px-2 py-0.5 bg-amber-100 text-amber-700 text-[9px] font-black uppercase rounded tracking-widest">Pending Review</span>
                  </div>
                  <p className="flex items-center gap-1.5 text-[10px] font-black text-slate-400 tracking-widest uppercase">
                    <MapPin size={12} /> {selectedVendor.businessAddress || "Location Unknown"}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full lg:w-auto">
                <button 
                  onClick={() => handleAction(selectedVendor._id, 'rejected')}
                  className="flex-1 lg:flex-none px-6 py-3.5 bg-white border border-slate-200 text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:text-red-600 transition-all"
                >
                  Decline
                </button>
                <button 
                  onClick={() => handleAction(selectedVendor._id, 'approved')}
                  className="flex-1 lg:flex-none px-10 py-3.5 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 transition-all"
                >
                  Approve Application
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-6">
                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 lg:p-10">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
                    <FileText size={14} className="text-indigo-600" /> Executive Summary
                  </h3>
                  <p className="text-slate-600 font-medium leading-loose text-sm">
                    Registered under the name <strong>{selectedVendor.userName}</strong>. This merchant is applying to sell footwear on the platform. Review the digital presence and contact details before approving.
                  </p>
                </div>

                <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 lg:p-10">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] mb-6 flex items-center gap-2">
                    <ShieldAlert size={14} className="text-indigo-600" /> Store Preview
                  </h3>
                  {selectedVendor.storeImage?.url ? (
                    <img src={selectedVendor.storeImage.url} alt="Store" className="w-full h-64 object-cover rounded-3xl" />
                  ) : (
                    <div className="w-full h-48 bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200 flex items-center justify-center text-slate-400 text-[10px] font-black uppercase">
                      No Store Image Uploaded
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-slate-950 p-8 rounded-[2.5rem] text-white shadow-2xl shadow-slate-950/20">
                  <h3 className="text-[9px] font-black text-indigo-400 uppercase tracking-[0.5em] mb-8">Digital Presence</h3>
                  <div className="space-y-6">
                    <div className="group">
                      <p className="text-[8px] text-slate-500 font-black uppercase tracking-widest mb-2">Primary Contact</p>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center text-indigo-400">
                          <Mail size={14} />
                        </div>
                        <p className="text-[11px] font-bold truncate">{selectedVendor.userEmail}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <div className="w-24 h-24 bg-white shadow-xl rounded-[2.5rem] flex items-center justify-center mb-8">
              <UserCheck size={36} className="text-indigo-600" />
            </div>
            <h2 className="text-3xl font-black italic tracking-tighter uppercase text-slate-900 mb-2">Review Desk</h2>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em]">Select a merchant from the queue to start</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ApproveVendor;