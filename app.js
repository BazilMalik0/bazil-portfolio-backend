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

// 2. Setup Multer for memory storage (Required for File Uploads)
const upload = multer({ storage: multer.memoryStorage() });

// 3. Updated POST Route (Using the upload middleware + controller)
// 'file' must match the key used in your frontend: dataToSend.append("file", ...)
app.post("/contact", upload.single("file"), async (req, res) => {
  // This calls your controller logic
  // If you have a separate controller file, import it and use it here:
  // submitContactForm(req, res);

  /* Internal logic for quick testing or if not using separate file: */
  try {
    const { name, email, phone, subject, message } = req.body;
    const contactSchema = new mongoose.Schema({
      name: String,
      email: String,
      phone: String,
      subject: String,
      message: String,
      file: { data: Buffer, contentType: String, fileName: String },
    });
    const BazilDevADMIN =
      mongoose.models.BazilDevADMIN ||
      mongoose.model("BazilDevADMIN", contactSchema);

    const data = { name, email, phone, subject, message };
    if (req.file) {
      data.file = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        fileName: req.file.originalname,
      };
    }
    await BazilDevADMIN.create(data);
    res
      .status(201)
      .json({ success: true, message: "Message sent successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// ✅ GET ALL MESSAGES (Updated to include Phone)
app.get("/contact", async (req, res) => {
  const BazilDevADMIN = mongoose.models.BazilDevADMIN;
  const messages = await BazilDevADMIN.find().sort({ _id: -1 });
  res.status(200).json(messages);
});

// ✅ DELETE MESSAGE
app.delete("/contact/:id", async (req, res) => {
  const { id } = req.params;
  const BazilDevADMIN = mongoose.models.BazilDevADMIN;
  await BazilDevADMIN.findByIdAndDelete(id);
  res.status(200).json({ success: true, message: "Deleted successfully" });
});

// Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log(err));

app.listen(PORT, () => console.log("Server running on port " + PORT));
