const mongoose = require("mongoose");

const foodItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    category: {
      type: String,
      required: true,
      trim: true
    },
    costPerKg: {
      type: Number,
      required: true,
      min: 0
    },
    co2ePerKg: {
      type: Number,
      required: true,
      min: 0
    },
    unit: {
      type: String,
      default: "kg"
    },
    active: {
      type: Boolean,
      default: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("FoodItem", foodItemSchema);