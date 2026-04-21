const Product = require("../../model/productModel");

// Create New Review or Update the review
// controllers/review/reviewController.js

exports.createProductReview = async (req, res) => {
  const { rating, comment, productId } = req.body;

  const review = {
    user: req.user._id, // This MUST be here to link the profile pic
    name: req.user.name,
    rating: Number(rating),
    comment,
  };

  const product = await Product.findById(productId);

  // Check if user already reviewed
  const isReviewed = product.reviews.find(
    (rev) => rev.user.toString() === req.user._id.toString()
  );

  if (isReviewed) {
    product.reviews.forEach((rev) => {
      if (rev.user.toString() === req.user._id.toString()) {
        rev.comment = comment;
        rev.rating = rating;
      }
    });
  } else {
    product.reviews.push(review);
    product.numOfReviews = product.reviews.length;
  }

  // Calculate average rating
  product.ratings = product.reviews.reduce((acc, item) => item.rating + acc, 0) / product.reviews.length;

  await product.save({ validateBeforeSave: false });

  res.status(200).json({ success: true, message: "Review added successfully" });
};
// Get All Reviews of a specific product
// controllers/productController.js
// controllers/productController.js

// ADD THIS MISSING FUNCTION TO FIX THE CRASH
exports.getProductReviews = async (req, res) => {
  const product = await Product.findById(req.query.id).populate({
    path: "reviews.user",
    select: "avatar", 
  });

  if (!product) {
    return res.status(404).json({ success: false, message: "Product not found" });
  }

  res.status(200).json({
    success: true,
    reviews: product.reviews,
  });
};