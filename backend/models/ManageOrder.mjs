import mongoose from "mongoose";

const manageOrderSchema = new mongoose.Schema(
  {
    cart_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "Cart" },
    user_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" },
    menu_section_id: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "MenuItem" },

    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    state: { type: String, default: "" },
    time_to_reach: { type: String, required: true },
    added_at: { type: String, required: true },
    updated_at: { type: String, required: true },
    item_name: { type: String, required: true },
    item_image: { type: String, required: true },
    delivery_address: { type: String, required: true },
    full_name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    special_instructions: { type: String, default: "" },
  },
  { collection: "manage_order" }
);

export default mongoose.model("ManageOrder", manageOrderSchema);
