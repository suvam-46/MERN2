require("dotenv").config();
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