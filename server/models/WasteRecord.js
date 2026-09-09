const mongoose = require("mongoose");

const wasteRecordSchema = new mongoose.Schema(
  {
    foodItem: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "FoodItem",
      required: true
    },

    weightKg: {
      type: Number,
      required: true,
      min: 0.001
    },

    reason: {
      type: String,
      required: true,
      enum: [
        "Preparation",
        "Spoilage",
        "Overproduction",
        "Plate Waste",
        "Damaged",
        "Expired",
        "Other"
      ]
    },

    station: {
      type: String,
      required: true,
      trim: true
    },

    costPerKgSnapshot: {
      type: Number,
      required: true
    },

    co2ePerKgSnapshot: {
      type: Number,
      required: true
    },

    calculatedCost: {
      type: Number,
      required: true
    },

    calculatedCO2e: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("WasteRecord", wasteRecordSchema);