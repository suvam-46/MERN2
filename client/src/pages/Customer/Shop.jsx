import React, { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Zap, Flame, ShoppingCart, Grid, Star, ArrowLeft } from "lucide-react";

const Shop = ({ onAddToCart }) => {
  const { category } = useParams();

  // क्याटेगरी बदलिँदा पेजको टुप्पोमा लैजाने
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [category]);

  const allProducts = [
    { id: 1, name: "Jordan 1 Retro", price: 190, cat: "new-arrivals", img: "/images/s1.png", brand: "Jordan" },
    { id: 2, name: "Air Max 270", price: 150, cat: "featured", img: "/images/s2.png", brand: "Nike" },
    { id: 3, name: "Yeezy 350 V2", price: 220, cat: "top-products", img: "/images/s3.png", brand: "Adidas" },
    { id: 4, name: "Dunk Low Panda", price: 110, cat: "new-arrivals", img: "/images/s4.png", brand: "Nike" },
    { id: 5, name: "Forum Low", price: 100, cat: "featured", img: "/images/s5.png", brand: "Adidas" },
    { id: 6, name: "Air Force 1", price: 115, cat: "top-products", img: "/images/s6.png", brand: "Nike" },
  ];

  // फिल्टर लोजिक: यदि category छ भने फिल्टर गर्ने, छैन भने सबै देखाउने
  const products = category 
    ? allProducts.filter((p) => p.cat === category)
    : allProducts;

  const getHeaderInfo = () => {
    switch (category) {
      case "new-arrivals": return { title: "New Arrivals", icon: <Zap className="text-orange-500" /> };
      case "top-products": return { title: "Top Rated", icon: <Flame className="text-red-500" /> };
      default: return { title: "All Sneakers", icon: <Grid className="text-blue-600" /> };
    }
  };

  const { title, icon } = getHeaderInfo();

  return (
    <div className="min-h-screen bg-[#f8fbff] pt-40 pb-20 px-6 md:px-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-16 gap-6">
          <div className="flex items-center gap-6">
            <div className="p-5 bg-white shadow-2xl rounded-[30px] border border-blue-50">
              {icon}
            </div>
            <div>
              <h1 className="text-5xl md:text-7xl font-black uppercase italic tracking-tighter text-slate-900">
                {title}<span className="text-blue-600">.</span>
              </h1>
              <p className="text-slate-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2">
                Premium Selection / 2026 Collection
              </p>
            </div>
          </div>
          
          {category && (
            <Link to="/shop" className="group flex items-center gap-2 text-slate-400 hover:text-blue-600 font-black uppercase text-[10px] tracking-widest transition-all">
              <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
              Back to all sneakers
            </Link>
          )}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12">
          {products.length > 0 ? (
            products.map((product) => (
              <div key={product.id} className="group relative bg-white rounded-[50px] p-8 shadow-[0_20px_50px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_80px_rgba(37,99,235,0.1)] transition-all duration-500 border border-transparent hover:border-blue-100">
                <div className="absolute top-8 left-8">
                  <span className="px-4 py-1 bg-slate-100 text-slate-500 text-[8px] font-black uppercase tracking-widest rounded-full">
                    {product.brand}
                  </span>
                </div>
                
                <div className="h-64 flex items-center justify-center mb-6 relative">
                   <div className="absolute w-32 h-32 bg-blue-100 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                   <img 
                    src={product.img} 
                    alt={product.name} 
                    className="w-full h-full object-contain relative z-10 group-hover:scale-110 group-hover:-rotate-12 transition-all duration-500 drop-shadow-2xl" 
                   />
                </div>

                <div className="flex justify-between items-end">
                  <div>
                    <h3 className="text-2xl font-black uppercase italic tracking-tighter text-slate-900 leading-tight">
                      {product.name}
                    </h3>
                    <span className="text-3xl font-black text-blue-600 mt-2 block italic tracking-tighter">
                      ${product.price}
                    </span>
                  </div>
                  <button 
                    onClick={() => onAddToCart(product)}
                    className="p-5 bg-slate-900 text-white rounded-[25px] hover:bg-blue-600 hover:scale-110 transition-all shadow-xl active:scale-95"
                  >
                    <ShoppingCart size={20} />
                  </button>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-full py-20 text-center opacity-30">
               <h2 className="text-3xl font-black uppercase italic">No Shoes Found.</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Shop;