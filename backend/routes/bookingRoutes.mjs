import express from "express";
import Occasion from "../models/occasion.mjs"; // adjust path
import TableBooking from "../models/TableBooking.mjs";
import mongoose from "mongoose";

const router = express.Router();

// POST /api/book/occasion
router.post("/occasion", async (req, res) => {
  try {
    const {
      user_id,
      first_name,
      last_name,
      email,
      phone,
      event_type,
      event_date,
      message
    } = req.body;

    // Basic validation
    if (
      !user_id ||
      !first_name ||
      !last_name ||
      !email ||
      !event_type ||
      !event_date
    ) {
      return res.status(400).json({
        status: "error",
        message: "Required fields are missing."
      });
    }

    const newOccasion = new Occasion({
      user_id,
      first_name: first_name.trim(),
      last_name: last_name.trim(),
      email: email.toLowerCase().trim(),
      phone: phone ? phone.trim() : "",
      event_type: event_type.trim(),
      event_date: event_date.trim(),
      message: message ? message.trim() : "",
      created_at: new Date().toISOString(),
      state: "active"
    });

    await newOccasion.save();

    return res.status(201).json({
      status: "success",
      message: "Your occasion has been booked successfully!"
    });
  } catch (err) {
    console.error("Occasion booking error:", err);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong while booking the occasion."
    });
  }
});



router.post("/my-bookings", async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id || !mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ success: false, message: "Invalid user_id" });
    }

    const tableBookings = await TableBooking.find({ user_id }).sort({ created_at: -1 });
    const occasions = await Occasion.find({ user_id }).sort({ created_at: -1 });

    res.json({ success: true, tableBookings, occasions });
  } catch (err) {
    console.error("Fetch user bookings error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
