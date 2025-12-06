import express from "express";
import { ObjectId } from "mongodb";

const router = express.Router();

// =================== Get All Users ===================
router.get("/get-users", async (req, res) => {
  const db = req.app.locals.db;

  try {
    const users = await db
      .collection("users")
      .find({})
      .toArray();

    const data = users.map(user => {
      const { password, profile_img, ...rest } = user;
      if (profile_img) rest.profile_img = Buffer.from(profile_img.buffer || profile_img).toString("base64");
      return rest;
    });

    if (data.length === 0) return res.json({ success: false, message: "No users found." });

    res.json({ success: true, data });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Database error" });
  }
});

// =================== Delete User ===================
router.post("/delete-user", async (req, res) => {
  const db = req.app.locals.db;
  const { user_id } = req.body;

  if (!user_id) return res.json({ success: false, message: "Missing user_id" });

  try {
    const result = await db.collection("users").deleteOne({ _id: new ObjectId(user_id) });
    if (result.deletedCount === 0) return res.json({ success: false, message: "User not found" });

    res.json({ success: true, message: "User deleted successfully." });
  } catch (err) {
    console.error(err);
    res.json({ success: false, message: "Error deleting user." });
  }
});

// =================== Update User ===================
router.post("/update-user", async (req, res) => {
  const db = req.app.locals.db;
  const {
    user_id,
    username,
    password,
    role,
    email,
    phone,
    address,
    bio,
    profile_img
  } = req.body;

  if (!user_id || !username || !email)
    return res.json({ success: false, message: "Invalid input data" });

  const updateFields = { username, email };
  if (password) updateFields.password = password;
  if (role) updateFields.role = role;
  if (phone) updateFields.phone = phone;
  if (address) updateFields.address = address;
  if (bio) updateFields.bio = bio;
  if (profile_img) updateFields.profile_img = Buffer.from(profile_img, "base64");

  try {
    const result = await db
      .collection("users")
      .updateOne({ _id: new ObjectId(user_id) }, { $set: updateFields });

    if (result.matchedCount === 0)
      return res.json({ success: false, message: "User not found" });

    res.json({ success: true, message: "User updated successfully." });
  } catch (err) {
    console.error("Update user error:", err);
    res.json({ success: false, message: `Error updating user. ${err && err.message ? err.message : ''}` });
  }
});

// =================== Get Logged-in User Profile ===================
router.get("/profile", (req, res) => {
  if (!req.session || !req.session.user) {
    return res.json({ status: "error", message: "No user logged in" });
  }

  const user = { ...req.session.user };
  res.json({
    status: "success",
    user: {
      ...user,
      profile_img: user.profile_img
        ? Buffer.from(user.profile_img).toString("base64")
        : null,
    },
  });
});

export default router;
