const jwt = require("jsonwebtoken");
const{promisify} = require("util");
const User = require("../Model/userModel");
const isAutheticated = async(req, res, next) => {
    try {
         const token = req.headers.authorization;
    console.log(token);
    if(!token){
        return res.status(403).json({
            messgae:"PLease Send Token"
        })
    }

    const decoded = await promisify(jwt.verify)(token, process.env.SECRET_KEY);
    const doesUserExist = await User.findOne({ _id: decoded.id});

    if(!doesUserExist){
        return res.status(404).json({
            message: "User doesnot exist with that token/id",
        });
    }
    req.user = doesUserExist;
    next();
    } catch (error) {
        res.status(400).json({
            message: error.messgae,
        });
    }



    const token = req.headers.authorization;
    console.log(token);
    if(!token){
        return res.status(403).json({
            messgae:"PLease Send Token"
        })
    }

    // jwt.verify(token, process.env.SECRET_KEY,(err,success)=>{
    //     if(err){
    //         res.status(400).json({
    //             message : "Invalid token"
    //         })
    //     } else{
    //         res.status(200).json({
    //             message:"valid token"
    //         })
    //     }
    // })

    //NEXT 
//     console.log("is Authenticate")
//     next();
};
module.exports = isAutheticated;
