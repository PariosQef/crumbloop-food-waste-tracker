const mongoose = require("mongoose");
const FoodItem = require("../models/FoodItem");
const SurplusRecord = require("../models/SurplusRecord");

const createSurplusRecord = async (req, res) => {
  try {
    const {
      foodItemId,
      weightKg,
      station,
      availableUntil,
      storageInstructions
    } = req.body;

    if (
      !foodItemId ||
      !weightKg ||
      !station ||
      !availableUntil
    ) {
      return res.status(400).json({
        message:
          "foodItemId, weightKg, station and availableUntil are required"
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

    const surplusRecord = await SurplusRecord.create({
      foodItem: foodItem._id,
      weightKg: Number(weightKg),
      station,
      availableUntil,
      storageInstructions
    });

    const populatedRecord =
      await SurplusRecord.findById(
        surplusRecord._id
      ).populate("foodItem", "name category");

    res.status(201).json(populatedRecord);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

const getSurplusRecords = async (req, res) => {
  try {
    const records = await SurplusRecord.find()
      .populate("foodItem", "name category")
      .sort({ createdAt: -1 });

    res.status(200).json(records);
  } catch (error) {
    res.status(500).json({
      message: "Unable to retrieve surplus records"
    });
  }
};

const updateSurplusStatus = async (req, res) => {
  try {
    const { status, donationOrganisation } = req.body;

    const allowedStatuses = [
      "AVAILABLE",
      "RESERVED",
      "DONATED",
      "EXPIRED",
      "CANCELLED"
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid surplus status"
      });
    }

    const record = await SurplusRecord.findById(
      req.params.id
    );

    if (!record) {
      return res.status(404).json({
        message: "Surplus record not found"
      });
    }

    record.status = status;

    if (donationOrganisation !== undefined) {
      record.donationOrganisation =
        donationOrganisation;
    }

    await record.save();

    const populatedRecord =
      await SurplusRecord.findById(
        record._id
      ).populate("foodItem", "name category");

    res.status(200).json(populatedRecord);
  } catch (error) {
    res.status(400).json({
      message: error.message
    });
  }
};

module.exports = {
  createSurplusRecord,
  getSurplusRecords,
  updateSurplusStatus
};