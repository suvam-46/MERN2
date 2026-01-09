const { addTocart, deleteItemFromCart, getMyCartItems } = require("../controller/admin/user/cart/cartController");
const isAutheticated = require("../milddleWare/isAuthenticated");
const catchAsync = require("../services/catchAsync");

const router = require("express").Router();

router
  .route("/cart/:productId")
  .post(isAutheticated, catchAsync(addTocart))
  .delete(isAutheticated, catchAsync(deleteItemFromCart));
router.route("/cart").get(isAutheticated, catchAsync(getMyCartItems));

module.exports = router;