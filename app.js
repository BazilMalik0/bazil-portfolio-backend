const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");
const PORT = process.env.PORT || 5000;

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// ✅ CONTACT FORM API (NO SEPARATE ROUTE FILE)
app.post("/contact", async (req, res) => {
  try {
    const { name, email, subject, message } = req.body;

    // Validation
    if (!name || !email || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // MongoDB Schema (inline to avoid extra files)
    const contactSchema = new mongoose.Schema({
      name: String,
      email: String,
      subject: String,
      message: String,
    });

    const BazilDevADMIN =
      mongoose.models.BazilDevADMIN ||
      mongoose.model("BazilDevADMIN", contactSchema);

    // Save to DB
    await BazilDevADMIN.create({ name, email, subject, message });

    res.status(201).json({
      success: true,
      message: "Message sent successfully",
    });
  } catch (error) {
    console.error("Contact Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});
// ✅ GET ALL CONTACT MESSAGES (FOR MESSAGE PAGE)
app.get("/contact", async (req, res) => {
  try {
    const contactSchema = new mongoose.Schema({
      name: String,
      email: String,
      subject: String,
      message: String,
    });

    const BazilDevADMIN =
      mongoose.models.BazilDevADMIN ||
      mongoose.model("BazilDevADMIN", contactSchema);

    const messages = await BazilDevADMIN.find().sort({ _id: -1 });

    res.status(200).json(messages);
  } catch (error) {
    console.error("Fetch Messages Error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch messages",
    });
  }
});

app.listen(PORT, () => {
  console.log("Server is listening at port " + PORT);
});

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected");
  })
  .catch((err) => {
    console.error("❌ MongoDB Error:", err.message);
  });
