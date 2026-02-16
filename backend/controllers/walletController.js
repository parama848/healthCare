// import Wallet from "../models/Wallet.js";
// import Transaction from "../models/Transaction.js";
// import Booking from "../models/Booking.js";
// import mongoose from "mongoose";

// /* =========================================
//    GET WALLET
// ========================================= */
// export const getWallet = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     if (!mongoose.Types.ObjectId.isValid(userId)) {
//       return res.status(400).json({ message: "Invalid userId" });
//     }

//     let wallet = await Wallet.findOne({ userId });

//     if (!wallet) {
//       wallet = await Wallet.create({ userId });
//     }

//     res.json(wallet);

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// /* =========================================
//    GET TRANSACTIONS
// ========================================= */
// export const getTransactions = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const wallet = await Wallet.findOne({ userId });
//     if (!wallet) return res.json([]);

//     const transactions = await Transaction.find({
//       walletId: wallet._id
//     }).sort({ createdAt: -1 });

//     res.json(transactions);

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };


// /* =========================================
//    ADD MONEY (CREDIT)
// ========================================= */
// export const addMoney = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { userId } = req.params;
//     const { amount } = req.body;

//     if (!amount || amount <= 0) {
//       throw new Error("Invalid amount");
//     }

//     let wallet = await Wallet.findOne({ userId }).session(session);

//     if (!wallet) {
//       const created = await Wallet.create([{ userId }], { session });
//       wallet = created[0];
//     }

//     wallet.balance += Number(amount);
//     wallet.totalDeposited += Number(amount);
//     await wallet.save({ session });

//     await Transaction.create(
//       [{
//         walletId: wallet._id,
//         type: "CREDIT",
//         amount: Number(amount),
//         description: "Added to Medical Savings"
//       }],
//       { session }
//     );

//     await session.commitTransaction();
//     session.endSession();

//     res.json({
//       message: "Money added successfully",
//       wallet
//     });

//   } catch (err) {
//     await session.abortTransaction();
//     session.endSession();
//     res.status(400).json({ message: err.message });
//   }
// };


// /* =========================================
//    DEDUCT MONEY + CREATE BOOKING
// ========================================= */
// export const deductMoney = async (req, res) => {
//   const session = await mongoose.startSession();
//   session.startTransaction();

//   try {
//     const { userId } = req.params;

//     const {
//       amount,
//       category,
//       description,
//       partnerName,
//       doctorName,
//       specialization,
//       consultType,
//       appointmentDate
//     } = req.body;

//     if (!amount || amount <= 0) {
//       throw new Error("Invalid amount");
//     }

//     const wallet = await Wallet.findOne({ userId }).session(session);

//     if (!wallet) {
//       throw new Error("Wallet not found");
//     }

//     if (wallet.balance < amount) {
//       throw new Error("Insufficient balance");
//     }

//     // 💰 Deduct balance
//     wallet.balance -= Number(amount);
//     wallet.totalUsed += Number(amount);
//     await wallet.save({ session });

//     // 🧾 Save transaction
//     await Transaction.create(
//       [{
//         walletId: wallet._id,
//         type: "DEBIT",
//         category: category || "CONSULTATION",
//         amount: Number(amount),
//         description: description || "Doctor Consultation",
//         partnerName: partnerName || null
//       }],
//       { session }
//     );

//     // 📅 Create booking
//     await Booking.create(
//       [{
//         userId,
//         doctorName,
//         specialization,
//         hospital: partnerName,
//         consultType,
//         appointmentDate,
//         fee: amount,
//         status: "CONFIRMED"
//       }],
//       { session }
//     );

//     await session.commitTransaction();
//     session.endSession();

//     res.json({
//       message: "Appointment booked successfully",
//       wallet
//     });

//   } catch (err) {
//     await session.abortTransaction();
//     session.endSession();
//     res.status(400).json({ message: err.message });
//   }
// };


// /* =========================================
//    BREAKDOWN (FOR CHART)
// ========================================= */
// export const getBreakdown = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     const wallet = await Wallet.findOne({ userId });
//     if (!wallet) return res.json([]);

