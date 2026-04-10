import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom"; // Add useNavigate
import { 
  DollarSign, ClipboardList, Package, TrendingUp, PlusCircle, 
  UserCircle, LogOut, Zap, Waves 
} from "lucide-react";
import axios from "axios"; // Add axios
import { toast } from "react-hot-toast"; // Add toast for feedback

const VendorDb = () => {
  const location = useLocation();
  const navigate = useNavigate(); // Initialize navigate

  // --- LOGOUT HANDLER ---
  const handleLogout = async () => {
    try {
      // 1. Call your backend logout API (ensure this route exists in authRoutes)
      // Usually: router.get("/logout", logoutController)
      await axios.get("http://localhost:3000/api/auth/logout", { withCredentials: true });

      // 2. Clear local storage if you store user data there
      localStorage.removeItem("user");

      // 3. Show success message
      toast.success("Logged out successfully");

      // 4. Redirect to login
      navigate("/login");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Failed to logout. Please try again.");
    }
  };

  const stats = [
    { title: "Total Income", value: "$12,450", icon: <DollarSign className="text-sky-600" />, bg: "bg-sky-100" },
    { title: "Total Orders", value: "85", icon: <ClipboardList className="text-blue-600" />, bg: "bg-blue-100" },
    { title: "Live Products", value: "12", icon: <Package className="text-cyan-600" />, bg: "bg-cyan-100" },
  ];

  const menuItems = [
    { label: "Dashboard", path: "/vendor/dashboard", icon: <TrendingUp size={20} /> },
    { label: "My Products", path: "/vendor/products", icon: <Package size={20} /> },
    { label: "Add Product", path: "/vendor/add-product", icon: <PlusCircle size={20} /> },
    { label: "Orders", path: "/vendor/orders", icon: <ClipboardList size={20} /> },
    { label: "Settings", path: "/vendor/settings", icon: <UserCircle size={20} /> },
  ];

  return (
    <div className="flex min-h-screen bg-[#F0F7FF]">
      {/* --- SIDEBAR --- */}
      <aside className="w-72 bg-[#0C2135] sticky top-0 h-screen hidden md:flex flex-col shadow-2xl">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="bg-sky-500 p-2 rounded-xl shadow-lg shadow-sky-500/30">
                <Waves className="text-white" size={24} />
            </div>
            <h1 className="text-2xl font-black text-white tracking-tight">
              Sky<span className="text-sky-400">Vendor</span>
            </h1>
          </div>
        </div>

        <nav className="mt-2 px-4 space-y-2 flex-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group relative flex items-center gap-4 px-4 py-4 rounded-2xl text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-sky-500 text-white shadow-lg shadow-sky-500/20"
                    : "text-slate-400 hover:bg-slate-800/50 hover:text-sky-100"
                }`}
              >
                {isActive && <div className="absolute left-0 w-1.5 h-6 bg-white rounded-r-full" />}
                <span className={`${isActive ? "text-white" : "text-slate-500 group-hover:text-sky-400"}`}>
                  {item.icon}
                </span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="px-6 mb-6">
            <div className="bg-sky-500/10 p-5 rounded-3xl border border-sky-500/20">
                <div className="bg-sky-500 w-10 h-10 rounded-xl flex items-center justify-center mb-4 shadow-lg shadow-sky-500/30">
                    <Zap className="text-white" size={20} />
                </div>
                <p className="text-sky-100 text-sm font-bold">Cloud Sync Active</p>
                <p className="text-sky-400/70 text-[11px] mt-1 font-medium">Your shop is live across all regions.</p>
            </div>
        </div>

        {/* --- UPDATED LOGOUT SECTION --- */}
        <div className="p-6 border-t border-slate-800/50">
          <button 
            onClick={handleLogout} // Attach the function here
            className="flex items-center gap-3 text-slate-400 hover:text-red-400 transition-all font-bold w-full px-4 py-2 hover:translate-x-1"
          >
            <LogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 p-10 overflow-y-auto">
        <header className="mb-12">
          <h2 className="text-4xl font-black text-[#0C2135] tracking-tight">Dashboard</h2>
          <p className="text-blue-500/70 font-semibold mt-2">Check out your shop's performance in the sky-blue view.</p>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          {stats.map((item, index) => (
            <div key={index} className="bg-white p-8 rounded-[2rem] shadow-sm border border-blue-50 hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] text-blue-300 font-black uppercase tracking-[0.2em] mb-1">{item.title}</p>
                  <h3 className="text-4xl font-black text-[#0C2135]">{item.value}</h3>
                </div>
                <div className={`${item.bg} p-5 rounded-2xl`}>{item.icon}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white p-10 rounded-[2.5rem] shadow-sm border border-blue-50 h-96 flex flex-col items-center justify-center relative overflow-hidden group">
            <div className="absolute -right-20 -top-20 w-80 h-80 bg-sky-50 rounded-full blur-3xl" />
            <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-blue-50 rounded-full blur-3xl" />
            <div className="relative z-10 text-center">
                <div className="bg-sky-50 w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-6 shadow-inner border border-sky-100">
                    <TrendingUp size={40} className="text-sky-400" />
                </div>
                <h4 className="text-2xl font-black text-[#0C2135] mb-2">Growth Charts</h4>
                <p className="text-blue-400/70 font-medium max-w-sm">
                    Everything is looking clear! We'll start plotting your 
                    sales data here as soon as orders fly in.
                </p>
            </div>
        </div>
      </main>
    </div>
  );
};

export default VendorDb;