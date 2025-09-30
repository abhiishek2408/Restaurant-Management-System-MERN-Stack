import express from "express";
import Reservation from "../models/Reservation.js";
import Table from "../models/Table.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();


// -------------------------
// 1️⃣ Get available tables for a date
// -------------------------
router.get("/available", async (req, res) => {
  const { date, startTime, endTime } = req.query;
  if (!date || !startTime || !endTime) 
    return res.status(400).json({ error: "Date, startTime, and endTime are required" });

  const selectedDate = new Date(date);
  const start = new Date(`${date}T${startTime}`);
  const end = new Date(`${date}T${endTime}`);

  try {
    const allTables = await Table.find({ status: "active", isBookableOnline: true });

    // Find reservations overlapping the requested time
    const reservations = await Reservation.find({
      tableIds: { $in: allTables.map(t => t._id) },
      status: "confirmed",
      $or: [
        { startTime: { $lt: end }, endTime: { $gt: start } } // overlap condition
      ]
    });

    const bookedTableIds = reservations.flatMap(r => r.tableIds.map(id => id.toString()));

    const availableTables = allTables.filter(t => !bookedTableIds.includes(t._id.toString()));

    res.json({ availableTables });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


// -------------------------
// 2️⃣ Create reservation for selected tables
// -------------------------
router.post("/", async (req, res) => {
  const { userId, date, tableIds, startTime, endTime } = req.body;

  if (!date || !tableIds || tableIds.length === 0 || !startTime || !endTime) {
    return res.status(400).json({ error: "Date, tables, startTime, and endTime are required" });
  }

  const start = new Date(`${date}T${startTime}`);
  const end = new Date(`${date}T${endTime}`);
  const duration = (end - start) / 60000; // in minutes

  try {
    // Check conflicts
    const conflicts = await Reservation.find({
      tableIds: { $in: tableIds },
      status: "confirmed",
      $or: [
        { startTime: { $lt: end }, endTime: { $gt: start } }
      ]
    });

    if (conflicts.length > 0) {
      return res.status(400).json({ error: "Some tables are already reserved for this time slot" });
    }

    const reservation = new Reservation({
      userId,
      date: new Date(date),
      tableIds,
      startTime: start,
      endTime: end,
      duration
    });

    await reservation.save();
    res.json({ success: true, reservation });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});



// -------------------------
// 1️⃣ Get all reservations of logged-in user
// -------------------------
router.get("/my-reservations", authMiddleware, async (req, res) => {
  try {
    console.log("REQ USER:", req.user); // should now log user object with _id
    const userId = req.user._id;

    const reservations = await Reservation.find({ userId })
      .populate("tableIds")
      .sort({ startTime: 1 });

    res.json({ reservations });
  } catch (error) {
    console.error("Error fetching reservations:", error);
    res.status(500).json({ error: "Server error" });
  }
});

// -------------------------
// 2️⃣ Cancel reservation if at least 3 hours before startTime
// -------------------------
router.patch("/cancel/:id", authMiddleware, async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const reservation = await Reservation.findOne({ _id: id, userId });
    if (!reservation) return res.status(404).json({ error: "Reservation not found" });

    const diffHours = (reservation.startTime - new Date()) / (1000 * 60 * 60);
    if (diffHours < 3)
      return res.status(400).json({ error: "Cannot cancel reservation within 3 hours" });

    reservation.status = "cancelled";
    await reservation.save();

    await Table.updateMany(
      { _id: { $in: reservation.tableIds } },
      { $set: { status: "active" } }
    );

    res.json({ success: true, message: "Reservation cancelled successfully" });
  } catch (error) {
    console.error("Error cancelling reservation:", error);
    res.status(500).json({ error: "Server error" });
  }
});

/**
 * 1️⃣ Fetch all reservations for the logged-in user
 */
// router.get("/my-reservations", async (req, res) => {
//   try {
//     console.log("REQ USER:", req.user);      // ✅ Debug: see if user exists
//     console.log("QUERY USERID:", req.query.userId); // ✅ Debug: see if userId comes from query

//     const userId = req.user?._id || req.query.userId; 
//     if (!userId) {
//       console.log("No userId found!"); // ✅ Debug
//       return res.status(400).json({ error: "User ID is required" });
//     }

//     const reservations = await Reservation.find({ userId })
//       .populate("tableIds")
//       .sort({ startTime: 1 });

//     res.json({ reservations });
//   } catch (error) {
//     console.error("Error fetching reservations:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// /**
//  * 2️⃣ Cancel reservation if at least 3 hours before startTime
//  */
// router.patch("/cancel/:id", async (req, res) => {
//   try {
//     console.log("REQ USER:", req.user);      // ✅ Debug
//     console.log("BODY USERID:", req.body.userId); // ✅ Debug
//     console.log("PARAM ID:", req.params.id);

//     const { id } = req.params;
//     const userId = req.user?._id || req.body.userId;

//     if (!userId) {
//       console.log("No userId found for cancellation!"); // ✅ Debug
//       return res.status(400).json({ error: "User ID is required" });
//     }

//     const reservation = await Reservation.findOne({ _id: id, userId });
//     if (!reservation) {
//       return res.status(404).json({ error: "Reservation not found" });
//     }

//     // Check if within 3 hours of startTime
//     const now = new Date();
//     const diffHours = (reservation.startTime - now) / (1000 * 60 * 60);
//     if (diffHours < 3) {
//       return res
//         .status(400)
//         .json({ error: "Cannot cancel reservation within 3 hours of start time" });
//     }

//     // Mark reservation as cancelled
//     reservation.status = "cancelled";
//     await reservation.save();

//     await Table.updateMany(
//       { _id: { $in: reservation.tableIds } },
//       { $set: { status: "active" } }
//     );

//     res.json({ success: true, message: "Reservation cancelled successfully" });
//   } catch (error) {
//     console.error("Error cancelling reservation:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });



// /**
//  * 1️⃣ Fetch all reservations for the logged-in user
//  */
// router.get("/my-reservations", async (req, res) => {
//   try {
//     const userId = req.user?._id || req.query.userId; // get from middleware OR query
//     if (!userId) return res.status(400).json({ error: "User ID is required" });

//     const reservations = await Reservation.find({ userId })
//       .populate("tableIds")
//       .sort({ startTime: 1 });

//     res.json({ reservations });
//   } catch (error) {
//     console.error("Error fetching reservations:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });

// /**
//  * 2️⃣ Cancel reservation if at least 3 hours before startTime
//  */
// router.patch("/cancel/:id", async (req, res) => {
//   try {
//     const { id } = req.params;
//     const userId = req.user?._id || req.body.userId; // get from middleware OR body

//     const reservation = await Reservation.findOne({ _id: id, userId });
//     if (!reservation) {
//       return res.status(404).json({ error: "Reservation not found" });
//     }

//     // Check if within 3 hours of startTime
//     const now = new Date();
//     const diffHours = (reservation.startTime - now) / (1000 * 60 * 60);
//     if (diffHours < 3) {
//       return res
//         .status(400)
//         .json({ error: "Cannot cancel reservation within 3 hours of start time" });
//     }

//     // Mark reservation as cancelled
//     reservation.status = "cancelled";
//     await reservation.save();

//     // Optionally mark tables as available (if you maintain a table status)
//     await Table.updateMany(
//       { _id: { $in: reservation.tableIds } },
//       { $set: { status: "active" } }
//     );

//     res.json({ success: true, message: "Reservation cancelled successfully" });
//   } catch (error) {
//     console.error("Error cancelling reservation:", error);
//     res.status(500).json({ error: "Server error" });
//   }
// });




export default router;
