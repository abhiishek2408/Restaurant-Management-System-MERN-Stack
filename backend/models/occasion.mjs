import mongoose from "mongoose";

const occasionSchema = new mongoose.Schema(
  {
    user_id: { type: String, required: true },
    first_name: { type: String, required: true, trim: true },
    last_name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    event_type: { type: String, required: true }, // e.g., "0" for birthday, "1" for anniversary
    event_date: { type: String, required: true },
    message: { type: String },
    state: { type: String, default: "active" },
    created_at: { type: String, required: true },
  },
  { collection: "occasion" }
);

export default mongoose.model("Occasion", occasionSchema);
