const User = require("../../Model/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const sendEmail = require("../../services/sendEmail");
 
 
 exports.userRegister = async (req, res) => {
    //Alternative (object destructuring)
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

  
