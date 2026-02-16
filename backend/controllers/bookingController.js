// import Booking from "../models/Booking.js";

// export const getUserBookings = async (req, res) => {
//   try {
//     // ✅ Get user from token
//     const userId = req.user._id;

//     const bookings = await Booking.find({ userId })
//       .sort({ appointmentDate: 1 }); // upcoming first

//     res.json(bookings);

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

import Booking from "../models/Booking.js";

/* =========================================
   GET ALL BOOKINGS (Logged-in user)
========================================= */
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;

    const bookings = await Booking.find({ userId })
      .sort({ appointmentDate: 1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================================
   GET SINGLE BOOKING
========================================= */
export const getSingleBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

/* =========================================
   CREATE BOOKING (Optional standalone)
========================================= */
export const createBooking = async (req, res) => {
  try {
    const userId = req.user._id;

    const {
      doctorName,
      specialization,
      hospital,
      consultType,
      appointmentDate,
      appointmentTime,
      fee
    } = req.body;

    if (
      !doctorName ||
      !specialization ||
      !hospital ||
      !consultType ||
      !appointmentDate ||
      !appointmentTime ||
      !fee
    ) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const booking = await Booking.create({
      userId,
      doctorName,
      specialization,
      hospital,
      consultType,
      appointmentDate: new Date(appointmentDate),
      appointmentTime,
      fee,
      status: "CONFIRMED"
    });

    res.status(201).json({
      message: "Booking created successfully",
      booking
    });

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

/* =========================================
   CANCEL BOOKING
========================================= */
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findOne({
      _id: req.params.id,
      userId: req.user._id
    });

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "CANCELLED") {
      return res.status(400).json({ message: "Booking already cancelled" });
    }

    booking.status = "CANCELLED";
    await booking.save();

    res.json({
      message: "Booking cancelled successfully",
      booking
    });

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
