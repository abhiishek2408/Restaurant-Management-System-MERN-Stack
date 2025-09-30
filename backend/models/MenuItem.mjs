import mongoose from "mongoose";

const foodItemSchema = new mongoose.Schema({
  foodType: { type: String, required: true, trim: true },
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  discount_price: { 
    type: Number, 
    default: 0,
    validate: {
      validator: function (v) {
        return v <= this.price;
      },
      message: "Discount price must be less than or equal to price"
    }
  },
  vegan: { type: Boolean, default: false },
  rating: { type: Number, min: 0, max: 5, default: 0 },
  time: { type: String, default: "00:00:00" },
  product_image: { type: String },
  isOffer: { type: Boolean, default: false },
  isArchive: { type: Boolean, default: false },
  is_active: { type: Boolean, default: true },
  is_featured: { type: Boolean, default: false },
  display_order: { type: Number, default: 0 },
  is_new: { type: Boolean, default: false },
  total_orders: { type: Number, default: 0 },

  // Multi-location support
  locations: {
    type: [{
      locationName: { type: String, required: true, trim: true },
      city: { type: String, required: true, trim: true },
      state: { type: String, required: true, trim: true },
      zipcode: { type: Number, required: true },

      price: { type: Number, required: true, min: 0 },
      discount_price: {
        type: Number,
        default: 0,
        validate: {
          validator: function (v) {
            return v <= this.price;
          },
          message: "Discount price must be less than or equal to price"
        }
      },
      total_orders: { type: Number, default: 0 },
      is_available: { type: Boolean, default: true },
    }],
    validate: {
      validator: function (v) {
        return Array.isArray(v) && v.length > 0;
      },
      message: "At least one location is required"
    }
  },

}, { timestamps: true, collection: "menu_items" });

// Indexes for faster queries
foodItemSchema.index({ "locations.city": 1 });
foodItemSchema.index({ "locations.zipcode": 1 });

export default mongoose.model("MenuItem", foodItemSchema);
