import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const OrderHistory = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchMyOrders = async () => {
            try {
                const { data } = await axios.get('http://localhost:3000/api/order/myOrders', {
                    withCredentials: true
                });
                if (data.success) {
                    setOrders(data.orders);
                }
            } catch (error) {
                console.error("Error fetching orders", error);
                toast.error("Failed to load your order history.");
            } finally {
                setLoading(false);
            }
        };

        fetchMyOrders();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[60vh]">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-black"></div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-12">
            <h1 className="text-4xl font-black uppercase italic tracking-tighter mb-10 border-l-8 border-black pl-4">
                My Purchase History
            </h1>

            {orders.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200">
                    <p className="text-slate-400 font-bold uppercase tracking-widest">No orders found yet.</p>
                    <button 
                        onClick={() => navigate('/')}
                        className="mt-6 px-8 py-3 bg-black text-white font-black uppercase italic tracking-widest hover:bg-slate-800 transition-all"
                    >
                        Start Shopping
                    </button>
                </div>
            ) : (
                <div className="grid gap-6">
                    {orders.map((order) => (
                        <div 
                            key={order._id} 
                            className="bg-white border-2 border-slate-100 hover:border-black transition-all group overflow-hidden"
                        >
                            <div className="flex flex-col md:flex-row justify-between items-start md:items-center p-6 bg-slate-50 border-b-2 border-slate-100 group-hover:bg-black group-hover:text-white transition-colors">
                                <div>
                                    <p className="text-xs font-black uppercase tracking-widest opacity-60">Order ID</p>
                                    <p className="font-mono text-sm">{order._id}</p>
                                </div>
                                <div className="mt-4 md:mt-0 flex flex-wrap gap-4 text-right">
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest opacity-60">Date</p>
                                        <p className="font-bold">{new Date(order.createdAt).toLocaleDateString()}</p>
                                    </div>
                                    <div>
                                        <p className="text-xs font-black uppercase tracking-widest opacity-60">Total</p>
                                        <p className="font-black italic">Rs. {order.totalPrice}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="p-6">
                                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                    <div className="flex items-center space-x-4">
                                        <div className="flex -space-x-3">
                                            {order.orderItems.slice(0, 3).map((item, idx) => (
                                                <img 
                                                    key={idx}
                                                    src={item.image} 
                                                    alt={item.productName}
                                                    className="w-12 h-12 object-cover border-2 border-white rounded-none shadow-sm"
                                                />
                                            ))}
                                            {order.orderItems.length > 3 && (
                                                <div className="w-12 h-12 bg-slate-200 flex items-center justify-center text-xs font-bold border-2 border-white">
                                                    +{order.orderItems.length - 3}
                                                </div>
                                            )}
                                        </div>
                                        <div>
                                            <p className="font-bold text-sm uppercase leading-tight">
                                                {order.orderItems[0].productName} {order.orderItems.length > 1 ? `& ${order.orderItems.length - 1} more` : ''}
                                            </p>
                                            <p className="text-xs text-slate-400 font-bold uppercase tracking-tighter">
                                                Status: <span className={order.orderStatus === 'Delivered' ? 'text-green-600' : 'text-orange-500'}>{order.orderStatus}</span>
                                            </p>
                                        </div>
                                    </div>

                                    <div className="flex items-center space-x-3 w-full sm:w-auto">
                                        <div className={`px-4 py-1 text-[10px] font-black uppercase tracking-widest border-2 ${
                                            order.paymentInfo.status === 'Paid' 
                                            ? 'border-green-500 text-green-600 bg-green-50' 
                                            : 'border-red-500 text-red-600 bg-red-50'
                                        }`}>
                                            {order.paymentInfo.status}
                                        </div>
                                        <button 
                                            onClick={() => navigate(`/order/${order._id}`)}
                                            className="px-6 py-2 border-2 border-black text-xs font-black uppercase italic tracking-widest hover:bg-black hover:text-white transition-all"
                                        >
                                            Details
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default OrderHistory;