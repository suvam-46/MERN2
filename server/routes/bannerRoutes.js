const express = require("express");
const router = express.Router();

// Controllers
const { 
  requestBanner, 
  getVendorBanners, 
  getPendingBanners, 
  reviewBanner, 
  getActiveBanners 
} = require("../controller/banner/bannerController");

// Middleware
const { isAuthenticated, authorizeRoles } = require("../middlewear/authMiddlewear");
const { upload } = require("../middlewear/cloudinary");

/**
 * @route   GET /api/banners/active
 * @desc    Get all approved and active banners for the homepage slider
 * @access  Public
 */
router.get("/active", getActiveBanners);

/**
 * @route   POST /api/banners/request
 * @desc    Vendor submits a banner for approval
 * @access  Private (Vendor Only)
 */
router.post("/request", isAuthenticated, authorizeRoles("vendor"), upload.single("image"), requestBanner);

/**
 * @route   GET /api/banners/vendor/my-banners
 * @desc    Vendor views their own banner request history/status
 * @access  Private (Vendor Only)
 */
router.get("/vendor/my-banners", isAuthenticated, authorizeRoles("vendor"), getVendorBanners);

/**
 * @route   GET /api/banners/admin/pending
 * @desc    Admin views all banners waiting for approval
 * @access  Private (Admin Only)
 */
router.get("/admin/pending", isAuthenticated, authorizeRoles("admin"), getPendingBanners);

/**
 * @route   PUT /api/banners/admin/review/:id
 * @desc    Admin approves or rejects a banner request
 * @access  Private (Admin Only)
 */
router.put("/admin/review/:id", isAuthenticated, authorizeRoles("admin"), reviewBanner);

module.exports = router;