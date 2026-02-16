import mongoose from "mongoose";

const medicationSchema = new mongoose.Schema({
  name: String,
  dosage: String
});

const emergencySchema = new mongoose.Schema({
  name: String,
  relation: String,
  phone: String
});

const userSchema = new mongoose.Schema(
  {
    // Auth
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    // Personal Info
    dateOfBirth: String,
    age: Number,
    gender: String,
    bloodGroup: String,
    phone: String,

    // Medical Info
    allergies: [String],
    chronicConditions: [String],
    medications: [medicationSchema],

    // Emergency
    emergencyContact: emergencySchema
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
