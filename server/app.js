require("dotenv").config();
const { connectDatabase } = require("./database/connectDB");
const express = require("express");
const User = require("./Model/userModel");
const Product = require("./Model/productModel");
const app = express();
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";
//const port = process.env.PORT;
app.use(
  express.json({
    strict: false,
    verify: (req, res, buf) => {
      if (!buf || !buf.length) req.body = {};
    },
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: "http://localhost:5173",
    origin: FRONTEND_URL,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  }),
);
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const userAdminRoute = require("./routes/userAdminRoute");
const productReviewRoute = require("./routes/productReviewRoute");
const userProfileRoutes = require("./routes/userProfileRoutes");
const cartRoutes = require("./routes/cartRoutes");
app.use("", authRoutes);
app.use("", productRoutes);
app.use("", userAdminRoute);
app.use("", productReviewRoute);
app.use("", userProfileRoutes);
app.use("", cartRoutes);
app.use(express.static("uploads"));
app.get("/healthz", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "Backend is running!",
  });
});
const PORT = process.env.PORT || 3000;
connectDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server has started at PORT ${PORT}`);
      console.log(`Health check available at /healthz`);
    });
  })
  .catch((err) => {
    console.error("Failed to connect to MongoDB", err);
  });

// require("dotenv").config()
// const {connectDatabase} = require("./database/connectDB")
// const express = require("express");
// const cors = require("cors"); // Import moved up for clarity
// const app = express()

// connectDatabase();

// // 1. GLOBAL MIDDLEWARE FIRST
// app.use(express.json({
//   strict: false,
//   verify: (req, res, buf) => {
//     if (!buf || !buf.length) req.body = {};
//   }
// }));
// app.use(express.urlencoded({ extended: true }));

// // 2. CORS MUST BE BEFORE ROUTES
// app.use(
//   cors({
//     origin: "http://localhost:5174",
//     methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],

//   })
// );

// // 3. ROUTES LAST
// const authRoutes = require("./routes/authRoutes")
// const productRoutes = require("./routes/productRoutes")
// const userAdminRoute = require("./routes/userAdminRoute")
// const productReviewRoute = require("./routes/productReviewRoute")
// const userProfileRoutes = require("./routes/userProfileRoutes")
// const cartRoutes = require("./routes/cartRoutes")

// app.use("", authRoutes)
// app.use("", productRoutes)
// app.use("", userAdminRoute)
// app.use("", productReviewRoute)
// app.use("", userProfileRoutes)
// app.use("", cartRoutes)

// app.use(express.static("uploads"))

// const port = process.env.PORT || 5000;
// app.listen(port, () => {
//     console.log(`Connected to ${port}`)
// })
