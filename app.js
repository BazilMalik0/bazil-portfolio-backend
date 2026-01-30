const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const multer = require("multer");

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// ✅ 1. DEFINE SCHEMA WITH ALL FIELDS AT THE TOP LEVEL
// This ensures MongoDB accepts 'phone' and 'file'
const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true }, // Ensure this exists!
  subject: { type: String, required: true },
  message: { type: String, required: true },
  file: {
    data: Buffer,
    contentType: String,
    fileName: String,
  },
  createdAt: { type: Date, default: Date.now },
});

// ✅ 2. INITIALIZE THE MODEL ONCE
// Use 'bazildevadmins' to match your screenshot collection name
const BazilDevADMIN =
  mongoose.models.BazilDevADMIN ||
  mongoose.model("BazilDevADMIN", contactSchema);

// Setup Multer for memory storage
const upload = multer({ storage: multer.memoryStorage() });

// ✅ 3. UPDATED POST ROUTE
app.post("/contact", upload.single("file"), async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Create a clean data object
    const newEntry = {
      name,
      email,
      phone,
      subject,
      message,
    };

    // Only add file if it exists in the request
    if (req.file) {
      newEntry.file = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        fileName: req.file.originalname,
      };
    }

    // Save to Database
    const savedData = await BazilDevADMIN.create(newEntry);

    console.log("Data saved successfully:", savedData._id);
    res
      .status(201)
      .json({ success: true, message: "Message sent successfully" });
  } catch (err) {
    console.error("Database Save Error:", err);
    res
      .status(500)
      .json({ success: false, message: "Failed to store data in DB" });
  }
});

// ✅ GET ROUTE
app.get("/contact", async (req, res) => {
  try {
    const messages = await BazilDevADMIN.find().sort({ _id: -1 });
    res.status(200).json(messages);
  } catch (err) {
    res.status(500).json({ success: false, message: "Error fetching data" });
  }
});

// Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

app.listen(PORT, () => console.log("Server running on port " + PORT));
