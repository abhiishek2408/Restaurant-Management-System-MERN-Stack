import mongoose from "mongoose";

const timingSchema = new mongoose.Schema(
  {
    id: { type: String, required: true },
    day: { type: String, required: true, trim: true },
    open_time: { type: String, required: true },
    close_time: { type: String, required: true },
    is_closed: { type: String, default: "0" }, // "1" if closed
    break_start: { type: String, default: null },
    break_end: { type: String, default: null },
    notes: { type: String, default: "" },
    is_special_day: { type: String, default: "0" }, // "1" for special day
    last_updated: { type: String, required: true },
  },
  { collection: "timings" }
);

export default mongoose.model("Timing", timingSchema);
