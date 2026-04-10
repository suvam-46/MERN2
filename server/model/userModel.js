const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
  {
    userName: { type: String, required: true },
    userEmail: { type: String, required: true, unique: true },
    userPassword: { type: String, required: true },
    userPhoneNumber: { type: String, required: true },
    role: { 
        type: String, 
        enum: ["customer", "vendor"], 
        default: "customer" 
    },
    
    avatar: {
      public_id: { type: String },
      url: { type: String }
    },

    isEmailVerified: { type: Boolean, default: false },
    otp: { type: String },
    
    // VENDOR ONLY FIELDS
    storeName: { type: String, trim: true },
    businessAddress: { type: String, trim: true },
    isVerifiedVendor: { type: Boolean, default: false },
    storeImage: {
      public_id: { type: String },
      url: { type: String }
    },

    // CUSTOMER ONLY FIELDS (Personal Collections)
    wishlist: [
      {
        type: mongoose.Schema.ObjectId,
        ref: "Product",
      }
    ],

}, { timestamps: true });

const User = mongoose.model("User", userSchema);
module.exports = User;