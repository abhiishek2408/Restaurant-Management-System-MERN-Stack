import mongoose from "mongoose";

const userAddressSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  full_name: { type: String, required: true },
  phone: { type: Number, required: true },
  address_line: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  zipcode: { type: Number, required: true },
  is_default: { type: String, default: "0" },
  created_at: { type: Date, default: Date.now }
}, { collection: "user_addresses" });

export default mongoose.model("UserAddress", userAddressSchema);
