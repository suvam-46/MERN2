const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../../model/userModel");
const sendEmail = require("../../services/sendEmail");
const { generateOtp } = require("../../services/generateOtp");

exports.userRegister = async (req, res) => {
    try {
        const { 
            userName, 
            userEmail, 
            userPhoneNumber, 
            userPassword, 
            role, 
            storeName, 
            businessAddress 
        } = req.body;

        // 1. Basic Field Validation
        if (!userName || !userEmail || !userPhoneNumber || !userPassword) {
            return res.status(400).json({ message: "Please provide all required fields" });
        }

        // 2. Vendor-Specific Validation
        if (role === "vendor" && !storeName) {
            return res.status(400).json({ message: "Vendors must provide a Store Name" });
        }

        // 3. Check for existing verified account
        let userFound = await User.findOne({ userEmail });
        if (userFound && userFound.isEmailVerified) {
            return res.status(400).json({ message: "This email is already verified. Please login." });
        }

        // 4. Security: Hash Password & Generate OTP
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(userPassword, salt);
        const otp = generateOtp();

        // 5. Extract File Data (Avatar and Store Image)
        // Note: Assumes multer config: upload.fields([{name:'avatar'}, {name:'storeImage'}])
        let avatarData = {};
        let storeImageData = {};

        if (req.files) {
            if (req.files.avatar) {
                avatarData = {
                    public_id: req.files.avatar[0].filename,
                    url: req.files.avatar[0].path
                };
            }
            if (req.files.storeImage) {
                storeImageData = {
                    public_id: req.files.storeImage[0].filename,
                    url: req.files.storeImage[0].path
                };
            }
        }

        // 6. UPSERT LOGIC: Update existing unverified OR Create New
        if (userFound) {
            // Update unverified user (The Safety Net)
            userFound.userName = userName;
            userFound.userPhoneNumber = userPhoneNumber;
            userFound.userPassword = hashedPassword;
            userFound.role = role || "customer";
            userFound.otp = otp;
            
            // Only update images if new ones were actually uploaded
            if (avatarData.url) userFound.avatar = avatarData;
            
            if (role === "vendor") {
                userFound.storeName = storeName;
                userFound.businessAddress = businessAddress;
                if (storeImageData.url) userFound.storeImage = storeImageData;
            }

            await userFound.save();
        } else {
            // Create fresh record
            const newUserConfig = {
                userName,
                userEmail,
                userPhoneNumber,
                userPassword: hashedPassword,
                role: role || "customer",
                otp,
                avatar: avatarData.url ? avatarData : undefined
            };

            if (role === "vendor") {
                newUserConfig.storeName = storeName;
                newUserConfig.businessAddress = businessAddress;
                newUserConfig.storeImage = storeImageData.url ? storeImageData : undefined;
            }

            await User.create(newUserConfig);
        }

        // 7. Send Verification Email
        await sendEmail({
            email: userEmail,
            subject: "Verify your FootWear Account",
            message: `Welcome to the Shoe Shop! Your OTP is: ${otp}. It will expire shortly.`
        });

        res.status(200).json({
            success: true,
            message: "Registration initiated. Please check your email for the OTP."
        });

    } catch (error) {
        console.error("Critical Registration Error:", error);
        res.status(500).json({ message: "Internal Server Error. Please try again later." });
    }
};

