import express from "express";
import { getUserBookings } from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// GET logged-in user bookings
router.get("/", protect, getUserBookings);

export default router;
