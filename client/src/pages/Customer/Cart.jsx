import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { 
  Trash2, 
  Minus, 
  Plus, 
  ShoppingBag, 
  ArrowRight, 
  ChevronLeft 
} from "lucide-react";

const Cart = ({ onCartChange }) => {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Fetch Cart Data
  const fetchCart = async () => {
    try {
      const res = await axios.get("http://localhost:3000/api/cart/getCart", {
        withCredentials: true,
      });
      if (res.data.success) {
        setCart(res.data.cart);
      }
    } catch (err) {
      console.error("Error fetching cart:", err);
      setCart(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Update Quantity + Trigger Navbar Refresh
  const handleUpdateQuantity = async (itemId, newQuantity) => {
    if (newQuantity < 1) return;
    try {
      const res = await axios.put(
        "http://localhost:3000/api/cart/updateQuantity",
        { itemId, quantity: newQuantity },
        { withCredentials: true }
      );
      if (res.data.success) {
        fetchCart();
        
        // Refresh Navbar Count via prop from App.jsx
        if (onCartChange) onCartChange(); 
        
        toast.success("Quantity updated");
      }
    } catch (err) {
      toast.error("Failed to update quantity");
    }
  };

  // Remove Item + Trigger Navbar Refresh
  const handleRemoveItem = async (itemId) => {
    try {
      const res = await axios.delete(
        `http://localhost:3000/api/cart/removeCartItem/${itemId}`,
        { withCredentials: true }
      );
      if (res.data.success) {
        fetchCart();
        
        // Refresh Navbar Count
        if (onCartChange) onCartChange();

        toast.success("Item removed from cart");
      }
    } catch (err) {
      console.error("Remove error:", err);
      toast.error("Failed to remove item");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-black italic text-slate-400">
        LOADING YOUR STASH...
      </div>
    );
  }

  if (!cart || !cart.items || cart.items.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center px-6">
        <div className="w-24 h-24 bg-slate-100 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag size={40} className="text-slate-300" />
        </div>
        <h2 className="text-3xl font-black italic text-slate-900 mb-2">YOUR CART IS EMPTY.</h2>
        <p className="text-slate-500 mb-8 font-medium">Looks like you haven't picked up any kicks yet.</p>
        <Link to="/shop" className="bg-slate-950 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest hover:bg-blue-600 transition-all active:scale-95 flex items-center gap-3">
          Start Shopping <ArrowRight size={18} />
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pt-28 pb-20 px-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <Link to="/shop" className="flex items-center gap-2 text-slate-400 hover:text-blue-600 font-bold text-xs uppercase tracking-widest mb-4 transition-colors">
              <ChevronLeft size={14} /> Back to Shop
            </Link>
            <h1 className="text-5xl font-black italic tracking-tighter text-slate-950">
              YOUR CART<span className="text-blue-600">.</span>
            </h1>
          </div>
          <span className="text-slate-400 font-black italic">{cart.items.length} ITEMS</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Cart Items List */}
          <div className="lg:col-span-2 space-y-8">
            {cart.items.map((item) => (
              <div key={item._id} className="flex gap-6 pb-8 border-b border-slate-100 group">
                <div className="w-32 h-32 md:w-44 md:h-44 bg-slate-50 rounded-[30px] overflow-hidden flex-shrink-0 relative">
                  <img 
                    src={item.product?.productImages?.[0]?.url || "https://via.placeholder.com/300"} 
                    alt={item.product?.productName} 
                    className="w-full h-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                </div>

                <div className="flex flex-col justify-between flex-grow py-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-xl font-black italic text-slate-950 leading-tight uppercase">
                        {item.product?.productName || "Loading Product..."}
                      </h3>
                      <p className="text-blue-600 font-black text-[10px] uppercase tracking-widest mt-1">
                        {item.product?.brand} • {item.product?.category}
                      </p>
                      <div className="flex gap-4 mt-4">
                        <span className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black uppercase text-slate-600">
                          Size: {item.selectedSize}
                        </span>
                        <span className="bg-slate-100 px-3 py-1 rounded-full text-[10px] font-black uppercase text-slate-600">
                          Color: {item.selectedColor}
                        </span>
                      </div>
                    </div>
                    <p className="text-xl font-black italic text-slate-950">
                      Rs. {item.price * item.quantity}
                    </p>
                  </div>

                  <div className="flex justify-between items-center mt-6">
                    <div className="flex items-center border-2 border-slate-100 rounded-full p-1">
                      <button 
                        onClick={() => handleUpdateQuantity(item._id, item.quantity - 1)}
                        className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-slate-950"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="w-10 text-center font-black italic text-slate-950">
                        {item.quantity}
                      </span>
                      <button 
                        onClick={() => handleUpdateQuantity(item._id, item.quantity + 1)}
                        className="p-2 hover:bg-slate-50 rounded-full transition-colors text-slate-400 hover:text-slate-950"
                      >
                        <Plus size={16} />
                      </button>
                    </div>

                    <button 
                      onClick={() => handleRemoveItem(item._id)}
                      className="text-slate-300 hover:text-red-500 transition-colors flex items-center gap-2 font-bold text-[10px] uppercase tracking-widest"
                    >
                      <Trash2 size={16} /> Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-slate-950 rounded-[40px] p-10 text-white sticky top-32 shadow-2xl shadow-blue-900/20">
              <h2 className="text-2xl font-black italic mb-8 border-b border-white/10 pb-6 uppercase tracking-tight">
                Order Summary
              </h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-slate-400 font-bold text-xs uppercase tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-white">Rs. {cart.totalPrice}</span>
                </div>
                <div className="flex justify-between text-slate-400 font-bold text-xs uppercase tracking-widest">
                  <span>Shipping</span>
                  <span className="text-green-400">FREE</span>
                </div>
                <div className="flex justify-between text-slate-400 font-bold text-xs uppercase tracking-widest">
                  <span>Tax (Estimated)</span>
                  <span className="text-white">Rs. 0.00</span>
                </div>
              </div>

              <div className="border-t border-white/10 pt-6 mb-10">
                <div className="flex justify-between items-end">
                  <span className="font-black italic text-sm uppercase text-slate-400">Total</span>
                  <span className="text-4xl font-black italic tracking-tighter">
                    Rs. {cart.totalPrice}
                  </span>
                </div>
              </div>

              {/* NAVIGATE TO CHECKOUT */}
              <button 
                onClick={() => navigate("/checkout")}
                className="w-full bg-blue-600 hover:bg-white hover:text-blue-600 text-white py-5 rounded-full font-black uppercase tracking-widest transition-all duration-300 flex items-center justify-center gap-3 active:scale-95 group"
              >
                Checkout Now <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
              </button>
              
              <p className="text-center text-[9px] text-white/30 uppercase tracking-[0.2em] mt-8 font-bold">
                Secure SSL Encryption Enabled
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;