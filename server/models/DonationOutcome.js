const mongoose = require("mongoose");

const donationOutcomeSchema = new mongoose.Schema(
  {
    foodCategory: {
      type: String,
      required: true
    },

    surplusWeightKg: {
      type: Number,
      required: true,
      min: 0
    },

    partnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "DonationPartner",
      required: true
    },

    distanceKm: {
      type: Number,
      required: true,
      min: 0
    },

    estimatedPickupMinutes: {
      type: Number,
      required: true,
      min: 0
    },

    availableCapacityKg: {
      type: Number,
      required: true,
      min: 0
    },

    reliabilityScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100
    },

    // 1 = successful collection
    // 0 = unsuccessful collection
    successful: {
      type: Number,
      enum: [0, 1],
      required: true
    },

    dataSource: {
      type: String,
      enum: ["REAL", "SYNTHETIC"],
      default: "REAL"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "DonationOutcome",
  donationOutcomeSchema
);