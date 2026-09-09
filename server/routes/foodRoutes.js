const express = require("express");
const FoodItem = require("../models/FoodItem");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("ADMIN"),
  async (req, res) => {
    try {
      const {
        name,
        category,
        costPerKg,
        co2ePerKg,
        unit
      } = req.body;

      const foodItem = await FoodItem.create({
        name,
        category,
        costPerKg,
        co2ePerKg,
        unit
      });

      res.status(201).json(foodItem);
    } catch (error) {
      res.status(400).json({
        message: error.message
      });
    }
  }
);

router.get(
  "/",
  protect,
  authorize("KITCHEN_STAFF", "ADMIN", "MANAGEMENT"),
  async (req, res) => {
    try {
      const foodItems = await FoodItem.find({
        active: true
      }).sort({ name: 1 });

      res.json(foodItems);
    } catch (error) {
      res.status(500).json({
        message: error.message
      });
    }
  }
);

module.exports = router;