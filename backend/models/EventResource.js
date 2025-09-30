// models/EventResource.js
import mongoose from "mongoose";

const EventResourceSchema = new mongoose.Schema({
  name: { type: String, required: true }, // e.g., projector, food package
  type: { type: String },                 // e.g., equipment, service
  quantity: { type: Number, default: 1 },
  price: { type: Number, default: 0 },    // charge for this resource
  bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "EventBooking" }],
}, { timestamps: true });

export default mongoose.model("EventResource", EventResourceSchema);
