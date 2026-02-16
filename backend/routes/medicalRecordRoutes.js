import express from "express";
import multer from "multer";
import {
  createRecord,
  getMyRecords,
  updateRecord,
  deleteRecord,
  downloadRecord,
  generateShareLink,
  accessSharedFile,
} from "../controllers/medicalRecordController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

const storage = multer.diskStorage({
  destination: "uploads/",
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname);
  },
});

const upload = multer({ storage });

router.post("/", protect, upload.single("file"), createRecord);
router.get("/", protect, getMyRecords);
router.put("/:id", protect, updateRecord);
router.delete("/:id", protect, deleteRecord);
router.get("/download/:id", protect, downloadRecord);
router.post("/share/:id", protect, generateShareLink);
router.get("/share/:token", accessSharedFile);

export default router;
