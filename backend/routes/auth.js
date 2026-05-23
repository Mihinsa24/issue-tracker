const express = require("express");
const router = express.Router();
const { register, login, verifyEmail, checkVerified } = require("../controllers/authController");

// Authentication routes for registration, login, and email verification.
router.post("/register", register);
router.post("/login", login);
router.get("/verify-email", verifyEmail);
router.post("/check-verified", checkVerified);

module.exports = router;