exports.verifyRegistrationOtp = async (req, res) => {
    try {
        const { email, otp } = req.body;

        if (!email || !otp) {
            return res.status(400).json({ message: "Email and OTP are required" });
        }

        // 1. Ensure this key matches your Schema (is it userEmail or email?)
        const user = await User.findOne({ userEmail: email });

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 2. Convert both to strings and trim whitespace to be 100% sure
        if (String(user.otp).trim() !== String(otp).trim()) {
            return res.status(400).json({ message: "Invalid OTP" });
        }

        user.isEmailVerified = true;
        user.otp = undefined; // Clean up
        await user.save();

        res.status(200).json({
            success: true,
            message: "Email verified successfully! You can now log in."
        });
    } catch (error) {
        console.error("Verification Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.userLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Validation
    if (!email || !password) {
      return res.status(400).json({ message: "Please provide email and password" });
    }

    // 2. Find User (Using userEmail to match your schema)
    const userFound = await User.findOne({ userEmail: email });
    if (!userFound) {
      return res.status(404).json({ message: "User with that email not found" });
    }

    // 3. Email Verification Check
    if (!userFound.isEmailVerified) {
      return res.status(403).json({
        message: "Your email is not verified. Please verify your email first.",
        isVerified: false,
        email: userFound.userEmail 
      });
    }

    // 4. Password Validation
    const isMatched = bcrypt.compareSync(password, userFound.userPassword);

    if (isMatched) {
      // 5. Generate JWT Token
      const token = jwt.sign(
        { id: userFound._id, role: userFound.role },
        process.env.SECRET_KEY,
        { expiresIn: "30d" }
      );

      // 6. Set Secure Cookie
      res.cookie("token", token, {
        httpOnly: true,
        // Secure is true only in production (requires HTTPS)
        secure: process.env.NODE_ENV === "production", 
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
      });

      // 7. Success Response
      res.status(200).json({
        message: "User logged in successfully",
        user: {
          id: userFound._id,
          userName: userFound.userName,
          role: userFound.role,
          userEmail: userFound.userEmail,
          isEmailVerified: userFound.isEmailVerified
        }
      });
    } else {
      res.status(401).json({ message: "Invalid Password" });
    }
  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: "Please provide Email" });
        }

        // 1. Check if user exists
        const userExist = await User.findOne({ userEmail: email });
        if (!userExist) {
            return res.status(404).json({ message: "Email is not registered" });
        }


        const otp = generateOtp();


        userExist.otp = otp;
        await userExist.save();

        await sendEmail({
            email: email,
            subject: "Your OTP for FootWear",
            message: `Your OTP is ${otp}. Please do not share it with anyone.`
        });

        res.status(200).json({
            message: "OTP sent successfully to your email"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Internal Server Error"
        });
    }
};

exports.verifyResetPasswordOtp = async (req, res) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
        return res.status(400).json({ message: "Please provide email and otp" });
    }

    const user = await User.findOne({ userEmail: email });

    if (!user) {
        return res.status(404).json({ message: "User not found" });
    }

    // Check if OTP matches
    if (user.otp !== Number(otp)) {
        return res.status(400).json({ message: "Invalid OTP" });
    }

    // Clear OTP and set verification status
    user.otp = undefined;
    user.isOtpVerified = true;
    await user.save();

    res.status(200).json({
        message: "OTP verified successfully. You can now reset your password."
    });
};
exports.resetPassword = async (req, res) => {
    try {
        const { email, newPassword, confirmPassword } = req.body;

        if (newPassword !== confirmPassword) {
            return res.status(400).json({ message: "Passwords do not match" });
        }

        const user = await User.findOne({ userEmail: email });
        
        if (!user || !user.isOtpVerified) {
            return res.status(403).json({ 
                message: "Unauthorized. Please verify OTP first." 
            });
        }

        // Use the same salt rounds as registration (10)
        user.userPassword = await bcrypt.hash(newPassword, 10);
        user.isOtpVerified = false; // LOCK THE DOOR
        await user.save();

        res.status(200).json({
            message: "Password updated! Please login with your new credentials."
        });

    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
    }
};

exports.userLogout = async (req, res) => {
    // Check your login controller: Did you name it "token"? 
    // If you used a different name there, change "token" here.
    res.clearCookie("token", {
        httpOnly: true,
        secure: true, // Must be true if sameSite is 'none'
        sameSite: "none", 
        path: "/" // Ensure the path matches your login cookie path
    });

    res.status(200).json({
        success: true,
        message: "Logged out successfully"
    });
};
exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ userEmail: email });

    if (!user) return res.status(404).json({ message: "User not found" });
    if (user.isEmailVerified) return res.status(400).json({ message: "Already verified" });

    // Use your existing service for consistency!
    const newOtp = generateOtp(); 

    user.otp = newOtp;
    await user.save();

    await sendEmail({
      email: user.userEmail,
      subject: "Your New Verification Code",
      message: `Your new OTP is: ${newOtp}`,
    });

    res.status(200).json({ message: "New OTP sent successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal server error" });
  }
};