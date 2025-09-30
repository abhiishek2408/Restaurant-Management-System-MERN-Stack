import express from "express";
import mongoose from "mongoose";
import authMiddleware from "../middleware/auth.js";
import Cart from "../models/Cart.mjs"; // adjust path if needed
import UserAddress from "../models/UserAddress.mjs";
import dotenv from 'dotenv';

const router = express.Router();

dotenv.config();

// =====================
// ADD TO CART
// =====================
router.post("/add-to-cart", async (req, res) => {
  try {
    const {
      user_id,
      menu_section_id,
      quantity,
      price,
      item_name,
      item_image,
      description,
      state,
    } = req.body;

    // Validation
    if (!user_id || !menu_section_id || !quantity || !price || !item_name) {
      return res
        .status(400)
        .json({ success: false, message: "Required fields are missing" });
    }

    if (
      !mongoose.Types.ObjectId.isValid(user_id) ||
      !mongoose.Types.ObjectId.isValid(menu_section_id)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid ObjectId" });
    }

    // Check if the item already exists in user's cart
    let cartItem = await Cart.findOne({ user_id, menu_section_id });

    if (cartItem) {
      // If item exists, increment quantity
      cartItem.quantity += parseInt(quantity, 10);
      // Optional: update price if needed (e.g., discount applied)
      cartItem.price = parseFloat(price);
      cartItem.updated_at = new Date();
      await cartItem.save();

      return res.json({
        success: true,
        message: `Quantity updated for ${item_name}`,
        cartItem,
      });
    } else {
      // If item doesn't exist, create new entry
      cartItem = new Cart({
        user_id,
        menu_section_id,
        quantity: parseInt(quantity, 10),
        price: parseFloat(price),
        item_name,
        item_image,
        description,
        state: state || "",
      });
      await cartItem.save();

      return res.json({
        success: true,
        message: `${item_name} added to cart successfully`,
        cartItem,
      });
    }
  } catch (err) {
    console.error("Error in add-to-cart:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.get("/get-cart/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    if (!user_id || !mongoose.Types.ObjectId.isValid(user_id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user_id" });
    }

    // Fetch cart items directly (no populate needed)
    const cartItems = await Cart.find({ user_id }).lean();

    // Map _id to cart_id for frontend consistency
    const formattedCart = cartItems.map((item) => ({
      _id: item._id,
      item_name: item.item_name,
      item_image: item.item_image,
      price: item.price,
      quantity: item.quantity,
      description: item.description,
    }));

    return res.json({ success: true, cart: formattedCart });
  } catch (err) {
    console.error("Error fetching cart:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

router.delete("/delete-from-cart/:cart_id", async (req, res) => {
  try {
    const { cart_id } = req.params;

    if (!cart_id || !mongoose.Types.ObjectId.isValid(cart_id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid cart_id" });
    }

    const deletedItem = await Cart.findByIdAndDelete(cart_id);

    if (!deletedItem) {
      return res
        .status(404)
        .json({ success: false, message: "Cart item not found" });
    }

    return res.json({
      success: true,
      message: "Cart item deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting cart item:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// =================== Get User Addresses ===================
router.get("/get_user_addresses/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params;

    // Validate user_id
    if (!user_id || !mongoose.Types.ObjectId.isValid(user_id)) {
      return res
        .status(400)
        .json({ success: false, message: "Invalid user_id" });
    }

    // Fetch addresses for this user
    const addresses = await UserAddress.find({ user_id: user_id })
      .sort({ is_default: -1, created_at: -1 })
      .lean();

    return res.json({ success: true, addresses });
  } catch (err) {
    console.error("Error fetching user addresses:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

// =================== Add User Address ===================

router.post("/add_user_addresses", authMiddleware, async (req, res) => {

  console.log("Request body:", req.body);
  console.log("Authenticated user:", req.user);

  try {
  
    const {
      full_name,
      phone,
      address_line,
      city,
      state,
      zipcode,
      is_default = "0",
    } = req.body;
    const user_id = req.user?._id;
    if (!user_id) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }
    if (!full_name || !phone || !address_line || !city || !state || !zipcode) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }
    if (isNaN(phone) || isNaN(zipcode)) {
      return res
        .status(400)
        .json({ success: false, message: "Phone and Zipcode must be numbers" });
    }
    const existingCount = await UserAddress.countDocuments({ user_id });
     console.log("Existing addresses count:", existingCount);
    if (existingCount >= 2) {
      return res
        .status(400)
        .json({
          success: false,
          message: "Maximum 2 addresses allowed per user",
        });
    }
    if (is_default === "1") {
      await UserAddress.updateMany({ user_id }, { $set: { is_default: "0" } });
    }
    const newAddress = new UserAddress({
      user_id,
      full_name,
      phone,
      address_line,
      city,
      state,
      zipcode,
      is_default,
      created_at: new Date(),
    });
    await newAddress.save();
    return res.json({
      success: true,
      message: "Address added successfully",
      address: newAddress,
    });
  } catch (err) {
    console.error("Error adding user address:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
