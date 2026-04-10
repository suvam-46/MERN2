const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    productName: {
      type: String,
      required: [true, "Please enter shoe name"],
      trim: true,
      maxLength: [100, "Shoe name cannot exceed 100 characters"],
    },
    productDescription: {
      type: String,
      required: [true, "Please enter shoe description"],
    },
    brand: {
      type: String,
      required: [true, "Please enter brand (e.g., Nike, Adidas)"],
      trim: true,
    },
    productPrice: {
      type: Number,
      required: [true, "Please enter product price"],
      default: 0.0,
    },

    discountPercent: {
  type: Number,
  default: 0, // e.g., 20 for 20%
},
    discountPrice: {
      type: Number,
      default: 0.0,
    },
    // SHOE SPECIFIC FIELDS
    gender: {
      type: String,
      required: [true, "Please select gender"],
      enum: ["Men", "Women", "Unisex", "Kids"],
    },
    sizes: [
      {
        type: Number,
        required: [true, "Please specify available sizes (e.g., 7, 8, 9, 10)"],
      }
    ],
    colors: [
      {
        type: String,
        required: [true, "Please specify colors (e.g., White/Blue)"],
      }
    ],
    material: {
      type: String, // Leather, Mesh, Synthetic, etc.
      trim: true,
    },
    category: {
      type: String,
      required: [true, "Please select category"],
      enum: {
        values: [
          "Running",
          "Basketball",
          "Casual/Sneakers",
          "Training & Gym",
          "Football",
          "Formal",
          "Sandals/Slides",
          "Outdoor/Boots"
        ],
        message: "Please select correct category for shoes",
      },
    },
    productImages: [
      {
        public_id: { type: String, required: true },
        url: { type: String, required: true },
      },
    ],
    stock: {
      type: Number,
      required: [true, "Please enter product stock"],
      default: 1,
    },
    ratings: {
      type: Number,
      default: 0,
    },
    numOfReviews: {
      type: Number,
      default: 0,
    },
    reviews: [
      {
        user: { type: mongoose.Schema.ObjectId, ref: "User", required: true },
        name: { type: String, required: true },
        rating: { type: Number, required: true },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    vendor: {
      type: mongoose.Schema.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);