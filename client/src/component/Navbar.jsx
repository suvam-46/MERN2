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
  Heart,
  LogIn,
} from "lucide-react";

const Navbar = ({ cartCount = 0, wishlistCount = 0, user }) => {
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

  // Shared badge styling to keep code clean
  const Badge = ({ count, colorClass }) => (
    <span className={`absolute -top-2 -right-3 ${colorClass} text-white text-[9px] min-w-[18px] h-[18px] flex items-center justify-center rounded-full font-black shadow-lg animate-in zoom-in duration-300`}>
      {count > 9 ? "9+" : count}
    </span>
  );

  return (
    <div className="fixed top-0 left-0 w-full z-[100] px-6 py-4 pointer-events-none">
      <nav
        className={`max-w-7xl mx-auto flex justify-between items-center transition-all duration-700 ease-in-out pointer-events-auto px-8 rounded-[30px] border ${
          scrolled 
            ? "bg-white/90 backdrop-blur-2xl shadow-[0_30px_60px_rgba(0,0,0,0.08)] border-white/50 py-3" 
            : "bg-white border-transparent py-6"
        }`}
      >
        {/* 1. LOGO SECTION */}
        <Link 
          to="/homepage" 
          className="flex items-center gap-3 group pointer-events-auto relative z-[110]"
        >
          <div className="relative">
            <img 
              src="/images/Logo.png" 
              alt="Footwear Logo" 
              className="w-11 h-11 object-contain rotate-3 group-hover:rotate-12 transition-all duration-500 drop-shadow-md"
            />
            <div className="absolute inset-0 bg-blue-600/10 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          </div>

          <div className="flex flex-col">
            <span className="font-black text-2xl italic tracking-tighter text-slate-950 leading-none">
              FOOTWEAR<span className="text-blue-600">.</span>
            </span>
            <span className="text-[7px] font-black uppercase tracking-[0.4em] text-blue-600/60 leading-none mt-1">
              Premium Kicks
            </span>
          </div>
        </Link>

        {/* 2. MENU ITEMS */}
        <div className="hidden lg:flex items-center space-x-10 font-black text-[11px] uppercase tracking-[0.2em]">
          <Link
            to="/homepage"
            className={`transition-colors duration-300 hover:text-blue-600 ${
              location.pathname === "/homepage" ? "text-blue-600" : "text-slate-500"
            }`}
          >
            Home
          </Link>

          {/* SHOP DROPDOWN */}
          <div
            className="relative group py-2"
            onMouseEnter={() => setShowShopMenu(true)}
            onMouseLeave={() => setShowShopMenu(false)}
          >
            <div
              className={`flex items-center gap-2 cursor-pointer transition-colors duration-300 hover:text-blue-600 ${
                location.pathname.startsWith("/shop") ? "text-blue-600" : "text-slate-500"
              }`}
            >
              <ShoppingBag size={14} className="group-hover:animate-bounce" />
              <span>Shop</span>
              <ChevronDown
                size={12}
                className={`transition-transform duration-500 ${showShopMenu ? "rotate-180 text-blue-600" : ""}`}
              />
            </div>

            {showShopMenu && (
              <div className="absolute top-full -left-8 w-64 pt-6 z-[110]">
                <div className="bg-white shadow-[0_40px_80px_rgba(0,0,0,0.12)] rounded-[35px] border border-slate-50 p-3 overflow-hidden animate-in fade-in zoom-in-95 slide-in-from-top-4 duration-300">
                  <div 
                    onClick={() => handleNavClick("/shop")} 
                    className="group/item flex items-center gap-4 px-5 py-4 rounded-[22px] hover:bg-slate-900 cursor-pointer transition-all duration-300"
                  >
                    <Star size={16} className="text-blue-500 group-hover/item:text-white transition-colors" />
                    <span className="text-slate-700 group-hover/item:text-white font-bold tracking-normal italic transition-colors">All Sneakers</span>
                  </div>

                  <div 
                    onClick={() => handleNavClick("/shop/new-arrivals")} 
                    className="group/item flex items-center gap-4 px-5 py-4 rounded-[22px] hover:bg-blue-600 cursor-pointer transition-all duration-300"
                  >
                    <Zap size={16} className="text-orange-500 group-hover/item:text-white transition-colors" />
                    <span className="text-slate-700 group-hover/item:text-white font-bold tracking-normal italic transition-colors">New Arrivals</span>
                  </div>

                  <div 
                    onClick={() => handleNavClick("/shop/top-products")} 
                    className="group/item flex items-center gap-4 px-5 py-4 rounded-[22px] hover:bg-yellow-500 cursor-pointer transition-all duration-300"
                  >
                    <Flame size={16} className="text-red-500 group-hover/item:text-white transition-colors" />
                    <span className="text-slate-700 group-hover/item:text-white font-bold tracking-normal italic transition-colors">Top Rated</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* WISHLIST */}
          <Link 
            to="/favorites" 
            className={`relative flex items-center gap-2 transition-colors duration-300 hover:text-red-500 ${
              location.pathname === "/favorites" ? "text-red-500" : "text-slate-500"
            }`}
          >
            <Heart 
              size={14} 
              fill={location.pathname === "/favorites" || wishlistCount > 0 ? "#ef4444" : "none"} 
              className={wishlistCount > 0 ? "text-red-500" : ""}
            />
            <span>Wishlist</span>
            {wishlistCount > 0 && <Badge count={wishlistCount} colorClass="bg-red-500" />}
          </Link>

          {/* CART */}
          <Link 
            to="/cart" 
            className={`relative flex items-center gap-2 transition-colors duration-300 hover:text-blue-600 ${
              location.pathname === "/cart" ? "text-blue-600" : "text-slate-500"
            }`}
          >
            <ShoppingCart size={14} />
            <span>Cart</span>
            {cartCount > 0 && <Badge count={cartCount} colorClass="bg-blue-600" />}
          </Link>
        </div>

        {/* 3. ACTION BUTTONS */}
        <div className="flex items-center gap-4">
          {user ? (
            <Link 
              to={user.role === "vendor" ? "/vendor/dashboard" : "/profile"} 
              className="flex items-center gap-3 p-1.5 pr-5 bg-slate-950 rounded-full hover:bg-blue-600 transition-all duration-500 group shadow-xl active:scale-95 pointer-events-auto"
            >
              <div className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center text-white text-xs font-black group-hover:bg-white group-hover:text-blue-600 transition-colors">
                {user.userName?.charAt(0).toUpperCase() || <User size={16} />}
              </div>
              <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white">
                {user.userName?.split(" ")[0]}
              </span>
            </Link>
          ) : (
            <Link
              to="/login"
              className="flex items-center gap-2 px-7 py-3 bg-slate-950 text-white rounded-full text-[10px] font-black uppercase tracking-[0.2em] hover:bg-blue-600 transition-all duration-500 active:scale-95 group pointer-events-auto"
            >
              <LogIn size={14} className="group-hover:translate-x-1 transition-transform" />
              <span>Sign In</span>
            </Link>
          )}
        </div>
      </nav>
    </div>
  );
};

export default Navbar;