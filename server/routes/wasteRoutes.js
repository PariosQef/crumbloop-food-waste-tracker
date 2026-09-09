const express = require("express");

const {
  createWasteRecord,
  getWasteRecords
} = require("../controllers/wasteController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("KITCHEN_STAFF", "ADMIN"),
  createWasteRecord
);

router.get(
  "/",
  protect,
  authorize("ADMIN", "MANAGEMENT"),
  getWasteRecords
);

module.exports = router;