const User = require("../../model/userModel");

const getVendorProfile = async (req, res) => {
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

module.exports = { getVendorProfile };