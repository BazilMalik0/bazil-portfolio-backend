import mongoose from "mongoose";

const contactSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },

    file: {
      data: Buffer,
      contentType: String,
      fileName: String,
    },

    // 1. ADDED FLAG: 0 is Inbox, 1 is Trash
    flag: {
      type: Number,
      default: 0,
    },
  },
  // 2. ADDED TIMESTAMPS: Automatically creates 'createdAt' and 'updatedAt'
  { timestamps: true },
);

// SAME model name you were already using
const ContactMessage =
  mongoose.models.BazilDevADMIN ||
  mongoose.model("BazilDevADMIN", contactSchema);

export default ContactMessage;
