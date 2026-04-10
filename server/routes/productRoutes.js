const express = require("express");
<<<<<<< HEAD
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

module.exports = router;