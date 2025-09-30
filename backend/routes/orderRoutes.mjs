import express from "express";
import fetch from "node-fetch";
import mongoose from "mongoose";
import ManageOrder from "../models/ManageOrder.mjs";

const router = express.Router();

// =================== PayPal Payment ===================
router.post("/paypal-payment", async (req, res) => {
  const { total } = req.body;
  if (!total) return res.json({ status: "error", message: "Missing total amount" });

  const clientID = "AcE5tnVEdPIABDFHbELA6SP5UmuwvrI3Cet__4pw2-HW58dd7F_FGCVR5xzazDbk9kxoPCIcKo2bN-h0";
  const secret = "EGcrBwHAjp24ZibeTMUTI1sjP4lzNy9ai7rBRKyKuGvRiHDbWGDbVuk-fglQwjdOdcEAK0tH0";
  const baseUrl = "https://api-m.sandbox.paypal.com"; // change to live URL when live

  try {
    // Get access token
    const tokenRes = await fetch(`${baseUrl}/v1/oauth2/token`, {
      method: "POST",
      headers: {
        Authorization: "Basic " + Buffer.from(`${clientID}:${secret}`).toString("base64"),
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: "grant_type=client_credentials",
    });

    const tokenData = await tokenRes.json();
    if (!tokenData.access_token) throw new Error("Unable to get access token");

    // Create order
    const orderRes = await fetch(`${baseUrl}/v2/checkout/orders`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${tokenData.access_token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        intent: "CAPTURE",
        purchase_units: [{ amount: { currency_code: "USD", value: total } }],
      }),
    });

    const orderData = await orderRes.json();
    res.json(orderData);
  } catch (err) {
    console.error(err);
    res.json({ status: "error", message: err.message });
  }
});



// =================== Manage Orders (All) ===================
router.get("/manage-orders", async (req, res) => {
  try {
    const orders = await ManageOrder.find().sort({ added_at: -1 });

    if (!orders || orders.length === 0) {
      return res.status(404).json({ success: false, message: "No orders found" });
    }

    // Convert buffer images to base64 safely (if needed)
    const data = orders.map((row) => {
      const obj = row.toObject(); // convert Mongoose doc to plain JS object
      if (obj.item_image && obj.item_image.buffer) {
        obj.item_image = Buffer.from(obj.item_image.buffer).toString("base64");
      }
      return obj;
    });

    res.json({ success: true, data });
  } catch (err) {
    console.error("Error fetching manage orders:", err);
    res.status(500).json({ success: false, message: "Database error" });
  }
});



// =================== Order History (Completed) ===================
router.post("/order-history", async (req, res) => {
  try {
    const { user_id } = req.body;

    if (!user_id || !mongoose.Types.ObjectId.isValid(user_id)) {
      return res.status(400).json({ success: false, message: "Invalid or missing user_id" });
    }

    // Fetch orders for this user and sort by latest first
    const orders = await ManageOrder.find({ user_id }).sort({ added_at: -1 });

    if (!orders || orders.length === 0) {
      return res.status(200).json({ success: false, message: "No orders found." });
    }

    res.status(200).json({ success: true, data: orders });
  } catch (error) {
    console.error("Error fetching order history:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
});



// =================== Update Single Order ===================
router.post("/update-order", async (req, res) => {
  try {
    const {
      cart_id,
      quantity,
      price,
      state,
      delivery_address,
      item_image,
    } = req.body;

    if (!cart_id || !mongoose.Types.ObjectId.isValid(cart_id)) {
      return res.status(400).json({ success: false, message: "Invalid or missing cart_id" });
    }

    const updateFields = {};
    if (quantity !== undefined) updateFields.quantity = quantity;
    if (price !== undefined) updateFields.price = price;
    if (state !== undefined) updateFields.state = state;
    if (delivery_address !== undefined) updateFields.delivery_address = delivery_address;
    if (item_image !== undefined) updateFields.item_image = item_image;

    if (Object.keys(updateFields).length === 0) {
      return res.status(400).json({ success: false, message: "No fields to update" });
    }

    const result = await ManageOrder.updateOne(
      { cart_id: cart_id }, // match based on cart_id field
      { $set: updateFields }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    res.json({ success: true, message: "Order updated successfully" });
  } catch (err) {
    console.error("Update order error:", err);
    res.status(500).json({ success: false, message: "Update failed" });
  }
});

export default router;
