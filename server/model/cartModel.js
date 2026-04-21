const mongoose = require("mongoose");

const cartSchema = new mongoose.Schema(
  {
    // Link to your User model
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        // Link to your Product model
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
          min: [1, "Quantity cannot be less than 1"],
          default: 1,
        },
        // Important for Shoes: selected variants
        selectedSize: {
          type: Number,
          required: [true, "Please select a size"],
        },
        selectedColor: {
          type: String,
          required: [true, "Please select a color"],
        },
        // Price at the time of adding to cart (helpful for snapshots)
        price: {
          type: Number,
          required: true,
        }
      },
    ],
    // Total price of all items in the cart
    totalPrice: {
      type: Number,
      required: true,
      default: 0,
    },
  },
  { timestamps: true }
);

// Middleware to calculate total price before saving
cartSchema.pre("save", async function () {
  this.totalPrice = this.items.reduce((total, item) => {
    return total + (item.price * item.quantity);
  }, 0);
});

module.exports = mongoose.model("Cart", cartSchema);