// const bcrypt = require("bcryptjs");
// const User = require("../model/userModel"); // make sure path is correct
// // ========================
// // REGISTER USER
// // ========================
// const registerUser = async (req, res) => {
//   const { userName, userEmail, userPhoneNumber, userPassword, role, companyName, companyLogo, panNumber } = req.body;

//   try {
//     // Check if email already exists
//     const existingUser = await User.findOne({ userEmail });
//     if (existingUser) {
//       return res.status(400).json({ error: "User already exists" });
//     }

//     // Hash password
//     const hashedPassword = await bcrypt.hash(userPassword, 10);

//     // Build user object
//     const newUser = {
//       userName,
//       userEmail,
//       userPhoneNumber,
//       userPassword: hashedPassword,
//       role,
//     };

//     // Add extra fields if role is vendor
//     if (role === "Vendor") {
//       if (!companyName || !companyLogo || !panNumber) {
//         return res.status(400).json({ error: "Vendor must provide companyName, companyLogo, and panNumber" });
//       }
//       newUser.companyName = companyName;
//       newUser.companyLogo = companyLogo;
//       newUser.panNumber = panNumber;
//     }

//     // Save user
//     const user = new User(newUser);
//     await user.save();

//     res.status(201).json({
//       success: true,
//       message: "User registered successfully",
//       user: {
//         userName: user.userName,
//         userEmail: user.userEmail,
//         role: user.role,
//       },
//     });
//   } catch (err) {
//     console.error("Register error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// // ========================
// // LOGIN USER
// // ========================
// const loginUser = async (req, res) => {
//   const { userEmail, userPassword } = req.body;

//   try {
//     // Check if user exists
//     const user = await User.findOne({ userEmail });
//     if (!user) return res.status(400).json({ error: "Invalid credentials" });

//     // Compare password
//     const isMatch = await bcrypt.compare(userPassword, user.userPassword);
//     if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

//     // Login successful
//     res.status(200).json({
//       success: true,
//       message: "Login successful",
//       user: {
//         userName: user.userName,
//         userEmail: user.userEmail,
//         role: user.role,
//       },
//     });
//   } catch (err) {
//     console.error("Login error:", err);
//     res.status(500).json({ error: "Server error" });
//   }
// };

// // ========================
// // EXPORT CONTROLLER
// // ========================
// module.exports = {
//   registerUser,
//   loginUser,
// };

const User = require("../model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../services/sendEmail");

 exports.userRegister = async (req, res) => {
    //Alternative
    const { username, email, phoneNumber, password } = req.body
    
    if(!username || !email || !phoneNumber || !password){
      return  res.status(400).json({
            message : "Please Provide UserName, Email, PhoneNumber, Password"
        })
    }
    const userFound = await User.find({userEmail:email})
    if(userFound.length>0){
        return res.status(400).json({
            message:"User With That email is already registered"
        })
    }
    
    // Insert to database logic goes here
    await User.create({
       userName: username,
       userEmail:email,
       userPhoneNumber:phoneNumber,
       userPassword: bcrypt.hashSync(password,10),
    });



    res.json({

        status: 201,
        message: "Success",
    });

};

exports.userLogin = async (req, res)=>{
    const {email, password} = req.body;
    if(!email || !password){
        res.status(400).json({
            message: "Please Provide email, password",
        })
    }
    const userFound = await User.find({userEmail:email})
    if(userFound.length == 0){
        return res.status(400).json({
            message:"User With That email is already registered"
        })
    }
    
    const isMatched = bcrypt.compareSync(password, userFound[0].userPassword)
    if (isMatched){
        //Generate Token
        const token = jwt.sign({ id: userFound[0]._id}, process.env.SECRET_KEY,{
            expiresIn: "30d",
    })

    res.status(200).json({
        message: "User logged in succesfully",
        token,
    })
    }
    else {
        res.status(404).json({
            message: "Invalid Password"
        })
    }
}

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({
      message: "Please provide Email",
    });
  }
  //check if that email is register or not
  const userExist = await User.find({ userEmail: email });
  if (!userExist) {
    return res.status(404).json({
      message: "Email is not registered",
    });
  }
  //send OTP to that email
  const otp = Math.floor(1000 + Math.random() * 9000);
  userExist[0].otp = otp;
  await userExist[0].save();
  await sendEmail({
    email : email,
    subject : "Your OTP for Digital Momo",
    message : `Your OTP is${otp}.`
  })
  res.json({
    message: "Forgot Password OTP is sended",
    otp : otp
  });
};

exports.verifyOtp = async (req, res) =>{
  const { email, otp} = req.body;
  if(!email || !otp){
    return res.status(400).json({
      message: "Please provide email,otp",
    });
  }
    const userExists = await User.find({ userEmail: email});
    if (userExists.length == 0){
      return res.status(404).json({
        message : "Email is not registered",
      });
    }
      if (userExists[0].otp !==otp){
        return res.status(404).json({
          message : "Invalid otp"
        });
      } 
      else userExists[0].otp = undefined;
      userExists[0].isOtpVerified = true;
      await userExists[0].save();
        res.status (200).json({
      message: "otp is correct",
    })
  }

  exports.resetPassword = async (req, res)=>{
    const {email, newPassword, confirmPassword} = req.body;
    if(!email || !newPassword || !confirmPassword){
      return res.status(400).json({
        message: "Please Provide Email, New Password, Confirm Password",
      });
    }
    if (newPassword !== confirmPassword){
      return res.status(400).json({
        message: "New Password and Confirm Password is not same",
      })
    }
    const userExists = await User.find({ userEmail : email});
    if (userExists.length == 0){
      return res.status(404).json({
        message: "Email is not registered"
      })
    }
    if (userExists[0].isOtpVerified !==true){
      return res.status(403).json({
        message: "You cannot perform this action",
      })
    }
    userExists[0].userPassword = bcrypt.hashSync(newPassword, 10);
    userExists[0].isOtpVerified = false;
    await userExists[0].save();
    res.status(404).json({
      message: "Password is Changed Sucessfully",
    })
  }

  
