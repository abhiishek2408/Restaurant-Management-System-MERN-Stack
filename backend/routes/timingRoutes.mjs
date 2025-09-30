import express from "express";

const router = express.Router();

// =================== Timing Route ===================
router.get("/timings", async (req, res) => {
  const db = req.app.locals.db;

  try {
    const timingsCursor = db.collection("timings").find({});
    const timingsArray = await timingsCursor.toArray();

    // Optional: sort by weekday order
    const weekOrder = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    timingsArray.sort((a, b) => weekOrder.indexOf(a.day) - weekOrder.indexOf(b.day));

    res.json({ timings: timingsArray });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Failed to fetch timings", error: err.message });
  }
});

export default router;
