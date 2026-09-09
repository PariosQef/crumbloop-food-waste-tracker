const DonationPartner = require(
  "../models/DonationPartner"
);

const {
  trainModel,
  predictDonationSuccess
} = require(
  "./mlDonationRecommendationService"
);

// =========================================
// ELIGIBILITY + EXPLANATION
// =========================================

const evaluatePartner = (
  partner,
  surplusRecord,
  modelWeights
) => {
  const reasons = [];

  const foodCategory =
    surplusRecord.foodItem?.category;

  const availableCapacity =
    partner.capacityKg -
    partner.currentLoadKg;

  const now = new Date();

  const availableUntil =
    new Date(
      surplusRecord.availableUntil
    );

  const minutesRemaining =
    (availableUntil - now) / 60000;

  // =========================================
  // HARD ELIGIBILITY RULES
  // =========================================

  const acceptsFoodCategory =
    partner.acceptedCategories.includes(
      foodCategory
    );

  const hasEnoughCapacity =
    availableCapacity >=
    surplusRecord.weightKg;

  const canCollectBeforeDeadline =
    partner.estimatedPickupMinutes <=
    minutesRemaining;

  // =========================================
  // EXPLANATION REASONS
  // =========================================

  if (acceptsFoodCategory) {
    reasons.push(
      `Accepts ${foodCategory.toLowerCase()} products`
    );
  }

  if (hasEnoughCapacity) {
    reasons.push(
      "Has enough capacity for this donation"
    );
  }

  if (canCollectBeforeDeadline) {
    reasons.push(
      "Can collect before the availability deadline"
    );
  }

  if (partner.distanceKm <= 2) {
    reasons.push(
      "Very close to the donation site"
    );
  } else if (
    partner.distanceKm <= 5
  ) {
    reasons.push(
      "Within a short collection distance"
    );
  } else if (
    partner.distanceKm <= 10
  ) {
    reasons.push(
      "Within the configured collection area"
    );
  }

  if (
    partner.reliabilityScore >= 90
  ) {
    reasons.push(
      "High previous collection reliability"
    );
  } else if (
    partner.reliabilityScore >= 80
  ) {
    reasons.push(
      "Good previous collection reliability"
    );
  }

  // =========================================
  // MACHINE-LEARNING PREDICTION
  // =========================================

  const aiSuccessProbability =
    predictDonationSuccess(
      modelWeights,
      {
        surplusWeightKg:
          surplusRecord.weightKg,

        distanceKm:
          partner.distanceKm,

        estimatedPickupMinutes:
          partner
            .estimatedPickupMinutes,

        availableCapacityKg:
          availableCapacity,

        reliabilityScore:
          partner.reliabilityScore
      }
    );

  return {
    partner,

    // Genuine ML prediction.
    aiSuccessProbability,

    /*
      Keep "score" temporarily for
      backwards compatibility with the
      existing controller/frontend.

      It now represents the ML predicted
      success probability, NOT the old
      manually weighted score.
    */
    score: aiSuccessProbability,

    reasons,

    availableCapacity,

    acceptsFoodCategory,

    hasEnoughCapacity,

    canCollectBeforeDeadline
  };
};

// =========================================
// AI DONATION RECOMMENDATION
// =========================================

const recommendDonationPartners =
  async (surplusRecord) => {
    // Train logistic regression using the
    // historical DonationOutcome dataset.
    const model = await trainModel();

    const partners =
      await DonationPartner.find({
        active: true,
        acceptingDonations: true
      });

    const results = partners

      // =====================================
      // HARD FILTER 1:
      // food category compatibility
      // =====================================

      .filter((partner) =>
        partner.acceptedCategories.includes(
          surplusRecord.foodItem?.category
        )
      )

      // =====================================
      // RUN ML PREDICTION
      // =====================================

      .map((partner) =>
        evaluatePartner(
          partner,
          surplusRecord,
          model.weights
        )
      )

      // =====================================
      // HARD FILTER 2:
      // sufficient capacity
      // =====================================

      .filter(
        (result) =>
          result.hasEnoughCapacity
      )

      // =====================================
      // HARD FILTER 3:
      // collection before deadline
      // =====================================

      .filter(
        (result) =>
          result
            .canCollectBeforeDeadline
      )

      // =====================================
      // AI RANKING
      // =====================================

      .sort((a, b) => {
        // 1. Highest ML predicted
        // donation success probability.
        if (
          b.aiSuccessProbability !==
          a.aiSuccessProbability
        ) {
          return (
            b.aiSuccessProbability -
            a.aiSuccessProbability
          );
        }

        // 2. Shortest distance.
        if (
          a.partner.distanceKm !==
          b.partner.distanceKm
        ) {
          return (
            a.partner.distanceKm -
            b.partner.distanceKm
          );
        }

        // 3. Fastest pickup.
        if (
          a.partner
            .estimatedPickupMinutes !==
          b.partner
            .estimatedPickupMinutes
        ) {
          return (
            a.partner
              .estimatedPickupMinutes -
            b.partner
              .estimatedPickupMinutes
          );
        }

        // 4. Highest reliability.
        if (
          a.partner
            .reliabilityScore !==
          b.partner
            .reliabilityScore
        ) {
          return (
            b.partner
              .reliabilityScore -
            a.partner
              .reliabilityScore
          );
        }

        // 5. Stable fallback.
        return (
          a.partner.name.localeCompare(
            b.partner.name
          )
        );
      });

    return results;
  };

module.exports = {
  recommendDonationPartners
};