import express from "express";
import upload from "../middleware/upload.js";
import {
  submitContactForm,
  getAllMessages,
  deleteMessage,
  adminLogin, // 1. Add this import
  updateMessageFlag, // 1. Add this import
} from "../controllers/contactController.js";

const router = express.Router();

// POST (WITH FILE)
router.post("/", upload.single("file"), submitContactForm);

// GET
router.get("/", getAllMessages);

// DELETE
router.delete("/:id", deleteMessage);

// 2. ADD THIS NEW ROUTE
router.post("/login", adminLogin);
// 3. ADD THIS NEW PUT ROUTE
router.put("/:id", updateMessageFlag);

export default router;
