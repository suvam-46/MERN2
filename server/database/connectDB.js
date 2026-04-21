<<<<<<< HEAD
// mongodb+srv://FootWear:<db_password>@footwear.pol2moe.mongodb.net/?appName=FootWear
const mongoose = require("mongoose");
=======
// mongodb+srv://SuvamKhanal:suvam123@digitalmomo.oymjk24.mongodb.net/?appName=DigitalMomo
const mongoose = require("mongoose");
const adminSeeder = require("../adminSeeder");

>>>>>>> f0508147ab85022abb8c8d1d3e42f06a4a0a0e30
exports.connectDatabase = async() => {
    try {
        
        await mongoose.connect(process.env.MONGO_URI)        
<<<<<<< HEAD
        console.log("Mongodb Connected Successfully");
        
=======
        console.log("Mangodb sanaga connect vayo haii");
        adminSeeder();
>>>>>>> f0508147ab85022abb8c8d1d3e42f06a4a0a0e30
    } catch (error) {
        
        console.error("MongoDB connection failed:", error.message);
        process.exit(1);// Stop app if database is down
    }
<<<<<<< HEAD
};
=======
};
>>>>>>> f0508147ab85022abb8c8d1d3e42f06a4a0a0e30
