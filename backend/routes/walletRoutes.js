// import express from "express";
// import {
//   getWallet,
//   getTransactions,
//   addMoney,
//   deductMoney,
//   getBreakdown
// } from "../controllers/walletController.js";
// import { protect } from "../middleware/authMiddleware.js";

// const router = express.Router();

// router.get("/:userId", getWallet);
// router.get("/transactions/:userId", getTransactions);
// router.post("/add/:userId", addMoney);
// // router.post("/deduct/:userId", deductMoney);
// router.post("/deduct", protect, deductMoney);
// router.get("/breakdown/:userId", getBreakdown);

// export default router;

import express from "express";
import {
  getWallet,
  getTransactions,
  addMoney,
  deductMoney,
  getBreakdown
} from "../controllers/walletController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getWallet);
router.get("/transactions", protect, getTransactions);
router.post("/add", protect, addMoney);
router.post("/deduct", protect, deductMoney);
router.get("/breakdown", protect, getBreakdown);

export default router;
