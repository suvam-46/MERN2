const express = require("express");
const router = express.Router();

// 1. Import your controller (Ensure the path to your controller folder is correct)
const { getVendorProfile, verifyVendor, rejectVendor, getPendingVendors } = require("../controller/user/vendorController");

// 2. Import your middleware 
// IMPORTANT: Check if your folder is named "middlewear" or "middleware" 
const { isAuthenticated, authorizeRoles } = require("../middlewear/authMiddlewear");

router.get(
    "/profile", 
    isAuthenticated, 
    authorizeRoles("vendor"), 
    getVendorProfile
);

router.get(
  "/admin/pending-vendors", 
  isAuthenticated, 
  authorizeRoles("admin"), 
  getPendingVendors
);

router.route("/admin/verify-vendor/:id")
  .put(isAuthenticated, authorizeRoles("admin"), verifyVendor);

router.route("/admin/reject-vendor/:id")
  .delete(isAuthenticated, authorizeRoles("admin"), rejectVendor);

module.exports = router;