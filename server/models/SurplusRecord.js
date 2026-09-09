const mongoose = require("mongoose");

const surplusRecordSchema = new mongoose.Schema(
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

    station: {
      type: String,
      required: true,
      trim: true
    },

    availableUntil: {
      type: Date,
      required: true
    },

    storageInstructions: {
      type: String,
      trim: true
    },

    status: {
      type: String,
      enum: [
        "AVAILABLE",
        "RESERVED",
        "DONATED",
        "EXPIRED",
        "CANCELLED"
      ],
      default: "AVAILABLE"
    },

    donationOrganisation: {
      type: String,
      trim: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "SurplusRecord",
  surplusRecordSchema
);