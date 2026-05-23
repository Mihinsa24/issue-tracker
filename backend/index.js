const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: [
    "http://localhost:5173",
    "https://tracer-app.netlify.app"
  ],
  credentials: true,
}));
app.use(express.json());

// Routes
const authRoutes = require("./routes/auth");
const issueRoutes = require("./routes/issues");

app.use("/api/auth", authRoutes);
app.use("/api/issues", issueRoutes);

// Health check
app.get("/", (req, res) => {
  res.send("Issue Tracker API is running!");
});

// Connect to MongoDB and start server
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log(" Connected to MongoDB");
    app.listen(process.env.PORT, () => {
      console.log(`Server running on port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error("MongoDB connection failed:", err.message);
  });