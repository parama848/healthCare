import mongoose from "mongoose";

const walletSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      unique: true
    },
    balance: {
      type: Number,
      default: 0
    },
    totalDeposited: {
      type: Number,
      default: 0
    },
    totalUsed: {
      type: Number,
      default: 0
    }
  },
  { timestamps: true }
);

export default mongoose.model("Wallet", walletSchema);
