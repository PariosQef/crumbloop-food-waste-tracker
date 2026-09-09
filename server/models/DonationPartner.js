const mongoose = require("mongoose");

const donationPartnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },

    organisationType: {
      type: String,
      enum: [
        "FOOD_BANK",
        "COMMUNITY_KITCHEN",
        "SHELTER",
        "CHARITY"
      ],
      required: true
    },

    acceptedCategories: {
      type: [String],
      default: []
    },

    capacityKg: {
      type: Number,
      required: true,
      min: 0
    },

    currentLoadKg: {
      type: Number,
      default: 0,
      min: 0
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

    active: {
      type: Boolean,
      default: true
    },

    acceptingDonations: {
      type: Boolean,
      default: true
    },

    reliabilityScore: {
      type: Number,
      min: 0,
      max: 100,
      default: 80
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model(
  "DonationPartner",
  donationPartnerSchema
);