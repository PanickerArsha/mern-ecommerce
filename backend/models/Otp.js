import mongoose from "mongoose";

const otpSchema = new mongoose.Schema({
  phone: {
    type: String,
    required: true,
  },

  otp: {
    type: String,
    required: true,
  },

  expiresAt: {
    type: Date,
    expires: 0, // 0 means the document will expire immediately after the expiresAt time is reached. 
  },
});

export default mongoose.model("Otp", otpSchema);