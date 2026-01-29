import ContactMessage from "../models/ContactMessage.js";

export const submitContactForm = async (req, res) => {
  try {
    const { name, email, phone, subject, message } = req.body;

    // Validation matching your frontend logic
    if (!name || !email || !phone || !subject || !message) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newMessageData = {
      name,
      email,
      phone,
      subject,
      message,
    };

    // Handle the file if it exists (Multer puts it in req.file)
    if (req.file) {
      newMessageData.file = {
        data: req.file.buffer,
        contentType: req.file.mimetype,
        fileName: req.file.originalname,
      };
    }

    const newMessage = new ContactMessage(newMessageData);
    await newMessage.save();

    res.status(201).json({
      success: true,
      message: "Message sent successfully✅",
    });
  } catch (error) {
    console.error("Contact Controller Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later",
    });
  }
};
