import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";
import helmet from "helmet";                 
import rateLimit from "express-rate-limit"; 

import connectDB from "./config/db.mjs";
import authRoutes from "./routes/authRoutes.mjs";
import foodItemRoutes from "./routes/foodItemRoutes.mjs";
import cartRoutes from "./routes/cartRoutes.mjs";
import orderRoutes from "./routes/orderRoutes.mjs";
import bookingRoutes from "./routes/bookingRoutes.mjs";
import tableBookingRoutes from "./routes/tableBookingRoute.mjs";
import contactRoutes from "./routes/contactRoutes.mjs";
import timingRoutes from "./routes/timingRoutes.mjs";
import userRoutes from "./routes/userRoutes.mjs";
import paypalRoutes from "./routes/paypalRoutes.mjs";

//Table booking

import restaurantRoutes from "./routes/restaurant.js";
import tableRoutes from "./routes/table.js";
import reservationRoutes from "./routes/reservation.js";

//Event booking

import searchRoutes from "./routes/EventSearch.js";
import EventBooking from "./routes/EventBooking.js";
import eventRoutes from "./routes/EventRoute.js";

dotenv.config();
const app = express();

connectDB();

// ====== Security Middlewares ======
app.use(helmet());  // Sets secure HTTP headers

// Rate Limiter: apply globally or to specific routes
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100,                 // Limit each IP to 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// ====== General Middlewares ======
// Increase payload limit to handle large JSON / base64 images
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(cookieParser());

app.use(
  cors({
    origin: "https://restaurant-management-system-mern-s.vercel.app",
    credentials: true,
    methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ====== Routes ======
app.use("/api/auth", authRoutes);
app.use("/api/food-items", foodItemRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/booking", bookingRoutes);
app.use("/api/tablebook", tableBookingRoutes);
app.use("/api/contact-form", contactRoutes);
app.use("/api/timing", timingRoutes);
app.use("/api/user", userRoutes);
app.use("/api/paypal", paypalRoutes);

app.use("/api/restaurants", restaurantRoutes);
app.use("/api/tables", tableRoutes);
app.use("/api/reservations", reservationRoutes);

app.use("/api/event-search", searchRoutes);
app.use("/api/event-booking", EventBooking);
app.use("/api/event", eventRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
