import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import { 
  Zap, Flame, ShoppingCart, Grid, Loader2, 
  Tag, Trophy, Dumbbell, Footprints, 
  Briefcase, Mountain, User, Sparkles, Star,
  X, Heart, Palette, Ruler, Check
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

const Shop = ({ onWishlistChange, onCartChange }) => {
  const { category: rawCategory } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const urlCategory = rawCategory ? decodeURIComponent(rawCategory) : null;
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userWishlist, setUserWishlist] = useState([]);

  // Filter States
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);

  // Quick Add Modal State
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [activeProduct, setActiveProduct] = useState(null);
  const [quickSize, setQuickSize] = useState(null);
  const [quickColor, setQuickColor] = useState(null);
  const [addingToCart, setAddingToCart] = useState(false);

  const categories = [
    { name: "Running", icon: <Zap size={16} /> },
    { name: "Basketball", icon: <Trophy size={16} /> },
    { name: "Casual/Sneakers", icon: <Footprints size={16} /> },
    { name: "Training & Gym", icon: <Dumbbell size={16} /> },
    { name: "Football", icon: <Flame size={16} /> },
    { name: "Formal", icon: <Briefcase size={16} /> },
    { name: "Sandals/Slides", icon: <Grid size={16} /> },
    { name: "Outdoor/Boots", icon: <Mountain size={16} /> },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const productRes = await axios.get("http://localhost:3000/api/product/all", { withCredentials: true });
        setProducts(productRes.data.products || productRes.data);

        try {
          const wishlistRes = await axios.get("http://localhost:3000/api/customer/wishlist", { withCredentials: true });
          const items = wishlistRes.data.wishlist || [];
          const wishlistIds = items.map(item => (typeof item === 'object' ? item._id : item));
          setUserWishlist(wishlistIds);
        } catch (err) {
          setUserWishlist([]); 
        }
      } catch (error) {
        toast.error("Failed to load inventory");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleWishlist = async (productId) => {
    try {
      const { data } = await axios.post(
        `http://localhost:3000/api/customer/wishlist/toggle/${productId}`, 
        {}, 
        { withCredentials: true }
      );

      if (data.isWishlisted) {
        setUserWishlist(prev => [...prev, productId]);
        toast.success("Added to favorites", { icon: '❤️' });
      } else {
        setUserWishlist(prev => prev.filter(id => id.toString() !== productId.toString()));
        toast.success("Removed from favorites");
      }

      if (onWishlistChange) onWishlistChange();
    } catch (error) {
      toast.error("Please login to save favorites");
    }
  };

  // UPDATED: This now triggers the navbar update
  const handleAddToCartSubmit = async () => {
    if (!quickSize || !quickColor) {
      toast.error("Please select size and color");
      return;
    }

    setAddingToCart(true);
    try {
      const res = await axios.post(
        "http://localhost:3000/api/cart/addCart",
        {
          productId: activeProduct._id,
          quantity: 1,
          selectedSize: quickSize,
          selectedColor: quickColor
        },
        { withCredentials: true }
      );

      if (res.data.success) {
        toast.success(`${activeProduct.productName} added to cart!`);
        setShowQuickAdd(false);
        setQuickSize(null);
        setQuickColor(null);
        
        // CRITICAL: Tells App.js to re-fetch the cart count for the Navbar
        if (onCartChange) onCartChange();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login to add items to cart");
    } finally {
      setAddingToCart(false);
    }
  };

  const openQuickAdd = (product) => {
    setActiveProduct(product);
    setShowQuickAdd(true);
  };

  const getProcessedProducts = () => {
    let result = [...products];
    if (location.pathname === "/shop/new-arrivals") {
      result = result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (location.pathname === "/shop/top-products") {
      result = result.sort((a, b) => (b.ratings || 0) - (a.ratings || 0));
    }
    return result.filter((p) => {
      const matchesCategory = !urlCategory || p.category === urlCategory;
      const matchesSize = !selectedSize || p.sizes?.includes(Number(selectedSize));
      const matchesColor = !selectedColor || p.colors?.includes(selectedColor);
      return matchesCategory && matchesSize && matchesColor;
    });
  };

  const filteredProducts = getProcessedProducts();
  const availableSizes = [...new Set(products.flatMap(p => p.sizes || []))].sort((a, b) => a - b);
  const availableColors = [...new Set(products.flatMap(p => p.colors || []))];

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={12}
        className={`${index < Math.floor(rating || 0) ? "fill-yellow-400 text-yellow-400" : "text-slate-200 fill-slate-100"}`}
      />
    ));
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fbff]">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
      <p className="font-black italic uppercase tracking-tighter text-slate-400">Syncing Collection...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fbff] pt-32 pb-20 px-4 md:px-20 relative">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col mb-12">
          <div className="flex items-center gap-2 mb-2">
             <Sparkles className="text-blue-500" size={20} />
             <span className="text-blue-600 font-black uppercase text-[10px] tracking-[0.3em]">
                {location.pathname.includes("top") ? "Elite Performance" : "Premium Footwear"}
             </span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
            {urlCategory || (location.pathname.includes("new") ? "New Arrivals" : "All Kicks")}<span className="text-blue-600">.</span>
          </h1>
        </div>

        {/* Categories Bar */}
        <div className="flex overflow-x-auto pb-10 gap-4 no-scrollbar items-center">
          <button
            onClick={() => navigate("/shop")}
            className={`flex-shrink-0 px-8 py-4 rounded-2xl font-black uppercase italic text-xs tracking-widest transition-all duration-500 border ${!urlCategory ? "bg-slate-900 text-white shadow-2xl scale-105 border-slate-900" : "bg-white text-slate-400 border-slate-100 hover:border-blue-200"}`}
          >
            Universal
          </button>
          {categories.map((cat) => (
            <button
              key={cat.name}
              onClick={() => navigate(`/shop/${encodeURIComponent(cat.name)}`)}
              className={`flex-shrink-0 flex items-center gap-3 px-8 py-4 rounded-2xl font-black uppercase italic text-xs tracking-widest transition-all duration-500 border ${urlCategory === cat.name ? "bg-blue-600 text-white shadow-2xl scale-105 border-blue-600" : "bg-white text-slate-400 border-slate-100 hover:border-blue-200"}`}
            >
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>

        <div className="flex flex-col lg:flex-row gap-12">
          {/* Sidebar */}
          <div className="lg:w-72 flex-shrink-0 space-y-12">
            <div className="bg-white/50 backdrop-blur-md p-6 rounded-[32px] border border-white shadow-sm">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 mb-6 flex items-center gap-2">
                <Ruler size={14} className="text-blue-600" /> Size (UK)
              </h4>
              <div className="grid grid-cols-3 gap-3">
                {availableSizes.map(size => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(selectedSize === size ? null : size)}
                    className={`h-12 rounded-xl text-[11px] font-black transition-all duration-300 ${selectedSize === size ? "bg-slate-900 text-white shadow-lg -translate-y-1" : "bg-white text-slate-400 border border-slate-100 hover:bg-slate-50 hover:text-slate-600"}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white/50 backdrop-blur-md p-6 rounded-[32px] border border-white shadow-sm">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-900 mb-6 flex items-center gap-2">
                <Palette size={14} className="text-blue-600" /> Colorway
              </h4>
              <div className="flex flex-wrap gap-4">
                {availableColors.map(color => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(selectedColor === color ? null : color)}
                    className={`group relative flex items-center gap-2 px-4 py-2 rounded-full border transition-all duration-500 ${selectedColor === color ? "bg-blue-600 border-blue-600 text-white shadow-md scale-105" : "bg-white border-slate-100 text-slate-400 hover:border-blue-200"}`}
                  >
                    <div 
                      className="w-3 h-3 rounded-full border border-black/5" 
                      style={{ backgroundColor: color.toLowerCase().replace(/\s/g, '') }} 
                    />
                    <span className="text-[10px] font-black uppercase tracking-tighter">{color}</span>
                  </button>
                ))}
              </div>
            </div>
            
            {(selectedSize || selectedColor) && (
              <button 
                onClick={() => {setSelectedSize(null); setSelectedColor(null);}}
                className="w-full py-4 rounded-2xl bg-red-50 text-red-500 text-[10px] font-black uppercase tracking-widest flex items-center justify-center gap-2 hover:bg-red-500 hover:text-white transition-all"
              >
                <X size={14} /> Clear Selection
              </button>
            )}
          </div>

          {/* Product Grid */}
          <div className="flex-grow grid grid-cols-1 md:grid-cols-2 gap-10">
            {filteredProducts.length > 0 ? (
              filteredProducts.map((product) => {
                const originalPrice = product.productPrice;
                const discountedPrice = product.discountPrice;
                const hasDiscount = discountedPrice > 0 && discountedPrice < originalPrice;
                const dynamicPercent = hasDiscount ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100) : 0;
                const isLiked = userWishlist.some(id => id.toString() === product._id.toString());

                return (
                  <div key={product._id} className="group relative bg-white rounded-[60px] p-10 shadow-[0_30px_60px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_90px_rgba(37,99,235,0.12)] transition-all duration-700 border border-transparent hover:border-blue-50 overflow-hidden">
                    
                    <div className="absolute top-8 right-8 z-40 flex flex-col items-end gap-3">
                      <button 
                        onClick={() => toggleWishlist(product._id)}
                        className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center border border-slate-100 shadow-sm hover:scale-110 transition-all active:scale-90"
                      >
                        <Heart 
                          size={20} 
                          className={`transition-colors duration-300 ${isLiked ? "fill-red-500 text-red-500" : "text-slate-300"}`} 
                        />
                      </button>

                      {hasDiscount && (
                        <span className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white text-[10px] font-black uppercase tracking-tighter rounded-full shadow-lg">
                          <Tag size={12} /> -{dynamicPercent}%
                        </span>
                      )}
                    </div>

                    <div className="absolute top-8 left-8 flex flex-col gap-2 z-30">
                      <span className="w-fit px-4 py-1.5 bg-white/80 backdrop-blur-md text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-sm border border-slate-100">{product.brand}</span>
                      <span className="w-fit px-3 py-1 bg-blue-600/90 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest rounded-full flex items-center gap-1 shadow-md"><User size={10} /> {product.gender}</span>
                    </div>

                    <Link to={`/product/${product._id}`} className="block">
                      <div className="h-64 flex items-center justify-center mb-8 relative z-10">
                         <div className="absolute w-32 h-32 bg-blue-50 rounded-full blur-[80px] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
                         <img 
                            src={product.productImages?.[0]?.url || "/placeholder.png"} 
                            alt={product.productName} 
                            className="w-full h-full object-contain relative group-hover:scale-110 group-hover:-rotate-12 transition-all duration-700 drop-shadow-[0_25px_25px_rgba(0,0,0,0.1)]" 
                         />
                      </div>
                      <div className="relative z-20">
                        <h3 className="text-xl font-black uppercase italic tracking-tighter text-slate-900 leading-none truncate mb-2 group-hover:text-blue-600 transition-colors">
                            {product.productName}
                        </h3>
                      </div>
                    </Link>

                    <div className="flex justify-between items-end relative z-20">
                      <div>
                        <div className="flex items-center gap-2 mb-3">
                            {renderStars(product.ratings)} 
                            <span className="text-[9px] font-bold text-slate-300">({product.numOfReviews || 0})</span>
                        </div>
                        <div className="flex flex-col">
                          {hasDiscount ? (
                            <>
                                <span className="text-xs font-bold text-slate-300 line-through italic">Rs. {originalPrice}</span>
                                <span className="text-3xl font-black text-blue-600 italic tracking-tighter">Rs. {discountedPrice}</span>
                            </>
                          ) : (
                            <span className="text-3xl font-black text-slate-900 italic tracking-tighter">Rs. {originalPrice}</span>
                          )}
                        </div>
                      </div>
                      <button 
                        onClick={() => openQuickAdd(product)} 
                        className="p-5 bg-slate-900 text-white rounded-[25px] hover:bg-blue-600 hover:scale-110 transition-all shadow-xl active:scale-95 group-hover:-translate-y-1"
                      >
                        <ShoppingCart size={20} />
                      </button>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-full py-20 text-center">
                 <div className="bg-white rounded-[40px] p-16 border-2 border-dashed border-slate-100">
                    <h2 className="text-2xl font-black uppercase italic tracking-tighter text-slate-300">No matching kicks found.</h2>
                    <button onClick={() => {setSelectedSize(null); setSelectedColor(null); navigate("/shop")}} className="mt-4 text-blue-600 font-black uppercase text-[10px] tracking-widest">Clear all filters</button>
                 </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* QUICK ADD MODAL */}
      {showQuickAdd && activeProduct && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-950/40 backdrop-blur-xl" onClick={() => setShowQuickAdd(false)} />
          <div className="relative bg-white w-full max-w-md rounded-[40px] p-10 shadow-2xl animate-in zoom-in-95 duration-300">
            <button onClick={() => setShowQuickAdd(false)} className="absolute top-6 right-6 text-slate-300 hover:text-slate-900 transition-colors">
              <X size={24} />
            </button>
            
            <h2 className="text-2xl font-black italic uppercase tracking-tighter mb-1">Select Options</h2>
            <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest mb-8">{activeProduct.productName}</p>

            <div className="mb-8">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-4">Available Sizes (UK)</label>
              <div className="grid grid-cols-4 gap-2">
                {activeProduct.sizes.map(size => (
                  <button 
                    key={size}
                    onClick={() => setQuickSize(size)}
                    className={`h-12 rounded-xl font-black text-xs transition-all ${quickSize === size ? "bg-blue-600 text-white shadow-lg" : "bg-slate-50 text-slate-400 hover:bg-slate-100"}`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-10">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-4">Available Colorways</label>
              <div className="flex flex-wrap gap-2">
                {activeProduct.colors.map(color => (
                  <button 
                    key={color}
                    onClick={() => setQuickColor(color)}
                    className={`px-4 py-2 rounded-full font-black text-[10px] uppercase tracking-widest transition-all flex items-center gap-2 border ${quickColor === color ? "bg-slate-900 text-white border-slate-900" : "bg-white border-slate-100 text-slate-400"}`}
                  >
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color.toLowerCase().replace(/\s/g, '') }} />
                    {color}
                  </button>
                ))}
              </div>
            </div>

            <button 
              onClick={handleAddToCartSubmit}
              disabled={addingToCart}
              className="w-full bg-blue-600 text-white py-5 rounded-3xl font-black uppercase tracking-widest flex items-center justify-center gap-3 hover:bg-slate-900 transition-all duration-300 disabled:opacity-50"
            >
              {addingToCart ? <Loader2 className="animate-spin" size={20} /> : <><Check size={20} /> Add to Cart</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shop;