import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  phone: String,
  address: String,
  bio: String,
  role: { type: String, default: "customer" },
  profileImg: { type: String },
  verified: { type: Boolean, default: false },
  otp: String,
  otpExpires: Date,
  resetToken: String,
  resetTokenExpires: Date,
}, { timestamps: true });

export default mongoose.model("User", userSchema);
