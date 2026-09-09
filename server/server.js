const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const foodRoutes = require("./routes/foodRoutes");
const wasteRoutes = require("./routes/wasteRoutes");
const analyticsRoutes = require("./routes/analyticsRoutes");
const surplusRoutes = require("./routes/surplusRoutes");
const surplusAnalyticsRoutes = require("./routes/surplusAnalyticsRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const recommendationRoutes = require(
  "./routes/recommendationRoutes"
);

dotenv.config();

connectDB();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/foods", foodRoutes);
app.use("/api/waste", wasteRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/surplus", surplusRoutes);
app.use("/api/surplus-analytics", surplusAnalyticsRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use(
  "/api/recommendations",
  recommendationRoutes
);

app.get("/", (req, res) => {
  res.json({
    message: "CrumbLoop API is running"
  });
});

const PORT = process.env.PORT || 5050;

app.listen(PORT, () => {
  console.log(`CrumbLoop API running on port ${PORT}`);
});