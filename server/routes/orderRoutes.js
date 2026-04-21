const express = require("express");
const router = express.Router();

// Use require instead of import
const { 
  createOrder, 
  verifyPayment, 
  getOrderDetails, 
  myOrders, 
  getAllOrders 
} = require("../controller/order/orderController"); 

const { isAuthenticated, authorizeRoles } = require("../middlewear/authMiddlewear");

router.route("/order/new").post(isAuthenticated, createOrder);
router.route("/verify-payment").post(isAuthenticated, verifyPayment);
router.route("/myOrders").get(isAuthenticated, myOrders);
router.route("/order/:id").get(isAuthenticated, getOrderDetails);

router.route("/admin/orders").get(isAuthenticated, authorizeRoles("admin" , "vendor"), getAllOrders);

module.exports = router; // Use module.exports instead of export default