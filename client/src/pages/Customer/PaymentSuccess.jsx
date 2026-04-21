import React, { useEffect, useState, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-hot-toast';

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const pidx = searchParams.get("pidx"); 
    const [loading, setLoading] = useState(true);
    const [status, setStatus] = useState("verifying");
    
    // Use a ref to prevent double-calling verification in React Strict Mode
    const hasVerified = useRef(false);

    useEffect(() => {
        const verify = async () => {
            if (hasVerified.current) return;
            
            if (pidx) {
                hasVerified.current = true;
                try {
                    const { data } = await axios.post(
                        'http://localhost:3000/api/order/verify-payment', 
                        { pidx }, 
                        { withCredentials: true }
                    );
                    
                    if (data.success) {
                        setStatus("success");
                        toast.success("Payment Verified!");
                        // Redirect to Home or Orders after a short delay
                        setTimeout(() => navigate('/orders/me'), 4000);
                    }
                } catch (error) {
                    console.error("Verification error", error);
                    setStatus("error");
                    toast.error("Payment verification failed.");
                    // Return to checkout so they can try again or choose COD
                    setTimeout(() => navigate('/checkout'), 3000);
                } finally {
                    setLoading(false);
                }
            } else {
                // This covers COD orders redirected here from Checkout
                setStatus("success");
                setLoading(false);
                setTimeout(() => navigate('/orders/me'), 4000);
            }
        };

        verify();
    }, [pidx, navigate]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
            {loading ? (
                <div className="text-center">
                    <div className="relative w-24 h-24 mx-auto">
                        <div className="absolute inset-0 border-4 border-slate-100 rounded-full"></div>
                        <div className="absolute inset-0 border-4 border-black border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <h2 className="text-2xl font-black uppercase italic mt-8 tracking-widest text-slate-900">
                        Verifying Transaction
                    </h2>
                    <p className="text-slate-400 font-bold text-xs uppercase mt-2 tracking-widest animate-pulse">
                        Communicating with Khalti...
                    </p>
                </div>
            ) : status === "success" ? (
                <div className="text-center animate-in fade-in zoom-in duration-700 max-w-md">
                    <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-green-200">
                        <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="4" d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    
                    <h2 className="text-5xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
                        Order <br /> Confirmed
                    </h2>
                    
                    <div className="mt-6 space-y-2">
                        <p className="text-slate-500 font-bold">
                            Your payment was processed successfully.
                        </p>
                        <p className="text-xs text-slate-400 uppercase tracking-widest font-black">
                            Redirecting to your orders in 4 seconds...
                        </p>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4 mt-10">
                        <button 
                            onClick={() => navigate('/orders/me')}
                            className="flex-1 px-8 py-4 bg-black text-white font-black uppercase italic tracking-widest hover:bg-slate-800 transition-all shadow-xl active:scale-95"
                        >
                            View Orders
                        </button>
                        <button 
                            onClick={() => navigate('/')}
                            className="flex-1 px-8 py-4 bg-white border-2 border-slate-200 text-slate-900 font-black uppercase italic tracking-widest hover:border-black transition-all active:scale-95"
                        >
                            Back to Shop
                        </button>
                    </div>
                </div>
            ) : (
                <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6 text-4xl">
                        ⚠️
                    </div>
                    <h2 className="text-2xl font-black uppercase italic text-slate-900">Verification Failed</h2>
                    <p className="text-slate-500 mt-2 font-medium">We couldn't verify your payment with Khalti.</p>
                    <button 
                        onClick={() => navigate('/checkout')}
                        className="mt-8 px-8 py-3 bg-red-600 text-white font-bold uppercase italic tracking-widest hover:bg-red-700 transition-all shadow-lg"
                    >
                        Try Again
                    </button>
                </div>
            )}
        </div>
    );
};

export default PaymentSuccess;