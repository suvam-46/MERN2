const express = require("express");
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

module.exports = router;