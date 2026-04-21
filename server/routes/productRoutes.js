const express = require("express");
const router = express.Router();

// Import Middleware
const { upload } = require("../middlewear/cloudinary");
const { isAuthenticated, authorizeRoles } = require("../middlewear/authMiddlewear");

// Import Controllers
const { 
    createProduct, 
    getVendorProducts, 
    updateProduct, 
    deleteProduct,
    getAllProducts, 
    getSingleProduct,
    createProductReview // Make sure this is imported for later
} = require("../controller/product/productController");

// --- 1. PUBLIC / CUSTOMER ROUTES ---
// Move these to the top so they don't require login
router.get("/all", getAllProducts); 
router.get("/product/:id", getSingleProduct); // <--- MOVED THIS UP

// --- 2. AUTHENTICATION WALL ---
// Everything below this point requires a logged-in user
router.use(isAuthenticated);

// --- 3. LOGGED IN CUSTOMER ROUTES ---
// If you add the review logic, put it here (above the vendor check)
// router.put("/review", createProductReview);

// --- 4. VENDOR ONLY ROUTES ---
// Everything below this requires the user to be a Vendor
router.use(authorizeRoles("vendor"));

router.post(
    "/new", 
    upload.array("productImages", 5), 
    createProduct
);

router.get("/vendor-inventory", getVendorProducts);

// Vendor update/delete routes
router.route("/product/:id")
    .put(upload.array("productImages", 5), updateProduct)
    .delete(deleteProduct);

module.exports = router;