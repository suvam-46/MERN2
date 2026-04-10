const express = require("express");
const isAuthenticated = require("../milddleWare/isAuthenticated");
const permitTo = require("../milddleWare/permitTo");
const {
  getUsers,
  deleteUser,
} = require("../controller/admin/user/userController");

const router = express.Router();

//routes here

router.route("/users").get(isAuthenticated, permitTo("admin"), getUsers);
router.route("/users/:id").delete(isAuthenticated, permitTo("admin"), deleteUser);

module.exports = router;
