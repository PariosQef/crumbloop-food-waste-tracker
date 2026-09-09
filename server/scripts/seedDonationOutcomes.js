require("dotenv").config();

const mongoose = require("mongoose");

const DonationPartner = require(
  "../models/DonationPartner"
);

const DonationOutcome = require(
  "../models/DonationOutcome"
);

const randomBetween = (
  minimum,
  maximum
) => {
  return (
    Math.random() *
      (maximum - minimum) +
    minimum
  );
};

const seed = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log("MongoDB connected");

    const partners =
      await DonationPartner.find({
        active: true
      });

    if (partners.length === 0) {
      throw new Error(
        "No donation partners found."
      );
    }

    // Only remove synthetic records.
    await DonationOutcome.deleteMany({
      dataSource: "SYNTHETIC"
    });

    const records = [];

    for (let i = 0; i < 120; i += 1) {
      const partner =
        partners[
          Math.floor(
            Math.random() *
              partners.length
          )
        ];

      const weightKg =
        randomBetween(1, 35);

      const distanceKm =
        Math.max(
          0.5,
          partner.distanceKm +
            randomBetween(-1, 2)
        );

      const pickupMinutes =
        Math.max(
          10,
          partner.estimatedPickupMinutes +
            randomBetween(-10, 30)
        );

      const availableCapacityKg =
        Math.max(
          5,
          partner.capacityKg -
            partner.currentLoadKg +
            randomBetween(-15, 15)
        );

      const reliabilityScore =
        Math.min(
          100,
          Math.max(
            40,
            partner.reliabilityScore +
              randomBetween(-10, 5)
          )
        );

      /*
        Used ONLY to generate synthetic
        historical prototype observations.

        Better conditions create a greater
        probability of success.
      */

      let successProbability = 0.5;

      if (distanceKm <= 3) {
        successProbability += 0.15;
      }

      if (pickupMinutes <= 45) {
        successProbability += 0.15;
      }

      if (
        availableCapacityKg >= weightKg
      ) {
        successProbability += 0.1;
      } else {
        successProbability -= 0.3;
      }

      if (reliabilityScore >= 85) {
        successProbability += 0.15;
      }

      successProbability =
        Math.max(
          0.05,
          Math.min(
            0.95,
            successProbability
          )
        );

      const successful =
        Math.random() <
        successProbability
          ? 1
          : 0;

      records.push({
        foodCategory:
          i % 2 === 0
            ? "Vegetables"
            : "Bakery",

        surplusWeightKg: weightKg,

        partnerId: partner._id,

        distanceKm,

        estimatedPickupMinutes:
          pickupMinutes,

        availableCapacityKg,

        reliabilityScore,

        successful,

        dataSource: "SYNTHETIC"
      });
    }

    await DonationOutcome.insertMany(
      records
    );

    console.log(
      `Created ${records.length} synthetic donation outcomes`
    );

    process.exit(0);
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

seed();