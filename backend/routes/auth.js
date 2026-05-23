const express = require("express");
const router = express.Router();
const { register, login, verifyEmail, checkVerified } = require("../controllers/authController");
const { sendVerificationEmail } = require("../utils/emailService");

router.get("/test-email", async (req, res) => {
  try {
    await sendVerificationEmail(
      process.env.EMAIL_USER,
      "Test User",
      "test-token-123"
    );
    res.json({ message: "Email sent successfully!" });
  } catch (err) {
    res.json({ error: err.message });
  }
});

router.post("/register", register);
router.post("/login", login);
router.get("/verify-email", verifyEmail);
router.post("/check-verified", checkVerified);

module.exports = router;
