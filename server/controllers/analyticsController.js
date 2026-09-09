const WasteRecord = require("../models/WasteRecord");

const getSummary = async (req, res) => {
  try {
    const summary = await WasteRecord.aggregate([
      {
        $group: {
          _id: null,
          totalWasteKg: { $sum: "$weightKg" },
          totalWasteCost: { $sum: "$calculatedCost" },
          totalCO2e: { $sum: "$calculatedCO2e" },
          totalWasteEvents: { $sum: 1 }
        }
      }
    ]);

    if (summary.length === 0) {
      return res.status(200).json({
        totalWasteKg: 0,
        totalWasteCost: 0,
        totalCO2e: 0,
        totalWasteEvents: 0
      });
    }

    res.status(200).json({
      totalWasteKg: summary[0].totalWasteKg,
      totalWasteCost: summary[0].totalWasteCost,
      totalCO2e: summary[0].totalCO2e,
      totalWasteEvents: summary[0].totalWasteEvents
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to retrieve analytics summary"
    });
  }
};

module.exports = {
  getSummary
};