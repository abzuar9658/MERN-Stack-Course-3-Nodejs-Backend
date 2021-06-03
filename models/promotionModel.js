const mongoose = require("mongoose");

const PromotionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Promotion must have a name"],
    },
    description: {
      type: String,
      required: [true, "A promotion must have a description"],
    },
    image: {
      type: String,
    },
    label: {
      type: String,
      default: "",
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    featured: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);
const Promotion = mongoose.model("Promotion", PromotionSchema);
module.exports = Promotion;
