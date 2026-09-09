const express = require("express");

const {
  createSurplusRecord,
  getSurplusRecords,
  updateSurplusStatus
} = require("../controllers/surplusController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("KITCHEN_STAFF", "ADMIN"),
  createSurplusRecord
);

router.get(
  "/",
  protect,
  authorize("ADMIN", "MANAGEMENT"),
  getSurplusRecords
);

router.patch(
  "/:id/status",
  protect,
  authorize("ADMIN"),
  updateSurplusStatus
);

module.exports = router;