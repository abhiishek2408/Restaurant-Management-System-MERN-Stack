// models/EventDetails.js
import mongoose from "mongoose";

const EventDetailsSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  startTime: { type: String, required: true }, // e.g., "10:00"
  endTime: { type: String, required: true },   // e.g., "12:00"
  venue: { type: mongoose.Schema.Types.ObjectId, ref: "EventVenue", required: true },
  maxAttendees: { type: Number, required: true },
  pricePerAttendee: { type: Number, required: true, default: 0 }, // charge per person
}, { timestamps: true });

export default mongoose.model("EventDetails", EventDetailsSchema);
