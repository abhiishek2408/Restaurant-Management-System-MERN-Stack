// models/EventVenue.js
import mongoose from "mongoose";

const EventVenueSchema = new mongoose.Schema({
  name: { type: String, required: true },
  capacity: { type: Number, required: true },
  location: { type: String },
  amenities: [{ type: String }], // e.g., projectors, chairs, sound system
}, { timestamps: true });

export default mongoose.model("EventVenue", EventVenueSchema);
