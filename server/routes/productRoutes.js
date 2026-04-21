const express = require("express");
<<<<<<< HEAD
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

<<<<<<< HEAD
// Vendor update/delete routes
router.route("/product/:id")
    .put(upload.array("productImages", 5), updateProduct)
    .delete(deleteProduct);
=======
router.get("/products", getVendorProducts);


router.put(
    "/product/:id", 
    upload.array("productImages", 5), 
    updateProduct
);


router.delete("/product/:id", deleteProduct);
=======
const {
  createProduct,
  getProduct,
  getProducts,
  deleteProduct,
  editProduct,
} = require("../controller/admin/product/productController");
const isAuthenticated = require("../milddleWare/isAuthenticated");
const permitTo = require("../milddleWare/permitTo");
const upload = require("../milddleWare/multerConfig");
const catchAsync = require("../services/catchAsync");
const router = express.Router();

router
  .route("/product")
  .post(
    isAuthenticated,
    permitTo("admin"),
    upload.single("productImage"),
    createProduct
  )
  .get(getProducts);
router
  .route("/product/:id")
  .get(getProduct)
  .delete(isAuthenticated, permitTo("admin"), catchAsync(deleteProduct))
  .patch(
    isAuthenticated,
    permitTo("admin"),
    upload.single("productImage"),
    editProduct
  );
>>>>>>> f0508147ab85022abb8c8d1d3e42f06a4a0a0e30
>>>>>>> 2f41cbe50e00a7c815281d618a53e9c9ad00551b

module.exports = router;