import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Instagram, Twitter, Youtube, Mail, MapPin, Phone, Send } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white pt-24 pb-12 px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          
          {/* COLUMN 1: BRAND & NEWSLETTER */}
          <div className="space-y-8">
            <div className="flex items-center gap-3">
              <img src="/images/Logo.png" alt="Logo" className="w-10 h-auto brightness-0 invert" />
              <span className="font-black text-2xl tracking-tighter uppercase italic">
                STEPSTYLE<span className="text-purple-500">.</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed">
              Redefining the way you move. Premium footwear engineered for performance and styled for the streets.
            </p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Join the inner circle..." 
                className="w-full bg-gray-800 border-none rounded-xl py-4 px-6 text-sm focus:ring-2 focus:ring-purple-500 transition-all outline-none"
              />
              <button className="absolute right-2 top-2 p-2 bg-purple-600 rounded-lg hover:bg-white hover:text-purple-600 transition-all">
                <Send size={18} />
              </button>
            </div>
          </div>

          {/* COLUMN 2: QUICK LINKS */}
          <div className="space-y-6">
            <h4 className="font-black uppercase text-xs tracking-[0.3em] text-purple-500">Collections</h4>
            <ul className="space-y-4 text-sm font-bold text-gray-400">
              <li><Link to="/shop/new-arrivals" className="hover:text-white transition">New Arrivals</Link></li>
              <li><Link to="/shop/featured" className="hover:text-white transition">Featured Drops</Link></li>
              <li><Link to="/shop/top-products" className="hover:text-white transition">Best Sellers</Link></li>
              <li><Link to="/shop" className="hover:text-white transition">Release Calendar</Link></li>
            </ul>
          </div>

          {/* COLUMN 3: SUPPORT */}
          <div className="space-y-6">
            <h4 className="font-black uppercase text-xs tracking-[0.3em] text-purple-500">Customer Care</h4>
            <ul className="space-y-4 text-sm font-bold text-gray-400">
              <li><Link to="/orders" className="hover:text-white transition">Order Tracking</Link></li>
              <li><Link to="/returns" className="hover:text-white transition">Returns & Exchanges</Link></li>
              <li><Link to="/size-guide" className="hover:text-white transition">Sizing Help</Link></li>
              <li><Link to="/contact" className="hover:text-white transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* COLUMN 4: CONTACT INFO */}
          <div className="space-y-6">
            <h4 className="font-black uppercase text-xs tracking-[0.3em] text-purple-500">Find Us</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-center gap-3">
                <MapPin size={18} className="text-purple-500" />
                <span>123 Sneaker St, NY 10001</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-purple-500" />
                <span>+1 (555) STEP-STYLE</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-purple-500" />
                <span>support@stepstyle.com</span>
              </li>
            </ul>
          </div>
        </div>

        {/* BOTTOM BAR */}
        <div className="pt-12 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-8">
          <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">
            © 2026 StepStyle Footwear. All rights reserved.
          </p>
          
          <div className="flex items-center gap-6">
            <a href="#" className="p-3 bg-gray-800 rounded-full hover:bg-purple-600 transition-all transform hover:-translate-y-1">
              <Instagram size={20} />
            </a>
            <a href="#" className="p-3 bg-gray-800 rounded-full hover:bg-purple-600 transition-all transform hover:-translate-y-1">
              <Facebook size={20} />
            </a>
            <a href="#" className="p-3 bg-gray-800 rounded-full hover:bg-purple-600 transition-all transform hover:-translate-y-1">
              <Twitter size={20} />
            </a>
            <a href="#" className="p-3 bg-gray-800 rounded-full hover:bg-purple-600 transition-all transform hover:-translate-y-1">
              <Youtube size={20} />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;