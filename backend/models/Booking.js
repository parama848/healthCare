// import mongoose from "mongoose";

// const bookingSchema = new mongoose.Schema(
//   {
//     userId: {
//       type: mongoose.Schema.Types.ObjectId,
//       required: true,
//       ref: "User",
//       index: true
//     },

//     doctorName: {
//       type: String,
//       required: true,
//       trim: true
//     },

//     specialization: {
//       type: String,
//       required: true,
//       trim: true
//     },

//     hospital: {
//       type: String,
//       required: true,
//       trim: true
//     },

//     consultType: {
//       type: String,
//       enum: ["inperson", "video"],
//       required: true
//     },

//     // ✅ Store as real Date (IMPORTANT)
//     appointmentDate: {
//       type: Date,
//       required: true
//     },

//     // ✅ Time Slot
//     appointmentTime: {
//       type: String,
//       required: true
//     },

//     fee: {
//       type: Number,
//       required: true
//     },

//     status: {
//       type: String,
//       enum: ["CONFIRMED", "CANCELLED", "COMPLETED"],
//       default: "CONFIRMED"
//     }
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Booking", bookingSchema);

import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true
    },

    doctorName: {
      type: String,
      required: true,
      trim: true
    },

    specialization: {
      type: String,
      required: true,
      trim: true
    },

    hospital: {
      type: String,
      required: true,
      trim: true
    },

    consultType: {
      type: String,
      enum: ["inperson", "video"],
      required: true
    },

    appointmentDate: {
      type: Date,
      required: true
    },

    appointmentTime: {
      type: String,
      required: true
    },

    fee: {
      type: Number,
      required: true,
      min: 0
    },

    status: {
      type: String,
      enum: ["CONFIRMED", "CANCELLED", "COMPLETED"],
      default: "CONFIRMED"
    }
  },
  { timestamps: true }
);

export default mongoose.model("Booking", bookingSchema);
