const mongoose = require("mongoose");

const activitySchema = new mongoose.Schema({
  message: String,
  by: String,
  at: { type: Date, default: Date.now },
});

const issueSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Open", "In Progress", "Resolved", "Closed"],
      default: "Open",
    },
    priority: {
      type: String,
      enum: ["Low", "Medium", "High"],
      default: "Medium",
    },
    severity: {
      type: String,
      enum: ["Minor", "Major", "Critical"],
      default: "Minor",
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    activityLog: [activitySchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Issue", issueSchema);