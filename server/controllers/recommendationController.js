const mongoose = require("mongoose");

const SurplusRecord = require(
  "../models/SurplusRecord"
);

const {
  recommendDonationPartners
} = require(
  "../services/donationRecommendationService"
);

// =========================================
// GET AI DONATION RECOMMENDATION
// =========================================

const getDonationRecommendation =
  async (req, res) => {
    try {
      const { id } = req.params;

      // =====================================
      // VALIDATE SURPLUS ID
      // =====================================

      if (
        !mongoose.Types.ObjectId.isValid(id)
      ) {
        return res.status(400).json({
          message:
            "Invalid surplus record ID"
        });
      }

      // =====================================
      // LOAD SURPLUS RECORD
      // =====================================

      const surplus =
        await SurplusRecord.findById(id)
          .populate(
            "foodItem",
            "name category"
          );

      if (!surplus) {
        return res.status(404).json({
          message:
            "Surplus record not found"
        });
      }

      // =====================================
      // ONLY AVAILABLE SURPLUS CAN
      // RECEIVE RECOMMENDATIONS
      // =====================================

      if (
        surplus.status !== "AVAILABLE"
      ) {
        return res.status(400).json({
          message:
            "Recommendations are only available for AVAILABLE surplus"
        });
      }

      // =====================================
      // CHECK EXPIRY
      // =====================================

      if (
        new Date(
          surplus.availableUntil
        ) <= new Date()
      ) {
        return res.status(400).json({
          message:
            "This surplus record has expired"
        });
      }

      // =====================================
      // RUN HYBRID AI RECOMMENDATION
      // =====================================

      const recommendations =
        await recommendDonationPartners(
          surplus
        );

      // =====================================
      // NO SUITABLE PARTNER
      // =====================================

      if (
        recommendations.length === 0
      ) {
        return res.status(200).json({
          surplus: {
            id: surplus._id,

            foodItem:
              surplus.foodItem,

            weightKg:
              surplus.weightKg,

            availableUntil:
              surplus.availableUntil
          },

          aiModel: {
            type:
              "LOGISTIC_REGRESSION",

            rankingMetric:
              "PREDICTED_DONATION_SUCCESS",

            humanOversight: true
          },

          recommendedPartner: null,

          alternatives: [],

          message:
            "No suitable donation partner is currently available"
        });
      }

      const [best, ...alternatives] =
        recommendations;

      // =====================================
      // RESPONSE
      // =====================================

      res.status(200).json({
        surplus: {
          id: surplus._id,

          foodItem:
            surplus.foodItem,

          weightKg:
            surplus.weightKg,

          availableUntil:
            surplus.availableUntil
        },

        // ===================================
        // AI MODEL INFORMATION
        // ===================================

        aiModel: {
          type:
            "LOGISTIC_REGRESSION",

          rankingMetric:
            "PREDICTED_DONATION_SUCCESS",

          humanOversight: true,

          description:
            "Eligible donation partners are ranked using a logistic regression model that predicts the probability of successful donation collection."
        },

        // ===================================
        // BEST AI RECOMMENDATION
        // ===================================

        recommendedPartner: {
          id:
            best.partner._id,

          name:
            best.partner.name,

          organisationType:
            best.partner
              .organisationType,

          aiSuccessProbability:
            best.aiSuccessProbability,

          distanceKm:
            best.partner.distanceKm,

          estimatedPickupMinutes:
            best.partner
              .estimatedPickupMinutes,

          reasons:
            best.reasons
        },

        // ===================================
        // ALTERNATIVE AI RECOMMENDATIONS
        // ===================================

        alternatives: alternatives
          .slice(0, 3)
          .map((result) => ({
            id:
              result.partner._id,

            name:
              result.partner.name,

            organisationType:
              result.partner
                .organisationType,

            aiSuccessProbability:
              result.aiSuccessProbability,

            distanceKm:
              result.partner
                .distanceKm,

            estimatedPickupMinutes:
              result.partner
                .estimatedPickupMinutes,

            reasons:
              result.reasons
          }))
      });
    } catch (error) {
      console.error(
        "AI recommendation error:",
        error
      );

      res.status(500).json({
        message:
          "Unable to generate AI donation recommendation"
      });
    }
  };

module.exports = {
  getDonationRecommendation
};