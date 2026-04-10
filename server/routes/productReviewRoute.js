const express = require("express");
const isAutheticated = require("../milddleWare/isAuthenticated");
const { createReview, getMyReviews, getProductReview, deleteReview } = require("../controller/admin/user/review/reviewController");
const catchAsync = require("../services/catchAsync");
const router = express.Router();
router.route("/review/:id").post(isAutheticated, catchAsync(createReview));
router.route("/reviews").get(isAutheticated, catchAsync(getMyReviews));
router.route("/reviews/:id").get(catchAsync(getProductReview))
router.route("/deletereview/:id").delete(isAutheticated, catchAsync(deleteReview));
module.exports = router;