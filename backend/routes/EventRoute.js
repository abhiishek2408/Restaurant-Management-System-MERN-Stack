import express from "express";
import EventDetails from "../models/EventDetails.js";
import EventVenue from "../models/EventVenue.js";

const router = express.Router();

/**
 * Create event
 */
router.post("/", async (req, res) => {
  try {
    const event = await EventDetails.create(req.body);
    res.status(201).json(event);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});

/**
 * Get all events
 */
router.get("/", async (req, res) => {
  try {
    const events = await EventDetails.find().populate("venue");
    res.json(events);
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
});

/**
 * Get all venues
 */
router.get("/venues", async (req, res) => {
  try {
    const venues = await EventVenue.find();
    res.json(venues);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});


// Search events by date and venue
router.get("/search", async (req, res) => {
  try {
    const { date, venueId } = req.query;
    const filter = {};

    if (date) filter.date = date;       // Assuming your EventDetails model has a 'date' field
    if (venueId) filter.venue = venueId; // Assuming 'venue' is a ref in EventDetails

    const events = await EventDetails.find(filter).populate("venue");
    res.json(events);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server Error" });
  }
});


export default router;

