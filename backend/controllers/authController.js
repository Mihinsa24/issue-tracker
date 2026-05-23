const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { sendVerificationEmail } = require("../utils/emailService");

// Register
const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate verification token
    const verificationToken = crypto.randomBytes(32).toString("hex");
    const verificationTokenExpiry = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      verificationToken,
      verificationTokenExpiry,
    });

    console.log("Created user token:", user.verificationToken); // Add this
    console.log("Token expiry:", user.verificationTokenExpiry); // Add this

    // Send verification email
    await sendVerificationEmail(email, name, verificationToken);

    res.status(201).json({
      message: "Registration successful! Please check your email to verify your account.",
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

// Verify Email
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;
    
    console.log("Token received:", token); // Add this

    const user = await User.findOne({
      verificationToken: token,
      verificationTokenExpiry: { $gt: new Date() },
    });

    console.log("User found:", user); // Add this

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired verification link" });
    }

    user.isVerified = true;
    user.verificationToken = undefined;
    user.verificationTokenExpiry = undefined;
    await user.save();

    res.status(200).json({ message: "Email verified successfully! You can now log in." });
  } catch (err) {
    console.log("Error:", err.message); // Add this
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const checkVerified = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });
    res.status(200).json({ isVerified: user.isVerified });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

// Login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Check if verified
    if (!user.isVerified) {
      return res.status(401).json({ message: "Please verify your email before logging in" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

module.exports = { register, login, verifyEmail, checkVerified };