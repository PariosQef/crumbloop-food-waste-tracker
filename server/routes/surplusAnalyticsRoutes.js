const express = require("express");

const {
  getSurplusSummary
} = require("../controllers/surplusAnalyticsController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/summary",
  protect,
  authorize("ADMIN", "MANAGEMENT"),
  getSurplusSummary
);

module.exports = router;