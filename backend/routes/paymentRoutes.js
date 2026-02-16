import express from "express";
import Stripe from "stripe";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";

const router = express.Router();

// =============================
// Create Checkout Session
// =============================
router.post("/create-checkout-session", async (req, res) => {
  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const { amount, userId } = req.body;
    const clientURL = process.env.CLIENT_URL || "http://localhost:5173";

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const session = await stripe.checkout.sessions.create({
      mode: "payment",

      payment_method_types: ["card"],

      billing_address_collection: "required",

      customer_creation: "always",   // 👈 VERY IMPORTANT FOR INDIA

      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: { name: "Wallet Top-up" },
            unit_amount: amount * 100,
          },
          quantity: 1,
        },
      ],

      success_url: `${clientURL}/payment-success?amount=${amount}&userId=${userId}`,
      cancel_url: `${clientURL}/wallet`,
    });

    res.json({ url: session.url });

  } catch (err) {
    console.error("Stripe Error:", err);
    res.status(500).json({ message: err.message });
  }
});


// =============================
// Confirm Payment
// =============================
router.post("/confirm-payment", async (req, res) => {
  try {
    const { userId, amount } = req.body;

    let wallet = await Wallet.findOne({ userId });
    if (!wallet) wallet = await Wallet.create({ userId });

    wallet.balance += Number(amount);
    wallet.totalDeposited += Number(amount);
    await wallet.save();

    await Transaction.create({
      walletId: wallet._id,
      type: "CREDIT",
      amount: Number(amount),
      description: "Stripe Wallet Top-up"
    });

    res.json({ message: "Wallet updated successfully" });

  } catch (err) {
    console.error("Confirm Payment Error:", err);
    res.status(500).json({ message: err.message });
  }
});

export default router;
