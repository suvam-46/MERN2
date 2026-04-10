// routes/authRoutes.js
const express = require("express");
const router = express.Router();

// Import all functions from the controller
const { 
    userRegister, 
    userLogin, 
    forgotPassword, 
    verifyResetPasswordOtp, 
    resetPassword, 
    userLogout, 
    verifyRegistrationOtp, 
    resendOTP 
} = require("../controller/auth/authController");

// Import file upload tool (Multer)
const { upload } = require("../middlewear/cloudinary"); 


// Create account (allows uploading 1 profile picture and 1 store picture)
router.post(
    "/register", 
    upload.fields([
        { name: "avatar", maxCount: 1 }, 
        { name: "storeImage", maxCount: 1 }
    ]), 
    userRegister
);

// Verify the email using the OTP code
router.post("/verifyEmail", verifyRegistrationOtp);

// Send the OTP code again if not received
router.post("/resendOTP", resendOTP);

// Sign in to the account
router.post("/login", userLogin);

// Sign out and remove cookies
router.get("/logout", userLogout);
    
// Request an OTP code to change password
router.post("/forgot-password", forgotPassword);

// Check if the reset OTP code is correct
router.post("/verify-reset-otp", verifyResetPasswordOtp);

// Set the new password
router.post("/reset-password", resetPassword);

module.exports = router;