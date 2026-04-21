const express = require("express");
const router = express.Router();

// Controllers
const { 
  addToCart, 
  getCart, 
  removeFromCart, 
  updateQuantity 
} = require("../controller/cart/cartController");

// Middleware
const { isAuthenticated } = require("../middlewear/authMiddlewear"); 

/**
 * @route   ALL /api/cart/*
 * @desc    Protect all cart routes - user must be logged in
 * @access  Private
 */
router.use(isAuthenticated);

// --- ROUTES ---

// GET: http://localhost:3000/api/cart/getCart
router.get("/getCart", getCart);

// POST: http://localhost:3000/api/cart/addCart
router.post("/addCart", addToCart);

// PUT: http://localhost:3000/api/cart/updateQuantity
router.put("/updateQuantity", updateQuantity);

// DELETE: http://localhost:3000/api/cart/removeCartItem/:itemId
router.delete("/removeCartItem/:itemId", removeFromCart);

module.exports = router;