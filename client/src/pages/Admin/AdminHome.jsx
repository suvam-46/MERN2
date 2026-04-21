import React, { useState } from 'react';
import { 
  Users, Store, Package, DollarSign, TrendingUp, 
  Settings, Search, Bell,
  LayoutDashboard, LogOut, Menu, X, ChevronRight,
  BarChart3, UserCheck, ArrowUpRight, ImagePlus, Clock
} from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

const AdminHome = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();

  // --- LOGOUT HANDLER ---
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const navItems = [
    { name: "Executive Overview", icon: LayoutDashboard, path: "/admin/dashboard" },
    { name: "Order Command", icon: Package, path: "/admin/orders" },
    { name: "Banner Requests", icon: ImagePlus, path: "/admin/banner-requests" },
    { name: "Merchant Hub", icon: Store, path: "/admin/vendors" },
    { name: "Vendor Approval", icon: UserCheck, path: "/admin/verify-vendors" },
    { name: "User Directory", icon: Users, path: "/admin/users" },
    { name: "Market Analytics", icon: BarChart3, path: "/admin/reports" },
    { name: "Platform Settings", icon: Settings, path: "/admin/settings" },
  ];

  const stats = [
    { title: "Total Users", value: "1,254", icon: Users, change: "+12%", color: "text-indigo-400", bg: "bg-indigo-500/10" },
    { title: "Incoming Orders", value: "86", icon: Package, change: "Action Req.", color: "text-amber-400", bg: "bg-amber-500/10" },
    { title: "Active Vendors", value: "48", icon: Store, change: "+5%", color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { title: "Net Revenue", value: "रू 45,230", icon: DollarSign, change: "+25%", color: "text-sky-400", bg: "bg-sky-500/10" },
  ];

  // Mock data for the compact order preview on dashboard
  const urgentOrders = [
    { id: "ORD-9921", customer: "Aashish Kc", total: "रू 12,500", time: "10m ago" },
    { id: "ORD-9922", customer: "Sita Thapa", total: "रू 4,200", time: "25m ago" },
    { id: "ORD-9923", customer: "Ram Gurung", total: "रू 18,900", time: "1h ago" },
  ];

  return (
    <div className="flex min-h-screen bg-[#F8FAFC] font-sans">
      
      {/* --- SIDEBAR --- */}
      <aside className={`fixed left-0 top-0 h-full bg-slate-950 text-white transition-all duration-500 z-50 overflow-hidden shadow-2xl
        ${isSidebarOpen ? 'w-72' : 'w-20'}`}>
        
        <div className="p-6 flex items-center justify-between">
          {isSidebarOpen && (
            <span className="font-black text-xl italic tracking-tighter uppercase animate-in fade-in duration-500">
              Admin<span className="text-indigo-500">.</span>CP
            </span>
          )}
          <button onClick={() => setSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-800 rounded-xl transition-colors">
            {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        <nav className="mt-8 px-3 space-y-2">
          {navItems.map((item, idx) => {
            const isActive = location.pathname === item.path;
            return (
              <Link 
                key={idx} 
                to={item.path} 
                className={`flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-300 group
                  ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/20' : 'text-slate-400 hover:bg-slate-900 hover:text-white'}`}
              >
                <item.icon size={22} className={isActive ? 'text-white' : 'group-hover:text-indigo-400'} />
                {isSidebarOpen && (
                  <div className="flex-1 flex items-center justify-between animate-in slide-in-from-left-2">
                    <span className="text-[11px] font-black uppercase tracking-widest">{item.name}</span>
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 w-full p-6 border-t border-slate-900 bg-slate-950/50 backdrop-blur-md">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-600 rounded-2xl flex items-center justify-center font-black italic shadow-lg">P</div>
            {isSidebarOpen && (
              <div className="animate-in fade-in slide-in-from-bottom-2 flex-1">
                <p className="text-sm font-black text-white">Priya S.</p>
                <button 
                  onClick={handleLogout}
                  className="text-[10px] font-bold text-slate-500 hover:text-red-400 flex items-center gap-1 transition-colors uppercase tracking-tighter"
                >
                  <LogOut size={12} /> Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>

      {/* --- MAIN CONTENT AREA --- */}
      <main className={`flex-1 transition-all duration-500 ${isSidebarOpen ? 'ml-72' : 'ml-20'}`}>
        
        <header className="bg-white/80 backdrop-blur-md sticky top-0 z-40 px-10 py-5 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-4">
            <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em]">Platform / <span className="text-slate-900">Executive Overview</span></h2>
          </div>
          
          <div className="flex items-center gap-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
              <input type="text" placeholder="Global Search..." className="bg-slate-100 border-none rounded-2xl pl-12 pr-6 py-2 text-xs font-bold focus:ring-2 focus:ring-indigo-500/10 w-64 transition-all" />
            </div>
            <button className="relative p-2.5 text-slate-500 hover:bg-slate-50 rounded-xl transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-600 rounded-full border-2 border-white"></span>
            </button>
          </div>
        </header>

        <div className="p-10 space-y-10">
          {/* Dashboard Hero */}
          <section className="relative bg-slate-950 rounded-[3.5rem] p-12 text-white overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-indigo-600/10 blur-[100px] rounded-full"></div>
            <div className="relative z-10">
              <p className="text-indigo-400 text-[10px] font-black uppercase tracking-[0.4em] mb-4">Live System Monitor</p>
              <h1 className="text-5xl font-black italic tracking-tighter mb-4 uppercase">Control Center Active.</h1>
              <p className="text-slate-400 max-w-xl font-medium text-lg leading-relaxed">
                Platform metrics are stable. You have <span className="text-indigo-400 font-black italic">{urgentOrders.length} customer orders</span> awaiting manual verification and authorization.
              </p>
              <div className="flex gap-4 mt-8">
                <Link to="/admin/orders" className="px-8 py-4 bg-indigo-600 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-indigo-500 shadow-xl shadow-indigo-600/20 transition-all flex items-center gap-2">
                  <Package size={16} /> Open Order Command
                </Link>
                <button className="px-8 py-4 bg-slate-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all border border-slate-800">
                    System Health Report
                </button>
              </div>
            </div>
          </section>

          {/* Stats Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="bg-white p-7 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500">
                <div className="flex justify-between items-start mb-4">
                  <div className={`p-4 rounded-2xl ${stat.bg} ${stat.color}`}>
                    <stat.icon size={22} />
                  </div>
                  <span className={`text-[10px] font-black px-2 py-1 rounded-lg ${stat.bg} ${stat.color}`}>
                    {stat.change}
                  </span>
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{stat.title}</p>
                <p className="text-3xl font-black text-slate-950 italic">{stat.value}</p>
              </div>
            ))}
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            {/* Quick Order Authorization Table */}
            <div className="xl:col-span-2 bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-sm">
              <div className="flex justify-between items-center mb-8 px-2">
                <div>
                  <h3 className="text-lg font-black uppercase italic tracking-tighter">Urgent Order Queue</h3>
                  <p className="text-xs font-bold text-slate-400">Authorization required for vendor dispatch</p>
                </div>
                <Link to="/admin/orders" className="p-3 bg-slate-50 hover:bg-indigo-50 text-indigo-600 rounded-2xl transition-all">
                  <ArrowUpRight size={20}/>
                </Link>
              </div>
              
              <div className="space-y-3">
                {urgentOrders.map((order, idx) => (
                  <div key={idx} className="flex items-center justify-between p-5 bg-slate-50/50 rounded-3xl border border-transparent hover:border-indigo-100 hover:bg-white transition-all group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-slate-950 text-white rounded-2xl flex items-center justify-center font-black italic">
                        {order.id.split('-')[1].charAt(0)}
                      </div>
                      <div>
                        <p className="text-sm font-black text-slate-950 uppercase">{order.id}</p>
                        <p className="text-[10px] font-bold text-slate-400 tracking-widest uppercase">{order.customer}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-8">
                      <div className="text-right hidden sm:block">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Amount</p>
                        <p className="text-xs font-bold text-slate-700 italic">{order.total}</p>
                      </div>
                      <div className="flex items-center gap-2">
                         <span className="flex items-center gap-1 text-[9px] font-black text-amber-500 px-2 py-1">
                            <Clock size={10}/> {order.time}
                         </span>
                         <Link to="/admin/orders" className="px-4 py-2 bg-indigo-600 text-white text-[9px] font-black uppercase tracking-widest rounded-xl hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-600/20">
                           Verify
                         </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Growth Analytics Card */}
            <div className="bg-indigo-600 rounded-[2.5rem] p-8 text-white shadow-xl shadow-indigo-600/30 flex flex-col justify-between relative overflow-hidden">
                <div className="absolute -right-10 -bottom-10 opacity-10 rotate-12">
                   <TrendingUp size={200} />
                </div>
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.3em] opacity-80 mb-2">Network Expansion</p>
                  <h4 className="text-4xl font-black italic tracking-tighter mb-6">+24.8% <span className="text-sm not-italic opacity-60">growth</span></h4>
                  <div className="space-y-4">
                     <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                       <span>Verification Rate</span>
                       <span>92%</span>
                     </div>
                     <div className="h-2 w-full bg-indigo-400 rounded-full overflow-hidden">
                       <div className="h-full bg-white w-[92%] rounded-full shadow-[0_0_15px_rgba(255,255,255,0.5)]"></div>
                     </div>
                  </div>
                </div>
                <button className="relative z-10 mt-10 w-full py-4 bg-white text-indigo-600 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] hover:bg-slate-50 transition-all active:scale-95 shadow-lg">
                  Detailed Forecast
                </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminHome;