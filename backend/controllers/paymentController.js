import Stripe from "stripe";
import Wallet from "../models/Wallet.js";
import Transaction from "../models/Transaction.js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export const createCheckoutSession = async (req, res) => {
  try {
    const { amount, userId } = req.body;

    if (!amount || amount <= 0) {
      return res.status(400).json({ message: "Invalid amount" });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "inr",
            product_data: {
              name: "Medical Wallet Top-Up",
            },
            unit_amount: amount * 100, // Stripe uses paise
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.CLIENT_URL}/payment-success?amount=${amount}&userId=${userId}`,
      cancel_url: `${process.env.CLIENT_URL}/wallet`,
    });

    res.json({ url: session.url });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
