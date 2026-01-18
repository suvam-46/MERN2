const mongoose = require("mongoose")
const Schema = mongoose.Schema
const userSchema = new Schema({
    userName:{
        type : String,
        require:[true,"Please Provide Username"]
    },
    userEmail:{
        type : String,
        require:[true,"Please Provide Email"]
    },
    userPhoneNumber:{
        type: Number,
        require:[true,"PLease Provide Phone Number"]
    }, 
    userPassword:{
        type : String,
        require:[true,"Please Provide Password"]
    },
    role:{
        type: String,
        Enum:["customer", "vendor"],
        default: "customer"
    },
    otp:{
        type: Number,
    },
    isOtpVerified :{
        type: Boolean,
        default: false,
    },
    // companyName:{
    //     type: String,
    // },
    // companyLogo: {
    //     type: String,
    // },

    // panNumber:{
    //  type: Number,
    // }
},
{timestamps:true}
);

const User = mongoose.model("User",userSchema)
module.exports = User
