const express = require("express");

const {
  getDonationRecommendation
} = require(
  "../controllers/recommendationController"
);

const {
  protect,
  authorize
} = require(
  "../middleware/authMiddleware"
);

const router = express.Router();

router.get(
  "/surplus/:id",
  protect,
  authorize("ADMIN", "MANAGEMENT"),
  getDonationRecommendation
);

module.exports = router;