const mongoose = require("mongoose");

const bannerSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Banner title is required"],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    // New: Visual tag to show on the homepage (e.g., "UP TO 50% OFF" or "SAVE $20")
    discountTag: {
      type: String,
      required: [true, "Please provide a discount tag (e.g., 20% OFF)"],
      trim: true,
    },
    image: {
      public_id: {
        type: String,
        required: true,
      },
      url: {
        type: String,
        required: true,
      },
    },
    // Keep this as an optional field so the banner still knows where to send the user
    redirectPath: {
      type: String,
      default: "/shop",
    },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    adminFeedback: {
      type: String,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    priority: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

bannerSchema.index({ status: 1 });
bannerSchema.index({ vendor: 1 });

const Banner = mongoose.model("Banner", bannerSchema);
module.exports = Banner;