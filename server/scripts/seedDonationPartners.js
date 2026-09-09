require("dotenv").config();

const mongoose = require("mongoose");

const DonationPartner = require(
  "../models/DonationPartner"
);

const partners = [
  {
    name: "Community Food Bank",
    organisationType: "FOOD_BANK",

    acceptedCategories: [
      "Vegetables",
      "Bakery",
      "Fruit"
    ],

    capacityKg: 100,
    currentLoadKg: 35,

    distanceKm: 2.1,

    estimatedPickupMinutes: 25,

    reliabilityScore: 94,

    active: true,
    acceptingDonations: true
  },

  {
    name: "City Community Kitchen",
    organisationType:
      "COMMUNITY_KITCHEN",

    acceptedCategories: [
      "Vegetables",
      "Bakery",
      "Prepared Meals"
    ],

    capacityKg: 60,
    currentLoadKg: 20,

    distanceKm: 4.2,

    estimatedPickupMinutes: 40,

    reliabilityScore: 88,

    active: true,
    acceptingDonations: true
  },

  {
    name: "Local Shelter Kitchen",
    organisationType: "SHELTER",

    acceptedCategories: [
      "Bakery",
      "Prepared Meals"
    ],

    capacityKg: 35,
    currentLoadKg: 10,

    distanceKm: 7,

    estimatedPickupMinutes: 55,

    reliabilityScore: 82,

    active: true,
    acceptingDonations: true
  }
];

const seed = async () => {
  try {
    await mongoose.connect(
      process.env.MONGO_URI
    );

    console.log("MongoDB connected");

    await DonationPartner.deleteMany();

    await DonationPartner.insertMany(
      partners
    );

    console.log(
      "Donation partners created"
    );

    process.exit(0);
  } catch (error) {
    console.error(error);

    process.exit(1);
  }
};

seed();