import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import {
  ShoppingBag,
  ChevronDown,
  User,
  Zap,
  Star,
  Flame,
  ShoppingCart,
  Search,
  LogIn, // Added LogIn icon
} from "lucide-react";

const Navbar = ({ cartCount = 0, user }) => {
  const [scrolled, setScrolled] = useState(false);
  const [showShopMenu, setShowShopMenu] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (path) => {
    navigate(path);
    setShowShopMenu(false);
  };

  return (
    <nav
      className={`fixed top-0 left-0 w-full z-[100] transition-all duration-500 px-8 py-4 flex justify-between items-center ${
        scrolled ? "bg-white/90 backdrop-blur-xl shadow-md" : "bg-white"
      }`}
    >
      {/* 1. LOGO */}
      <Link to="/homepage" className="flex items-center gap-3">
        <span className="font-black text-2xl italic tracking-tighter">
          FOOTWEAR<span className="text-blue-600">.</span>
        </span>
      </Link>

      {/* 2. MENU ITEMS */}
      <div className="hidden lg:flex items-center space-x-10 font-black text-[11px] uppercase tracking-[0.2em]">
        <Link
          to="/homepage"
          className={location.pathname === "/homepage" ? "text-blue-600" : "text-slate-600"}
        >
          Home
        </Link>

        {/* SHOP DROPDOWN */}
        <div
          className="relative py-2"
          onMouseEnter={() => setShowShopMenu(true)}
          onMouseLeave={() => setShowShopMenu(false)}
        >
          <div
            className={`flex items-center gap-2 cursor-pointer ${
              location.pathname.startsWith("/shop") ? "text-blue-600" : "text-slate-600"
            }`}
          >
            <ShoppingBag size={15} />
            <span>Shop</span>
            <ChevronDown
              size={13}
              className={`transition-transform duration-300 ${showShopMenu ? "rotate-180" : ""}`}
            />
          </div>

          {showShopMenu && (
            <div className="absolute top-full -left-5 w-60 pt-4 z-[110]">
              <div className="bg-white shadow-2xl rounded-2xl border border-gray-100 p-2 overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                <div onClick={() => handleNavClick("/shop")} className="flex items-center gap-3 px-4 py-4 rounded-xl hover:bg-blue-50 cursor-pointer transition">
                  <Star size={16} className="text-blue-500" />
                  <span className="text-slate-700 font-bold tracking-normal italic">All Sneakers</span>
                </div>
                <div onClick={() => handleNavClick("/shop/new-arrivals")} className="flex items-center gap-3 px-4 py-4 rounded-xl hover:bg-blue-50 cursor-pointer transition">
                  <Zap size={16} className="text-orange-500" />
                  <span className="text-slate-700 font-bold tracking-normal italic">New Arrivals</span>
                </div>
                <div onClick={() => handleNavClick("/shop/top-products")} className="flex items-center gap-3 px-4 py-4 rounded-xl hover:bg-blue-50 cursor-pointer transition">
                  <Flame size={16} className="text-red-500" />
                  <span className="text-slate-700 font-bold tracking-normal italic">Top Rated</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <Link to="/cart" className="relative flex items-center gap-2 text-slate-600">
          <ShoppingCart size={15} />
          <span>Cart</span>
          {cartCount > 0 && (
            <span className="absolute -top-2 -right-3 bg-blue-600 text-white text-[8px] w-4 h-4 flex items-center justify-center rounded-full animate-bounce">
              {cartCount}
            </span>
          )}
        </Link>
      </div>

      {/* 3. ACTION BUTTONS */}
      <div className="flex items-center gap-3">
        <div className="p-2.5 bg-gray-50 text-slate-600 rounded-full hover:bg-blue-50 hover:text-blue-600 cursor-pointer transition-colors">
          <Search size={18} />
        </div>

        {user ? (
          /* SHOW USER PROFILE IF LOGGED IN */
          <Link 
            to={user.role === "vendor" ? "/vendor/dashboard" : "/profile"} 
            className="flex items-center gap-2 p-1 pr-4 bg-gray-50 rounded-full hover:bg-blue-50 transition-all border border-transparent hover:border-blue-100 group"
          >
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white text-xs font-black">
              {user.userName?.charAt(0).toUpperCase() || <User size={16} />}
            </div>
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-700 group-hover:text-blue-600">
              {user.userName?.split(" ")[0]}
            </span>
          </Link>
        ) : (
          /* SHOW SIGN IN BUTTON IF NOT LOGGED IN */
          <Link
            to="/login"
            className="flex items-center gap-2 px-5 py-2.5 bg-slate-950 text-white rounded-full text-[10px] font-black uppercase tracking-[0.15em] hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-500/30 transition-all duration-300 active:scale-95"
          >
            <LogIn size={14} />
            <span>Sign In</span>
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;