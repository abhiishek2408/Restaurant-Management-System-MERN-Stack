import mongoose from "mongoose";
const { Schema } = mongoose;

const TableSchema = new Schema({
  name: { type: String, required: true }, // Table name/number
  capacity: { type: Number, required: true }, // Max guests
  minCapacity: { type: Number, default: 1 }, // Min guests
  nearWindow: { type: Boolean, default: false },
  nearEntrance: { type: Boolean, default: false },
  hasHighChair: { type: Boolean, default: false }, // Child-friendly
  isVIP: { type: Boolean, default: false },
  isBookableOnline: { type: Boolean, default: true },
  status: { type: String, enum: ["active", "inactive"], default: "active" },
  notes: { type: String, default: "" },
  turnoverTime: { 
    type: Number, 
    default: 60, 
    min: 1, 
    max: 180, // Ensure turnoverTime does not exceed 180 minutes
  },
  // Pricing details
  price: { type: Number, default: 0 }, // Base price for table
  peakHourMultiplier: { type: Number, default: 1 }, // e.g., 1.5x price during peak hours
  discount: { 
    type: Number, 
    default: 0, // percent discount, 0-100
    min: 0,
    max: 100
  },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Middleware to update timestamp and adjust price based on turnoverTime
TableSchema.pre("save", function(next) {
  this.updatedAt = Date.now();

  // Enforce price change based on turnoverTime
  if (this.turnoverTime > 60 && this.turnoverTime <= 120) {
    this.price = this.price * 2; // Double the price
  } else if (this.turnoverTime > 120 && this.turnoverTime <= 180) {
    this.price = this.price * 3; // Triple the price
  }

  // Ensure turnoverTime does not exceed 180 minutes
  if (this.turnoverTime > 180) {
    this.turnoverTime = 180;
  }

  next();
});

export default mongoose.model("Table", TableSchema);
