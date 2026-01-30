const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer"); // 1. Import Multer
const PORT = process.env.PORT || 5000;

// If you are using ES Modules for the controller, use 'import' instead of 'require'
// import { submitContactForm } from "./controllers/contactController.js";

dotenv.config();
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ 1. DEFINE SCHEMA OUTSIDE THE ROUTE (The Fix)
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true }, // Added Phone
  subject: { type: String, required: true },
  message: { type: String, required: true },
  file: {
    data: Buffer,
    contentType: String,
    fileName: String,
  }, // Added File
  createdAt: { type: Date, default: Date.now },
});
// ✅ 2. INITIALIZE MODEL ONCE
const BazilDevADMIN =
  mongoose.models.BazilDevADMIN ||
  mongoose.model("BazilDevADMIN", contactSchema);
// 2. Setup Multer for memory storage (Required for File Uploads)
const upload = multer({ storage: multer.memoryStorage() });
app.post("/contact", upload.single("file"), async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    const newContact = {
      name,
      email,
      phone,
      subject,
      message,
    };

    // Check if file exists in the request
    if (req.file) {
      newContact.file = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        fileName: req.file.originalname,
      };
    }

    await BazilDevADMIN.create(newContact);

    res.status(201).json({ success: true, message: "Message saved to DB!" });
  } catch (err) {
    console.error("DB Error:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

app.get("/contact", async (req, res) => {
  try {
    const messages = await BazilDevADMIN.find().sort({ _id: -1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch" });
  }
});

// ✅ DELETE MESSAGE
app.delete("/contact/:id", async (req, res) => {
  const { id } = req.params;
  await BazilDevADMIN.findByIdAndDelete(id);
  res.status(200).json({ success: true, message: "Deleted" });
});

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

app.listen(PORT, () => console.log("Server running on port " + PORT));
