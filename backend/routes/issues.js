const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth");
const {
  createIssue,
  getIssues,
  getIssue,
  updateIssue,
  deleteIssue,
  getIssueCounts,
} = require("../controllers/issueController");

router.use(protect); // All issue routes require login

router.get("/counts", getIssueCounts);
router.get("/", getIssues);
router.get("/:id", getIssue);
router.post("/", createIssue);
router.put("/:id", updateIssue);
router.delete("/:id", deleteIssue);

module.exports = router;