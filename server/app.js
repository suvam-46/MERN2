require("dotenv").config()
const {connectDatabase} = require("./database/connectDB")
const express = require("express");
const User = require("./Model/userModel");
const Product = require("./model/productModel");
const app = express()
connectDatabase();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const port = process.env.PORT;
app.use(express.json({
  strict: false,
  verify: (req, res, buf) => {
    if (!buf || !buf.length) req.body = {};
  }
}));
app.use(express.urlencoded({ extended: true }));
const authRoutes = require("./routes/authRoutes")
const productRoutes = require("./routes/productRoutes")
const userAdminRoute = require("./routes/userAdminRoute")
const productReviewRoute = require("./routes/productReviewRoute")
const userProfileRoutes = require("./routes/userProfileRoutes")
const cartRoutes = require("./routes/cartRoutes")
app.use("",authRoutes)
app.use("",productRoutes)
app.use("",userAdminRoute)
app.use("",productReviewRoute)
app.use("", userProfileRoutes)
app.use("", cartRoutes)
app.use(express.static("uploads"))
app.listen(port, (req,res)=>{
    console.log(`Connected to ${port}`)
})
