import mongoose from "mongoose";

const attachmentSchema = new mongoose.Schema({
  fileName: String,
  fileType: String,
  fileSize: Number,
});

const medicalRecordSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    name: { type: String, required: true },
    description: { type: String, required: true },
    category: { type: String, required: true },

    doctor: {
      name: String,
      specialization: String,
    },

    hospital: {
      name: String,
      location: String,
    },

    recordDate: { type: Date, required: true },
    tags: [String],

    status: {
      type: String,
      enum: ["Normal", "Attention Needed", "Critical"],
      default: "Normal",
    },

    attachments: [attachmentSchema],

    isShared: { type: Boolean, default: false },
    shareToken: String,
  },
  { timestamps: true }
);

export default mongoose.model("MedicalRecord", medicalRecordSchema);
