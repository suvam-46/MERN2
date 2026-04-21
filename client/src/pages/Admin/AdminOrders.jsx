import React, { useState } from 'react';
import { 
  Package, Check, Clock, X, 
  ChevronRight, MapPin, ReceiptText, ArrowLeft,
  Filter, Search
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const AdminOrders = () => {
  const navigate = useNavigate();
  
  // State for managing orders (Admin View)
  const [orders, setOrders] = useState([
    {
      id: "FW-10293",
      customer: "Priya Sharma",
      date: "Oct 24, 2025",
      status: "Pending",
      total: "रू 12,500",
      items: [
        { name: "Volt Speed Runner", size: "42", qty: 1, price: "रू 12,500", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200" }
      ],
      address: "New Baneshwor, Kathmandu"
    },
    {
      id: "FW-10115",
      customer: "Rohan Adhikari",
      date: "Sep 12, 2025",
      status: "Confirmed",
      total: "रू 8,200",
      items: [
        { name: "Arctic High-Top", size: "40", qty: 1, price: "रू 8,200", img: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=200" }
      ],
      address: "Pokhara, Lakeside"
    }
  ]);

  const handleStatusUpdate = (orderId, newStatus) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: newStatus } : order
    ));
    toast.success(`Order ${orderId} marked as ${newStatus}`);
  };

  const getStatusStyle = (status) => {
    switch (status) {
      case 'Confirmed': return 'text-emerald-500 bg-emerald-50 border-emerald-100';
      case 'Pending': return 'text-amber-500 bg-amber-50 border-amber-100';
      case 'Cancelled': return 'text-red-500 bg-red-50 border-red-100';
      default: return 'text-slate-500 bg-slate-50 border-slate-100';
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] py-12 px-6 sm:px-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Admin Navigation */}
        <div className="flex items-center justify-between mb-12">
          <button 
            onClick={() => navigate('/admin/dashboard')} 
            className="group flex items-center gap-2 text-slate-400 hover:text-slate-900 transition-all"
          >
            <div className="p-2 rounded-full border border-slate-200 group-hover:bg-white transition-all">
              <ArrowLeft size={18} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Admin Dashboard</span>
          </button>
          
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={14} />
              <input 
                type="text" 
                placeholder="Search Order ID or Name..." 
                className="pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-slate-900 w-64 transition-all"
              />
            </div>
            <button className="p-2 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all">
              <Filter size={18} className="text-slate-600" />
            </button>
          </div>
        </div>

        {/* Page Header */}
        <div className="mb-16">
          <h2 className="text-slate-400 font-black uppercase tracking-[0.3em] text-[10px] mb-3">Management Portal</h2>
          <h1 className="text-5xl font-black italic tracking-tighter text-slate-900 uppercase leading-none">Customer Orders.</h1>
        </div>

        {/* Order Cards */}
        <div className="space-y-8">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-[2rem] border border-slate-200 shadow-sm overflow-hidden hover:shadow-md transition-all">
              <div className="p-8">
                {/* Top Row: Meta & Status */}
                <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-50">
                  <div className="flex items-center gap-6">
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Order ID</p>
                      <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">{order.id}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Customer</p>
                      <p className="text-sm font-black text-slate-900 italic">{order.customer}</p>
                    </div>
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Date</p>
                      <p className="text-sm font-bold text-slate-600 uppercase">{order.date}</p>
                    </div>
                  </div>
                  
                  <div className={`px-4 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest ${getStatusStyle(order.status)}`}>
                    {order.status}
                  </div>
                </div>

                {/* Content Row */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
                  {/* Item Preview */}
                  <div className="lg:col-span-5 flex items-center gap-6">
                    <div className="w-20 h-20 bg-slate-50 rounded-2xl overflow-hidden flex-shrink-0 border border-slate-100">
                      <img src={order.items[0].img} alt="" className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="text-md font-black text-slate-900 uppercase italic leading-tight">{order.items[0].name}</h4>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase">Total: <span className="text-slate-950">{order.total}</span></p>
                    </div>
                  </div>

                  {/* Shipping Info */}
                  <div className="lg:col-span-3 flex items-start gap-3">
                    <MapPin size={16} className="text-slate-400 mt-1" />
                    <div>
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Address</p>
                      <p className="text-xs font-bold text-slate-700 leading-snug">{order.address}</p>
                    </div>
                  </div>

                  {/* Admin Actions */}
                  <div className="lg:col-span-4 flex items-center gap-3">
                    {order.status === 'Pending' ? (
                      <>
                        <button 
                          onClick={() => handleStatusUpdate(order.id, 'Confirmed')}
                          className="flex-1 py-3 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-lg shadow-emerald-100"
                        >
                          <Check size={14} /> Confirm Order
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(order.id, 'Cancelled')}
                          className="p-3 bg-white border border-slate-200 text-red-500 hover:bg-red-50 rounded-xl transition-all"
                        >
                          <X size={18} />
                        </button>
                      </>
                    ) : (
                      <button 
                        onClick={() => navigate(`/admin/order/${order.id}`)}
                        className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all"
                      >
                        View Full Details <ChevronRight size={14} />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Summary Footer */}
        <div className="mt-12 flex justify-between items-center p-8 bg-white border border-slate-200 rounded-[2rem]">
          <div className="flex items-center gap-8">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-amber-500"></div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">1 Pending</p>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
              <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">1 Confirmed</p>
            </div>
          </div>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Last updated: Just now</p>
        </div>

      </div>
    </div>
  );
};

export default AdminOrders;