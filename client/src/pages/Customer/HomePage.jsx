import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import axios from "axios";

const Home = ({ onAddToCart }) => {
  const [banners, setBanners] = useState([]);
  const [currentBanner, setCurrentBanner] = useState(0);
  const [loading, setLoading] = useState(true);

  // --- FETCH APPROVED BANNERS FROM BACKEND ---
  useEffect(() => {
    const fetchActiveBanners = async () => {
      try {
        const res = await axios.get("http://localhost:3000/api/banners/active");
        setBanners(res.data.banners);
      } catch (err) {
        console.error("Error loading banners:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchActiveBanners();
  }, []);

  // --- AUTO-SLIDE LOGIC (Rotates every 5 seconds) ---
  useEffect(() => {
    if (banners.length > 1) {
      const timer = setInterval(() => {
        setCurrentBanner((prev) => (prev + 1) % banners.length);
      }, 5000);
      return () => clearInterval(timer);
    }
  }, [banners]);

  const trendingShoes = [
    {
      id: 1,
      name: "Volt Speed Runner",
      price: "$120.00",
      image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=600",
      tag: "Best Seller",
      accent: "bg-orange-50"
    },
    {
      id: 2,
      name: "Nebula Walking Pro",
      price: "$95.00",
      image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&q=80&w=600",
      tag: "Trending",
      accent: "bg-purple-50"
    },
    {
      id: 3,
      name: "Arctic High-Top",
      price: "$145.00",
      image: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?auto=format&fit=crop&q=80&w=600",
      tag: "New Arrival",
      accent: "bg-blue-50"
    }
  ];

  return (
    <div className="min-h-screen bg-white font-sans selection:bg-purple-600 selection:text-white">
      
      {/* --- DYNAMIC HERO SECTION (BANNER) --- */}
      <header className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#f8f8f8]">
        
        {/* Background Large Decorative Text */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none transition-opacity duration-1000">
          <h1 className="text-[20vw] font-black text-gray-200/40 leading-none italic uppercase">
            {banners[currentBanner]?.discountTag?.split(' ')[0] || "FOOTWEAR"}
          </h1>
        </div>

        <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-12 relative z-10">
          
          {/* Text Content Area */}
          <div key={`text-${currentBanner}`} className="animate-slide-right">
            {/* HIGHLIGHTED DISCOUNT TAG (e.g., 30% OFF) */}
            <div className="inline-block mb-6">
               <span className="bg-yellow-400 text-black px-5 py-2.5 rounded-full font-black uppercase tracking-tighter text-sm italic shadow-xl shadow-yellow-400/30 flex items-center gap-2">
                 <span className="animate-pulse">⚡</span> {banners[currentBanner]?.discountTag || "New Collection"}
               </span>
            </div>

            <h1 className="text-6xl md:text-8xl font-black text-gray-900 leading-[0.9] mb-8 italic uppercase tracking-tighter">
              {banners[currentBanner]?.title ? (
                <>
                  {banners[currentBanner].title.split(' ').slice(0, -1).join(' ')} <br />
                  <span className="text-transparent stroke-text">
                    {banners[currentBanner].title.split(' ').pop()}.
                  </span>
                </>
              ) : (
                <>Level <br /> <span className="text-transparent stroke-text">Up.</span></>
              )}
            </h1>

            <p className="text-lg text-gray-500 mb-10 max-w-md font-medium leading-relaxed">
              {banners[currentBanner]?.description || "Experience the next generation of footwear. Engineered for durability and unmatched comfort."}
            </p>

            <Link 
              to="/shop" 
              className="inline-block px-12 py-5 bg-purple-600 text-white font-black italic rounded-xl hover:bg-gray-900 transition-all transform hover:-translate-y-1 shadow-2xl shadow-purple-500/20"
            >
              EXPLORE COLLECTION
            </Link>
          </div>

          {/* Image Display Area */}
          <div className="relative flex justify-center items-center h-[500px]">
            <div className="absolute w-[80%] h-[80%] bg-purple-500/10 rounded-full blur-[120px]"></div>
            
            {loading ? (
               <div className="w-64 h-64 bg-gray-200 animate-pulse rounded-full" />
            ) : (
              <img 
                key={`img-${currentBanner}`}
                src={banners[currentBanner]?.image?.url || "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000"} 
                className="relative z-10 w-full max-h-[500px] object-contain drop-shadow-[0_35px_35px_rgba(0,0,0,0.3)] transition-all duration-700 ease-out animate-banner-in" 
                alt="Featured Product" 
              />
            )}
          </div>
        </div>

        {/* Slide Progress Indicators (Bottom Left) */}
        {banners.length > 1 && (
          <div className="absolute bottom-12 left-10 flex gap-6 items-end">
            {banners.map((_, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentBanner(idx)}
                className="group flex flex-col gap-2 items-start"
              >
                <span className={`text-[10px] font-black transition-colors ${idx === currentBanner ? "text-purple-600" : "text-gray-400"}`}>
                  0{idx + 1}
                </span>
                <div className={`h-[4px] transition-all duration-700 rounded-full ${idx === currentBanner ? "w-20 bg-purple-600" : "w-10 bg-gray-300 group-hover:bg-gray-400"}`} />
              </button>
            ))}
          </div>
        )}
      </header>

      {/* --- TRENDING PRODUCTS GRID --- */}
      <main className="max-w-7xl mx-auto py-32 px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-4">
          <div>
            <span className="text-purple-600 font-bold uppercase tracking-widest text-xs">Curated Selection</span>
            <h2 className="text-5xl font-black text-gray-900 italic uppercase">Trending Now</h2>
          </div>
          <Link to="/shop" className="group flex items-center gap-2 font-black text-xs uppercase tracking-widest hover:text-purple-600 transition-colors">
            View All Series <span className="group-hover:translate-x-2 transition-transform">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-16">
          {trendingShoes.map((shoe) => (
            <div key={shoe.id} className="group cursor-pointer">
              <div className={`${shoe.accent} rounded-[48px] h-[450px] flex items-center justify-center relative overflow-hidden transition-all duration-700 group-hover:shadow-2xl group-hover:-translate-y-4`}>
                <img src={shoe.image} alt={shoe.name} className="w-[85%] object-contain drop-shadow-2xl transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12" />
                <div className="absolute top-10 left-10 bg-white/80 backdrop-blur-md px-5 py-2 rounded-full shadow-sm text-[10px] font-black uppercase tracking-widest text-gray-900">
                  {shoe.tag}
                </div>
              </div>

              <div className="mt-10 px-4">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-2xl font-black text-gray-900 group-hover:text-purple-600 transition-colors leading-tight">{shoe.name}</h3>
                    <p className="text-gray-400 font-bold text-xs uppercase tracking-widest mt-1">Series 2.0 / Performance</p>
                  </div>
                  <span className="text-2xl font-black text-gray-900 leading-none">{shoe.price}</span>
                </div>
                <button 
                  onClick={onAddToCart}
                  className="w-full mt-4 py-5 bg-gray-900 text-white rounded-[20px] font-black italic uppercase tracking-widest hover:bg-purple-600 transition-all active:scale-95 shadow-lg"
                >
                  Add To Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* --- CSS ANIMATIONS --- */}
      <style>
        {`
          .stroke-text { -webkit-text-stroke: 2px #111; }
          
          @keyframes slide-right { 
            from { opacity: 0; transform: translateX(-40px); } 
            to { opacity: 1; transform: translateX(0); } 
          }
          
          @keyframes banner-in {
            from { opacity: 0; transform: scale(0.9) rotate(0deg) translateY(20px); }
            to { opacity: 1; transform: scale(1) rotate(-12deg) translateY(0); }
          }

          .animate-slide-right { 
            animation: slide-right 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
          }
          
          .animate-banner-in { 
            animation: banner-in 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; 
          }
        `}
      </style>
    </div>
  );
};

export default Home;