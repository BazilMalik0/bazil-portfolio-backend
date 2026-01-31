import ContactMessage from "../models/ContactMessage.js";

export const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation (matches frontend)
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newMessage = new ContactMessage({
      name,
      email,
      phone,
      subject,
      message,
      file: req.file
        ? {
            data: req.file.buffer,
            contentType: req.file.mimetype,
            fileName: req.file.originalname,
          }
        : null,
    });

    await newMessage.save();

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
};

// GET ALL MESSAGES
export const getAllMessages = async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ _id: -1 });
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch messages" });
  }
};

// DELETE MESSAGE
export const deleteMessage = async (req, res) => {
  try {
    const deleted = await ContactMessage.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: "Message not found" });
    }
    res.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Delete failed" });
  }
};
// --- ADD THIS TO THE BOTTOM OF contactController.js ---
export const adminLogin = async (req, res) => {
  const { username, password } = req.body;

  // These come from your .env file
  if (
    username === process.env.ADMIN_USERNAME &&
    password === process.env.ADMIN_PASSWORD
  ) {
    res.status(200).json({
      success: true,
      message: "Login successful",
    });
  } else {
    res.status(401).json({
      success: false,
      message: "Invalid credentials",
    });
  }
};
