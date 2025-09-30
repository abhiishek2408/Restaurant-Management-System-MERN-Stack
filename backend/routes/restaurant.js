import express from "express";
import Restaurant from "../models/Restaurant.js";
const router = express.Router();

// Get all restaurants
router.get("/", async (req, res) => {
  const restaurants = await Restaurant.find();
  res.json(restaurants);
});

// Get single restaurant
router.get("/:id", async (req, res) => {
  const restaurant = await Restaurant.findById(req.params.id);
  res.json(restaurant);
});

export default router;
