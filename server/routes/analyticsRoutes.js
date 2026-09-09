const express = require("express");

const {
  getSummary
} = require("../controllers/analyticsController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/summary",
  protect,
  authorize("ADMIN", "MANAGEMENT"),
  getSummary
);

module.exports = router;