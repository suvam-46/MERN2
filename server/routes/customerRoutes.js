const express = require("express");
const router = express.Router();

// 1. Import your controller
const { 
    getCustomerProfile, 
    updateAvatar, 
    getAllCustomers, 
    toggleWishlist,
    checkWishlistStatus,
    getWishlist
} = require("../controller/user/customerController");

// 2. Import your middleware
const { isAuthenticated, authorizeRoles } = require("../middlewear/authMiddlewear");

// 3. Import your existing Cloudinary upload config
const { upload } = require("../middlewear/cloudinary"); // Adjust path if needed

// --- ROUTES ---

// Get current customer profile
router.get(
    "/profile", 
    isAuthenticated, 
    authorizeRoles("customer"), 
    getCustomerProfile
);

// Update avatar using Cloudinary
router.put(
    "/update-avatar", 
    isAuthenticated, 
    authorizeRoles("customer"), 
    upload.single("avatar"), // Cloudinary handles the storage automatically
    updateAvatar
);

// Admin: Get all customers
router.get(
    "/admin/all-customers", 
    isAuthenticated, 
    authorizeRoles("admin"), 
    getAllCustomers
);
router.route("/wishlist/toggle/:id").post(isAuthenticated, toggleWishlist);

// @desc    Check if product is in wishlist (for UI state)
// @route   GET /api/user/wishlist/check/:id
router.route("/wishlist/check/:id").get(isAuthenticated, checkWishlistStatus);

// @desc    Get all products in user wishlist
// @route   GET /api/user/wishlist
router.route("/wishlist").get(isAuthenticated, getWishlist);



module.exports = router;