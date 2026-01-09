// mongodb+srv://SuvamKhanal:suvam123@digitalmomo.oymjk24.mongodb.net/?appName=DigitalMomo
const mongoose = require("mongoose");
const adminSeeder = require("../adminSeeder");

exports.connectDatabase = async() => {
    try {
        
        await mongoose.connect(process.env.MONGO_URI)        
        console.log("Mangodb sanaga connect vayo haii");
        adminSeeder();
    } catch (error) {
        
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);// Stop app if database is down
    }
};
