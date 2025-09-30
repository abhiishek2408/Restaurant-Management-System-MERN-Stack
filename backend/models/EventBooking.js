// models/EventBooking.js
import mongoose from "mongoose";

const EventBookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "EventDetails", required: true },
  date: { type: String, required: true },
  attendees: { type: Number, required: true },
  totalCharge: { type: Number, required: true }, // calculated as attendees * pricePerAttendee + resource charges
  status: { type: String, enum: ["pending", "confirmed", "cancelled"], default: "pending" },
  resources: [{ type: mongoose.Schema.Types.ObjectId, ref: "EventResource" }], // optional
}, { timestamps: true });

export default mongoose.model("EventBooking", EventBookingSchema);
