import Otp from "../models/Otp.js";
import User from "../models/User.js";
import jwt from "jsonwebtoken";

export const sendOtp = async (req, res) => {
  try {
    const { phone } = req.body;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    //deleteMany method is used to remove any existing OTP entries for the given phone number before creating a new one. This ensures that only the most recent OTP is valid for that phone number, enhancing security and preventing confusion if multiple OTPs were generated in a short period of time.
    await Otp.deleteMany({ phone });

    await Otp.create({
      phone,
      otp,
      expiresAt: new Date(Date.now() + 5 * 60 * 1000),
    });

    // Send SMS here using provider

    console.log("OTP:", otp);

    res.json({
      message: "OTP sent successfully",
    });
  } catch (error) {
    res.json({
      message: "Failed to send OTP",
    });
  }
};

export const verifyOtp = async (req, res) => {
  try {
    const { phone, otp } = req.body;

    const otpRecord = await Otp.findOne({
      phone,
      otp,
    });

    if (!otpRecord) {
      return res.status(400).json({
        message: "Invalid OTP",
      });
    }

    let user = await User.findOne({
      phone,
    });

    if (!user) {
      user = await User.create({
        name: "Phone User",
        phone,
      });
    }

    const token = jwt.sign(
      {
        userId: user._id,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    await Otp.deleteMany({ phone });

    res.status(200).json({
      token,
      user,
      message: "Login successful",
    });
  } catch (error) {
    res.status(500).json({
      message: "Verification failed",
    });
  }
};