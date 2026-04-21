require("dotenv").config();
<<<<<<< HEAD
const express = require("express");
const cors = require("cors"); 
const cookieParser = require("cookie-parser"); 
const morgan = require("morgan"); // NEW: For request logging
const { connectDatabase } = require("./database/connectDB");

// Routes
const authRoutes = require("./routes/authRoutes");
const productRouter = require("./routes/productRoutes");
const vendorRouter = require("./routes/vendorRoutes");
const customerRouter = require("./routes/customerRoutes");
const reviewRouter = require("./routes/reviewRoutes");
const cartRouter = require("./routes/cartRoutes");
const orderRouter = require("./routes/orderRoutes");
const bannerRouter = require("./routes/bannerRoutes");
const adminSeeder = require("./adminSeeder");

const app = express();

// Connect to Database
connectDatabase()
    .then(() => {
        console.log("Database connection established.");
        adminSeeder(); 
    })
    .catch((err) => {
        console.error("Database connection failed:", err);
    });

// --- Middleware ---

// Use Morgan to log requests in the terminal
app.use(morgan("dev")); 

app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true 
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser()); 

// --- Routes ---

app.use("/api/auth", authRoutes); 
app.use("/api/product", productRouter);
app.use("/api/vendor", vendorRouter);
app.use("/api/customer", customerRouter);
app.use("/api/review", reviewRouter);
app.use("/api/cart", cartRouter);
app.use("/api/order", orderRouter);
app.use("/api/banners", bannerRouter);

app.get("/", (req, res) => {
    res.send("FootWear API is running...");
});

// --- NEW: Global Error Handling Middleware ---
// This ensures that any error in your controllers is sent as JSON to the frontend
app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";
    
    console.error(`[Error] ${message}`);
    
    res.status(statusCode).json({
        success: false,
        message,
        stack: process.env.NODE_ENV === "production" ? null : err.stack,
    });
});

// --- Server Start ---
const PORT = process.env.PORT || 3000; // Added fallback port
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
=======
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
>>>>>>> f0508147ab85022abb8c8d1d3e42f06a4a0a0e30
