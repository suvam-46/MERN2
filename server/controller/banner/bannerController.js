const Banner = require("../../model/bannerModel");
const cloudinary = require("cloudinary").v2;

// --- VENDOR ACTIONS ---

// 1. Request a New Banner
exports.requestBanner = async (req, res) => {
  try {
    const { title, description, discountTag } = req.body;

    // 1. Check if Multer actually uploaded the file
    if (!req.file) {
      return res.status(400).json({ success: false, message: "Banner image is required" });
    }

    // 2. Create the banner object matching your Mongoose Schema
    const newBanner = new Banner({
      title,
      description,
      discountTag,
      // Your schema expects image.url and image.public_id
      image: {
        url: req.file.path,             // The Cloudinary URL
        public_id: req.file.filename    // The Cloudinary public ID provided by Multer
      },
      // Your schema expects 'vendor' (not vendorId)
      vendor: req.user._id, 
      status: "pending"
    });

    // 3. Save to database
    await newBanner.save();

    res.status(201).json({
      success: true,
      message: "Banner request submitted successfully",
      banner: newBanner
    });
  } catch (error) {
    console.error("Mongoose Validation Error:", error.message);
    res.status(500).json({ 
      success: false, 
      message: error.message || "Internal Server Error" 
    });
  }
};

// 2. View My Banner Requests (Vendor Dashboard)
exports.getVendorBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ vendor: req.user._id }).sort({ createdAt: -1 });
    res.status(200).json({ success: true, banners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- ADMIN ACTIONS ---

// 3. Get All Pending Requests (Admin Review Queue)
exports.getPendingBanners = async (req, res) => {
  try {
    const banners = await Banner.find({ status: "pending" })
      .populate("vendor", "name storeName") 
      .sort({ createdAt: 1 }); // FIFO

    res.status(200).json({ success: true, banners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 4. Review Banner (Approve or Reject)
exports.reviewBanner = async (req, res) => {
  try {
    const { status, adminFeedback, priority } = req.body;
    
    if (!["approved", "rejected"].includes(status)) {
      return res.status(400).json({ success: false, message: "Invalid status update" });
    }

    const banner = await Banner.findById(req.params.id);
    if (!banner) return res.status(404).json({ message: "Banner not found" });

    banner.status = status;
    banner.adminFeedback = adminFeedback || "";
    
    if (status === "approved") {
      banner.isActive = true;
      banner.priority = priority || 0;
    } else {
      banner.isActive = false;
    }

    await banner.save();

    res.status(200).json({
      success: true,
      message: `Banner has been ${status}`,
      banner,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// --- PUBLIC ACTIONS ---

// 5. Get Active Banners (Homepage Slider)
exports.getActiveBanners = async (req, res) => {
  try {
    // Only fetch banners that have the discountTag and are approved/active
    const banners = await Banner.find({ 
      status: "approved", 
      isActive: true 
    }).sort({ priority: -1 });

    res.status(200).json({ success: true, banners });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};