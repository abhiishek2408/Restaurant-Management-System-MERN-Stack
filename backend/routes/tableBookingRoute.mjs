import express from "express";
import TableBooking from "../models/TableBooking.mjs";

const router = express.Router();

// POST /api/book/table
router.post("/table", async (req, res) => {
  try {
    const {
      user_id,
      first_name,
      last_name,
      email,
      phone,
      event_type,
      event_date,
      message,
    } = req.body;

    // Basic validation
    if (!user_id || !first_name || !last_name || !email || !event_type || !event_date) {
      return res.status(400).json({
        status: "error",
        message: "Required fields are missing."
      });
    }

    const newBooking = new TableBooking({
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

    await newBooking.save();

    return res.status(201).json({
      status: "success",
      message: "Your table booking has been submitted successfully!"
    });

  } catch (err) {
    console.error("Table booking error:", err);
    return res.status(500).json({
      status: "error",
      message: "Something went wrong while submitting your booking."
    });
  }
});

export default router;
