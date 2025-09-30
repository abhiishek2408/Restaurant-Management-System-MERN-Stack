import express from "express";
import EventBooking from "../models/EventBooking.js";
import EventDetails from "../models/EventDetails.js";
import EventResource from "../models/EventResource.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

/**
 * Create a booking
 * POST /booking
 * body: { userId, eventId, attendees, resourceIds }
 */
router.post("/", async (req, res) => {
  try {
    const { userId, eventId, attendees, resourceIds, date } = req.body;

    // 1. Check event exists
    const event = await EventDetails.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // 2. Validate date
    if (!date) return res.status(400).json({ error: "Date is required" });


    // ✅ 3. Check if ANY booking exists for this event on the same date
    const existingBooking = await EventBooking.findOne({
      event: eventId,
      date,
      status: { $in: ["confirmed", "pending"] },
    });

    if (existingBooking) {
      return res
        .status(400)
        .json({ error: "This event is already booked for the selected date." });
    }

    
    // 3. Check capacity
    const totalBookedAgg = await EventBooking.aggregate([
      { $match: { event: event._id, date, status: "confirmed" } },
      { $group: { _id: null, sum: { $sum: "$attendees" } } },
    ]);
    const booked = totalBookedAgg[0]?.sum || 0;
    if (booked + attendees > event.maxAttendees)
      return res.status(400).json({ error: "Not enough seats available" });

    // 3. Calculate charges
    let resourceCharge = 0;
    let resources = [];
    if (resourceIds && resourceIds.length > 0) {
      resources = await EventResource.find({ _id: { $in: resourceIds } });
      resourceCharge = resources.reduce((acc, r) => acc + r.price, 0);
    }

    const totalCharge = event.pricePerAttendee * attendees + resourceCharge;

    // 4. Create booking
    const booking = await EventBooking.create({
      user: userId,
      event: eventId,
      date, // ✅ Store selected date
      attendees,
      totalCharge,
      status: "confirmed",
      resources: resources.map(r => r._id),
    });

    res.status(201).json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});




router.get("/resources/:eventId", async (req, res) => {
  try {
    const { eventId } = req.params;

    // Check if event exists
    const event = await EventDetails.findById(eventId);
    if (!event) return res.status(404).json({ error: "Event not found" });

    // Fetch resources associated with this event
    const resources = await EventResource.find({ bookings: { $ne: eventId } }); 
    // If you want all resources regardless of booking, use: EventResource.find()

    res.json(resources);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});


// Get logged-in user's event bookings
router.get("/my-bookings", authMiddleware, async (req, res) => {
  try {
    const bookings = await EventBooking.find({ user: req.user._id })
      .populate("event")
      .populate("resources")
      .lean();

    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});




export default router;
