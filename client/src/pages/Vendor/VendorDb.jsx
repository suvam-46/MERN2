import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { 
  DollarSign, ClipboardList, Package, PlusCircle, 
  UserCircle, LogOut, ShoppingBag, Image as ImageIcon,
  Search, Edit3, Trash2, ChevronRight, Bell, LayoutDashboard,
  Clock, Eye
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

const VendorDb = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  const [user, setUser] = useState({ userName: "Vendor", storeName: "" });
  const [orders, setOrders] = useState([]);
  const [orderLoading, setOrderLoading] = useState(false);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser({
          ...parsedUser,
          displayName: parsedUser.userName || parsedUser.firstName || "Vendor",
          displayStore: parsedUser.storeName || ""
        });
      } catch (error) {
        console.error("Error parsing user data:", error);
      }
    }
  }, []);

  // --- ROUTING LOGIC ---
  const isDashboard = location.pathname === "/vendor/dashboard";
  const isProductsPage = location.pathname === "/vendor/products";
  const isOrdersPage = location.pathname === "/vendor/orders";

  // --- FETCH ORDERS (Only when on orders page) ---
  useEffect(() => {
    if (isOrdersPage) {
      const fetchOrders = async () => {
        setOrderLoading(true);
        try {
          const { data } = await axios.get('http://localhost:3000/api/order/admin/orders', {
            withCredentials: true
          });
          if (data.success) setOrders(data.orders);
        } catch (error) {
          toast.error("Failed to sync orders");
        } finally {
          setOrderLoading(false);
        }
      };
      fetchOrders();
    }
  }, [isOrdersPage]);

  // --- MOCK PRODUCTS ---
  const [products] = useState([
    {
      id: "PRD-9921",
      name: "Volt Speed Runner",
      category: "Athletic",
      productPrice: 12500,
      stock: 24,
      img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=200"
    },
    {
      id: "PRD-8842",
      name: "Arctic High-Top",
      category: "Boots",
      productPrice: 8200,
      stock: 0,
      img: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=200"
    }
  ]);

  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:3000/api/auth/logout", { withCredentials: true });
      localStorage.removeItem("user");
      toast.success("Session Ended");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed.");
    }
  };

  const menuItems = [
    { label: "Overview", path: "/vendor/dashboard", icon: <LayoutDashboard size={18} /> },
    { label: "Inventory", path: "/vendor/products", icon: <Package size={18} /> },
    { label: "Orders", path: "/vendor/orders", icon: <ClipboardList size={18} /> },
    { label: "Promotions", path: "/vendor/banners", icon: <ImageIcon size={18} /> },
    { label: "New Listing", path: "/vendor/add-product", icon: <PlusCircle size={18} /> },
    { label: "Account", path: "/vendor/settings", icon: <UserCircle size={18} /> },
  ];

  return (
    <div className="flex min-h-screen bg-white text-slate-900 font-sans selection:bg-blue-100">
      
      {/* SIDEBAR */}
      <aside className="w-72 bg-[#130229] sticky top-0 h-screen hidden lg:flex flex-col shadow-xl">
        <div className="p-8">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-to-br from-cyan-400 to-blue-600 p-2.5 rounded-xl">
              <ShoppingBag className="text-white" size={22} />
            </div>
            <span className="text-xl font-black text-white tracking-widest uppercase italic">
              Foot<span className="text-cyan-400">wear</span>
            </span>
          </div>
          {user.displayStore && (
            <p className="text-cyan-400/50 text-[10px] font-bold uppercase mt-2 tracking-widest px-1">
              {user.displayStore}
            </p>
          )}
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2">
          <p className="px-4 text-[10px] font-bold text-purple-400/60 uppercase tracking-[0.3em] mb-4">Merchant Hub</p>
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`group flex items-center justify-between px-4 py-3.5 rounded-xl transition-all duration-300 ${
                  isActive
                    ? "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                    : "text-purple-200/60 hover:bg-white/5 hover:text-white"
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className={`${isActive ? "text-cyan-400" : "group-hover:text-cyan-400"}`}>
                    {item.icon}
                  </span>
                  <span className="text-sm font-bold tracking-wide">{item.label}</span>
                </div>
                {isActive && <ChevronRight size={14} />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-white/10">
          <button onClick={handleLogout} className="flex items-center gap-3 text-purple-400/60 hover:text-red-400 transition-all text-xs font-black uppercase tracking-widest w-full px-4 py-3 hover:bg-red-500/5 rounded-xl">
            <LogOut size={16} /> Disconnect
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        
        {/* TOPBAR */}
        <header className="h-20 bg-white/80 backdrop-blur-md border-b border-slate-100 flex items-center justify-between px-10 sticky top-0 z-10">
          <div className="flex items-center gap-4 bg-slate-50 px-5 py-2.5 rounded-full border border-slate-200 w-96">
            <Search className="text-slate-400" size={16} />
            <input type="text" placeholder="Search catalog..." className="bg-transparent border-none focus:ring-0 text-xs w-full font-medium" />
          </div>
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-slate-400 hover:text-blue-500 transition-all">
              <Bell size={20} />
              <span className="absolute top-2 right-2.5 w-2 h-2 bg-blue-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="h-8 w-[1px] bg-slate-200"></div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
              {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
            </p>
          </div>
        </header>

        <div className="p-10 overflow-y-auto">
          
          {/* 1. DASHBOARD VIEW */}
          {isDashboard && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
              <div className="mb-10">
                <h2 className="text-4xl font-black text-[#130229] tracking-tighter uppercase italic">
                  Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-cyan-500">{user.displayName}</span>
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                {[
                  { title: "Net Revenue", value: "रू 1,22,450", icon: <DollarSign size={20}/>, change: "+12.5%", color: "text-blue-600", bg: "bg-blue-50" },
                  { title: "Total Orders", value: orders.length, icon: <ClipboardList size={20}/>, change: "Live Sync", color: "text-purple-600", bg: "bg-purple-50" },
                  { title: "Live Units", value: products.length, icon: <Package size={20}/>, change: "Active", color: "text-cyan-600", bg: "bg-cyan-50" },
                ].map((item, index) => (
                  <div key={index} className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all">
                    <div className="flex items-start justify-between">
                      <div>
                        <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] mb-2">{item.title}</p>
                        <h3 className="text-3xl font-black text-[#130229] italic tracking-tight">{item.value}</h3>
                        <p className={`text-[10px] font-black mt-3 px-2 py-0.5 rounded ${item.bg} inline-block ${item.color}`}>{item.change}</p>
                      </div>
                      <div className={`${item.bg} p-4 rounded-2xl ${item.color}`}>{item.icon}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* 2. INVENTORY VIEW */}
          {isProductsPage && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
               <div className="flex justify-between items-end mb-10">
                <div>
                  <h2 className="text-4xl font-black text-[#130229] tracking-tighter uppercase italic">Inventory</h2>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">Manage your catalog entries</p>
                </div>
                <button onClick={() => navigate('/vendor/add-product')} className="bg-[#130229] hover:bg-slate-800 text-white px-8 py-4 rounded-xl text-xs font-black uppercase tracking-[0.2em] flex items-center gap-3 transition-all shadow-lg">
                  <PlusCircle size={16} /> Deploy New Item
                </button>
              </div>

              <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 border-b border-slate-100">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Asset</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Status</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Price</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] text-right">Utility</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {products.map((product) => (
                      <tr key={product.id} className="group hover:bg-slate-50/50 transition-all">
                        <td className="px-8 py-6">
                          <div className="flex items-center gap-5">
                            <img src={product.img} className="w-14 h-14 rounded-2xl object-cover border border-slate-200" alt="" />
                            <div>
                              <p className="font-black text-[#130229] text-sm uppercase">{product.name}</p>
                              <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mt-1">Ref: {product.id}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-3 py-1 rounded-md text-[10px] font-black uppercase ${product.stock === 0 ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-600"}`}>
                            {product.stock === 0 ? "Depleted" : `${product.stock} Units`}
                          </span>
                        </td>
                        <td className="px-8 py-6 font-black text-[#130229] italic tracking-wide">रू {product.productPrice.toLocaleString()}</td>
                        <td className="px-8 py-6 text-right">
                          <div className="flex justify-end gap-2">
                            <button className="p-2.5 text-slate-400 hover:text-blue-600 transition-all"><Edit3 size={16} /></button>
                            <button className="p-2.5 text-slate-400 hover:text-red-600 transition-all"><Trash2 size={16} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. ORDERS VIEW (INTEGRATED) */}
          {isOrdersPage && (
            <div className="animate-in fade-in slide-in-from-bottom-2 duration-700">
              <div className="mb-10">
                <h2 className="text-4xl font-black text-[#130229] tracking-tighter uppercase italic">Transmissions</h2>
                <p className="text-slate-500 text-xs font-bold uppercase tracking-[0.2em] mt-2">Monitoring Incoming Sales</p>
              </div>

              {orderLoading ? (
                <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-10 w-10 border-t-4 border-indigo-600"></div></div>
              ) : orders.length === 0 ? (
                <div className="bg-slate-50 border-2 border-dashed border-slate-200 p-20 text-center rounded-[2.5rem]">
                   <ShoppingBag className="mx-auto text-slate-300 mb-4" size={48} />
                   <p className="font-black uppercase text-slate-400 tracking-widest text-xs">No active order transmissions</p>
                </div>
              ) : (
                <div className="grid gap-6">
                  {orders.map((order) => (
                    <div key={order._id} className="bg-white border border-slate-100 p-8 rounded-[2rem] hover:shadow-xl transition-all group">
                      <div className="flex flex-wrap justify-between items-center mb-8 pb-6 border-b border-slate-50">
                        <div className="flex items-center gap-4">
                          <div className="bg-[#130229] p-4 rounded-2xl text-cyan-400 shadow-lg shadow-indigo-500/20">
                            <Package size={24} />
                          </div>
                          <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Order Ref</p>
                            <p className="font-black text-sm italic">#{order._id.slice(-8).toUpperCase()}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-10">
                          <div className="text-right">
                             <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Received</p>
                             <p className="text-xs font-bold uppercase italic">{new Date(order.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div className={`px-5 py-2.5 text-[10px] font-black uppercase tracking-[0.2em] rounded-full border-2 ${
                            order.orderStatus === 'Delivered' ? 'border-green-500 text-green-600 bg-green-50' : 'border-amber-500 text-amber-600 bg-amber-50'
                          }`}>
                            {order.orderStatus}
                          </div>
                        </div>
                      </div>

                      <div className="space-y-4">
                        {order.orderItems.map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between bg-slate-50/50 p-5 rounded-2xl border border-slate-100 hover:border-indigo-100 transition-colors">
                            <div className="flex items-center gap-5">
                              <img src={item.image} alt="" className="w-16 h-16 object-cover rounded-xl border border-slate-200 grayscale group-hover:grayscale-0 transition-all" />
                              <div>
                                <p className="font-black uppercase italic text-sm text-slate-800">{item.productName}</p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase mt-1">Sizing: {item.selectedSize} | Qty: {item.quantity}</p>
                              </div>
                            </div>
                            <p className="font-black text-[#130229] italic tracking-tighter text-lg">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                          </div>
                        ))}
                      </div>

                      <div className="mt-8 pt-6 flex justify-between items-center text-slate-400">
                        <div className="flex items-center gap-3">
                          <Clock size={16} className="text-indigo-400"/>
                          <span className="text-[10px] font-black uppercase tracking-widest">Sync: {new Date(order.updatedAt).toLocaleTimeString()}</span>
                        </div>
                        <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] hover:text-indigo-600 transition-all">
                          <Eye size={16} /> Details
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default VendorDb;