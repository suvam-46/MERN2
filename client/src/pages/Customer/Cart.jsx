import React from "react";
import { Link } from "react-router-dom";
import {
  ShoppingBag,
  ArrowRight,
  Trash2,
  Plus,
  Minus,
  CreditCard,
  ShoppingCart,
} from "lucide-react";

const Cart = ({ cartItems, setCartItems }) => {
  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.price * (item.quantity || 1),
    0,
  );
  const shipping = cartItems.length > 0 ? 20 : 0;
  const total = subtotal + shipping;

  const updateQuantity = (id, amount) => {
    setCartItems((prev) =>
      prev.map((item) =>
        item.id === id
          ? { ...item, quantity: Math.max(1, (item.quantity || 1) + amount) }
          : item,
      ),
    );
  };

  const removeItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  if (cartItems.length === 0) {
    return (
      <div className="relative min-h-screen flex items-center justify-center p-6 overflow-hidden">
        {/* Background Image with Dark Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 hover:scale-105"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1552346154-21d32810aba3?q=80&w=2070&auto=format&fit=crop')`,
          }}
        >
          <div className="absolute inset-0 bg-black/60 backdrop-blur-[2px]" />
        </div>

        <div className="relative z-10 text-center flex flex-col items-center animate-in fade-in zoom-in duration-700">
          <div className="w-40 h-40 bg-white/10 backdrop-blur-3xl rounded-[50px] border border-white/20 flex items-center justify-center mb-10 shadow-2xl shadow-black/50">
            <ShoppingCart size={60} className="text-white opacity-80" />
          </div>
          <h2 className="text-7xl md:text-9xl font-black uppercase italic tracking-tighter text-white leading-none mb-4 drop-shadow-2xl">
            BAG <br /> <span className="text-blue-500">EMPTY.</span>
          </h2>
          <p className="text-white/50 font-bold uppercase tracking-[0.5em] text-[10px] mb-10">
            Don't let your style wait.
          </p>
          <Link
            to="/shop"
            className="group relative px-12 py-5 bg-blue-600 text-white rounded-full font-black uppercase italic tracking-widest overflow-hidden transition-all duration-500 shadow-[0_20px_40px_rgba(37,99,235,0.4)]"
          >
            <span className="relative z-10 flex items-center gap-3">
              Start Shopping{" "}
              <ArrowRight
                size={20}
                className="group-hover:translate-x-2 transition-transform"
              />
            </span>
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            <span className="absolute inset-0 flex items-center justify-center text-blue-600 font-black opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-20">
              GO TO SHOP
            </span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen pt-32 pb-20 px-4 md:px-12 lg:px-24">
      {/* Background Image for Full Cart */}
      <div
        className="fixed inset-0 bg-cover bg-center bg-no-repeat z-[-1]"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=2071&auto=format&fit=crop')`,
        }}
      >
        <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <header className="mb-16">
          <h1 className="text-7xl md:text-9xl font-black uppercase italic tracking-tighter text-white leading-none">
            YOUR <span className="text-blue-500">GEAR.</span>
          </h1>
          <div className="h-1 w-32 bg-blue-600 mt-4 rounded-full" />
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* ITEM LIST */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item) => (
              <div
                key={item.id}
                className="bg-white/5 backdrop-blur-3xl p-6 rounded-[35px] border border-white/10 flex flex-col sm:flex-row items-center gap-8 group hover:bg-white/10 transition-all duration-500"
              >
                <div className="w-40 h-32 bg-white/90 rounded-2xl p-4 flex items-center justify-center group-hover:scale-105 transition-transform">
                  <img
                    src={item.img}
                    alt={item.name}
                    className="w-full h-full object-contain drop-shadow-2xl"
                  />
                </div>

                <div className="flex-1">
                  <h3 className="text-xl font-black uppercase italic text-white tracking-tight">
                    {item.name}
                  </h3>
                  <div className="mt-4 flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-red-500 transition-colors"
                    >
                      <Minus size={14} />
                    </button>
                    <span className="text-white font-black text-lg w-6 text-center">
                      {item.quantity || 1}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-8 h-8 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-blue-500 transition-colors"
                    >
                      <Plus size={14} />
                    </button>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-black text-white italic mb-4">
                    ${(item.price * (item.quantity || 1)).toFixed(2)}
                  </p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-white/30 hover:text-red-500 transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* SUMMARY SIDEBAR */}
          <div className="lg:col-span-4">
            <div className="bg-white p-10 rounded-[50px] shadow-2xl sticky top-32 border border-white/20">
              <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-8 text-slate-900">
                Summary
              </h2>

              <div className="space-y-4 mb-8">
                <div className="flex justify-between font-bold text-slate-400 uppercase text-[10px] tracking-widest">
                  <span>Subtotal</span>
                  <span className="text-slate-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between font-bold text-slate-400 uppercase text-[10px] tracking-widest">
                  <span>Shipping</span>
                  <span className="text-slate-900">${shipping.toFixed(2)}</span>
                </div>
                <div className="h-[1px] bg-slate-100 my-4" />
                <div className="flex justify-between items-center">
                  <span className="font-black uppercase italic text-blue-600">
                    Total
                  </span>
                  <span className="text-4xl font-black italic tracking-tighter text-slate-900">
                    ${total.toFixed(2)}
                  </span>
                </div>
              </div>

              <button className="w-full py-6 bg-blue-600 text-white rounded-[25px] font-black uppercase italic tracking-[0.2em] text-[11px] hover:bg-black transition-all duration-500 flex items-center justify-center gap-3 shadow-xl shadow-blue-200">
                Checkout <CreditCard size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
