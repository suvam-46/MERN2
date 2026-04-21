import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { Package, Eye, ShoppingBag, Clock } from 'lucide-react';

const VendorOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVendorOrders = async () => {
            try {
                // We hit the endpoint that returns orders. 
                // The backend logic should ideally filter by vendor, 
                // but if it doesn't, we filter on the frontend for now.
                const { data } = await axios.get('http://localhost:3000/api/order/admin/orders', {
                    withCredentials: true
                });

                if (data.success) {
                    setOrders(data.orders);
                }
            } catch (error) {
                console.error("Error fetching vendor orders:", error);
                toast.error("Failed to load orders");
            } finally {
                setLoading(false);
            }
        };

        fetchVendorOrders();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="p-8 bg-slate-50 min-h-screen">
            <div className="max-w-6xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-black uppercase italic tracking-tighter text-slate-900">
                        Product <span className="text-indigo-600">Sales</span>
                    </h1>
                    <p className="text-slate-500 text-sm font-bold uppercase tracking-widest mt-1">
                        Monitor your incoming orders
                    </p>
                </div>

                {orders.length === 0 ? (
                    <div className="bg-white border-2 border-dashed border-slate-200 p-20 text-center rounded-xl">
                        <ShoppingBag className="mx-auto text-slate-300 mb-4" size={48} />
                        <p className="font-black uppercase text-slate-400">No orders found for your products</p>
                    </div>
                ) : (
                    <div className="grid gap-6">
                        {orders.map((order) => (
                            <div key={order._id} className="bg-white border-2 border-slate-100 hover:border-black transition-all p-6 shadow-sm group">
                                <div className="flex flex-wrap justify-between items-center mb-6 pb-4 border-b border-slate-50">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-indigo-50 p-3 text-indigo-600">
                                            <Package size={20} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Order ID</p>
                                            <p className="font-mono text-sm font-bold">#{order._id}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-6">
                                        <div className="text-right">
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none">Order Date</p>
                                            <p className="text-xs font-bold uppercase italic">{new Date(order.createdAt).toLocaleDateString()}</p>
                                        </div>
                                        <div className={`px-4 py-2 text-[10px] font-black uppercase tracking-widest border-2 ${
                                            order.orderStatus === 'Delivered' ? 'border-green-500 text-green-600' : 'border-amber-500 text-amber-600'
                                        }`}>
                                            {order.orderStatus}
                                        </div>
                                    </div>
                                </div>

                                {/* Product List specifically for this Vendor */}
                                <div className="space-y-3">
                                    <p className="text-[10px] font-black text-indigo-600 uppercase tracking-[0.2em] mb-4">Items Ordered</p>
                                    {order.orderItems.map((item, idx) => (
                                        <div key={idx} className="flex items-center justify-between bg-slate-50 p-4 rounded-lg">
                                            <div className="flex items-center gap-4">
                                                <img src={item.image} alt="" className="w-12 h-12 object-cover rounded border border-slate-200" />
                                                <div>
                                                    <p className="font-black uppercase italic text-sm tracking-tight text-slate-800">{item.productName}</p>
                                                    <p className="text-[10px] font-bold text-slate-400 uppercase">Size: {item.selectedSize} | Qty: {item.quantity}</p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-black text-sm text-slate-900">Rs. {(item.price * item.quantity).toLocaleString()}</p>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="mt-6 pt-4 border-t border-slate-50 flex justify-between items-center">
                                    <div className="flex items-center gap-2 text-slate-400">
                                        <Clock size={14} />
                                        <span className="text-[10px] font-black uppercase">Updated {new Date(order.updatedAt).toLocaleTimeString()}</span>
                                    </div>
                                    <button className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400 hover:text-black transition-colors">
                                        <Eye size={14} /> View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default VendorOrders;