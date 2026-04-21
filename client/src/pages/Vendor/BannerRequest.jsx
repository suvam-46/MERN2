import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { Upload, Send, ArrowLeft, X, Info, Tag } from "lucide-react";

const BannerRequest = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discountTag: "", 
  });
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const clearImage = () => {
    setImage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) return toast.error("Please upload an image");
    if (!formData.discountTag) return toast.error("Discount tag is required");

    const data = new FormData();
    data.append("title", formData.title);
    data.append("description", formData.description);
    data.append("discountTag", formData.discountTag); 
    data.append("image", image);

    try {
      setLoading(true);
      const res = await axios.post("http://localhost:3000/api/banners/request", data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (res.data.success) {
        toast.success("Request sent to Admin!");
        setFormData({ title: "", description: "", discountTag: "" });
        setImage(null);
        setTimeout(() => navigate("/vendor/dashboard"), 2000);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Request failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 md:p-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
        <div className="space-y-2">
          <button
            onClick={() => navigate(-1)}
            className="group flex items-center gap-2 text-slate-400 hover:text-sky-500 font-bold transition-all mb-4"
          >
            <div className="p-2 rounded-full group-hover:bg-sky-50 transition-colors">
              <ArrowLeft size={20} />
            </div>
            Back to Dashboard
          </button>
          <h2 className="text-5xl font-black text-[#0C2135] tracking-tight">
            Banner <span className="text-sky-500">Request</span>
          </h2>
          <p className="text-slate-500 font-medium text-lg">
            Create promotional content for the homepage slider.
          </p>
        </div>

        <div className="hidden lg:flex items-center gap-3 bg-amber-50 border border-amber-100 p-5 rounded-[2rem]">
          <Info className="text-amber-500" size={24} />
          <p className="text-xs font-bold text-amber-700 leading-tight">
            Promotional banners require <br /> Admin approval to go live.
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        {/* Left Side: Form Fields */}
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-white p-8 md:p-10 rounded-[3rem] shadow-xl shadow-blue-900/5 border border-slate-50 space-y-8">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Campaign Title */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Campaign Title</label>
                <input
                  type="text"
                  className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-sky-400 focus:bg-white rounded-2xl transition-all outline-none font-bold text-slate-700"
                  placeholder="e.g. Summer Clearance"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              {/* Discount Tag */}
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-sky-500 ml-2 flex items-center gap-1">
                  <Tag size={12} /> Discount Tag
                </label>
                <input
                  type="text"
                  className="w-full p-4 bg-sky-50/50 border-2 border-sky-100 focus:border-sky-400 focus:bg-white rounded-2xl transition-all outline-none font-bold text-sky-700 placeholder:text-sky-300"
                  placeholder="e.g. 50% OFF"
                  value={formData.discountTag}
                  onChange={(e) => setFormData({ ...formData, discountTag: e.target.value })}
                  required
                />
              </div>
            </div>

            {/* Campaign Description */}
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-2">Description</label>
              <textarea
                className="w-full p-4 bg-slate-50 border-2 border-transparent focus:border-sky-400 focus:bg-white rounded-2xl transition-all outline-none font-bold text-slate-700 h-32 resize-none"
                placeholder="What is this promotion about?"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Asset Upload */}
        <div className="lg:col-span-5 flex flex-col gap-6">
          <div 
            className={`relative group h-80 rounded-[3rem] border-4 border-dashed transition-all overflow-hidden flex flex-col items-center justify-center
              ${image ? 'border-sky-400 bg-slate-900 shadow-2xl shadow-sky-500/10' : 'border-slate-200 hover:border-sky-300 bg-white'}`}
          >
            {image ? (
              <div className="flex flex-col items-center gap-4 text-center p-6">
                <div className="bg-sky-500 text-white px-6 py-2 rounded-full font-black text-xl shadow-2xl uppercase tracking-tighter">
                  {formData.discountTag || "Discount Tag"}
                </div>
                <div className="mt-2 space-y-1">
                  <p className="text-white font-bold truncate max-w-[200px]">{image.name}</p>
                  <p className="text-sky-400 text-[10px] font-black uppercase tracking-widest">File Ready</p>
                </div>
                <button 
                  type="button"
                  onClick={clearImage}
                  className="mt-4 bg-white text-red-500 p-4 rounded-full shadow-xl hover:scale-110 transition-transform"
                >
                  <X size={24} />
                </button>
              </div>
            ) : (
              <label className="w-full h-full cursor-pointer flex flex-col items-center justify-center p-6 text-center">
                <div className="bg-sky-50 p-6 rounded-3xl mb-4 text-sky-500 group-hover:bg-sky-500 group-hover:text-white transition-all">
                  <Upload size={32} />
                </div>
                <h4 className="text-lg font-black text-[#0C2135]">Banner Visual</h4>
                <p className="text-sm text-slate-400 font-medium mt-1">Recommended size: 1920x600px</p>
                <input type="file" className="hidden" onChange={handleFileChange} accept="image/*" />
              </label>
            )}
          </div>

          <button
            disabled={loading}
            type="submit"
            className={`group w-full p-6 rounded-[2rem] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-3 transition-all shadow-2xl
              ${loading 
                ? 'bg-slate-200 text-slate-400 cursor-not-allowed' 
                : 'bg-[#0C2135] text-white hover:bg-sky-600 active:scale-[0.98]'}`}
          >
            {loading ? "Processing..." : (
              <>
                Submit Request
                <Send size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default BannerRequest;