import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const MyOrders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                setLoading(true);
                // 1. Changed port from 5000 to 3000
                // 2. Ensure this matches your router path: /api/order/myorders
                const { data } = await axios.get('http://localhost:3000/api/order/myorders', { 
                    withCredentials: true 
                });
                
                if (data.success) {
                    setOrders(data.orders);
                }
            } catch (error) {
                console.error("Error fetching orders:", error);
                toast.error("Failed to load orders");
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) return <div className="text-center py-20 font-bold">Loading your orders...</div>;

    return (
        <div className="max-w-6xl mx-auto px-4 py-10">
            <h2 className="text-4xl font-black italic uppercase tracking-tighter text-slate-900 mb-8">
                Your Order History
            </h2>

            {orders.length === 0 ? (
                <div className="bg-slate-50 p-10 rounded-3xl text-center">
                    <p className="text-slate-500 mb-4">You haven't placed any orders yet.</p>
                    <Link to="/" className="text-blue-600 font-bold underline">Start Shopping</Link>
                </div>
            ) : (
                <div className="overflow-x-auto bg-white rounded-3xl border border-slate-100 shadow-sm">
                    <table className="w-full text-left border-collapse">
                        <thead>
                            <tr className="bg-slate-900 text-white">
                                <th className="p-4 uppercase text-xs tracking-widest">Order ID</th>
                                <th className="p-4 uppercase text-xs tracking-widest">Date</th>
                                <th className="p-4 uppercase text-xs tracking-widest">Total Amount</th>
                                <th className="p-4 uppercase text-xs tracking-widest">Status</th>
                                <th className="p-4 uppercase text-xs tracking-widest text-center">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {orders.map(order => (
                                <tr key={order._id} className="hover:bg-slate-50 transition-colors">
                                    <td className="p-4 font-mono text-xs text-slate-400">#{order._id}</td>
                                    <td className="p-4 font-medium text-slate-700">
                                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                                            year: 'numeric', month: 'long', day: 'numeric'
                                        })}
                                    </td>
                                    <td className="p-4 font-black text-slate-900">
                                        रू {order.totalPrice.toLocaleString()}
                                    </td>
                                    <td className="p-4">
                                        <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest ${
                                            order.orderStatus === 'Delivered' ? 'bg-green-100 text-green-600' :
                                            order.orderStatus === 'Cancelled' ? 'bg-red-100 text-red-600' :
                                            'bg-blue-100 text-blue-600'
                                        }`}>
                                            {order.orderStatus}
                                        </span>
                                    </td>
                                    <td className="p-4 text-center">
                                        <Link 
                                            to={`/order/${order._id}`}
                                            className="bg-slate-100 hover:bg-slate-900 hover:text-white px-4 py-2 rounded-lg font-bold text-xs transition-all inline-block"
                                        >
                                            View Details
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyOrders;