import mongoose from "mongoose";

const contactSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true }, // Added Phone
  subject: { type: String, required: true },
  message: { type: String, required: true },
  file: {
    // Added File Object
    data: Buffer,
    contentType: String,
    fileName: String,
  },
  date: { type: Date, default: Date.now },
});

// Use the model name you prefer (BazilDevADMIN as per your app.js)
const ContactMessage =
  mongoose.models.BazilDevADMIN ||
  mongoose.model("BazilDevADMIN", contactSchema);

export default ContactMessage;
