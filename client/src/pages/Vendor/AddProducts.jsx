import React, { useState } from "react";
import { Package, Upload, X, ArrowLeft, Zap, Info, Percent } from "lucide-react"; // Added Percent
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

const AddProducts = () => {
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    productName: "",
    brand: "",
    productDescription: "",
    productPrice: "",
    discountPercent: 0, // Changed from discountPrice to discountPercent
    discountPrice: "",  // This will be calculated automatically
    category: "",
    gender: "",
    stock: 1,
    sizes: "",
    colors: "",
    material: "",
  });

  const categories = [
    "Running", "Basketball", "Casual/Sneakers", "Training & Gym", 
    "Football", "Formal", "Sandals/Slides", "Outdoor/Boots"
  ];

  const genders = ["Men", "Women", "Unisex", "Kids"];

  const handleChange = (e) => {
    const { name, value } = e.target;
    let updatedData = { ...formData, [name]: value };

    // --- AUTO CALCULATION LOGIC ---
    if (name === "productPrice" || name === "discountPercent") {
      const price = name === "productPrice" ? parseFloat(value) : parseFloat(formData.productPrice);
      const percent = name === "discountPercent" ? parseFloat(value) : parseFloat(formData.discountPercent);

      if (!isNaN(price) && !isNaN(percent)) {
        const discountAmount = (price * percent) / 100;
        updatedData.discountPrice = (price - discountAmount).toFixed(2);
      } else if (!isNaN(price)) {
        updatedData.discountPrice = price.toFixed(2);
      }
    }

    setFormData(updatedData);
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length + images.length > 5) {
      return toast.error("You can only upload up to 5 images");
    }
    setImages([...images, ...files]);
    const filePreviews = files.map((file) => URL.createObjectURL(file));
    setPreviews([...previews, ...filePreviews]);
  };

  const removeImage = (index) => {
    setImages(images.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach((key) => {
        data.append(key, formData[key]);
      });

      images.forEach((image) => {
        data.append("productImages", image);
      });

      const response = await axios.post("http://localhost:3000/api/product/new", data, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });

      if (response.data.success) {
        toast.success("Shoe Published Successfully!");
        navigate("/vendor/dashboard");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Check your inputs and try again");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F0F7FF] p-6 md:p-10">
      <div className="max-w-5xl mx-auto mb-8 flex items-center justify-between">
        <Link to="/vendor/dashboard" className="flex items-center gap-2 text-[#0C2135] font-bold hover:text-sky-600 transition-all">
          <ArrowLeft size={20} /> Back to Dashboard
        </Link>
      </div>

      <div className="max-w-5xl mx-auto bg-white rounded-[2.5rem] shadow-xl border border-blue-50 overflow-hidden">
        <div className="bg-[#0C2135] p-10 text-white">
          <h2 className="text-3xl font-black flex items-center gap-4">
            <Package size={32} className="text-sky-400" /> List New Shoe
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          {/* Section 1 & 2 remain the same... */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 ml-1">Shoe Name</label>
              <input required name="productName" value={formData.productName} onChange={handleChange} placeholder="e.g. Air Jordan 1 Retro" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-sky-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 ml-1">Brand</label>
              <input required name="brand" value={formData.brand} onChange={handleChange} placeholder="e.g. Nike" className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-sky-500 outline-none" />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 ml-1">Category</label>
              <select required name="category" value={formData.category} onChange={handleChange} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-sky-500 outline-none">
                <option value="">Select Type</option>
                {categories.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 ml-1">Gender</label>
              <select required name="gender" value={formData.gender} onChange={handleChange} className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-sky-500 outline-none">
                <option value="">Select Gender</option>
                {genders.map(g => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>
          </div>

          {/* Section 3: Specs */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-sky-50 rounded-[2rem]">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-sky-600 ml-1 flex items-center gap-1">Available Sizes <Info size={12}/></label>
              <input required name="sizes" value={formData.sizes} onChange={handleChange} placeholder="e.g. 7, 8, 9, 10" className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-sky-500 outline-none" />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-sky-600 ml-1">Colors</label>
              <input required name="colors" value={formData.colors} onChange={handleChange} placeholder="e.g. Red, Black, White" className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-sky-500 outline-none" />
            </div>
          </div>

          {/* Section 4: Pricing (Updated Layout) */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 ml-1">Base Price ($)</label>
              <input required type="number" name="productPrice" value={formData.productPrice} onChange={handleChange} className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-sky-500 outline-none shadow-sm" />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-indigo-500 ml-1">Discount (%)</label>
              <div className="relative">
                <input type="number" name="discountPercent" value={formData.discountPercent} onChange={handleChange} className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm pr-12" />
                <Percent size={16} className="absolute right-5 top-1/2 -translate-y-1/2 text-indigo-300" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-emerald-500 ml-1">Final Price ($)</label>
              <div className="w-full px-6 py-4 rounded-2xl bg-emerald-50 text-emerald-700 font-black flex items-center gap-2 border border-emerald-100 min-h-[56px]">
                <Zap size={16} className="fill-emerald-500" /> {formData.discountPrice || "0.00"}
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase text-slate-400 ml-1">Stock</label>
              <input required type="number" name="stock" value={formData.stock} onChange={handleChange} className="w-full px-6 py-4 rounded-2xl bg-white border-none focus:ring-2 focus:ring-sky-500 outline-none shadow-sm" />
            </div>
          </div>

          {/* Description and Images remain same... */}
          <div className="space-y-2">
            <label className="text-xs font-black uppercase text-slate-400 ml-1">Description</label>
            <textarea required name="productDescription" value={formData.productDescription} onChange={handleChange} rows="4" placeholder="Tell us about the grip, comfort, and style..." className="w-full px-6 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-sky-500 outline-none"></textarea>
          </div>

          <div className="space-y-4">
            <label className="text-xs font-black uppercase text-slate-400 ml-1">Shoe Gallery (Max 5)</label>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {previews.map((url, index) => (
                <div key={index} className="relative aspect-square rounded-2xl overflow-hidden shadow-lg border-2 border-white">
                  <img src={url} alt="preview" className="w-full h-full object-cover" />
                  <button type="button" onClick={() => removeImage(index)} className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:scale-110 transition-transform"><X size={14} /></button>
                </div>
              ))}
              {images.length < 5 && (
                <label className="aspect-square flex flex-col items-center justify-center border-2 border-dashed border-sky-200 rounded-2xl cursor-pointer hover:bg-sky-50 transition-all text-sky-400">
                  <Upload size={24} />
                  <span className="text-[10px] font-bold mt-2">UPLOAD</span>
                  <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                </label>
              )}
            </div>
          </div>

          <button disabled={loading} type="submit" className={`w-full py-5 rounded-2xl font-black text-white uppercase tracking-widest shadow-xl transition-all ${loading ? "bg-slate-300" : "bg-sky-500 hover:bg-sky-600 shadow-sky-200"}`}>
            {loading ? "Listing Shoe..." : "Launch Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProducts;