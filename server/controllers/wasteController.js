const mongoose = require("mongoose");
const FoodItem = require("../models/FoodItem");
const WasteRecord = require("../models/WasteRecord");

const createWasteRecord = async (req, res) => {
  try {
    const {
      foodItemId,
      weightKg,
      reason,
      station
    } = req.body;

    if (!foodItemId || !weightKg || !reason || !station) {
      return res.status(400).json({
        message: "foodItemId, weightKg, reason and station are required"
      });
    }

    if (!mongoose.Types.ObjectId.isValid(foodItemId)) {
      return res.status(400).json({
        message: "Invalid food item ID"
      });
    }

    if (Number(weightKg) <= 0) {
      return res.status(400).json({
        message: "Weight must be greater than zero"
      });
    }

    const foodItem = await FoodItem.findById(foodItemId);

    if (!foodItem || !foodItem.active) {
      return res.status(404).json({
        message: "Food item not found"
      });
    }

    const calculatedCost =
      Number(weightKg) * foodItem.costPerKg;

    const calculatedCO2e =
      Number(weightKg) * foodItem.co2ePerKg;

    const wasteRecord = await WasteRecord.create({
      foodItem: foodItem._id,
      weightKg: Number(weightKg),
      reason,
      station,
      costPerKgSnapshot: foodItem.costPerKg,
      co2ePerKgSnapshot: foodItem.co2ePerKg,
      calculatedCost,
      calculatedCO2e
    });

    const populatedRecord = await WasteRecord.findById(
      wasteRecord._id
    ).populate("foodItem", "name category");

    res.status(201).json(populatedRecord);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

const getWasteRecords = async (req, res) => {
  try {
    const records = await WasteRecord.find()
      .populate("foodItem", "name category")
      .sort({ createdAt: -1 });

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({
      message: "Unable to retrieve waste records"
    });
  }
};

module.exports = {
  createWasteRecord,
  getWasteRecords
};