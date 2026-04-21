import React, { useState, useEffect } from 'react';
import { 
  Plus, Search, Edit3, Trash2, 
  ExternalLink, Package, ArrowLeft, Loader2 
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const VendorProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // 1. Fetch products from Backend
  const fetchInventory = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get(
        "http://localhost:3000/api/product/vendor-inventory", 
        { withCredentials: true }
      );
      
      // Log this to your browser console (F12) to verify the data structure
      console.log("Fetched Products:", data.products);
      
      setProducts(data.products || []);
    } catch (error) {
      console.error("Fetch Error:", error);
      toast.error("Failed to load inventory");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // 2. Delete Product Logic
  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await axios.delete(
          `http://localhost:3000/api/product/product/${id}`, 
          { withCredentials: true }
        );
        toast.success("Product removed");
        fetchInventory(); 
      } catch (error) {
        toast.error(error.response?.data?.message || "Delete failed");
      }
    }
  };

  // 3. Filter products based on search
  const filteredProducts = products.filter(product => 
    product.productName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-[#F0F7FF] py-12 px-6 sm:px-10 font-sans">
      <div className="max-w-6xl mx-auto">
        
        {/* Navigation & Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <button 
            onClick={() => navigate('/vendor/dashboard')} 
            className="group flex items-center gap-2 text-blue-400 hover:text-blue-600 transition-all"
          >
            <div className="p-2 rounded-full border border-blue-100 bg-white group-hover:bg-blue-50 transition-all">
              <ArrowLeft size={18} />
            </div>
            <span className="text-[10px] font-black uppercase tracking-[0.2em]">Dashboard</span>
          </button>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-300" size={14} />
              <input 
                type="text" 
                placeholder="Search inventory..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2.5 bg-white border border-blue-100 rounded-2xl text-xs focus:outline-none focus:ring-2 focus:ring-blue-400 w-64 transition-all shadow-sm"
              />
            </div>
            <button 
              onClick={() => navigate('/vendor/add-product')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-blue-100"
            >
              <Plus size={16} /> Add Product
            </button>
          </div>
        </div>

        {/* Header */}
        <div className="mb-12">
          <h2 className="text-blue-500 font-black uppercase tracking-[0.3em] text-[10px] mb-3">Inventory Management</h2>
          <h1 className="text-5xl font-black italic tracking-tighter text-slate-900 uppercase leading-none">Your Products.</h1>
        </div>

        {/* Product Table */}
        <div className="bg-white rounded-[2.5rem] border border-blue-50 shadow-xl shadow-blue-900/5 overflow-hidden">
          {loading ? (
            <div className="py-20 flex flex-col items-center justify-center text-blue-400">
              <Loader2 className="animate-spin mb-4" size={40} />
              <p className="text-[10px] font-black uppercase tracking-widest">Syncing Inventory...</p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="py-20 text-center">
              <Package size={48} className="mx-auto text-blue-100 mb-4" />
              <p className="text-slate-400 font-bold uppercase text-xs tracking-widest">
                {searchTerm ? "No matches found" : "No products in your shop"}
              </p>
            </div>
          ) : (
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/50 border-b border-blue-50">
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Product</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Category</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Stock</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Price</th>
                  <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blue-50">
                {filteredProducts.map((product) => (
                  <tr key={product._id} className="hover:bg-blue-50/30 transition-all group">
                    <td className="px-8 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-14 bg-slate-100 rounded-xl overflow-hidden border border-blue-50">
                          {/* Full Color Image */}
                          <img 
                            src={product.productImages?.[0]?.url || "https://via.placeholder.com/150"} 
                            alt={product.productName} 
                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                          />
                        </div>
                        <div>
                          <p className="text-sm font-black text-slate-900 uppercase tracking-tighter">{product.productName || "Unnamed"}</p>
                          <p className="text-[9px] font-bold text-slate-400 uppercase">ID: {product._id?.slice(-6)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-8 py-6">
                      <span className="text-[10px] font-black text-slate-500 uppercase px-3 py-1 bg-slate-100 rounded-lg">
                        {product.category || "N/A"}
                      </span>
                    </td>
                    <td className="px-8 py-6">
                      <p className={`text-sm font-black italic ${product.stock <= 5 ? 'text-red-500' : 'text-slate-900'}`}>
                        {product.stock ?? 0} <span className="text-[9px] not-italic text-slate-400 ml-1">UNITS</span>
                      </p>
                    </td>
                    <td className="px-8 py-6 font-black text-slate-900 italic">
                      {/* UPDATED: uses productPrice from your model */}
                      रू {product.productPrice ? Number(product.productPrice).toLocaleString() : "0"}
                    </td>
                    <td className="px-8 py-6">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => navigate(`/vendor/edit-product/${product._id}`)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        >
                          <Edit3 size={16} />
                        </button>
                        <button 
                          onClick={() => handleDelete(product._id)}
                          className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* Footer Stats */}
        {!loading && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
            <div className="p-6 bg-white border border-blue-100 rounded-[2rem] flex items-center gap-4">
              <div className="p-3 bg-blue-100 text-blue-600 rounded-2xl">
                <Package size={20} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Live Inventory</p>
                <p className="text-xl font-black text-slate-900 italic mt-1">{products.length} Items</p>
              </div>
            </div>
            <div className="p-6 bg-slate-900 rounded-[2rem] flex items-center gap-4 text-white">
              <div className="p-3 bg-white/10 text-white rounded-2xl">
                <ExternalLink size={20} />
              </div>
              <div>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Storefront</p>
                <p 
                  onClick={() => navigate('/shop')} 
                  className="text-xl font-black italic mt-1 text-blue-400 cursor-pointer hover:text-blue-300 transition-colors"
                >
                  View Public Shop
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default VendorProducts;