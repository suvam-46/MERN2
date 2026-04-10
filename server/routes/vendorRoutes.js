const express = require("express");
const router = express.Router();

// 1. Import your controller (Ensure the path to your controller folder is correct)
const { getVendorProfile } = require("../controller/user/vendorController");

// 2. Import your middleware 
// IMPORTANT: Check if your folder is named "middlewear" or "middleware" 
const { isAuthenticated, authorizeRoles } = require("../middlewear/authMiddlewear");

router.get(
    "/profile", 
    isAuthenticated, 
    authorizeRoles("vendor"), 
    getVendorProfile
);

module.exports = router;