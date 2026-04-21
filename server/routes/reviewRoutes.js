const express = require("express");
const { 
  createProductReview, 
  getProductReviews 
} = require("../controller/review/reviewController");
const { isAuthenticated } = require("../middlewear/authMiddlewear");

const router = express.Router();

// REMOVED authorizeRoles("customer")
// Now any logged-in user (Customer or Admin) can leave a review
// Change this line in reviewRoutes.js
// In reviewRoutes.js
// Just remove authorizeRoles(...) completely
router.route("/review").put(isAuthenticated, createProductReview);

router.route("/reviews").get(getProductReviews);

module.exports = router;