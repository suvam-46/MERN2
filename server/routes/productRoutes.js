const express = require("express");
const router = express.Router();

// Import Middleware
const { upload } = require("../middlewear/cloudinary");
const { isAuthenticated, authorizeRoles } = require("../middlewear/authMiddlewear");

// Import Vendor Controller
const { 
    createProduct, 
    getVendorProducts, 
    updateProduct, 
    deleteProduct 
} = require("../controller/product/productController");


router.use(isAuthenticated);
router.use(authorizeRoles("vendor"));


router.post(
    "/new", 
    upload.array("productImages", 5), 
    createProduct
);


router.get("/products", getVendorProducts);


router.put(
    "/product/:id", 
    upload.array("productImages", 5), 
    updateProduct
);


router.delete("/product/:id", deleteProduct);

module.exports = router;