// mongodb+srv://FootWear:<db_password>@footwear.pol2moe.mongodb.net/?appName=FootWear
const mongoose = require("mongoose");
exports.connectDatabase = async() => {
    try {
        
        await mongoose.connect(process.env.MONGO_URI)        
        console.log("Mongodb Connected Successfully");
        
    } catch (error) {
        
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);// Stop app if database is down
    }
};