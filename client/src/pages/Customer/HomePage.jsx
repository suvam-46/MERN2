import React from 'react';
import { Link } from "react-router-dom";

const Home = ({ onAddToCart }) => {
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
      {/* --- HERO SECTION --- */}
      <header className="relative min-h-screen flex items-center overflow-hidden bg-[#f8f8f8]">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 select-none pointer-events-none">
          <h1 className="text-[20vw] font-black text-gray-200/40 leading-none italic uppercase">FOOTWEAR</h1>
        </div>

        <div className="max-w-7xl mx-auto px-8 w-full grid grid-cols-1 lg:grid-cols-2 items-center gap-12 relative z-10">
          <div className="animate-slide-right">
            <h2 className="text-purple-600 font-black uppercase tracking-[0.5em] mb-4 text-xs">Premium Performance</h2>
            <h1 className="text-7xl md:text-9xl font-black text-gray-900 leading-[0.85] mb-8 italic uppercase tracking-tighter">
              Level <br /> 
              <span className="text-transparent stroke-text">Up.</span>
            </h1>
            <p className="text-lg text-gray-500 mb-10 max-w-md font-medium leading-relaxed">
              Step into the future of athletic comfort. Engineered for the bold, designed for the traveler.
            </p>
            <Link to="/shop" className="inline-block px-12 py-5 bg-purple-600 text-white font-black italic rounded-xl hover:bg-gray-900 transition-all transform hover:-translate-y-1 shadow-2xl shadow-purple-500/20">
              SHOP COLLECTION
            </Link>
          </div>

          <div className="relative flex justify-center items-center animate-float">
            <div className="absolute w-[80%] h-[80%] bg-purple-500/10 rounded-full blur-[120px]"></div>
            <img 
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=1000" 
              className="relative z-10 w-full h-auto drop-shadow-[0_35px_35px_rgba(0,0,0,0.3)] rotate-[-15deg] hover:rotate-0 transition-transform duration-1000" 
              alt="Hero Shoe" 
            />
          </div>
        </div>
      </header>

      {/* --- PRODUCT GRID --- */}
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

      <style>
        {`
          .stroke-text { -webkit-text-stroke: 2px #111; }
          @keyframes slide-right { from { opacity: 0; transform: translateX(-50px); } to { opacity: 1; transform: translateX(0); } }
          @keyframes float { 0%, 100% { transform: translateY(0px); } 50% { transform: translateY(-20px); } }
          .animate-slide-right { animation: slide-right 1s ease-out forwards; }
          .animate-float { animation: float 6s ease-in-out infinite; }
        `}
      </style>
    </div>
  );
};

export default Home;