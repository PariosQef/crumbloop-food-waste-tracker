const bcrypt = require("bcryptjs");
const User = require("../models/User");

const createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role
    } = req.body;

    if (!name || !email || !password || !role) {
      return res.status(400).json({
        message: "Name, email, password and role are required"
      });
    }

    const allowedRoles = [
      "KITCHEN_STAFF",
      "ADMIN",
      "MANAGEMENT"
    ];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        message: "Invalid user role"
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        message: "Password must be at least 8 characters"
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase()
    });

    if (existingUser) {
      return res.status(409).json({
        message: "A user with this email already exists"
      });
    }

    const passwordHash = await bcrypt.hash(password, 12);

    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role
    });

    res.status(201).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active,
        createdAt: user.createdAt
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to create user"
    });
  }
};

const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-passwordHash")
      .sort({ createdAt: -1 });

    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({
      message: "Unable to retrieve users"
    });
  }
};

const updateUserStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { active } = req.body;

    if (typeof active !== "boolean") {
      return res.status(400).json({
        message: "Active status must be true or false"
      });
    }

    if (req.user._id.toString() === id && active === false) {
      return res.status(400).json({
        message: "You cannot deactivate your own admin account"
      });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.active = active;

    await user.save();

    res.status(200).json({
      message: active
        ? "User reactivated successfully"
        : "User deactivated successfully",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        active: user.active
      }
    });
  } catch (error) {
    res.status(500).json({
      message: "Unable to update user status"
    });
  }
};

module.exports = {
  createUser,
  getUsers,
  updateUserStatus
};