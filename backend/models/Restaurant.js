import mongoose from "mongoose";
const { Schema } = mongoose;

// Turnover rules for table based on party size
const TurnoverRuleSchema = new Schema({
  minPartySize: { type: Number, required: true },
  maxPartySize: { type: Number, required: true },
  duration: { type: Number, required: true } // minutes
}, { _id: false });

// Opening hours per day
const OpeningSchema = new Schema({
  day: { type: String, required: true }, // "mon","tue",...
  open: { type: String, required: true }, // "10:00"
  close: { type: String, required: true } // "22:00"
}, { _id: false });

// Optional peak hours multiplier
const PeakHourSchema = new Schema({
  start: { type: String, required: true }, // "19:00"
  end: { type: String, required: true }, // "21:00"
  multiplier: { type: Number, default: 1.5 } // price multiplier
}, { _id: false });

const RestaurantSchema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  phone: { type: String },
  email: { type: String },
  currency: { type: String, default: "INR" },
  openingHours: [OpeningSchema],
  turnoverRules: [TurnoverRuleSchema],
  maxPartySize: { type: Number, default: 10 },
  slotInterval: { type: Number, default: 30 }, // minutes
  peakHours: [PeakHourSchema],
  onlineBookingEnabled: { type: Boolean, default: true },
  notes: { type: String, default: "" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware to update updatedAt
RestaurantSchema.pre("save", function(next) {
  this.updatedAt = Date.now();
  next();
});

export default mongoose.model("Restaurant", RestaurantSchema);
