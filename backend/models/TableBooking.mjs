import mongoose from "mongoose";

const tableBookingSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, default: "" },
    event_type: { type: String, required: true },
    event_date: { type: String, required: true },
    message: { type: String },
    state: { type: String, default: "active" },
    created_at: { type: String, required: true },
  },
  { collection: "table_bookings" }
);

export default mongoose.model("TableBooking", tableBookingSchema);
