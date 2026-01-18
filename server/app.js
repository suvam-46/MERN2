require("dotenv").config();
const express = require("express");
const cors = require("cors");           // ✅ Import cors
const bodyParser = require("body-parser"); // ✅ Import body-parser
const { connectDatabase } = require("./database/connectDB");
const authRoutes = require("../server/routes/authRoutes")

const app = express();

// Middleware
app.use(cors());           // ✅ Enable CORS
app.use(bodyParser.json()); // ✅ Parse JSON requests

// Connect to DB
connectDatabase();

const port = process.env.PORT || 5000;

// Routes
app.use("", authRoutes); 

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
