const Issue = require("../models/Issue");

// Create a new issue and attach the current user as creator.
const createIssue = async (req, res) => {
  try {
    const { title, description, priority, severity } = req.body;

    const issue = await Issue.create({
      title,
      description,
      priority,
      severity,
      createdBy: req.user.id,
      activityLog: [{ message: "Issue created", by: req.user.email }],
    });

    res.status(201).json(issue);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Retrieve issues with optional search, filtering, and pagination.
const getIssues = async (req, res) => {
  try {
    const { search, priority, status, page = 1, limit = 10 } = req.query;

    // Build query object only for provided filters.
    const query = {};
    if (search) query.title = { $regex: search, $options: "i" };
    if (priority) query.priority = priority;
    if (status) query.status = status;

    const total = await Issue.countDocuments(query);
    const issues = await Issue.find(query)
      .populate("createdBy", "name email")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));

    res.status(200).json({
      issues,
      total,
      page: Number(page),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Return a single issue by ID, including creator details.
const getIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id).populate(
      "createdBy",
      "name email"
    );

    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.status(200).json(issue);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Update issue fields and record key changes in the activity log.
const updateIssue = async (req, res) => {
  try {
    const issue = await Issue.findById(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    const { title, description, priority, severity, status } = req.body;

    if (status && status !== issue.status) {
      issue.activityLog.push({
        message: `Status changed from ${issue.status} to ${status}`,
        by: req.user.email,
      });
    }

    if (priority && priority !== issue.priority) {
      issue.activityLog.push({
        message: `Priority changed from ${issue.priority} to ${priority}`,
        by: req.user.email,
      });
    }

    issue.title = title || issue.title;
    issue.description = description || issue.description;
    issue.priority = priority || issue.priority;
    issue.severity = severity || issue.severity;
    issue.status = status || issue.status;

    await issue.save();
    res.status(200).json(issue);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Delete an issue by ID.
const deleteIssue = async (req, res) => {
  try {
    const issue = await Issue.findByIdAndDelete(req.params.id);
    if (!issue) {
      return res.status(404).json({ message: "Issue not found" });
    }

    res.status(200).json({ message: "Issue deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Aggregate issue counts grouped by status.
const getIssueCounts = async (req, res) => {
  try {
    const counts = await Issue.aggregate([
      { $group: { _id: "$status", count: { $sum: 1 } } },
    ]);

    res.status(200).json(counts);
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = {
  createIssue,
  getIssues,
  getIssue,
  updateIssue,
  deleteIssue,
  getIssueCounts,
};