import mongoose from "mongoose";
const { Schema } = mongoose;

const ReservationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true },
  date: { type: Date, required: true },
  tableIds: [{ type: Schema.Types.ObjectId, ref: "Table", required: true }],
  startTime: { type: Date, required: true }, // exact start date-time
  endTime: { type: Date, required: true },   // exact end date-time
  duration: { type: Number },  // duration in minutes
  partySize: { type: Number }, // optional now
  status: { 
    type: String, 
    enum: ["pending","confirmed","seated","cancelled","no-show"], 
    default: "confirmed" 
  },
  notes: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now }
});

// Index for faster search by date & overlapping time
ReservationSchema.index({ tableIds: 1, startTime: 1, endTime: 1 });

export default mongoose.model("Reservation", ReservationSchema);
