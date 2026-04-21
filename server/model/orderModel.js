const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    // 1. Linking the User
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 2. The Snapshot of Cart Items
    orderItems: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        productName: { type: String, required: true },
        quantity: { type: Number, required: true },
        selectedSize: { type: String, required: true },
        selectedColor: { type: String, required: true },
        price: { type: Number, required: true }, 
        image: { type: String, required: true },
      },
    ],

    // 3. Shipping Details
    shippingAddress: {
      fullName: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
      phoneNo: { type: String, required: true },
      postalCode: { type: String },
    },

    // 4. Payment Info
    paymentInfo: {
      pidx: { type: String }, 
      transactionId: { type: String }, // Added to store Khalti transaction ID
      status: { type: String, default: "Pending" },
      method: { 
        type: String, 
        required: true, 
        enum: ["COD", "Khalti", "Points"] 
      },
    },

    // 5. Pricing Breakdown
    itemsPrice: { type: Number, default: 0.0, required: true },
    taxPrice: { type: Number, default: 0.0 },
    shippingPrice: { type: Number, default: 0.0 },
    totalPrice: { type: Number, default: 0.0, required: true },

    // 6. Coupon & Points Logic
    appliedCoupon: { type: String, default: null },
    discountAmount: { type: Number, default: 0 },
    pointsEarned: { type: Number, default: 0 }, 
    pointsRedeemed: { type: Number, default: 0 }, 

    // 7. Order Status
    orderStatus: {
      type: String,
      required: true,
      default: "Processing",
      enum: ["Processing", "Shipped", "Delivered", "Cancelled"],
    },

    deliveredAt: Date,
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

// Use module.exports instead of export default
const Order = mongoose.model("Order", orderSchema);
module.exports = Order;