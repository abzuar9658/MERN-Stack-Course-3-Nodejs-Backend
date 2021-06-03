const mongoose = require("mongoose");

const LeaderSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Leader must have a name"],
    },
    image: {
      type: String,
    },
    designation: {
      type: String,
      required: [true, "A Leader must have a designation"],
    },
    abbr: {
      type: String,
      required: [true, "A Leader must have a designation abbreviatio"],
    },
    featured: {
      type: Boolean,
      default: true,
    },
    description: {
      type: String,
      required: [true, "A promotion must have a description"],
    },
  },
  {
    timestamps: true,
  }
);
const Leader = mongoose.model("Leader", LeaderSchema);
module.exports = Leader;
