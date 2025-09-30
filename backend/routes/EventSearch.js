import express from "express";
import EventDetails from "../models/EventDetails.js";
import EventVenue from "../models/EventVenue.js";

const router = express.Router();

/**
 * Search events by:
 * - date
 * - venue
 */
router.get("/", async (req, res) => {
  try {
    const { date, venueId, minAttendees, maxAttendees } = req.query;

    let query = {};

    if (date) {
      // Only events on the selected date
      query.date = new Date(date);
    }

    if (venueId) {
      query.venue = venueId;
    }

    if (minAttendees || maxAttendees) {
      query.maxAttendees = {};
      if (minAttendees) query.maxAttendees.$gte = parseInt(minAttendees);
      if (maxAttendees) query.maxAttendees.$lte = parseInt(maxAttendees);
    }

    const events = await EventDetails.find(query)
      .populate("venue")
      .lean();

    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

export default router;
