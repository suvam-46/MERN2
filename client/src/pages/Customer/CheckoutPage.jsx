import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import LoadingScreen from "../LoadingScreen";

const CheckoutPage = ({ onCartChange }) => {
  const navigate = useNavigate();

  // State
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [address, setAddress] = useState({
    fullName: "",
    address: "",
    city: "",
    phoneNo: "",
    postalCode: "",
  });
  const [paymentMethod, setPaymentMethod] = useState("COD");

  // 1. Fetch Cart Data on Mount
  useEffect(() => {
    const fetchCheckoutData = async () => {
      try {
        setLoading(true);
        const res = await axios.get("http://localhost:3000/api/cart/getCart", {
          withCredentials: true,
        });

        if (res.data.success && res.data.cart?.items?.length > 0) {
          setCart(res.data.cart);
        } else {
          toast.error("Your cart is empty.");
          navigate("/cart");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        toast.error("Please login to continue.");
        navigate("/login");
      } finally {
        setLoading(false);
      }
    };
    fetchCheckoutData();
  }, [navigate]);

  const handleInputChange = (e) => {
    setAddress({ ...address, [e.target.name]: e.target.value });
  };

  // 2. Handle Order Placement
  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    // Basic Form Validation
    if (!address.fullName || !address.address || !address.phoneNo) {
      return toast.error("Please fill in all required shipping details.");
    }

    // Khalti-specific phone validation (10 digits)
    if (paymentMethod === "Khalti" && address.phoneNo.length !== 10) {
      return toast.error("Please provide a valid 10-digit phone number for Khalti.");
    }

    try {
      setIsSubmitting(true);
      
      const orderData = {
        shippingAddress: address,
        paymentMethod: paymentMethod, 
        itemsPrice: cart.totalPrice,
        shippingPrice: 0, 
        totalPrice: cart.totalPrice,
        orderItems: cart.items.map((item) => ({
          product: item.product._id,
          productName: item.product.productName,
          quantity: item.quantity,
          selectedSize: String(item.selectedSize),
          selectedColor: item.selectedColor,
          price: item.price,
          image: item.product.productImages[0]?.url || "",
        })),
      };

      const res = await axios.post(
        "http://localhost:3000/api/order/order/new",
        orderData,
        { withCredentials: true }
      );

      if (res.data.success) {
        if (paymentMethod === "Khalti" && res.data.payment_url) {
          // Redirect user to Khalti payment portal
          toast.loading("Redirecting to Khalti...");
          window.location.href = res.data.payment_url;
        } else {
          // Cash on Delivery path
          toast.success("Order Placed Successfully!");
          if (onCartChange) onCartChange(); 
          navigate("/orders/me"); // Redirect to My Orders after COD
        }
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Failed to process order.";
      toast.error(errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <LoadingScreen />;
  if (!cart) return null;

  return (
    <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10 bg-white">
      
      {/* Left Column: Form */}
      <div className="animate-in fade-in slide-in-from-left-4 duration-500">
        <h2 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 mb-8">
          Checkout
        </h2>
        
        <form onSubmit={handlePlaceOrder} className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-2">Shipping Information</h3>
            <input
              type="text"
              name="fullName"
              placeholder="Full Name"
              className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-black outline-none transition-all"
              onChange={handleInputChange}
              required
            />
            <input
              type="text"
              name="address"
              placeholder="Full Delivery Address"
              className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-black outline-none transition-all"
              onChange={handleInputChange}
              required
            />
            <div className="grid grid-cols-2 gap-4">
              <input
                type="text"
                name="city"
                placeholder="City"
                className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-black outline-none transition-all"
                onChange={handleInputChange}
                required
              />
              <input
                type="tel"
                name="phoneNo"
                placeholder="Phone Number (10 digits)"
                className="w-full p-4 bg-white border-2 border-slate-100 rounded-2xl focus:border-black outline-none transition-all"
                onChange={handleInputChange}
                required
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-sm font-black uppercase tracking-widest text-slate-400">Payment Gateway</h3>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setPaymentMethod("COD")}
                className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                  paymentMethod === "COD" 
                  ? "border-black bg-slate-900 text-white shadow-xl scale-[1.02]" 
                  : "border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200"
                }`}
              >
                <span className="font-black uppercase italic text-xs tracking-widest">Cash</span>
                <span className="text-[10px] font-bold opacity-60">Pay at your door</span>
              </button>
              
              <button
                type="button"
                onClick={() => setPaymentMethod("Khalti")}
                className={`p-6 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                  paymentMethod === "Khalti" 
                  ? "border-purple-600 bg-purple-600 text-white shadow-xl scale-[1.02]" 
                  : "border-slate-100 bg-slate-50 text-slate-400 hover:border-purple-200"
                }`}
              >
                <span className="font-black uppercase italic text-xs tracking-widest">Khalti</span>
                <span className="text-[10px] font-bold opacity-60">Digital Wallet</span>
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full p-6 rounded-2xl font-black uppercase italic tracking-[0.2em] transition-all shadow-2xl active:scale-95 ${
              isSubmitting 
              ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
              : "bg-black text-white hover:bg-slate-800"
            }`}
          >
            {isSubmitting ? "Processing..." : `Complete Order — रू ${cart.totalPrice.toLocaleString()}`}
          </button>
        </form>
      </div>

      {/* Right Column: Order Summary */}
      <div className="animate-in fade-in slide-in-from-right-4 duration-500">
        <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-100 h-fit sticky top-10">
          <h2 className="text-xl font-black italic uppercase mb-8 tracking-tight">Your Selection</h2>
          
          <div className="space-y-4 max-h-[450px] overflow-y-auto pr-2 custom-scrollbar">
            {cart.items.map((item, index) => (
              <div key={index} className="flex items-center gap-5 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
                <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-50 flex-shrink-0">
                  <img
                    src={item.product?.productImages[0]?.url}
                    alt=""
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-black text-slate-800 text-sm uppercase truncate">
                    {item.product?.productName}
                  </h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-widest">
                    Size {item.selectedSize} × {item.quantity}
                  </p>
                  <p className="font-black text-slate-900 mt-2">रू {item.price.toLocaleString()}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 pt-8 border-t-2 border-dashed border-slate-200 space-y-3">
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>Merchandise Subtotal</span>
              <span>रू {cart.totalPrice.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs font-bold text-slate-400 uppercase tracking-widest">
              <span>Standard Logistics</span>
              <span className="text-cyan-600">Free</span>
            </div>
            <div className="flex justify-between text-3xl font-black text-slate-900 pt-4 italic">
              <span>TOTAL</span>
              <span>रू {cart.totalPrice.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CheckoutPage;