//     const breakdown = await Transaction.aggregate([
//       {
//         $match: {
//           walletId: wallet._id,
//           type: "DEBIT"
//         }
//       },
//       {
//         $group: {
//           _id: { $ifNull: ["$category", "GENERAL"] },
//           total: { $sum: "$amount" }
//         }
//       }
//     ]);

//     res.json(breakdown);

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";
import Booking from "../models/Booking.js";
import mongoose from "mongoose";

/* =========================================
   GET WALLET
========================================= */
export const getWallet = async (req, res) => {
  try {
    const userId = req.user._id;

    let wallet = await Wallet.findOne({ userId });

    if (!wallet) {
      wallet = await Wallet.create({ userId });
    }

    res.json(wallet);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* =========================================
   GET TRANSACTIONS
========================================= */
export const getTransactions = async (req, res) => {
  try {
    const userId = req.user._id;

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) return res.json([]);

    const transactions = await Transaction.find({
      walletId: wallet._id
    }).sort({ createdAt: -1 });

    res.json(transactions);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


/* =========================================
   ADD MONEY (WALLET TOP-UP)
========================================= */
export const addMoney = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user._id;
    const { amount } = req.body;

    if (!amount || Number(amount) <= 0) {
      throw new Error("Invalid amount");
    }

    let wallet = await Wallet.findOne({ userId }).session(session);

    if (!wallet) {
      const created = await Wallet.create([{ userId }], { session });
      wallet = created[0];
    }

    wallet.balance += Number(amount);
    wallet.totalDeposited += Number(amount);

    await wallet.save({ session });

    await Transaction.create(
      [{
        walletId: wallet._id,
        type: "CREDIT",
        amount: Number(amount),
        description: "Added to Medical Savings"
      }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.json({
      message: "Money added successfully",
      wallet
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: err.message });
  }
};


/* =========================================
   DEDUCT MONEY + CREATE BOOKING
========================================= */
export const deductMoney = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const userId = req.user._id;

    const {
      amount,
      category,
      description,
      partnerName,
      doctorName,
      specialization,
      consultType,
      appointmentDate,
      appointmentTime
    } = req.body;

    if (!amount || Number(amount) <= 0) {
      throw new Error("Invalid amount");
    }

    if (
      !doctorName ||
      !specialization ||
      !consultType ||
      !appointmentDate ||
      !appointmentTime
    ) {
      throw new Error("Missing booking details");
    }

    const wallet = await Wallet.findOne({ userId }).session(session);
    if (!wallet) throw new Error("Wallet not found");

    if (wallet.balance < Number(amount)) {
      throw new Error("Insufficient balance");
    }

    // 💰 Deduct Balance
    wallet.balance -= Number(amount);
    wallet.totalUsed += Number(amount);

    await wallet.save({ session });

    // 🧾 Save Transaction
    await Transaction.create(
      [{
        walletId: wallet._id,
        type: "DEBIT",
        category: category || "CONSULTATION",
        amount: Number(amount),
        description: description || "Doctor Consultation",
        partnerName: partnerName || null
      }],
      { session }
    );

    // 📅 Create Booking
    await Booking.create(
      [{
        userId,
        doctorName,
        specialization,
        hospital: partnerName,
        consultType,
        appointmentDate: new Date(appointmentDate),
        appointmentTime,
        fee: Number(amount),
        status: "CONFIRMED"
      }],
      { session }
    );

    await session.commitTransaction();
    session.endSession();

    res.json({
      message: "Appointment booked successfully",
      wallet
    });

  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    res.status(400).json({ message: err.message });
  }
};


/* =========================================
   BREAKDOWN (FOR CHART)
========================================= */
export const getBreakdown = async (req, res) => {
  try {
    const userId = req.user._id;

    const wallet = await Wallet.findOne({ userId });
    if (!wallet) return res.json([]);

    const breakdown = await Transaction.aggregate([
      {
        $match: {
          walletId: wallet._id,
          type: "DEBIT"
        }
      },
      {
        $group: {
          _id: { $ifNull: ["$category", "GENERAL"] },
          total: { $sum: "$amount" }
        }
      }
    ]);

    res.json(breakdown);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
