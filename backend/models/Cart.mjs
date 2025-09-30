import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    user_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // ← User model ka naam
      required: true,
    },
    menu_section_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "MenuItem", // ← MenuItem model ka naam
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      set: (v) => parseInt(v, 10),
    },
    price: {
      type: Number,
      required: true,
      min: 0,
      set: (v) => parseFloat(v),
    },
    state: {
      type: String,
      default: "",
      trim: true,
    },
    added_at: {
      type: Date,
      default: Date.now,
      set: (v) => new Date(v),
    },
    updated_at: {
      type: Date,
      default: Date.now,
      set: (v) => new Date(v),
    },
    item_name: {
      type: String,
      required: true,
      trim: true,
    },
    item_image: {
      type: String,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true, collection: "cart" }
);

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
