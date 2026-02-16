// import express from "express";
// import { activateEmergency } from "../controllers/emergencyController.js";

// const router = express.Router();

// router.post("/activate", activateEmergency);

// export default router;

import express from "express";
import {
  getUserBookings,
  getSingleBooking,
  createBooking,
  cancelBooking
} from "../controllers/bookingController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes protected
router.get("/", protect, getUserBookings);
router.get("/:id", protect, getSingleBooking);
router.post("/", protect, createBooking);
router.put("/cancel/:id", protect, cancelBooking);

export default router;
