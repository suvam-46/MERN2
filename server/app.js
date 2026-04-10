require("dotenv").config();
const express = require("express");
const cors = require("cors"); 
const cookieParser = require("cookie-parser"); 
const { connectDatabase } = require("./database/connectDB");
const authRoutes = require("./routes/authRoutes");
const productRouter = require("./routes/productRoutes") 
const vendorRouter = require("./routes/vendorRoutes")


const app = express();

// Connect to Database
connectDatabase();


app.use(cors({
    origin: "http://localhost:5173", 
    credentials: true 
}));

app.use(express.json()); 
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser()); // 

//Routes

app.use("/api/auth", authRoutes); 

app.use("/api/product", productRouter);

app.use("/api/vendor", vendorRouter);

// Root route for testing
app.get("/", (req, res) => {
    res.send("FootWear API is running...");
});

// --- Server Start ---
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});