// routes/authRoutes.js
const express = require("express");
const { userRegister, userLogin } = require("../controller/authController");



const router = express.Router();

// Route to handle user registration
router.post("/register", userRegister);

// Route to handle user login
router.post("/login", userLogin);

module.exports = router;
