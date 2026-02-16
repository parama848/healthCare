import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    walletId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Wallet",
      required: true
    },
    type: {
      type: String,
      enum: ["CREDIT", "DEBIT"],
      required: true
    },
    category: {
      type: String,
      enum: ["CONSULTATION", "LAB_TEST", "MEDICINE"]
    },
    amount: {
      type: Number,
      required: true
    },
    description: String,
    partnerName: String
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);
