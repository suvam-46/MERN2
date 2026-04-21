const User = require("../../model/userModel");

// Get Customer Profile
exports.getCustomerProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-userPassword -otp");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

// Update Customer Avatar
exports.updateAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Please upload an image" });
    }

    const userId = req.user.id;
    // If using Cloudinary, use req.file.path. If local, use the string below.
    const fileUrl = req.file.path || `/uploads/profiles/${req.file.filename}`;

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          avatar: {
            public_id: req.file.filename || `pic_${Date.now()}`,
            url: fileUrl,
          },
        },
      },
      { new: true }
    ).select("-userPassword");

    res.status(200).json({
      message: "Avatar updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(500).json({ message: "Update failed", error: error.message });
  }
};

// --- ADD THIS MISSING FUNCTION ---
exports.getAllCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: "customer" }).select("-userPassword");
    res.status(200).json(customers);
  } catch (error) {
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};

exports.toggleWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const productId = req.params.id;

        const isWishlisted = user.wishlist.includes(productId);

        if (isWishlisted) {
            // Remove from wishlist
            user.wishlist = user.wishlist.filter((id) => id.toString() !== productId);
            await user.save();
            return res.status(200).json({ success: true, message: "Removed from wishlist", isWishlisted: false });
        } else {
            // Add to wishlist
            user.wishlist.push(productId);
            await user.save();
            return res.status(200).json({ success: true, message: "Added to wishlist", isWishlisted: true });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Also add a route to check if product is in wishlist on load
exports.checkWishlistStatus = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        const isWishlisted = user.wishlist.includes(req.params.id);
        res.status(200).json({ success: true, isWishlisted });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};
exports.getWishlist = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).populate("wishlist");
        res.status(200).json({ success: true, wishlist: user.wishlist });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};