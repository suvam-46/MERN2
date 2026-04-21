const bcrypt = require("bcryptjs");
const User = require("./model/userModel"); 

const adminSeeder = async () => {
    // Define the email in a variable so you only have to change it in one place
    const adminEmail = "footwear288@gmail.com";

    try {
        // 1. Check for the EXACT email you are about to create
        const isAdminExists = await User.findOne({ userEmail: adminEmail });

        if (!isAdminExists) {
            await User.create({
                userName: "System Admin",
                userEmail: adminEmail, // Now this matches the check above
                userPassword: bcrypt.hashSync("admin123", 10),
                userPhoneNumber: "9812345678",
                role: "admin",
                isEmailVerified: true, 
                avatar: {
                    public_id: "admin_def",
                    url: "https://res.cloudinary.com/demo/image/upload/d_avatar.png"
                }
            });
            console.log("✅ Admin seeded successfully!");
        } else {
            console.log(`ℹ️ Admin (${adminEmail}) already exists in database.`);
            
            // OPTIONAL: If the user exists but isn't an admin, you can update them
            if (isAdminExists.role !== "admin") {
                isAdminExists.role = "admin";
                await isAdminExists.save();
                console.log("⬆️ Existing user promoted to Admin.");
            }
        }
    } catch (error) {
        console.error("❌ Error seeding admin:", error);
    }
};

module.exports = adminSeeder;