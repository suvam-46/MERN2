import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { ArrowLeft, Package, MapPin, CreditCard, User } from 'lucide-react';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                // This URL should match your backend route
                const { data } = await axios.get(`http://localhost:3000/api/order/order/${id}`, {
                    withCredentials: true
                });

                if (data.success) {
                    setOrder(data.order);
                } else {
                    toast.error("Order not found");
                }
            } catch (error) {
                console.error("Fetch Error:", error);
                toast.error(error.response?.data?.message || "Could not retrieve order details.");
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchOrderDetails();
    }, [id]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-white">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-black"></div>
        </div>
    );

    if (!order) return (
        <div className="min-h-screen flex flex-col items-center justify-center p-20 text-center">
            <h1 className="font-black text-2xl uppercase italic">Order Not Found</h1>
            <button onClick={() => navigate('/orders/me')} className="mt-4 underline font-bold uppercase text-xs text-indigo-600">Return to History</button>
        </div>
    );

    // Matching your controller's "shippingAddress" object
    const ship = order.shippingAddress || {};

    return (
        <div className="min-h-screen bg-white pt-28 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                <button 
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-slate-400 hover:text-black transition-all font-black text-[10px] uppercase tracking-[0.2em] mb-8 group"
                >
                    <ArrowLeft size={14} className="group-hover:-translate-x-1 transition-transform" />
                    Back to History
                </button>

                <div className="flex flex-col md:flex-row justify-between items-start mb-12 gap-6">
                    <div>
                        <h1 className="text-5xl font-black uppercase italic tracking-tighter leading-none">
                            Order <span className="text-indigo-600">Details</span>
                        </h1>
                        <p className="mt-4 font-mono text-sm text-slate-400 uppercase tracking-tighter">
                            Ref: #{order._id}
                        </p>
                    </div>
                    <div className="bg-black text-white px-8 py-4 rotate-2 shadow-2xl">
                        <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Status</p>
                        <p className="text-xl font-black italic uppercase">{order.orderStatus}</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {/* Items List */}
                    <div className="md:col-span-2 space-y-4">
                        <div className="border-b-4 border-black pb-2 mb-6">
                            <h3 className="text-sm font-black uppercase tracking-widest flex items-center gap-2">
                                <Package size={16} /> Items Ordered
                            </h3>
                        </div>
                        {order.orderItems?.map((item, index) => (
                            <div key={index} className="flex items-center gap-6 p-4 border-2 border-slate-50 hover:border-black transition-all group">
                                <img 
                                    src={item.image} 
                                    alt={item.productName} 
                                    className="w-24 h-24 object-cover grayscale group-hover:grayscale-0 transition-all border border-slate-100" 
                                />
                                <div className="flex-1">
                                    <h4 className="font-black uppercase italic tracking-tighter text-lg leading-tight">{item.productName}</h4>
                                    <p className="text-xs font-bold text-slate-400 mt-1 uppercase">
                                        Size: {item.selectedSize} | Qty: {item.quantity}
                                    </p>
                                    <p className="font-black mt-2 text-indigo-600">Rs. {item.price?.toLocaleString()}</p>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Sidebar: Shipping & Payment */}
                    <div className="space-y-6">
                        {/* Shipping Section - UPDATED TO MATCH YOUR CONTROLLER */}
                        <div className="bg-slate-50 p-6 border-l-4 border-indigo-600 shadow-sm">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                                <MapPin size={14} /> Shipping Destination
                            </h4>
                            <div className="text-sm font-bold uppercase leading-relaxed text-slate-800">
                                <p className="text-indigo-600 flex items-center gap-1 mb-2">
                                    <User size={12} /> {ship.fullName || "N/A"}
                                </p>
                                <p className="mb-1">{ship.address || "No address"}</p>
                                <p className="mb-3">{ship.city} {ship.postalCode}</p>
                                
                                <div className="pt-2 border-t border-slate-200">
                                    <p className="text-[10px] text-slate-400 font-black">Contact Number</p>
                                    <p className="text-black">{ship.phoneNo || "N/A"}</p>
                                </div>
                            </div>
                        </div>

                        {/* Payment Summary */}
                        <div className="bg-slate-950 text-white p-6 shadow-xl">
                            <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-indigo-400 mb-4 flex items-center gap-2">
                                <CreditCard size={14} /> Financial Summary
                            </h4>
                            <div className="space-y-3 border-b border-white/10 pb-4 mb-4">
                                <div className="flex justify-between text-xs font-bold uppercase">
                                    <span className="opacity-60">Subtotal</span>
                                    <span>Rs. {order.itemsPrice?.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-xs font-bold uppercase">
                                    <span className="opacity-60">Shipping</span>
                                    <span>Rs. {order.shippingPrice || 0}</span>
                                </div>
                            </div>
                            <div className="flex justify-between items-end">
                                <span className="text-[10px] font-black uppercase tracking-widest text-indigo-400">Grand Total</span>
                                <span className="text-2xl font-black italic leading-none">Rs. {order.totalPrice?.toLocaleString()}</span>
                            </div>
                        </div>

                        {/* Payment Method & Status */}
                        <div className="flex flex-col gap-2">
                             <div className="p-3 bg-slate-100 text-center font-black text-[9px] uppercase tracking-widest border border-slate-200">
                                Method: {order.paymentInfo?.method || "N/A"}
                            </div>
                            <div className={`p-4 text-center font-black text-[10px] uppercase tracking-widest border-2 ${
                                order.paymentInfo?.status === 'Paid' 
                                    ? 'border-green-500 text-green-600 bg-green-50' 
                                    : 'border-red-500 text-red-600 bg-red-50'
                            }`}>
                                Payment {order.paymentInfo?.status || 'Pending'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetails;