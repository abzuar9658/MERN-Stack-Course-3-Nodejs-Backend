const mongoose = require("mongoose");
//const Currency = mongoose.Types.Currency;
// const validator = require('validator');

const commentSchema = new Schema(
  {
    rating: {
      type: Number,
      min: 1,
      max: 5,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

const dishSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "A Dish must have a name"],
      unique: true,
      trim: true,
      maxlength: [40, "A Dish name must have less or equal then 40 characters"],
      minlength: [10, "A Dish name must have more or equal then 10 characters"],
    },
    description: {
      type: String,
      required: [true, "A dish must have a description"],
    },
    image: {
      type: String,
      trim: true,
    },
    category: {
      type: String,
      required: true,
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
    comments: [commentSchema],
  },
  {
    timestamps: true,
  }
);
const Dish = mongoose.model("Dish", dishSchema);

module.exports = Dish;
