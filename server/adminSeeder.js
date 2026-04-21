const bcrypt = require("bcryptjs");
<<<<<<< HEAD
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

=======
const User = require("./Model/userModel");
const adminSeeder = async () =>{
    const isAdminExists = await User.findOne({ userEmail: "admin@gmail.com"});
    if (!isAdminExists){
        await User.create({
            userEmail : "admin@gmail.com",
            userPassword : bcrypt.hashSync("admin",10),
            userPhoneNumber: 9812345678,
            userName: "admin",
            role: "admin",
        });
        console.log("Admin seeded successfully!!");
    } else {
        console.log("Admin already seeded");
    }
};
 //       await User.bulkWrite([
    //   {
    //     updateOne: {
    //       filter: { userEmail: "admin1@gmail.com" },
    //       update: {
    //         $setOnInsert: {
    //           userEmail: "admin1@gmail.com",
    //           userPassword: await bcrypt.hash("admin123", 10),
    //           userPhoneNumber: 9812345678,
    //           userName: "Admin One",
    //           role: "admin",
    //         },
    //       },
    //       upsert: true,
    //     },
    //   },
    //   {
    //     updateOne: {
    //       filter: { userEmail: "admin2@gmail.com" },
    //       update: {
    //         $setOnInsert: {
    //           userEmail: "admin2@gmail.com",
    //           userPassword: await bcrypt.hash("admin123", 10),
    //           userPhoneNumber: 9812345679,
    //           userName: "Admin Two",
    //           role: "admin",
    //         },
    //       },
    //       upsert: true,
    //     },
    //   },
    // ]);
>>>>>>> 2f41cbe50e00a7c815281d618a53e9c9ad00551b
module.exports = adminSeeder;