import MedicalRecord from "../models/MedicalRecord.js";
import crypto from "crypto";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOAD_DIR = path.join(__dirname, "..", "uploads");

// ======================
// CREATE
// ======================
export const createRecord = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: "File required" });

    const record = await MedicalRecord.create({
      user: req.user.id,
      name: req.body.name, // ✅ changed
      description: req.body.description,
      category: req.body.category,
      doctor: {
        name: req.body.doctorName,
        specialization: req.body.specialization,
      },
      hospital: {
        name: req.body.hospitalName,
        location: req.body.hospitalLocation,
      },
      recordDate: req.body.recordDate,
      tags: req.body.tags ? req.body.tags.split(",") : [],
      status: req.body.status,
      attachments: [
        {
          fileName: req.file.filename,
          fileType: req.file.mimetype,
          fileSize: req.file.size,
        },
      ],
    });

    res.status(201).json(record);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ======================
// READ
// ======================
export const getMyRecords = async (req, res) => {
  const records = await MedicalRecord.find({
    user: req.user.id,
  }).sort({ createdAt: -1 });

  res.json(records);
};

// ======================
// UPDATE
// ======================
export const updateRecord = async (req, res) => {
  const record = await MedicalRecord.findById(req.params.id);

  if (!record) return res.status(404).json({ message: "Not found" });
  if (record.user.toString() !== req.user.id)
    return res.status(401).json({ message: "Unauthorized" });

  record.name = req.body.name || record.name; // ✅ changed
  record.description = req.body.description || record.description;
  record.category = req.body.category || record.category;
  record.status = req.body.status || record.status;

  await record.save();
  res.json(record);
};

// ======================
// DELETE
// ======================
export const deleteRecord = async (req, res) => {
  const record = await MedicalRecord.findById(req.params.id);

  if (!record) return res.status(404).json({ message: "Not found" });
  if (record.user.toString() !== req.user.id)
    return res.status(401).json({ message: "Unauthorized" });

  const file = record.attachments[0];
  const filePath = path.join(UPLOAD_DIR, file.fileName);

  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  await record.deleteOne();
  res.json({ message: "Deleted successfully" });
};

// ======================
// DOWNLOAD (Protected)
// ======================
export const downloadRecord = async (req, res) => {
  const record = await MedicalRecord.findById(req.params.id);

  if (!record) return res.status(404).send("Not found");
  if (record.user.toString() !== req.user.id)
    return res.status(401).send("Unauthorized");

  const file = record.attachments[0];
  const filePath = path.join(UPLOAD_DIR, file.fileName);

  return res.download(filePath, file.fileName);
};

// ======================
// SHARE LINK
// ======================
export const generateShareLink = async (req, res) => {
  const record = await MedicalRecord.findById(req.params.id);

  if (!record) return res.status(404).json({ message: "Not found" });
  if (record.user.toString() !== req.user.id)
    return res.status(401).json({ message: "Unauthorized" });

  const token = crypto.randomBytes(32).toString("hex");

  record.isShared = true;
  record.shareToken = token;
  await record.save();

  res.json({
    shareLink: `http://localhost:5000/api/medical-records/share/${token}`,
  });
};

// ======================
// ACCESS SHARED FILE
// ======================
export const accessSharedFile = async (req, res) => {
  const record = await MedicalRecord.findOne({
    shareToken: req.params.token,
    isShared: true,
  });

  if (!record) return res.status(404).send("Invalid link");

  const file = record.attachments[0];
  const filePath = path.join(UPLOAD_DIR, file.fileName);

  return res.download(filePath, file.fileName);
};
