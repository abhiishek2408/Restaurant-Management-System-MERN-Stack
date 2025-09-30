import mongoose from "mongoose";

const contactMessageSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, lowercase: true },
    phone: { type: String, required: true },
    message: { type: String, required: true },
    submitted_at: { type: String, required: true },
  },
  { collection: "contact_messages" }
);

export default mongoose.model("ContactMessage", contactMessageSchema);
