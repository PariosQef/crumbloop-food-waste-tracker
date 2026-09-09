const SurplusRecord = require("../models/SurplusRecord");

const getSurplusSummary = async (req, res) => {
  try {
    const records = await SurplusRecord.find();

    const totalSurplusKg = records.reduce(
      (sum, record) => sum + record.weightKg,
      0
    );

    const donatedKg = records
      .filter((record) => record.status === "DONATED")
      .reduce((sum, record) => sum + record.weightKg, 0);

    const availableKg = records
      .filter((record) => record.status === "AVAILABLE")
      .reduce((sum, record) => sum + record.weightKg, 0);

    const reservedKg = records
      .filter((record) => record.status === "RESERVED")
      .reduce((sum, record) => sum + record.weightKg, 0);

    const expiredKg = records
      .filter((record) => record.status === "EXPIRED")
      .reduce((sum, record) => sum + record.weightKg, 0);

    const donationRate =
      totalSurplusKg > 0
        ? (donatedKg / totalSurplusKg) * 100
        : 0;

    res.status(200).json({
      totalSurplusKg,
      donatedKg,
      availableKg,
      reservedKg,
      expiredKg,
      donationRate: Number(donationRate.toFixed(2))
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to retrieve surplus analytics"
    });
  }
};

module.exports = {
  getSurplusSummary
};