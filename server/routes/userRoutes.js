const express = require("express");

const {
  createUser,
  getUsers,
  updateUserStatus
} = require("../controllers/userController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

router.get(
  "/",
  protect,
  authorize("ADMIN"),
  getUsers
);

router.post(
  "/",
  protect,
  authorize("ADMIN"),
  createUser
);

router.patch(
  "/:id/status",
  protect,
  authorize("ADMIN"),
  updateUserStatus
);

module.exports = router;