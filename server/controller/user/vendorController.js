const User = require("../../model/userModel");

exports.getVendorProfile = async (req, res) => {
  try {
    // DIAGNOSTIC LOG: Check your terminal to see if this ID exists!
    console.log("Fetching profile for User ID:", req.user?._id || req.user?.id);

    // Use a flexible ID check (handles both _id and id)
    const userId = req.user?._id || req.user?.id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized: No user ID found in session."
      });
    }

    const vendor = await User.findOne({ _id: userId, role: "vendor" });

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor profile not found in our records."
      });
    }

    // Map fields to the response
    const profileData = {
      userName: vendor.userName,
      email: vendor.userEmail,
      phone: vendor.userPhoneNumber,
      shopName: vendor.storeName || "Unnamed Store",
      address: vendor.businessAddress || "No address provided",
      shopLogo: {
        public_id: vendor.storeImage?.public_id || null,
        url: vendor.storeImage?.url || "" 
      },
      isVerified: vendor.isEmailVerified,
      joinedAt: vendor.createdAt,
      role: vendor.role
    };

    res.status(200).json(profileData);

  } catch (error) {
    console.error("Vendor Profile Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error while fetching profile details."
    });
  }
};

exports.getPendingVendors = async (req, res) => {
  try {
    // Find users where role is vendor AND isVerifiedVendor is false
    const vendors = await User.find({ 
      role: "vendor", 
      isVerifiedVendor: false 
    }).select("-userPassword"); // Security: never send passwords to the frontend

    res.status(200).json({
      success: true,
      count: vendors.length,
      vendors
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyVendor = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Find the user by ID
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 2. Security Check: Ensure we aren't accidentally verifying a 'customer'
    if (user.role !== "vendor") {
      return res.status(400).json({ 
        success: false, 
        message: "This user is not registered as a vendor" 
      });
    }

    // 3. Update verification status
    user.isVerifiedVendor = true;
    
    // Optional: You could also clear a 'pending' status here if you add one
    await user.save();

    res.status(200).json({
      success: true,
      message: `${user.storeName} has been approved successfully!`,
      user
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Server Error", 
      error: error.message 
    });
  }
};

// @desc    Reject/Delete a vendor application
// @route   DELETE /api/admin/reject-vendor/:id
exports.rejectVendor = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: "Vendor not found" });
        
        res.status(200).json({ success: true, message: "Application rejected and removed." });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};