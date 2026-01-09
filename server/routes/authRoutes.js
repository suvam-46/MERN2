const express = require("express");
const { userRegister, userLogin, forgotPassword, verifyOtp, resetPassword } = require("../controller/auth/authController");
const router = express.Router();
router.route("/register").post(userRegister)
router.route("/login").post(userLogin)
router.route("/forgotPassword").post(forgotPassword)
router.route("/verifyotp").post(verifyOtp)
router.route("/newPassword").post(resetPassword)
module.exports = router;




