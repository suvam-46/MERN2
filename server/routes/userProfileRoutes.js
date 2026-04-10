const { getMyProfile } = require("../controller/admin/user/profile/profileController");
const isAutheticated = require("../milddleWare/isAuthenticated");
const catchAsync = require("../services/catchAsync");
const router = require("express").Router();
router.route("/profile").get(isAutheticated, catchAsync(getMyProfile))
module.exports = router;