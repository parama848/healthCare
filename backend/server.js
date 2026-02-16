import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import http from "http";
import { Server } from "socket.io";

// =============================
// Route Imports
// =============================
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import medicalRecordRoutes from "./routes/medicalRecordRoutes.js";
import emergencyRoutes from "./routes/emergencyRoutes.js";
import walletRoutes from "./routes/walletRoutes.js"
import paymentRoutes from "./routes/paymentRoutes.js"
import bookingRoutes from "./routes/bookingRoutes.js";


dotenv.config();

const app = express();

// Fix __dirname for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// =============================
// MongoDB Connection
// =============================
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");
  } catch (error) {
    console.error("❌ MongoDB Connection Failed:", error.message);
    process.exit(1);
  }
};

connectDB();

// =============================
// Middleware
// =============================
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// =============================
// Static Folder for Uploads
// =============================
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// =============================
// API Routes
// =============================
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/medical-records", medicalRecordRoutes);
app.use("/api/emergency", emergencyRoutes);
app.use("/api/wallet", walletRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/bookings", bookingRoutes);



// =============================
// Health Check
// =============================
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "SmartCare API Running 🚀",
  });
});

// =============================
// 404 Handler
// =============================
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API Route Not Found",
  });
});

// =============================
// Global Error Handler
// =============================
app.use((err, req, res, next) => {
  console.error("🔥 Server Error:", err.stack);
  res.status(500).json({
    success: false,
    message: "Internal Server Error",
  });
});

// =============================
// 🔥 SOCKET.IO SETUP
// =============================
const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

// Make io available in controllers
app.set("io", io);

io.on("connection", (socket) => {
  console.log("🔌 Client connected:", socket.id);

  socket.on("disconnect", () => {
    console.log("❌ Client disconnected:", socket.id);
  });
});

// =============================
// Start Server
// =============================
const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
