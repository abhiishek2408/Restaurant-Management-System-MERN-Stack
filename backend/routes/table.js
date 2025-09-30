import express from "express";
import Table from "../models/Table.js";
const router = express.Router();

// Get all tables
router.get("/", async (req, res) => {
  const tables = await Table.find();
  res.json(tables);
});

// Get tables by restaurant capacity filter (optional)
router.get("/filter/:partySize", async (req, res) => {
  const { partySize } = req.params;
  const tables = await Table.find({ capacity: { $gte: partySize } });
  res.json(tables);
});

export default router;
