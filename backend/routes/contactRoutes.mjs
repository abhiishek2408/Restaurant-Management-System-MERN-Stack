import express from "express";
import ContactMessage from "../models/contactMessage.mjs"; // <-- Import your model

const router = express.Router();

// =================== Contact Page ===================
router.post("/contact", async (req, res) => {
  const data = req.body;

  const name = (data.name || "").trim();
  const email = (data.email || "").trim();
  const phone = (data.phone || "").trim();
  const message = (data.message || "").trim();

  // Validation
  if (!name || !email || !phone || !message) {
    return res.status(400).json({
      success: false,
      message: "Please fill all required fields.",
    });
  }

  // ✅ Custom phone validation (only numbers, 10 digits example)
  if (!/^\d{10}$/.test(phone)) {
    return res.status(400).json({
      success: false,
      message: "Phone must be a valid 10-digit number.",
    });
  }

  try {
    await ContactMessage.create({
      name,
      email,
      phone,
      message,
      submitted_at: new Date().toISOString(),
    });

    res.json({
      success: true,
      message: "Your message has been submitted successfully.",
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      message: "Something went wrong.",
      error: err.message,
    });
  }
});

export default router;
