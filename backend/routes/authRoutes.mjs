import express from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import crypto from "crypto";
import User from "../models/User.mjs";
import sendEmail from "../utils/sendEmail.mjs";

const router = express.Router();

const upload = multer({ dest: "uploads/" });

router.post("/register", upload.single("profileImg"), async (req, res) => {
  try {
    const { username, email, password, confirmPassword, phone, address, bio } = req.body;

    if (password !== confirmPassword)
      return res
        .status(400)
        .json({ success: false, error: "Passwords do not match" });

    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    
    if (existingUser)
      return res
        .status(400)
        .json({ success: false, error: "Username or Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const user = await User.create({
      username,
      email,
      password: hashedPassword,
      phone,
      address,
      bio,
      profileImg: req.file?.filename || null,
      otp,
      otpExpires: Date.now() + 10 * 60 * 1000, // 10 min expiry
    });

    const verifyLink = `${process.env.FRONTEND_URL}/verify/${user._id}`;
    await sendEmail(
      email,
      "Verify your account",
      `<h3>Your OTP: ${otp}</h3><p>Or click <a href="${verifyLink}">here</a> to verify.</p>`
    );

    res.json({
      success: true,
      message: "User registered. Please verify your email.",
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { userId, otp } = req.body;
    const user = await User.findById(userId);

    if (!user)
      return res.status(404).json({ success: false, error: "User not found" });
    if (user.otp !== otp || Date.now() > user.otpExpires)
      return res
        .status(400)
        .json({ success: false, error: "Invalid or expired OTP" });

    user.verified = true;
    user.otp = null;
    user.otpExpires = null;
    await user.save();

    res.json({ success: true, message: "Account verified successfully" });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});



router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ success: false, error: "User not found" });
    if (!user.verified)
      return res
        .status(403)
        .json({ success: false, error: "Please verify your account first" });
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res
        .status(400)
        .json({ success: false, error: "Invalid credentials" });
    const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10d",
    });
    res.cookie("token", token, { httpOnly: true });
    res.json({
      success: true,
      message: "Login successful",
      token,
      user: { _id: user._id, email: user.email, phone: user.phone, address: user.address },
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});



router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully" });
});

router.post("/forgot-password", async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user)
      return res.status(404).json({ success: false, error: "User not found" });

    const resetToken = crypto.randomBytes(32).toString("hex");
    user.resetToken = resetToken;
    user.resetTokenExpires = Date.now() + 15 * 60 * 1000; // 15 min
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;
    await sendEmail(
      email,
      "Password Reset",
      `<p>Click <a href="${resetLink}">here</a> to reset password.</p>`
    );

    res.json({ success: true, message: "Password reset link sent to email." });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export default router;
