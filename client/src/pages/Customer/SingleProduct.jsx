import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { 
  ShoppingCart, Star, ShieldCheck, 
  Truck, ArrowLeft, Loader2, Sparkles, Plus, Minus, Store, Palette
} from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";
import ReviewSection from "./ReviewSection";

const SingleProduct = ({ onCartChange }) => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [selectedColor, setSelectedColor] = useState(null);
  const [isAdding, setIsAdding] = useState(false);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(`http://localhost:3000/api/product/product/${id}`, {
        withCredentials: true 
      });
      setProduct(data.product);
      
      // Default selections to prevent validation errors if user doesn't click
      if (data.product.sizes?.length > 0) {
        setSelectedSize(data.product.sizes[0]);
      }
      if (data.product.colors?.length > 0) {
        setSelectedColor(data.product.colors[0]);
      }
    } catch (error) {
      console.error("Error fetching product:", error);
      toast.error("Could not find this product");
    } finally {
      setLoading(false);
    }
  };

  // --- ADD TO CART LOGIC (Fixed to match backend schema) ---
  const handleAddToCart = async () => {
    if (!selectedSize || !selectedColor) {
      return toast.error("Please select a size and color");
    }

    try {
      setIsAdding(true);
      const response = await axios.post(
        "http://localhost:3000/api/cart/addCart",
        {
          productId: product._id,
          quantity: quantity,
          selectedSize: selectedSize, // Matches backend validation key
          selectedColor: selectedColor, // Matches backend validation key
        },
        { withCredentials: true }
      );

      if (response.status === 200 || response.status === 201) {
        toast.success(`${product.productName} added to cart!`);
        // Refresh the Navbar count in App.jsx
        if (onCartChange) onCartChange(); 
      }
    } catch (error) {
      console.error("Add to cart error:", error);
      const message = error.response?.data?.message || "Failed to add to cart";
      toast.error(message);
    } finally {
      setIsAdding(false);
    }
  };

  useEffect(() => {
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white">
      <Loader2 className="animate-spin text-blue-600 mb-4" size={48} />
      <p className="font-black uppercase italic tracking-tighter text-slate-400">Loading Kicks...</p>
    </div>
  );

  if (!product) return <div className="p-20 text-center font-black text-slate-900 uppercase">Product Not Found.</div>;

  return (
    <div className="min-h-screen bg-white pt-32 pb-20 px-4 md:px-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Back Navigation */}
        <button 
          onClick={() => window.history.back()}
          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-blue-600 transition-colors mb-12"
        >
          <ArrowLeft size={14} /> Back to Collection
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          
          {/* Left: Product Image Gallery */}
          <div className="relative bg-[#f8fbff] rounded-[60px] p-10 flex items-center justify-center group overflow-hidden">
              <div className="absolute inset-0 bg-blue-100/20 blur-[120px] rounded-full scale-75 group-hover:scale-110 transition-transform duration-1000" />
              <img 
                src={product.productImages?.[0]?.url || "/placeholder.png"} 
                alt={product.productName} 
                className="w-full h-auto object-contain relative z-10 drop-shadow-[0_50px_50px_rgba(0,0,0,0.12)] group-hover:scale-105 transition-transform duration-700"
              />
          </div>

          {/* Right: Product Details Section */}
          <div className="flex flex-col">
            <div className="mb-8">
              <div className="flex items-center flex-wrap gap-4 mb-4">
                 <div className="flex items-center gap-2">
                    <Sparkles className="text-blue-500" size={18} />
                    <span className="text-blue-600 font-black uppercase text-[10px] tracking-widest">
                      {product.brand} • {product.category}
                    </span>
                 </div>
              </div>

              <h1 className="text-6xl font-black uppercase italic tracking-tighter text-slate-900 leading-[0.8] mb-6">
                {product.productName}
              </h1>
              
              <div className="flex items-center gap-4">
                <div className="flex gap-0.5">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className={`${i < Math.floor(product.ratings) ? "fill-yellow-400 text-yellow-400" : "text-slate-200"}`} />
                  ))}
                </div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  ({product.numOfReviews} Verified Reviews)
                </span>
              </div>
            </div>

            {/* Vendor Card */}
            <div className="mb-10 p-5 bg-slate-50 rounded-[32px] border border-slate-100 flex items-center justify-between group hover:border-blue-200 transition-all duration-500">
                <div className="flex items-center gap-5">
                    <div className="w-16 h-16 rounded-[20px] bg-white border-2 border-white shadow-md overflow-hidden flex items-center justify-center shrink-0">
                        {product.vendor?.storeImage?.url ? (
                            <img src={product.vendor.storeImage.url} alt={product.vendor?.storeName} className="w-full h-full object-cover" />
                        ) : (
                            <Store className="text-slate-200" size={28} />
                        )}
                    </div>
                    <div>
                        <p className="text-[8px] font-black text-blue-600 uppercase tracking-[0.2em] mb-1">Official Merchant</p>
                        <h4 className="text-lg font-black uppercase italic text-slate-900 leading-none">
                          {product.vendor?.storeName || "Premium Seller"}
                        </h4>
                        <div className="flex items-center gap-1.5 mt-2">
                           <ShieldCheck size={12} className={product.vendor?.isVerifiedVendor ? "text-green-500" : "text-slate-300"} />
                           <span className="text-[9px] font-bold text-slate-400 uppercase">
                              {product.vendor?.isVerifiedVendor ? "Identity Verified" : "Verification Pending"}
                           </span>
                        </div>
                    </div>
                </div>
            </div>

            <p className="text-slate-500 font-medium leading-relaxed mb-10 max-w-md">
              {product.productDescription}
            </p>

            {/* Pricing */}
            <div className="mb-10">
              {product.discountPrice > 0 ? (
                <div className="flex items-end gap-4">
                   <span className="text-5xl font-black text-blue-600 italic tracking-tighter leading-none">Rs. {product.discountPrice}</span>
                   <span className="text-xl font-bold text-slate-300 line-through italic mb-1">Rs. {product.productPrice}</span>
                </div>
              ) : (
                <span className="text-5xl font-black text-slate-900 italic tracking-tighter leading-none">Rs. {product.productPrice}</span>
              )}
            </div>

            {/* COLOR SELECTOR */}
            <div className="mb-8">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                <Palette size={12} /> Choose Colorway
              </h4>
              <div className="flex flex-wrap gap-3">
                {product.colors?.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => setSelectedColor(color)}
                    className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all border ${
                      selectedColor === color 
                      ? "bg-blue-600 text-white border-blue-600 shadow-lg scale-105" 
                      : "bg-white text-slate-400 border-slate-100 hover:border-blue-200"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* SIZE SELECTOR */}
            <div className="mb-10">
              <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Select Size (UK)</h4>
              <div className="flex flex-wrap gap-3">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 rounded-2xl font-black transition-all border ${
                      selectedSize === size 
                      ? "bg-slate-900 text-white border-slate-900 shadow-xl scale-105" 
                      : "bg-white text-slate-900 border-slate-100 hover:border-blue-200"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-6">
              <div className="flex items-center bg-slate-50 rounded-full px-4 py-2 w-fit border border-slate-100">
                <button type="button" onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:text-blue-600"><Minus size={18} /></button>
                <span className="w-12 text-center font-black text-lg italic">{quantity}</span>
                <button type="button" onClick={() => setQuantity(quantity + 1)} className="p-2 hover:text-blue-600"><Plus size={18} /></button>
              </div>

              <button 
                type="button"
                onClick={handleAddToCart}
                disabled={isAdding}
                className="flex-grow flex items-center justify-center gap-4 bg-slate-900 text-white rounded-full py-6 px-10 font-black uppercase italic tracking-widest hover:bg-blue-600 transition-all shadow-2xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isAdding ? "Adding..." : "Add to Cart"} <ShoppingCart size={20} />
              </button>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 grid grid-cols-2 gap-6 pt-12 border-t border-slate-50">
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center text-green-600"><ShieldCheck size={20} /></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Authentic Kicks</span>
               </div>
               <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-blue-600"><Truck size={20} /></div>
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Fast Delivery</span>
               </div>
            </div>
          </div>
        </div>

        <div className="mt-32">
           <ReviewSection product={product} refreshProduct={fetchProduct} />
        </div>
      </div>
    </div>
  );
};

export default SingleProduct;