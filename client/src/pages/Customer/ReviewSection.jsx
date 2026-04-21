import React, { useState } from "react";
import { Star, Send, User, MessageSquare, Sparkles, TrendingUp } from "lucide-react";
import axios from "axios";
import { toast } from "react-hot-toast";

const ReviewSection = ({ product, refreshProduct }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [hover, setHover] = useState(0);
  const [submitting, setSubmitting] = useState(false);

  // Calculate percentages for the UI breakdown bars
  const getPercentage = (star) => {
    if (!product.reviews?.length) return 0;
    const count = product.reviews.filter((r) => Math.floor(r.rating) === star).length;
    return (count / product.reviews.length) * 100;
  };

  const submitReviewHandler = async (e) => {
    e.preventDefault();
    if (rating === 0) return toast.error("Please select a star rating");

    try {
      setSubmitting(true);
      const { data } = await axios.put(
        `http://localhost:3000/api/review/review`,
        { rating, comment, productId: product._id },
        { withCredentials: true }
      );
      toast.success(data.message);
      setComment("");
      setRating(0);
      refreshProduct();
    } catch (error) {
      toast.error(error.response?.data?.message || "Login to leave a review");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="border-t border-slate-100 pt-32 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
        
        {/* LEFT COLUMN: STATS & SUMMARY (Unchanged) */}
        <div className="lg:col-span-4 space-y-10">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-blue-600" size={20} />
              <span className="text-blue-600 font-black uppercase text-[10px] tracking-[0.3em]">Verified Feedback</span>
            </div>
            <h3 className="text-5xl font-black uppercase italic tracking-tighter text-slate-900 leading-none">
              The <span className="text-blue-600 underline decoration-4 underline-offset-8">Verdict.</span>
            </h3>
          </div>

          <div className="bg-[#f8fbff] rounded-[50px] p-10 border border-blue-50 relative overflow-hidden group">
            <div className="absolute top-[-20px] right-[-20px] text-blue-100/50 group-hover:scale-110 transition-transform duration-700">
               <TrendingUp size={120} />
            </div>
            <div className="relative z-10">
              <h1 className="text-7xl font-black italic tracking-tighter text-slate-900 mb-2">
                {product.ratings?.toFixed(1) || "0.0"}
              </h1>
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} size={20} className={`${i < Math.floor(product.ratings) ? "fill-yellow-400 text-yellow-400" : "text-slate-200"}`} />
                ))}
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">Based on {product.numOfReviews} Global Reviews</p>
            </div>
          </div>

          <div className="space-y-4 px-4">
            {[5, 4, 3, 2, 1].map((star) => (
              <div key={star} className="flex items-center gap-4">
                <span className="text-[10px] font-black text-slate-400 w-4">{star}</span>
                <div className="flex-grow h-1.5 bg-slate-50 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-600 rounded-full transition-all duration-1000" style={{ width: `${getPercentage(star)}%` }} />
                </div>
                <span className="text-[10px] font-bold text-slate-300 w-8">{Math.round(getPercentage(star))}%</span>
              </div>
            ))}
          </div>

          <form onSubmit={submitReviewHandler} className="bg-slate-900 rounded-[40px] p-8 shadow-2xl">
            <h4 className="text-white font-black uppercase italic tracking-widest text-sm mb-6 flex items-center gap-2">
              <MessageSquare size={16} className="text-blue-400" /> Drop a Review
            </h4>
            <div className="mb-6">
              <div className="flex gap-2 mb-4 bg-slate-800/50 p-3 rounded-2xl w-fit">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button key={star} type="button" onClick={() => setRating(star)} onMouseEnter={() => setHover(star)} onMouseLeave={() => setHover(0)} className="transition-transform active:scale-90" >
                    <Star size={20} className={`${star <= (hover || rating) ? "fill-yellow-400 text-yellow-400" : "text-slate-600"}`} />
                  </button>
                ))}
              </div>
              <textarea rows="3" value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Comfort, fit, and style..." className="w-full bg-slate-800 border-none rounded-2xl p-4 text-sm text-slate-200 placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" required />
            </div>
            <button type="submit" disabled={submitting} className="w-full bg-blue-600 text-white py-4 rounded-2xl font-black uppercase italic tracking-widest hover:bg-white hover:text-slate-900 transition-all disabled:opacity-50" >
              {submitting ? "Analyzing..." : "Post Review"}
            </button>
          </form>
        </div>

        {/* RIGHT COLUMN: REVIEWS FEED (Updated with Avatar Logic) */}
        <div className="lg:col-span-8">
          <div className="flex items-center justify-between mb-12">
             <h4 className="text-xs font-black uppercase tracking-[0.4em] text-slate-400">Community Feed</h4>
             <div className="h-[1px] flex-grow mx-8 bg-slate-100 hidden md:block" />
          </div>

          {product.reviews && product.reviews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {product.reviews.map((rev) => (
                <div key={rev._id} className="bg-white border border-slate-100 p-8 rounded-[40px] hover:border-blue-100 hover:shadow-2xl hover:shadow-blue-500/5 transition-all group relative overflow-hidden flex flex-col">
                  
                  <div className="flex items-center gap-4 mb-6">
                    {/* AVATAR LOGIC START */}
                    <div className="w-14 h-14 rounded-2xl overflow-hidden border-2 border-slate-50 group-hover:border-blue-100 transition-colors duration-500 transform group-hover:rotate-3 shadow-inner flex items-center justify-center bg-slate-50">
                      {rev.user && rev.user.avatar && rev.user.avatar.url ? (
                        <img 
                          src={rev.user.avatar.url} 
                          alt={rev.name} 
                          className="w-full h-full object-cover"
                          // Handles broken image links gracefully
                          onError={(e) => {
                            e.target.onerror = null; 
                            e.target.src = "/default_avatar.png"
                          }}
                        />
                      ) : (
                        // Fallback icon if no avatar data exists
                        <div className="text-slate-300 group-hover:text-blue-500 transition-colors">
                          <User size={24} />
                        </div>
                      )}
                    </div>
                    {/* AVATAR LOGIC END */}

                    <div>
                      <h4 className="font-black uppercase italic text-slate-900 tracking-tight text-sm">{rev.name}</h4>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={10} className={`${i < rev.rating ? "fill-yellow-400 text-yellow-400" : "text-slate-100"}`} />
                        ))}
                      </div>
                    </div>
                  </div>

                  <p className="text-slate-500 text-xs font-medium leading-relaxed italic border-l-2 border-slate-50 pl-4 flex-grow">
                    "{rev.comment}"
                  </p>

                  <span className="absolute bottom-6 right-8 text-[8px] font-black text-slate-200 uppercase tracking-widest">
                    {new Date(rev.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-32 bg-slate-50 rounded-[80px] border-4 border-dashed border-white">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-xl mb-6">
                 <MessageSquare className="text-blue-600" size={32} />
              </div>
              <h4 className="text-2xl font-black uppercase italic text-slate-900 tracking-tighter">Silence is loud.</h4>
              <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest mt-2">Break the ice and leave the first review.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReviewSection;