import mongoose from "mongoose";

const emergencySchema = new mongoose.Schema({
  userLocation: {
    lat: Number,
    lng: Number,
  },
  hospitalName: String,
  eta: String,
}, { timestamps: true });

export default mongoose.model("EmergencyEvent", emergencySchema);
