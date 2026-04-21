import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Heart, 
  Trash2, 
  ShoppingCart, 
  ArrowRight, 
  Ghost,
  Loader2,
  Sparkles,
  User,
  Star,
  Tag
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

const Wishlist = ({ onCartChange, setWishlistCount }) => {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(null); // Track which ID is being added
  const navigate = useNavigate();

  // Helper to render stars
  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <Star
        key={index}
        size={12}
        className={`${index < Math.floor(rating) ? "fill-yellow-400 text-yellow-400" : "text-slate-200 fill-slate-100"}`}
      />
    ));
  };

  const fetchWishlist = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get("http://localhost:3000/api/customer/wishlist", {
        withCredentials: true,
      });
      const items = data.wishlist || [];
      setWishlist(items);
      if (setWishlistCount) setWishlistCount(items.length);
    } catch (error) {
      if (error.response?.status === 401) {
        toast.error("Please login to see your favorites");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWishlist();
  }, [setWishlistCount, navigate]);

  const removeFromWishlist = async (productId) => {
    try {
      const { data } = await axios.post(
        `http://localhost:3000/api/customer/wishlist/toggle/${productId}`,
        {},
        { withCredentials: true }
      );
      
      const updatedList = wishlist.filter((item) => item._id !== productId);
      setWishlist(updatedList);
      if (setWishlistCount) setWishlistCount(updatedList.length);
      toast.success(data.message || "Removed from favorites");
    } catch (error) {
      toast.error("Failed to update wishlist");
    }
  };

  // --- ADD TO CART LOGIC ---
  const handleAddToCart = async (product) => {
    // Validation: Ensure product has sizes and colors to avoid backend error
    const selectedSize = product.sizes?.[0];
    const selectedColor = product.colors?.[0];

    if (!selectedSize || !selectedColor) {
      toast.error("Product options missing. Please view product details.");
      return navigate(`/product/${product._id}`);
    }

    try {
      setIsAdding(product._id);
      const response = await axios.post(
        "http://localhost:3000/api/cart/addCart",
        {
          productId: product._id,
          quantity: 1,
          selectedSize: selectedSize,
          selectedColor: selectedColor,
        },
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success(`${product.productName} added to cart!`);
        if (onCartChange) onCartChange(); // Updates Navbar count
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      toast.error(error.response?.data?.message || "Failed to add to cart");
    } finally {
      setIsAdding(null);
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f8fbff]">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
      <p className="font-black italic uppercase tracking-tighter text-slate-400">Syncing Collection...</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#f8fbff] pt-32 pb-20 px-4 md:px-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="flex flex-col mb-12">
          <div className="flex items-center gap-2 mb-2">
            <Sparkles className="text-blue-500" size={20} />
            <span className="text-blue-600 font-black uppercase text-[10px] tracking-widest">Saved Grails</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
            Wishlist<span className="text-blue-600">.</span>
          </h1>
        </div>

        {wishlist.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
            {wishlist.map((product) => {
              const originalPrice = product.productPrice;
              const discountedPrice = product.discountPrice;
              const hasDiscount = discountedPrice > 0 && discountedPrice < originalPrice;
              const dynamicPercent = hasDiscount ? Math.round(((originalPrice - discountedPrice) / originalPrice) * 100) : 0;

              return (
                <div key={product._id} className="group relative bg-white rounded-[60px] p-10 shadow-[0_30px_60px_rgba(0,0,0,0.02)] hover:shadow-[0_40px_90px_rgba(37,99,235,0.12)] transition-all duration-700 border border-transparent hover:border-blue-50 overflow-hidden">
                  
                  {/* TOP RIGHT ACTIONS */}
                  <div className="absolute top-8 right-8 z-40 flex flex-col items-end gap-3">
                    <button 
                      onClick={() => removeFromWishlist(product._id)}
                      className="w-12 h-12 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center border border-slate-100 shadow-sm hover:scale-110 transition-all active:scale-90"
                    >
                      <Heart size={20} className="fill-red-500 text-red-500" />
                    </button>

                    {hasDiscount && (
                      <span className="flex items-center gap-1 px-4 py-2 bg-red-500 text-white text-[10px] font-black uppercase tracking-tighter rounded-full shadow-lg">
                        <Tag size={12} /> -{dynamicPercent}%
                      </span>
                    )}
                  </div>

                  {/* TOP LEFT LABELS */}
                  <div className="absolute top-8 left-8 flex flex-col gap-2 z-30">
                    <span className="w-fit px-4 py-1.5 bg-white/80 backdrop-blur-md text-slate-500 text-[9px] font-black uppercase tracking-[0.2em] rounded-full shadow-sm border border-slate-100">{product.brand}</span>
                    <span className="w-fit px-3 py-1 bg-blue-600/90 backdrop-blur-md text-white text-[8px] font-black uppercase tracking-widest rounded-full flex items-center gap-1 shadow-md"><User size={10} /> {product.gender}</span>
                  </div>

                  {/* Product Image */}
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

                  {/* Price & Add to Cart */}
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
                      onClick={() => handleAddToCart(product)} 
                      disabled={isAdding === product._id}
                      className="p-5 bg-slate-900 text-white rounded-[25px] hover:bg-blue-600 hover:scale-110 transition-all shadow-xl active:scale-95 group-hover:-translate-y-1 disabled:opacity-50"
                    >
                      {isAdding === product._id ? <Loader2 className="animate-spin" size={20} /> : <ShoppingCart size={20} />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="py-24 flex flex-col items-center justify-center text-center">
            <div className="w-40 h-40 bg-white rounded-[50px] shadow-[0_20px_40px_rgba(0,0,0,0.03)] flex items-center justify-center mb-8 border border-slate-100 relative">
               <div className="absolute inset-0 bg-blue-50 rounded-full blur-3xl opacity-50" />
               <Ghost size={60} className="text-slate-200 relative z-10 animate-pulse" />
            </div>
            <h2 className="text-4xl font-black uppercase italic tracking-tighter text-slate-900 mb-4">
              Your rack is empty<span className="text-blue-600">.</span>
            </h2>
            <p className="text-slate-400 font-bold italic mb-10 max-w-sm leading-relaxed">
              Find the perfect pair to add to your collection.
            </p>
            <Link 
              to="/shop" 
              className="group flex items-center gap-3 px-12 py-5 bg-blue-600 text-white rounded-full font-black uppercase text-xs tracking-widest hover:bg-slate-900 shadow-2xl transition-all duration-500 active:scale-95"
            >
              Back to Shop <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default Wishlist;